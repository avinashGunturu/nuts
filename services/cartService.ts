import { API_CONFIG } from '../config';

const API_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART}`;

// Get auth token from cookie
const getAuthToken = (): string | null => {
    const match = document.cookie.match(new RegExp('(^| )Authorization=([^;]+)'));
    return match ? match[2] : null;
};

export interface CartItem {
    productId: string;
    variantId: string;
    quantity: number;
    weight?: string;
    price: number;
    name?: string;
    image?: string;
}

export interface SaveCartResponse {
    itemCount: number;
    cartId: string;
}

export interface GetCartResponse {
    items: CartItem[];
    itemCount: number;
    updatedAt?: string;
}

/**
 * Save cart to backend
 */
export const saveCartToServer = async (items: any[]): Promise<SaveCartResponse> => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('Not authenticated');
    }

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            items: items.map(item => ({
                productId: item.id || item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
                weight: item.weight,
                price: item.calculatedPrice || item.price,
                name: item.name,
                image: item.image
            }))
        })
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to save cart');
    }

    return result.data;
};

/**
 * Get cart from backend
 */
export const getCartFromServer = async (): Promise<GetCartResponse> => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('Not authenticated');
    }

    const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to get cart');
    }

    return result.data;
};

/**
 * Clear cart from backend
 */
export const clearCartOnServer = async (): Promise<void> => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('Not authenticated');
    }

    const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to clear cart');
    }
};
