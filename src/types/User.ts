export interface User {
    first_name: string;
    father_name?: string | null;
    last_name: string;
    email: string;
    phone_number: string;
}

export interface Pharmacy {
    name: string;
    governorate_id?: number;
    city_id: number;
    address?: string | null;
}