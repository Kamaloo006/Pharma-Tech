import axios, { AxiosError } from "axios";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Request Interceptor: حقن الـ Access Token الحالي
api.interceptors.request.use(
  (config) => {
    const token = window.__ACCESS_TOKEN__ || localStorage.getItem("access_token") || sessionStorage.getItem("access_token"); 
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: التعامل مع انتهاء الصلاحية 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // إذا كان الخطأ 401 والطلب لم يتم إعادته سابقاً لتجنب حلقة مفرغة
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // إذا كان الطلب الفاشل هو نفسه طلب الـ refresh، نقوم بعمل logout فوراً لمنع التكرار
      if (originalRequest.url?.includes('/refresh')) {
        handleForcedLogout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // إذا كانت هناك عملية تجديد قيد التنفيذ حالياً، ضع هذا الطلب في الانتظار
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refresh_token") || sessionStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          // 🟢 إرسال طلب الـ Refresh بالمحددات المطلوبة تماماً من لارفيل
          const res = await axios.post(`${api.defaults.baseURL}/refresh`, {
            refresh_token: refreshToken,
            device_name: "WebApp_Pharmacist", 
          }, {
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            }
          });

          if (res.status === 200) {
            const { access_token, refresh_token } = res.data;

            // 1. التخزين العام وفي الـ Storage النشط حالياً
            window.__ACCESS_TOKEN__ = access_token;
            
            const isRemembered = !!localStorage.getItem("refresh_token");
            const storage = isRemembered ? localStorage : sessionStorage;
            
            storage.setItem("access_token", access_token);
            if (refresh_token) {
              storage.setItem("refresh_token", refresh_token);
            }

            // 2. تسيير كافة الطلبات التي كانت تنتظر في الطابور بالتوكن الجديد
            processQueue(null, access_token);

            // 3. تحديث هيدر الطلب الحالي المكسور وإعادة إطلاقه
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            isRefreshing = false;
            return api(originalRequest);
          }
        } catch (refreshError) {
          isRefreshing = false;
          processQueue(refreshError, null);
          handleForcedLogout();
          return Promise.reject(refreshError);
        }
      } else {
        handleForcedLogout();
      }
    }
    return Promise.reject(error);
  }
);

// دالة تنظيف الجلسة والتحويل الإجباري في حال تلف التوكنات
function handleForcedLogout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
  localStorage.removeItem("pharmacy");
  sessionStorage.clear();
  window.__ACCESS_TOKEN__ = null;
  
  if (window.location.pathname !== "/login/pharmacist") {
    window.location.href = "/login/pharmacist";
  }
}

declare global {
  interface Window {
    __ACCESS_TOKEN__?: string | null;
  }
}

export const setGlobalAccessToken = (token: string | null) => {
  window.__ACCESS_TOKEN__ = token;
};

// --- منطق ترجمة الأخطاء من Laravel كما هو ---
const LARAVEL_ERROR_MAP: Record<string, string> = {
  'the selected email is invalid': 'auth.emailInvalid',
  'invalid email or password': 'auth.invalidCredentials', 
  'invalidemail':'auth.emailInvalid',
  'too many attempts.': 'auth.tooManyAttempts',
  'please verify your email first. a new verification link has been sent to your email.': 'auth.emailNotVerified'
};

function mapRawError(message: string): string {
  if (!message) return message;
  const cleanMessage = message.trim().toLowerCase().replace(/\.$/, '');
  return LARAVEL_ERROR_MAP[cleanMessage] || message;
}

export function getErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<any>;
    
    if (axiosError.code === 'ERR_NETWORK') {
      return "common.networkError";
    }

    if (axiosError.response) {
      const status = axiosError.response.status;
      const data = axiosError.response.data;

      if (status === 400 && data?.message === 'This password reset token is invalid.') {
        return "auth.invalidResetToken";
      }

      if (status === 429) {
        return "auth.tooManyAttempts"; 
      }

      if (status === 422 && data?.errors) {
        const errors = data.errors;
        if (typeof errors === 'object') {
          const firstErrorKey = Object.keys(errors)[0];
          const rawLaravelMessage = errors[firstErrorKey][0];
          return mapRawError(rawLaravelMessage);
        }
      }

      if (status === 401) {
        if (data?.message) {
          return mapRawError(data.message);
        }
        return "auth.invalidCredentials"; 
      }

      if (status === 403 && data?.message?.includes('verify your email')) {
        return "auth.emailNotVerified";
      }

      if (status === 500) {
        return "common.serverError";
      }

      if (data?.message) {
        return mapRawError(data.message);
      }
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

export const ensureError = getErrorMessage;
export default api;