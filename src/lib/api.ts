import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Interceptor لحقن الـ Access Token القصير في رأس كل طلب
api.interceptors.request.use(
  (config) => {
    // جلب التوكن من الـ State أو من متغير مخصص يتم تحديثه من الـ AuthContext
    // سنعتمد هنا على تمريره برمجياً أو استخدام دالة مساعدة
    const token = window.__ACCESS_TOKEN__ || null; 
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor صائد خطأ 401 لعمل Refresh التوكن تلقائياً
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // إذا انتهى الـ Access Token وأرجع السيرفر 401 ولم نقم بمحاولة التجديد بعد
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // لمنع الدخول في حلقة تكرار لا نهائية لو انتهى الريفريش نفسه
      
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          // إرسال طلب الـ Refresh الـ Endpoint الخاص بـ لارفيل
          const res = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          if (res.status === 200) {
            const { access_token, refresh_token } = res.data;

            // 1. حفظ التوكنات الجديدة
            window.__ACCESS_TOKEN__ = access_token;
            localStorage.setItem("refresh_token", refresh_token);

            // 2. تحديث الـ Header في الطلب الحالي المكسور وإعادة تشغيله
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          // لو فشل الـ Refresh أيضاً (مثلاً انتهت الـ 14 يوم)، سجل خروج المستخدم إجبارياً
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          window.location.href = "/login/pharmacist";
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

// ربط بسيط لمشاركة الـ Access Token بين الـ Context والـ Axios
declare global {
  interface Window {
    __ACCESS_TOKEN__?: string | null;
  }
}

export const setGlobalAccessToken = (token: string | null) => {
  window.__ACCESS_TOKEN__ = token;
};

export default api;