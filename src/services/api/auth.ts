import api from "@/lib/api";
import type {  RegisterInput, LoginInput } from "@/types/authValidation";



export const register = async (data:RegisterInput) => {
    const response = await api.post("/register", data);
    return response.data;
}

export const login = async (data:LoginInput) => {
    const response = await api.post("/login", data);
    return response.data;
}

export const resendVerificationEmail =async (email:string) => {
    const response = await api.post("/email/resend", { email });
    return response.data;
}

export const verifyEmail = async (verificationUrl: string) => {
  const response = await api.get(verificationUrl);
  return response.data;
};

export const getCities = async () => {
  const response = await api.get("/cities");
  return response.data;
};