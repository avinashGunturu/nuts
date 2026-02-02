import { API_CONFIG } from '../config';

const getAuthToken = () => {
    const match = document.cookie.match(new RegExp('(^| )Authorization=([^;]+)'));
    if (match) return match[2];
    return localStorage.getItem('token');
};

export const bannerService = {
    // Public: Get active banner
    getBanner: async () => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BANNER}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const result = await response.json();
            if (!response.ok) {
                console.error('Failed to fetch banner:', result);
                return null;
            }
            return result;
        } catch (error) {
            console.error('Error fetching banner:', error);
            return null;
        }
    },

    // Assuming there's an interface or type definition for a banner object that these properties belong to.
    // The instruction implies these properties are part of the service definition,
    // but they look like interface properties. Placing them as comments to avoid syntax errors.
    // link?: string;
    // linkText?: string;
    // speed?: number;
    // isActive: boolean;

    // Admin: Get banner settings (active or inactive)
    getBannerSettings: async () => {
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BANNER}/settings`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                }
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to fetch banner settings');
            }
            return result;
        } catch (error) {
            throw error;
        }
    },

    // Admin: Update banner
    updateBanner: async (data: any) => {
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BANNER}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to update banner');
            }
            return result;
        } catch (error) {
            throw error;
        }
    }
};
