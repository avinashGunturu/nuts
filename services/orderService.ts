import { API_CONFIG } from '../config';

// Types
export interface CartValidationItem {
    productId: string;
    variantId: string;
    quantity: number;
}

export interface ShippingAddress {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export interface CheckoutInitiateResponse {
    success: boolean;
    message: string;
    data: {
        orderId: string;
        razorpayOrderId: string;
        amount: number;
        currency: string;
        key: string;
        mongoOrderId: string;
    };
}

export interface PaymentVerifyPayload {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    mongoOrderId: string;
}

export interface CouponApplyResponse {
    success: boolean;
    message: string;
    data: {
        couponCode: string;
        discountAmount: number;
        finalTotal: number;
        _id: string;
    };
}

export interface Order {
    _id: string;
    orderId: string;
    items: Array<{
        product: any;
        variantId: string;
        weight: string;
        quantity: number;
        price: number;
        discountApplied: number;
    }>;
    totalAmount: number;
    finalAmount: number;
    shippingFee?: number;
    shippingInfo?: any;
    couponApplied?: any;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress: ShippingAddress;
    paymentInfo: {
        razorpayOrderId?: string;
        razorpayPaymentId?: string;
        status: string;
        method?: string;
    };
    createdAt: string;
    updatedAt: string;
}

// Helper to get auth token
const getAuthToken = (): string | null => {
    const match = document.cookie.match(new RegExp('(^| )Authorization=([^;]+)'));
    if (match) return match[2];
    return localStorage.getItem('token');
};

export const orderService = {
    /**
     * Validate cart items (stock & price check)
     */
    validateCart: async (items: CartValidationItem[]): Promise<any> => {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART_VALIDATE}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ items })
                }
            );

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Cart validation failed');
            }
            return result;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Apply coupon code to get discount
     */
    applyCoupon: async (code: string, cartTotal: number): Promise<CouponApplyResponse> => {
        try {
            const token = getAuthToken();
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.COUPONS_APPLY}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    },
                    body: JSON.stringify({ code, cartTotal })
                }
            );

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to apply coupon');
            }
            return result;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Initiate checkout - creates order and Razorpay order
     */
    initiateCheckout: async (
        items: CartValidationItem[],
        shippingAddress: ShippingAddress,
        couponCode?: string,
        deliveryMethod?: 'shipping' | 'pickup',
        shippingFee?: number,
        shippingInfo?: any,
        contactEmail?: string,
        contactPhone?: string
    ): Promise<CheckoutInitiateResponse> => {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('Please login to proceed with checkout');
            }

            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ORDERS_CHECKOUT_INITIATE}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        items,
                        shippingAddress,
                        ...(couponCode ? { couponCode } : {}),
                        deliveryMethod,
                        shippingFee: shippingFee || 0,
                        shippingInfo,
                        contactEmail,
                        contactPhone
                    })
                }
            );

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Checkout initiation failed');
            }
            return result;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Verify Razorpay payment
     */
    verifyPayment: async (paymentData: PaymentVerifyPayload): Promise<any> => {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ORDERS_CHECKOUT_VERIFY}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(paymentData)
                }
            );

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Payment verification failed');
            }
            return result;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Create order without payment (when Razorpay is not available)
     * Use this for COD or manual payment processing
     */
    createOrder: async (
        items: CartValidationItem[],
        shippingAddress: ShippingAddress,
        couponCode?: string,
        deliveryMethod?: 'shipping' | 'pickup',
        shippingFee?: number,
        shippingInfo?: any,
        contactEmail?: string,
        contactPhone?: string
    ): Promise<{ success: boolean; message: string; data: { orderId: string; mongoOrderId: string; finalAmount: number } }> => {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('Please login to proceed with checkout');
            }

            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ORDERS_CREATE}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        items,
                        shippingAddress,
                        ...(couponCode ? { couponCode } : {}),
                        deliveryMethod,
                        shippingFee: shippingFee || 0,
                        shippingInfo,
                        contactEmail,
                        contactPhone
                    })
                }
            );

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Order creation failed');
            }
            return result;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get user's order history
     */
    getMyOrders: async (page = 1, limit = 10): Promise<{
        success: boolean;
        data: {
            orders: Order[];
            pagination: {
                total: number;
                page: number;
                limit: number;
                pages: number;
            }
        }
    }> => {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('Please login to view orders');
            }

            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ORDERS_MY_ORDERS}?page=${page}&limit=${limit}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch orders');
            }
            return result;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get all orders (Admin) with filters and pagination
     */
    getAllOrders: async (filters: {
        page?: number;
        limit?: number;
        status?: string;
        orderId?: string;
        deliveryMethod?: string;
        startDate?: string;
        endDate?: string;
    } = {}): Promise<{
        orders: Order[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }> => {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ORDERS_LIST}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(filters)
                }
            );

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch orders');
            }
            return result.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get single order by orderId (Admin)
     */
    getOrderById: async (orderId: string): Promise<Order> => {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ORDERS}/${orderId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch order');
            }
            return result.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update order status (Admin)
     */
    updateOrderStatus: async (mongoId: string, status: string): Promise<Order> => {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ORDERS}/${mongoId}/status`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ status })
                }
            );

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to update status');
            }
            return result.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Check shipping rate for a delivery pincode
     */
    checkShippingRate: async (pincode: string, weightKg: number, cartTotal: number): Promise<{
        success: boolean;
        data: {
            serviceable: boolean;
            shippingFee: number;
            estimatedDays: string;
            courierName: string;
            freeShipping: boolean;
            freeShippingThreshold: number;
            shippingInfo?: any;
        };
    }> => {
        try {
            const params = new URLSearchParams({
                pincode,
                weight: String(weightKg),
                cartTotal: String(cartTotal),
            });

            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SHIPPING_CHECK}?${params.toString()}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to check shipping rate');
            }
            return result;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get site settings (free shipping threshold, etc.)
     */
    getSettings: async (): Promise<{
        success: boolean;
        data: { freeShippingThreshold: number };
    }> => {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SETTINGS}`,
                { method: 'GET', headers: { 'Content-Type': 'application/json' } }
            );

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch settings');
            }
            return result;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update site settings (admin only)
     */
    updateSettings: async (freeShippingThreshold: number): Promise<any> => {
        try {
            const token = getAuthToken();
            if (!token) throw new Error('Authentication required');

            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SETTINGS}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ freeShippingThreshold })
                }
            );

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to update settings');
            }
            return result;
        } catch (error) {
            throw error;
        }
    }
};
