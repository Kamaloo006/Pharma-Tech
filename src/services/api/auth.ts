import api from "@/lib/api";
import type {  RegisterInput, LoginInput } from "@/types/authValidation";


export const register = async (data:RegisterInput) => {
    const response = await api.post("/register", {
      ...data,
      platform:"web"
    });
    return response.data;
}

type LoginRequest = LoginInput & {
  identifier?: string;
};

export const login = async (data: LoginRequest) => {
    const response = await api.post("/login", {
      email: data.email,
      identifier: data.identifier ?? data.email,
      password: data.password,
      platform:"web",
    });
    return response.data;
}

export const resendVerificationEmail =async (email:string) => {
    const response = await api.post("/email/resend", { email, platform:"web" });
    console.log(email)
    return response.data;
}

export const verifyEmail = async (verificationUrl: string) => {
  const response = await api.get(verificationUrl);
  return response.data;
};


export const forgotPassword = async(email:string) => {
  const response = await api.post("/password/forgot", { email, platform:"web"});
  return response.data;
}