import { API_CONFIG } from '../config';

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
    }
};
