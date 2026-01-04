import { API_CONFIG } from '../config';

export interface CouponFilters {
    search?: string;
    isActive?: boolean;
    discountType?: 'percentage' | 'fixed';
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}

export interface Coupon {
    _id: string;
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minOrderValue: number;
    maxDiscountAmount: number;
    validUntil: string;
    validFrom: string;
    usageLimit: number;
    usedCount: number;
    applicableTo: 'all' | 'specific_users';
    assignedUsers: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCouponPayload {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minOrderValue?: number;
    maxDiscountAmount?: number;
    validUntil: string;
    usageLimit?: number;
    applicableTo?: 'all' | 'specific_users';
    assignedUsers?: string[];
}

export interface CouponListResponse {
    success: boolean;
    message: string;
    data: {
        coupons: Coupon[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    };
}

export interface CouponResponse {
    success: boolean;
    message: string;
    data: Coupon;
}

const getAuthToken = (): string | null => {
    const match = document.cookie.match(new RegExp('(^| )Authorization=([^;]+)'));
    if (match) return match[2];
    return localStorage.getItem('token');
};

export const couponService = {
    getCoupons: async (filters: CouponFilters = {}): Promise<CouponListResponse> => {
        try {
            const token = getAuthToken();
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.COUPONS_LIST}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    },
                    body: JSON.stringify({
                        search: filters.search || '',
                        isActive: filters.isActive,
                        discountType: filters.discountType,
                        startDate: filters.startDate,
                        endDate: filters.endDate,
                        page: filters.page || 1,
                        limit: filters.limit || 10
                    })
                }
            );

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch coupons');
            }
            return result;
        } catch (error) {
            throw error;
        }
    },

    createCoupon: async (couponData: CreateCouponPayload): Promise<CouponResponse> => {
        try {
            const token = getAuthToken();
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.COUPONS}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    },
                    body: JSON.stringify(couponData)
                }
            );

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to create coupon');
            }
            return result;
        } catch (error) {
            throw error;
        }
    },

    toggleCouponStatus: async (couponId: string, isActive: boolean): Promise<CouponResponse> => {
        try {
            const token = getAuthToken();
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.COUPONS}/${couponId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    },
                    body: JSON.stringify({ isActive })
                }
            );

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to update coupon status');
            }
            return result;
        } catch (error) {
            throw error;
        }
    },

    updateCoupon: async (couponId: string, couponData: Partial<CreateCouponPayload>): Promise<CouponResponse> => {
        try {
            const token = getAuthToken();
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.COUPONS}/${couponId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    },
                    body: JSON.stringify(couponData)
                }
            );

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to update coupon');
            }
            return result;
        } catch (error) {
            throw error;
        }
    }
};
