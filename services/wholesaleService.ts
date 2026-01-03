import { API_CONFIG } from '../config';

export interface WholesaleInquiry {
    _id: string;
    name: string;
    email: string;
    companyName: string;
    gstNumber?: string;
    mobile: string;
    requirements: string;
    status: 'new' | 'read' | 'replied' | 'resolved'; // Assuming these statuses based on typical flow
    createdAt: string;
    updatedAt: string;
}

export interface WholesaleFilterPayload {
    page: number;
    limit: number;
    search?: string;
    status?: string | 'All';
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface WholesaleListResponse {
    success: boolean;
    message: string;
    data: {
        inquiries: WholesaleInquiry[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    };
}

export interface WholesaleDetailResponse {
    success: boolean;
    message: string;
    data: WholesaleInquiry;
}

const getAuthToken = (): string | null => {
    const match = document.cookie.match(new RegExp('(^| )Authorization=([^;]+)'));
    if (match) return match[2];
    return null;
};

// POST /api/wholesale/filter
export const fetchWholesaleInquiries = async (filters: WholesaleFilterPayload): Promise<WholesaleListResponse> => {
    const token = getAuthToken();

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/wholesale/filter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(filters),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch wholesale inquiries');
        }

        return result;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unexpected error occurred');
    }
};

// GET /api/wholesale/:id
export const fetchWholesaleInquiryById = async (id: string): Promise<WholesaleDetailResponse> => {
    const token = getAuthToken();

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/wholesale/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch inquiry details');
        }

        return result;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unexpected error occurred');
    }
};

// PUT /api/wholesale/:id/status
export const updateWholesaleStatus = async (id: string, status: string): Promise<WholesaleDetailResponse> => {
    const token = getAuthToken();

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/wholesale/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ status }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to update status');
        }

        return result;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unexpected error occurred');
    }
};
