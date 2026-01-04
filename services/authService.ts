import { API_CONFIG } from '../config';

const API_URL = `${API_CONFIG.BASE_URL}/auth`; // Assumes API_CONFIG.BASE_URL is 'http://localhost:5001/api' or similar if '/auth' is not in BASE_URL. 
// Based on contactService: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONTACT}`;
// I should verify where '/api' is. 
// authController says: router.post('/send-otp', sendOtp); => /api/auth/send-otp.
// So API_URL should be .../api/auth.

export interface SendOtpPayload {
    phone?: string;
    email?: string;
}

export interface VerifyOtpPayload {
    phone?: string;
    email?: string;
    otp: string;
    name?: string;      // Optional: for signup flow
    userEmail?: string; // Optional: for signup flow (separate from OTP email identifier)
}

export interface UserAddress {
    _id?: string;
    type: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isDefault: boolean;
}

export interface User {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    role: string;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    addresses?: UserAddress[];
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
        user?: User;
        token?: string;
        message?: string;
        type?: string;
    };
}

const getAuthToken = (): string | null => {
    // Check for cookie 'authorization' or 'Authorization'
    const match = document.cookie.match(new RegExp('(^| )Authorization=([^;]+)'));
    if (match) return match[2];
    // Fallback?
    return null;
};

export const setAuthCookie = (token: string): void => {
    // Set cookie with 7-day expiry, path=/, samesite=lax for security
    document.cookie = `Authorization=${token}; path=/; max-age=604800; samesite=lax`;
};

export const sendOtp = async (data: SendOtpPayload): Promise<AuthResponse> => {
    try {
        const response = await fetch(`${API_URL}/send-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to send OTP');
        }

        return result;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unexpected error occurred during OTP send');
    }
};

export const verifyOtp = async (data: VerifyOtpPayload): Promise<AuthResponse> => {
    try {
        const response = await fetch(`${API_URL}/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Verification failed');
        }

        return result;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unexpected error occurred during verification');
    }
};

export const getMe = async (): Promise<User> => {
    const token = getAuthToken();
    if (!token) throw new Error('No Authorization token found');

    try {
        const response = await fetch(`${API_URL}/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch user profile');
        }

        // Response structure for getMe is: sendSuccess(res, user, 'User profile fetched');
        // So result.data might be the user, or result if sendSuccess puts it at root? 
        // Checking apiResponse util or authController usage usually implies { success: true, data: user, message: ... }
        return result.data || result;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unexpected error occurred fetching profile');
    }
};

export interface UpdateProfilePayload {
    name?: string;
    email?: string;
    phone?: string;
}

export const updateUserProfile = async (data: UpdateProfilePayload): Promise<User> => {
    const token = getAuthToken();
    if (!token) throw new Error('No Authorization token found');

    try {
        const response = await fetch(`${API_URL}/me`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to update profile');
        }

        return result.data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unexpected error occurred updating profile');
    }
};

export const verifyUserField = async (type: 'email' | 'phone', otp: string): Promise<User> => {
    const token = getAuthToken();
    if (!token) throw new Error('No Authorization token found');

    try {
        const response = await fetch(`${API_URL}/verify-field`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ type, otp })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Verification failed');
        }

        return result.data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unexpected error occurred during verification');
    }
};
