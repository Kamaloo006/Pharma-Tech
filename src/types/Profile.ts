export interface User {
  id: number;
  first_name?: string;
  father_name?: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
}

export interface ProfileFormValues {
  first_name: string;
  father_name: string;
  last_name: string;
  phone_number: string;
  email?: string;
}

export interface ProfileSettingsProps {
  user?: User;
}

export interface ProfileUpdateResponse {
  message: string;
  user: User;
}