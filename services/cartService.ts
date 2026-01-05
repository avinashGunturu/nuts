import { API_CONFIG } from '../config';

const API_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART}`;

// Get auth token from cookie or localStorage (consistent with authService)
const getAuthToken = (): string | null => {
    // Check cookie first
    const match = document.cookie.match(new RegExp('(^| )Authorization=([^;]+)'));
    if (match) return match[2];
    // Fallback to localStorage
    return localStorage.getItem('token');
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
        console.warn('[CartService] No auth token found, skipping cart save');
        throw new Error('Not authenticated');
    }

    console.log('[CartService] Saving cart with', items.length, 'items');

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
            items: items.map(item => ({
                productId: item.id || item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
                weight: item.weight || item.selectedWeight,
                price: item.calculatedPrice || item.price,
                name: item.name,
                image: item.image
            }))
        })
    });

    const result = await response.json();

    if (!response.ok) {
        console.error('[CartService] Save failed:', result.message);
        throw new Error(result.message || 'Failed to save cart');
    }

    console.log('[CartService] Cart saved successfully:', result.data);
    return result.data;
};

/**
 * Get cart from backend
 */
export const getCartFromServer = async (): Promise<GetCartResponse> => {
    const token = getAuthToken();
    if (!token) {
        console.warn('[CartService] No auth token found, skipping cart fetch');
        throw new Error('Not authenticated');
    }

    console.log('[CartService] Fetching cart from server');

    const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
    });

    const result = await response.json();

    if (!response.ok) {
        console.error('[CartService] Fetch failed:', result.message);
        throw new Error(result.message || 'Failed to get cart');
    }

    console.log('[CartService] Cart fetched successfully:', result.data);
    return result.data;
};

/**
 * Clear cart from backend
 */
export const clearCartOnServer = async (): Promise<void> => {
    const token = getAuthToken();
    if (!token) {
        console.warn('[CartService] No auth token found, skipping cart clear');
        throw new Error('Not authenticated');
    }

    console.log('[CartService] Clearing cart on server');

    const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
    });

    const result = await response.json();

    if (!response.ok) {
        console.error('[CartService] Clear failed:', result.message);
        throw new Error(result.message || 'Failed to clear cart');
    }

    console.log('[CartService] Cart cleared successfully');
};
