import { API_CONFIG } from '../config';

export interface ContactPayload {
    name: string;
    email: string;
    phone: string;
    topic: string;
    message: string;
    orderId?: string;
}

export interface ContactResponse {
    success: boolean;
    message: string;
    data?: any;
}

const API_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONTACT}`;

export const sendContactMessage = async (data: ContactPayload): Promise<ContactResponse> => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to send message');
        }

        return result;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unexpected error occurred');
    }
};

export interface ContactFilterPayload {
    page: number;
    limit: number;
    status?: string | 'All';
    search?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface ContactRequestItem {
    _id: string;
    name: string;
    email: string;
    phone: string;
    orderId?: string;
    topic: string;
    message: string;
    status: 'new' | 'resolved';
    createdAt: string;
    updatedAt: string;
}

export interface ContactListResponse {
    success: boolean;
    message: string;
    data: {
        requests: ContactRequestItem[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    };
}

const getAuthToken = (): string | null => {
    // Basic cookie parser to get 'token' or 'auth_token'
    const match = document.cookie.match(new RegExp('(^| )Authorization=([^;]+)'));
    if (match) return match[2];

    // Fallback if named differently, e.g., standard 'connect.sid' isn't a JWT usually. 
    // Assuming 'token' based on common practices or user hint would be 'token'.
    return null;
};

export const fetchContactRequests = async (filters: ContactFilterPayload): Promise<ContactListResponse> => {
    const token = getAuthToken();

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONTACT_FILTER}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(filters),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch contact requests');
        }

        return result;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unexpected error occurred');
    }
};
