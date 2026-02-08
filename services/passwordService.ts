import { API_CONFIG } from '../config';

const API_URL = `${API_CONFIG.BASE_URL}/passwords`;

export const getPasswords = async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No Authorization token found');

    const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch passwords');
    }

    return result.data;
};

export const createPassword = async (data: any) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No Authorization token found');

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to create password');
    }

    return result.data;
};

export const updatePassword = async (id: string, data: any) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No Authorization token found');

    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to update password');
    }

    return result.data;
};

export const deletePassword = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No Authorization token found');

    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to delete password');
    }

    return result.data;
};
