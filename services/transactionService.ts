import { API_CONFIG } from '../config';

const API_URL = API_CONFIG.BASE_URL;

// Get auth token from cookie
const getAuthToken = (): string | null => {
    const match = document.cookie.match(new RegExp('(^| )Authorization=([^;]+)'));
    return match ? match[2] : null;
};

export interface Transaction {
    _id: string;
    paymentId: string;
    orderId: string;
    orderDetails: {
        orderId: string;
        status: string;
    } | null;
    customer: {
        name: string;
        email: string;
        phone: string;
    } | null;
    amount: number;
    currency: string;
    gateway: 'razorpay' | 'manual';
    status: 'initiated' | 'success' | 'failed' | 'refunded';
    failureReason?: string;
    createdAt: string;
    updatedAt: string;
}

export interface TransactionFilters {
    page?: number;
    limit?: number;
    status?: string;
    gateway?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    startDate?: string;
    endDate?: string;
}

export interface TransactionsResponse {
    transactions: Transaction[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface TransactionStats {
    allTime: {
        success: { count: number; amount: number };
        failed: { count: number; amount: number };
        initiated: { count: number; amount: number };
        refunded: { count: number; amount: number };
    };
    last7Days: {
        success: { count: number; amount: number };
        failed: { count: number; amount: number };
        initiated: { count: number; amount: number };
        refunded: { count: number; amount: number };
    };
}

/**
 * Get transactions with filters and pagination
 */
export const getTransactions = async (filters: TransactionFilters = {}): Promise<TransactionsResponse> => {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_URL}${API_CONFIG.ENDPOINTS.TRANSACTIONS_LIST}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(filters)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch transactions');
    }

    return result.data;
};

/**
 * Get transaction statistics
 */
export const getTransactionStats = async (): Promise<TransactionStats> => {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_URL}${API_CONFIG.ENDPOINTS.TRANSACTIONS_STATS}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch statistics');
    }

    return result.data;
};

/**
 * Get single transaction by ID
 */
export const getTransactionById = async (id: string): Promise<Transaction> => {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_URL}${API_CONFIG.ENDPOINTS.TRANSACTIONS}/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch transaction');
    }

    return result.data;
};
