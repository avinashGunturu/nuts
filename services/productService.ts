import { API_CONFIG } from '../config';

// Cache configuration
const CACHE_KEY = 'KC_PRODUCTS_CACHE';
const CACHE_EXPIRY_KEY = 'KC_PRODUCTS_CACHE_EXPIRY';
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

const getAuthToken = () => {
    const match = document.cookie.match(new RegExp('(^| )Authorization=([^;]+)'));
    if (match) return match[2];
    return localStorage.getItem('token');
};

export const productService = {
    createProduct: async (productData: any) => {
        try {
            const token = getAuthToken();
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    },
                    body: JSON.stringify(productData)
                }
            );

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to create product');
            }
            return result;
        } catch (error) {
            throw error;
        }
    },

    getProducts: async (page = 1, limit = 10, filters = {}) => {
        try {
            const token = getAuthToken();
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS_LIST}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    },
                    body: JSON.stringify({ page, limit, filters })
                }
            );

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch products');
            }
            return result;
        } catch (error) {
            throw error;
        }
    },

    uploadImage: async (file: File) => {
        try {
            const token = getAuthToken();
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPLOAD}`,
                {
                    method: 'POST',
                    headers: {
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    },
                    body: formData
                }
            );

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to upload image');
            }
            return result;
        } catch (error) {
            throw error;
        }
    },

    getProduct: async (id: string) => {
        try {
            const token = getAuthToken();
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    }
                }
            );

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch product');
            }
            return result;
        } catch (error) {
            throw error;
        }
    },

    updateProduct: async (id: string, productData: any) => {
        try {
            const token = getAuthToken();
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    },
                    body: JSON.stringify(productData)
                }
            );

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to update product');
            }
            return result;
        } catch (error) {
            throw error;
        }
    },

    deleteProduct: async (id: string) => {
        try {
            const token = getAuthToken();
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    }
                }
            );

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to delete product');
            }
            return result;
        } catch (error) {
            throw error;
        }
    },

    // Public method for shop page - with caching
    getPublicProducts: async (filters?: { category?: string; search?: string }) => {
        try {
            // Check sessionStorage cache first
            const cachedData = sessionStorage.getItem(CACHE_KEY);
            const cacheExpiry = sessionStorage.getItem(CACHE_EXPIRY_KEY);

            if (cachedData && cacheExpiry && Date.now() < parseInt(cacheExpiry)) {
                console.log('[ProductCache] Cache hit - returning cached products');
                return JSON.parse(cachedData);
            }

            console.log('[ProductCache] Cache miss - fetching from API');

            // Cache miss or expired - fetch from API
            const queryParams = new URLSearchParams();
            if (filters?.category && filters.category !== 'All') {
                queryParams.append('category', filters.category);
            }
            if (filters?.search) {
                queryParams.append('search', filters.search);
            }

            const queryString = queryParams.toString();
            const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}${queryString ? '?' + queryString : ''}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch products');
            }

            // Store in sessionStorage with expiry timestamp
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(result.data));
            sessionStorage.setItem(CACHE_EXPIRY_KEY, String(Date.now() + CACHE_DURATION_MS));

            return result.data;
        } catch (error) {
            throw error;
        }
    },

    // Find a product from cache by ID (for product details page)
    getProductFromCache: (productId: string): any | null => {
        const cachedData = sessionStorage.getItem(CACHE_KEY);
        if (cachedData) {
            try {
                const products = JSON.parse(cachedData);
                const found = products.find((p: any) => p._id === productId || p.id === productId);
                if (found) {
                    console.log('[ProductCache] Found product in cache:', productId);
                    return found;
                }
            } catch (e) {
                console.error('[ProductCache] Error parsing cache:', e);
            }
        }
        console.log('[ProductCache] Product not in cache:', productId);
        return null;
    },

    // Invalidate cache - call after product create/update/delete
    invalidateProductCache: () => {
        console.log('[ProductCache] Cache invalidated');
        sessionStorage.removeItem(CACHE_KEY);
        sessionStorage.removeItem(CACHE_EXPIRY_KEY);
    }
};
