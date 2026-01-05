
import React, { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    ChevronLeft,
    ChevronRight,
    Ticket,
    ToggleLeft,
    ToggleRight,
    X,
    CheckCircle2,
    XCircle,
    Calendar,
    Percent,
    DollarSign,
    Loader2,
    Eye,
    Pencil,
    Trash2,
    AlertTriangle,
    Users
} from 'lucide-react';
import { Button } from '../../components/Button';
import { couponService, Coupon, CouponFilters, CreateCouponPayload } from '../../services/couponService';
import { API_CONFIG } from '../../config';

interface Customer {
    _id: string;
    name: string;
    email: string;
    phone: string;
}

type ModalMode = 'create' | 'view' | 'edit';

interface FormData extends CreateCouponPayload {
    _id?: string;
}

export const AdminCoupons: React.FC = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pages: 1 });

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<ModalMode>('create');
    const [saving, setSaving] = useState(false);
    const [modalError, setModalError] = useState<string | null>(null);

    // Delete confirmation modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);
    const [deleting, setDeleting] = useState(false);

    // User selection state
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<Customer[]>([]);
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    // Form state
    const [formData, setFormData] = useState<FormData>({
        code: '',
        discountType: 'percentage',
        discountValue: 0,
        minOrderValue: 0,
        maxDiscountAmount: 0,
        validUntil: '',
        usageLimit: 100,
        applicableTo: 'all',
        assignedUsers: []
    });

    const resetFormData = () => {
        setFormData({
            code: '',
            discountType: 'percentage',
            discountValue: 0,
            minOrderValue: 0,
            maxDiscountAmount: 0,
            validUntil: '',
            usageLimit: 100,
            applicableTo: 'all',
            assignedUsers: []
        });
        setSelectedUsers([]);
        setUserSearchTerm('');
    };

    // Fetch customers for user selection
    const fetchCustomers = async (search: string = '') => {
        setLoadingUsers(true);
        try {
            const token = document.cookie.match(new RegExp('(^| )Authorization=([^;]+)'))?.[2] || localStorage.getItem('token');
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN_CUSTOMERS}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    },
                    body: JSON.stringify({ search, limit: 50 })
                }
            );
            const result = await response.json();
            if (response.ok && result.data) {
                setCustomers(result.data.customers || []);
            }
        } catch (err) {
            console.error('Failed to fetch customers:', err);
        } finally {
            setLoadingUsers(false);
        }
    };

    // Fetch customers when modal opens with specific_users
    useEffect(() => {
        if (showModal && formData.applicableTo === 'specific_users') {
            fetchCustomers(userSearchTerm);
        }
    }, [showModal, formData.applicableTo]);

    // Debounce user search
    useEffect(() => {
        if (formData.applicableTo === 'specific_users') {
            const debounce = setTimeout(() => {
                fetchCustomers(userSearchTerm);
            }, 300);
            return () => clearTimeout(debounce);
        }
    }, [userSearchTerm]);

    const handleSelectUser = (customer: Customer) => {
        if (!selectedUsers.find(u => u._id === customer._id)) {
            setSelectedUsers(prev => [...prev, customer]);
            setFormData(prev => ({
                ...prev,
                assignedUsers: [...(prev.assignedUsers || []), customer._id]
            }));
        }
        setShowUserDropdown(false);
        setUserSearchTerm('');
    };

    const handleRemoveUser = (userId: string) => {
        setSelectedUsers(prev => prev.filter(u => u._id !== userId));
        setFormData(prev => ({
            ...prev,
            assignedUsers: (prev.assignedUsers || []).filter(id => id !== userId)
        }));
    };

    const fetchCoupons = async () => {
        setLoading(true);
        setError(null);
        try {
            const filters: CouponFilters = {
                search: searchTerm,
                page: pagination.page,
                limit: pagination.limit
            };

            if (statusFilter !== 'all') {
                filters.isActive = statusFilter === 'active';
            }

            const result = await couponService.getCoupons(filters);
            setCoupons(result.data.coupons);
            setPagination(result.data.pagination);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch coupons');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, [pagination.page, statusFilter]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            if (pagination.page === 1) {
                fetchCoupons();
            } else {
                setPagination(prev => ({ ...prev, page: 1 }));
            }
        }, 300);
        return () => clearTimeout(debounce);
    }, [searchTerm]);

    const handleToggleStatus = async (coupon: Coupon) => {
        try {
            await couponService.toggleCouponStatus(coupon._id, !coupon.isActive);
            fetchCoupons();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update coupon status');
        }
    };

    const openCreateModal = () => {
        resetFormData();
        setModalMode('create');
        setModalError(null);
        setShowModal(true);
    };

    const openViewModal = async (coupon: Coupon) => {
        setFormData({
            _id: coupon._id,
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            minOrderValue: coupon.minOrderValue,
            maxDiscountAmount: coupon.maxDiscountAmount,
            validUntil: formatDateTimeLocal(coupon.validUntil),
            usageLimit: coupon.usageLimit,
            applicableTo: coupon.applicableTo,
            assignedUsers: coupon.assignedUsers || []
        });

        // Fetch user details for assigned users - using optimized by-ids endpoint
        if (coupon.assignedUsers && coupon.assignedUsers.length > 0 && coupon.applicableTo === 'specific_users') {
            try {
                const token = document.cookie.match(new RegExp('(^| )Authorization=([^;]+)'))?.[2] || localStorage.getItem('token');
                const response = await fetch(
                    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN_CUSTOMERS_BY_IDS}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                        },
                        body: JSON.stringify({ userIds: coupon.assignedUsers })
                    }
                );
                const result = await response.json();
                if (response.ok && result.data) {
                    setSelectedUsers(result.data.customers || []);
                }
            } catch (err) {
                console.error('Failed to fetch assigned users:', err);
            }
        } else {
            setSelectedUsers([]);
        }

        setModalMode('view');
        setModalError(null);
        setShowModal(true);
    };

    const openEditModal = async (coupon: Coupon) => {
        setFormData({
            _id: coupon._id,
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            minOrderValue: coupon.minOrderValue,
            maxDiscountAmount: coupon.maxDiscountAmount,
            validUntil: formatDateTimeLocal(coupon.validUntil),
            usageLimit: coupon.usageLimit,
            applicableTo: coupon.applicableTo,
            assignedUsers: coupon.assignedUsers || []
        });

        // Fetch user details for assigned users - using optimized by-ids endpoint
        if (coupon.assignedUsers && coupon.assignedUsers.length > 0 && coupon.applicableTo === 'specific_users') {
            try {
                const token = document.cookie.match(new RegExp('(^| )Authorization=([^;]+)'))?.[2] || localStorage.getItem('token');
                const response = await fetch(
                    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN_CUSTOMERS_BY_IDS}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                        },
                        body: JSON.stringify({ userIds: coupon.assignedUsers })
                    }
                );
                const result = await response.json();
                if (response.ok && result.data) {
                    setSelectedUsers(result.data.customers || []);
                }
            } catch (err) {
                console.error('Failed to fetch assigned users:', err);
            }
        } else {
            setSelectedUsers([]);
        }

        setModalMode('edit');
        setModalError(null);
        setShowModal(true);
    };

    const openDeleteModal = (coupon: Coupon) => {
        setCouponToDelete(coupon);
        setShowDeleteModal(true);
    };

    const handleSaveCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setModalError(null);

        try {
            if (modalMode === 'create') {
                await couponService.createCoupon(formData);
            } else if (modalMode === 'edit' && formData._id) {
                await couponService.updateCoupon(formData._id, formData);
            }
            setShowModal(false);
            resetFormData();
            fetchCoupons();
        } catch (err) {
            setModalError(err instanceof Error ? err.message : `Failed to ${modalMode} coupon`);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteCoupon = async () => {
        if (!couponToDelete) return;

        setDeleting(true);
        try {
            // Soft delete = set isActive to false
            await couponService.toggleCouponStatus(couponToDelete._id, false);
            setShowDeleteModal(false);
            setCouponToDelete(null);
            fetchCoupons();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete coupon');
        } finally {
            setDeleting(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTimeLocal = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
    };

    const isExpired = (dateString: string) => {
        return new Date(dateString) < new Date();
    };

    const getModalTitle = () => {
        switch (modalMode) {
            case 'create': return 'Create New Coupon';
            case 'view': return 'Coupon Details';
            case 'edit': return 'Edit Coupon';
        }
    };

    const STATS_SUMMARY = [
        {
            label: 'Total Coupons',
            count: pagination.total,
            icon: Ticket,
            color: 'text-brand',
            description: 'All coupons created'
        },
        {
            label: 'Active',
            count: coupons.filter(c => c.isActive && !isExpired(c.validUntil)).length,
            icon: CheckCircle2,
            color: 'text-success',
            description: 'Currently active'
        },
        {
            label: 'Inactive',
            count: coupons.filter(c => !c.isActive).length,
            icon: XCircle,
            color: 'text-neutral-400',
            description: 'Disabled coupons'
        },
        {
            label: 'Expired',
            count: coupons.filter(c => isExpired(c.validUntil)).length,
            icon: Calendar,
            color: 'text-error',
            description: 'Past validity date'
        },
    ];

    const isViewMode = modalMode === 'view';

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">Coupons Management</h1>
                    <p className="text-neutral-500 mt-2 font-medium">Create and manage discount coupons for your store.</p>
                </div>
                <Button
                    variant="black"
                    size="md"
                    className="flex items-center gap-2 shadow-xl shadow-neutral-900/10"
                    onClick={openCreateModal}
                >
                    <Plus size={20} /> Create Coupon
                </Button>
            </div>

            {/* Stats Summary Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS_SUMMARY.map(stat => (
                    <div key={stat.label} className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex items-center justify-between group transition-all hover:shadow-md">
                        <div>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h4 className="text-2xl font-bold text-neutral-900">{stat.count}</h4>
                            <p className="text-[10px] text-neutral-400 mt-1 font-medium">{stat.description}</p>
                        </div>
                        <div className={`p-3 rounded-xl bg-neutral-50 ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-6 rounded-[32px] border border-neutral-100 shadow-sm flex flex-col md:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by coupon code..."
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-100 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-3">
                    <div className="bg-neutral-100 p-1 rounded-2xl flex gap-1">
                        {(['all', 'active', 'inactive'] as const).map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize ${statusFilter === status
                                    ? 'bg-white text-neutral-900 shadow-sm'
                                    : 'text-neutral-500 hover:text-neutral-900'
                                    }`}
                            >
                                {status === 'all' ? 'All Coupons' : status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-error-bg text-error px-6 py-4 rounded-2xl flex items-center gap-3">
                    <XCircle size={20} />
                    <span className="font-medium">{error}</span>
                </div>
            )}

            {/* Table Container */}
            <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm overflow-hidden flex flex-col" style={{ minHeight: '500px' }}>
                {loading ? (
                    <div className="flex-1 flex items-center justify-center py-20">
                        <Loader2 size={40} className="text-brand animate-spin" />
                    </div>
                ) : coupons.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 text-neutral-400">
                        <Ticket size={48} className="mb-4 opacity-50" />
                        <p className="text-lg font-medium">No coupons found</p>
                        <p className="text-sm">Create your first coupon to get started</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-neutral-50/50">
                                        <th className="px-10 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Code</th>
                                        <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Discount</th>
                                        <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Min Order</th>
                                        <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Valid Until</th>
                                        <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Usage</th>
                                        <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Status</th>
                                        <th className="px-10 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-50">
                                    {coupons.map((coupon) => (
                                        <tr key={coupon._id} className="hover:bg-neutral-50/50 transition-colors group">
                                            <td className="px-10 py-6">
                                                <span className="text-sm font-bold text-neutral-900 bg-neutral-100 px-3 py-1.5 rounded-lg font-mono">
                                                    {coupon.code}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-2">
                                                    {coupon.discountType === 'percentage' ? (
                                                        <Percent size={14} className="text-brand" />
                                                    ) : (
                                                        <DollarSign size={14} className="text-success" />
                                                    )}
                                                    <span className="text-sm font-bold text-neutral-700">
                                                        {coupon.discountType === 'percentage'
                                                            ? `${coupon.discountValue}%`
                                                            : `₹${coupon.discountValue}`}
                                                    </span>
                                                    {coupon.maxDiscountAmount > 0 && coupon.discountType === 'percentage' && (
                                                        <span className="text-xs text-neutral-400">
                                                            (max ₹{coupon.maxDiscountAmount})
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className="text-sm text-neutral-700 font-medium">
                                                    ₹{coupon.minOrderValue.toLocaleString('en-IN')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className="text-sm font-medium text-neutral-700">
                                                    {formatDate(coupon.validUntil)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-neutral-900">{coupon.usedCount}</span>
                                                    <span className="text-sm text-neutral-400">/ {coupon.usageLimit}</span>
                                                </div>
                                                <div className="w-20 h-1.5 bg-neutral-100 rounded-full mt-1.5 overflow-hidden">
                                                    <div
                                                        className="h-full bg-brand rounded-full transition-all"
                                                        style={{ width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex flex-col gap-1.5">
                                                    {isExpired(coupon.validUntil) ? (
                                                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-error-bg text-error w-fit">
                                                            Expired
                                                        </span>
                                                    ) : (
                                                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-success-bg text-success w-fit">
                                                            Valid
                                                        </span>
                                                    )}
                                                    {coupon.isActive ? (
                                                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-brand-50 text-brand w-fit">
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-neutral-100 text-neutral-400 w-fit">
                                                            Inactive
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openViewModal(coupon)}
                                                        className="w-9 h-9 rounded-xl bg-neutral-50 text-neutral-400 hover:text-brand hover:bg-brand-50 flex items-center justify-center transition-all"
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => openEditModal(coupon)}
                                                        className="w-9 h-9 rounded-xl bg-neutral-50 text-neutral-400 hover:text-brand hover:bg-brand-50 flex items-center justify-center transition-all"
                                                        title="Edit Coupon"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    {coupon.isActive ? (
                                                        <button
                                                            onClick={() => openDeleteModal(coupon)}
                                                            className="w-9 h-9 rounded-xl bg-neutral-50 text-neutral-400 hover:text-orange-500 hover:bg-orange-50 flex items-center justify-center transition-all"
                                                            title="Deactivate Coupon"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleToggleStatus(coupon)}
                                                            className="w-9 h-9 rounded-xl bg-neutral-50 text-neutral-400 hover:text-success hover:bg-success-bg flex items-center justify-center transition-all"
                                                            title="Activate Coupon"
                                                        >
                                                            <CheckCircle2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-10 py-8 bg-neutral-50/50 flex flex-col sm:flex-row justify-between items-center gap-6 mt-auto">
                            <p className="text-sm text-neutral-500 font-medium">
                                Showing <span className="text-neutral-900 font-bold">{((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="text-neutral-900 font-bold">{pagination.total}</span> entries
                            </p>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                    disabled={pagination.page <= 1}
                                    className="p-2 rounded-xl border border-neutral-200 bg-white text-neutral-400 hover:text-brand transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <span className="text-sm font-bold text-neutral-700">
                                    Page {pagination.page} of {pagination.pages}
                                </span>
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                    disabled={pagination.page >= pagination.pages}
                                    className="p-2 rounded-xl border border-neutral-200 bg-white text-neutral-400 hover:text-brand transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* View/Edit/Create Coupon Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-[32px] w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-neutral-50 text-neutral-400 hover:text-neutral-900 flex items-center justify-center transition-all"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-bold text-neutral-900 mb-6">{getModalTitle()}</h2>

                        {modalError && (
                            <div className="bg-error-bg text-error px-4 py-3 rounded-xl mb-6 text-sm font-medium">
                                {modalError}
                            </div>
                        )}

                        <form onSubmit={handleSaveCoupon} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                                    Coupon Code {!isViewMode && '*'}
                                </label>
                                <input
                                    type="text"
                                    required={!isViewMode}
                                    disabled={isViewMode}
                                    value={formData.code}
                                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                                    className={`w-full px-4 py-3 rounded-2xl border border-neutral-100 outline-none transition-all text-sm font-mono uppercase ${isViewMode
                                        ? 'bg-neutral-100 text-neutral-600 cursor-not-allowed'
                                        : 'bg-neutral-50 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10'
                                        }`}
                                    placeholder="e.g., SUMMER2025"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                                        Discount Type
                                    </label>
                                    <select
                                        disabled={isViewMode}
                                        value={formData.discountType}
                                        onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value as 'percentage' | 'fixed' }))}
                                        className={`w-full px-4 py-3 rounded-2xl border border-neutral-100 outline-none transition-all text-sm ${isViewMode
                                            ? 'bg-neutral-100 text-neutral-600 cursor-not-allowed'
                                            : 'bg-neutral-50 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10'
                                            }`}
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                                        Discount Value {!isViewMode && '*'}
                                    </label>
                                    <input
                                        type="number"
                                        required={!isViewMode}
                                        disabled={isViewMode}
                                        min="0"
                                        value={formData.discountValue || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, discountValue: Number(e.target.value) }))}
                                        className={`w-full px-4 py-3 rounded-2xl border border-neutral-100 outline-none transition-all text-sm ${isViewMode
                                            ? 'bg-neutral-100 text-neutral-600 cursor-not-allowed'
                                            : 'bg-neutral-50 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10'
                                            }`}
                                        placeholder={formData.discountType === 'percentage' ? 'e.g., 10' : 'e.g., 100'}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                                        Min Order Value
                                    </label>
                                    <input
                                        type="number"
                                        disabled={isViewMode}
                                        min="0"
                                        value={formData.minOrderValue || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, minOrderValue: Number(e.target.value) }))}
                                        className={`w-full px-4 py-3 rounded-2xl border border-neutral-100 outline-none transition-all text-sm ${isViewMode
                                            ? 'bg-neutral-100 text-neutral-600 cursor-not-allowed'
                                            : 'bg-neutral-50 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10'
                                            }`}
                                        placeholder="e.g., 500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                                        Max Discount
                                    </label>
                                    <input
                                        type="number"
                                        disabled={isViewMode}
                                        min="0"
                                        value={formData.maxDiscountAmount || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, maxDiscountAmount: Number(e.target.value) }))}
                                        className={`w-full px-4 py-3 rounded-2xl border border-neutral-100 outline-none transition-all text-sm ${isViewMode
                                            ? 'bg-neutral-100 text-neutral-600 cursor-not-allowed'
                                            : 'bg-neutral-50 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10'
                                            }`}
                                        placeholder="e.g., 200"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                                        Valid Until {!isViewMode && '*'}
                                    </label>
                                    <input
                                        type="datetime-local"
                                        required={!isViewMode}
                                        disabled={isViewMode}
                                        value={formData.validUntil}
                                        onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                                        className={`w-full px-4 py-3 rounded-2xl border border-neutral-100 outline-none transition-all text-sm ${isViewMode
                                            ? 'bg-neutral-100 text-neutral-600 cursor-not-allowed'
                                            : 'bg-neutral-50 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10'
                                            }`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                                        Usage Limit
                                    </label>
                                    <input
                                        type="number"
                                        disabled={isViewMode}
                                        min="1"
                                        value={formData.usageLimit || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: Number(e.target.value) }))}
                                        className={`w-full px-4 py-3 rounded-2xl border border-neutral-100 outline-none transition-all text-sm ${isViewMode
                                            ? 'bg-neutral-100 text-neutral-600 cursor-not-allowed'
                                            : 'bg-neutral-50 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10'
                                            }`}
                                        placeholder="e.g., 100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                                    Applicable To
                                </label>
                                <select
                                    disabled={isViewMode}
                                    value={formData.applicableTo}
                                    onChange={(e) => {
                                        const value = e.target.value as 'all' | 'specific_users';
                                        setFormData(prev => ({ ...prev, applicableTo: value }));
                                        if (value === 'all') {
                                            setSelectedUsers([]);
                                            setFormData(prev => ({ ...prev, assignedUsers: [] }));
                                        }
                                    }}
                                    className={`w-full px-4 py-3 rounded-2xl border border-neutral-100 outline-none transition-all text-sm ${isViewMode
                                        ? 'bg-neutral-100 text-neutral-600 cursor-not-allowed'
                                        : 'bg-neutral-50 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10'
                                        }`}
                                >
                                    <option value="all">All Users</option>
                                    <option value="specific_users">Specific Users</option>
                                </select>
                            </div>

                            {/* User Selection Dropdown - Show when specific_users is selected */}
                            {formData.applicableTo === 'specific_users' && (
                                <div className="space-y-3">
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">
                                        <Users size={12} className="inline mr-1" />
                                        Select Users
                                    </label>

                                    {/* Selected Users Display */}
                                    {selectedUsers.length > 0 && (
                                        <div className="flex flex-wrap gap-2 p-3 bg-neutral-50 rounded-2xl">
                                            {selectedUsers.map(user => (
                                                <span
                                                    key={user._id}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand rounded-full text-xs font-medium"
                                                >
                                                    {user.name || user.phone || user.email}
                                                    {!isViewMode && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveUser(user._id)}
                                                            className="w-4 h-4 rounded-full bg-brand/20 hover:bg-brand/40 flex items-center justify-center transition-colors"
                                                        >
                                                            <X size={10} />
                                                        </button>
                                                    )}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Search Input with Dropdown */}
                                    {!isViewMode && (
                                        <div className="relative">
                                            <div className="relative">
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                                                <input
                                                    type="text"
                                                    placeholder="Search users by name, email or phone..."
                                                    value={userSearchTerm}
                                                    onChange={(e) => setUserSearchTerm(e.target.value)}
                                                    onFocus={() => setShowUserDropdown(true)}
                                                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-100 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-sm"
                                                />
                                                {loadingUsers && (
                                                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 animate-spin" size={16} />
                                                )}
                                            </div>

                                            {/* Dropdown List */}
                                            {showUserDropdown && (
                                                <div className="absolute z-10 w-full mt-2 bg-white rounded-2xl border border-neutral-100 shadow-lg max-h-48 overflow-y-auto">
                                                    {customers.length === 0 ? (
                                                        <div className="px-4 py-3 text-sm text-neutral-400 text-center">
                                                            {loadingUsers ? 'Loading users...' : 'No users found'}
                                                        </div>
                                                    ) : (
                                                        customers
                                                            .filter(c => !selectedUsers.find(u => u._id === c._id))
                                                            .map(customer => (
                                                                <button
                                                                    key={customer._id}
                                                                    type="button"
                                                                    onClick={() => handleSelectUser(customer)}
                                                                    className="w-full px-4 py-3 text-left hover:bg-neutral-50 transition-colors flex items-center justify-between group"
                                                                >
                                                                    <div>
                                                                        <p className="text-sm font-medium text-neutral-900">{customer.name || 'No Name'}</p>
                                                                        <p className="text-xs text-neutral-400">{customer.phone || customer.email}</p>
                                                                    </div>
                                                                    <Plus size={16} className="text-neutral-300 group-hover:text-brand transition-colors" />
                                                                </button>
                                                            ))
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* View mode - show user IDs or message */}
                                    {isViewMode && selectedUsers.length === 0 && formData.assignedUsers && formData.assignedUsers.length > 0 && (
                                        <p className="text-sm text-neutral-500">
                                            {formData.assignedUsers.length} user(s) assigned
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                {isViewMode ? (
                                    <>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Close
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="primary"
                                            className="flex-1 gap-2"
                                            onClick={() => setModalMode('edit')}
                                        >
                                            <Pencil size={18} />
                                            Edit Coupon
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            className="flex-1 gap-2"
                                            disabled={saving}
                                        >
                                            {saving ? (
                                                <>
                                                    <Loader2 size={18} className="animate-spin" />
                                                    Saving...
                                                </>
                                            ) : modalMode === 'create' ? (
                                                <>
                                                    <Plus size={18} />
                                                    Create Coupon
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle2 size={18} />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Deactivate Confirmation Modal */}
            {showDeleteModal && couponToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-[32px] w-full max-w-md p-8 relative">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                                <AlertTriangle size={32} className="text-orange-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Deactivate Coupon?</h2>
                            <p className="text-neutral-500 mb-2">
                                Are you sure you want to deactivate the coupon
                            </p>
                            <p className="text-lg font-bold font-mono bg-neutral-100 px-4 py-2 rounded-lg mb-4">
                                {couponToDelete.code}
                            </p>
                            <p className="text-sm text-neutral-400 mb-6">
                                This coupon will be marked as inactive and customers won't be able to use it. You can reactivate it anytime from the coupons list.
                            </p>

                            <div className="flex gap-3 w-full">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setCouponToDelete(null);
                                    }}
                                    disabled={deleting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    variant="primary"
                                    className="flex-1 gap-2 !bg-orange-500 hover:!bg-orange-600"
                                    onClick={handleDeleteCoupon}
                                    disabled={deleting}
                                >
                                    {deleting ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Deactivating...
                                        </>
                                    ) : (
                                        <>
                                            <ToggleLeft size={18} />
                                            Deactivate Coupon
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
