import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile, sendOtp, verifyUserField } from '../services/authService';
import { Button } from '../components/Button';
import { User, MapPin, Mail, Phone, Plus, Trash2, ShieldCheck, LogOut, ChevronRight, Settings, X, Check, AlertCircle, CheckCircle, BadgeCheck, Lock } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { user, logout, addresses, updateProfile, deleteAddress, addAddress, isAuthenticated, fetchUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'details' | 'addresses'>('details');
  const [isEditing, setIsEditing] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editData, setEditData] = useState({ ...user });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Verification Modal State
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyType, setVerifyType] = useState<'email' | 'phone'>('email');
  const [verifyStep, setVerifyStep] = useState<1 | 2>(1); // 1=Send OTP, 2=Enter OTP
  const [verifyOtp, setVerifyOtp] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    address: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  if (!isAuthenticated) return <Navigate to="/login" />;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedUser = await updateUserProfile({
        name: editData.name,
        email: editData.email,
        phone: editData.phone
      });

      // Update local context
      updateProfile(updatedUser);

      setSuccess('Profile updated successfully!');
      setIsEditing(false);

      // Refresh user profile from server
      await fetchUserProfile();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress(newAddress);
    setShowAddressModal(false);
    setNewAddress({ label: 'Home', address: '', city: '', state: '', pincode: '', isDefault: false });
  };

  // Open verification modal
  const openVerifyModal = (type: 'email' | 'phone') => {
    setVerifyType(type);
    setVerifyStep(1);
    setVerifyOtp('');
    setVerifyError('');
    setShowVerifyModal(true);
  };

  // Send OTP for verification
  const handleSendVerifyOtp = async () => {
    setVerifyLoading(true);
    setVerifyError('');

    try {
      const identifier = verifyType === 'email' ? user?.email : user?.phone;
      if (!identifier) {
        setVerifyError(`No ${verifyType} found on your account`);
        return;
      }

      await sendOtp(verifyType === 'email' ? { email: identifier } : { phone: identifier });
      setVerifyStep(2);
    } catch (err: any) {
      setVerifyError(err.message || 'Failed to send OTP');
    } finally {
      setVerifyLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    setVerifyLoading(true);
    setVerifyError('');

    try {
      await verifyUserField(verifyType, verifyOtp);

      // Refresh user profile to get updated verification status
      await fetchUserProfile();

      setShowVerifyModal(false);
      setSuccess(`${verifyType === 'email' ? 'Email' : 'Phone'} verified successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setVerifyError(err.message || 'Verification failed');
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-36 pb-24">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-[32px] p-8 border border-neutral-100 shadow-sm sticky top-32">
              <div className="flex flex-col items-center text-center mb-10">
                <div className="w-24 h-24 bg-brand-50 text-brand rounded-full flex items-center justify-center text-4xl font-bold mb-4 border-4 border-white shadow-xl">
                  {user?.name?.[0]}
                </div>
                <h2 className="text-2xl font-bold text-neutral-900">{user?.name}</h2>
                <p className="text-neutral-500 text-sm">{user?.email}</p>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'details' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-neutral-600 hover:bg-neutral-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <User size={20} />
                    <span className="font-bold">Personal Details</span>
                  </div>
                  <ChevronRight size={18} />
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'addresses' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-neutral-600 hover:bg-neutral-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin size={20} />
                    <span className="font-bold">Address Book</span>
                  </div>
                  <ChevronRight size={18} />
                </button>
                <div className="pt-6 mt-6 border-t border-neutral-100">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 p-4 rounded-2xl text-error hover:bg-error-bg transition-all font-bold"
                  >
                    <LogOut size={20} />
                    Log Out
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-[40px] p-10 md:p-14 border border-neutral-100 shadow-xl shadow-neutral-100/50 min-h-[600px]">

              {activeTab === 'details' && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <h3 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
                        <Settings className="text-brand" size={28} />
                        Account Settings
                      </h3>
                      <p className="text-neutral-500 mt-2">Manage your personal information and security</p>
                    </div>
                    {!isEditing && (
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    )}
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleUpdate} className="space-y-8 max-w-xl animate-fade-in-up">
                      {error && (
                        <div className="p-4 bg-error-bg border border-error/10 rounded-2xl flex items-center gap-3 text-error text-sm font-medium animate-fade-in">
                          <AlertCircle size={20} className="shrink-0" />
                          {error}
                        </div>
                      )}
                      {success && (
                        <div className="p-4 bg-brand-50 border border-brand/10 rounded-2xl flex items-center gap-3 text-brand text-sm font-medium animate-fade-in">
                          <CheckCircle size={20} className="shrink-0" />
                          {success}
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">Full Name</label>
                          <input
                            type="text"
                            value={editData.name || ''}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className="w-full px-5 py-4 rounded-xl border border-neutral-200 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none bg-neutral-50/50"
                            placeholder="Your full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">Phone Number</label>
                          <input
                            type="tel"
                            value={editData.phone || ''}
                            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                            className="w-full px-5 py-4 rounded-xl border border-neutral-200 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none bg-neutral-50/50"
                            placeholder="9876543210"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">Email Address</label>
                        <input
                          type="email"
                          value={editData.email || ''}
                          onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                          className="w-full px-5 py-4 rounded-xl border border-neutral-200 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none bg-neutral-50/50"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div className="flex gap-4 pt-4">
                        <Button type="submit" isLoading={isLoading}>Save Changes</Button>
                        <Button variant="ghost" onClick={() => { setIsEditing(false); setError(''); setEditData({ ...user }); }}>Cancel</Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-8">
                      {/* Profile Info Cards */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Name Card */}
                        <div className="group relative bg-gradient-to-br from-white to-neutral-50 p-6 rounded-3xl border border-neutral-100 hover:border-brand/20 hover:shadow-xl hover:shadow-brand/5 transition-all duration-300 overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
                          <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white mb-4 shadow-lg shadow-brand/20">
                              <User size={22} />
                            </div>
                            <p className="text-xs text-neutral-400 font-bold uppercase tracking-[0.15em] mb-2">Full Name</p>
                            <p className="text-xl font-bold text-neutral-900 truncate">{user?.name || 'Not set'}</p>
                          </div>
                        </div>

                        {/* Email Card */}
                        <div className="group relative bg-gradient-to-br from-white to-neutral-50 p-6 rounded-3xl border border-neutral-100 hover:border-brand/20 hover:shadow-xl hover:shadow-brand/5 transition-all duration-300 overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
                          <div className="relative">
                            <div className="flex items-start justify-between mb-4">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                <Mail size={22} />
                              </div>
                              {user?.isEmailVerified ? (
                                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
                                  <BadgeCheck size={14} /> Verified
                                </span>
                              ) : user?.email && (
                                <button
                                  onClick={() => openVerifyModal('email')}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 text-xs font-bold hover:bg-amber-100 transition-colors"
                                >
                                  <AlertCircle size={14} /> Verify
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-neutral-400 font-bold uppercase tracking-[0.15em] mb-2">Email Address</p>
                            <p className="text-xl font-bold text-neutral-900 truncate">{user?.email || 'Not set'}</p>
                          </div>
                        </div>

                        {/* Phone Card */}
                        <div className="group relative bg-gradient-to-br from-white to-neutral-50 p-6 rounded-3xl border border-neutral-100 hover:border-brand/20 hover:shadow-xl hover:shadow-brand/5 transition-all duration-300 overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
                          <div className="relative">
                            <div className="flex items-start justify-between mb-4">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                                <Phone size={22} />
                              </div>
                              {user?.isPhoneVerified ? (
                                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
                                  <BadgeCheck size={14} /> Verified
                                </span>
                              ) : user?.phone && (
                                <button
                                  onClick={() => openVerifyModal('phone')}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 text-xs font-bold hover:bg-amber-100 transition-colors"
                                >
                                  <AlertCircle size={14} /> Verify
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-neutral-400 font-bold uppercase tracking-[0.15em] mb-2">Phone Number</p>
                            <p className="text-xl font-bold text-neutral-900 truncate">{user?.phone || 'Not set'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Membership Card - Full Width Premium Design */}
                      <div className="relative bg-gradient-to-br from-brand via-brand-dark to-neutral-900 p-8 md:p-10 rounded-[32px] overflow-hidden">
                        {/* Background Effects */}
                        <div className="absolute inset-0 overflow-hidden">
                          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                          <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-light/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
                        </div>

                        <div className="relative z-10">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                            {/* Left Side - Title & Description */}
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                  <ShieldCheck size={24} className="text-brand-light" />
                                </div>
                                <div>
                                  <h4 className="text-xl font-bold text-white">Premium Member</h4>
                                  <p className="text-brand-100 text-sm">Account Verified & Secured</p>
                                </div>
                              </div>

                              <p className="text-white/70 text-sm leading-relaxed max-w-md mb-6">
                                Enjoy exclusive benefits and priority access to our premium dry fruits collection. Your membership unlocks special features.
                              </p>

                              {/* Benefits Pills */}
                              <div className="flex flex-wrap gap-2">
                                {['🚀 Priority Shipping', '🌾 Fresh Harvest', '💰 Best Prices'].map(benefit => (
                                  <span key={benefit} className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white text-sm font-medium">
                                    {benefit}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Right Side - Stats Card */}
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 min-w-[200px]">
                              <div className="text-center">
                                <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">Member Since</p>
                                <p className="text-3xl font-bold text-white mb-1">Jan 2024</p>
                                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-4">
                                  <div className="w-3/4 h-full bg-gradient-to-r from-brand-light to-white rounded-full"></div>
                                </div>

                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { icon: MapPin, label: 'Addresses', value: addresses?.length || 0 },
                          { icon: ShieldCheck, label: 'Verified', value: user?.isPhoneVerified ? 'Yes' : 'No' },
                          { icon: User, label: 'Account Type', value: user?.role || 'Customer' },
                          { icon: Check, label: 'Status', value: 'Active' },
                        ].map((item, i) => (
                          <div key={i} className="bg-neutral-50 p-4 rounded-2xl text-center hover:bg-brand-50 transition-colors group">
                            <item.icon size={20} className="mx-auto mb-2 text-neutral-400 group-hover:text-brand transition-colors" />
                            <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">{item.label}</p>
                            <p className="text-lg font-bold text-neutral-900 capitalize">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <h3 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
                        <MapPin className="text-brand" size={28} />
                        Address Book
                      </h3>
                      <p className="text-neutral-500 mt-2">Manage your delivery locations</p>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => setShowAddressModal(true)}>
                      <Plus size={18} /> New Address
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="p-8 rounded-[32px] border border-neutral-100 bg-neutral-50/30 hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all relative group">
                        <div className="flex justify-between items-start mb-6">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] ${addr.isDefault ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'bg-neutral-100 text-neutral-400'}`}>
                            {addr.label}
                          </span>
                          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                            <button className="w-8 h-8 rounded-full bg-neutral-50 text-neutral-400 hover:text-brand flex items-center justify-center transition-colors"><Settings size={16} /></button>
                            <button onClick={() => deleteAddress(addr.id)} className="w-8 h-8 rounded-full bg-neutral-50 text-neutral-400 hover:text-error flex items-center justify-center transition-colors"><Trash2 size={16} /></button>
                          </div>
                        </div>
                        <p className="text-neutral-900 font-bold text-lg mb-2">{user?.name}</p>
                        <p className="text-neutral-500 leading-relaxed mb-6 font-light">
                          {addr.address}<br />
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <div className="flex items-center gap-2 text-neutral-400">
                          <Phone size={14} />
                          <p className="text-sm font-bold">{user?.phone}</p>
                        </div>
                      </div>
                    ))}

                    {/* Add Placeholder Card */}
                    <button
                      onClick={() => setShowAddressModal(true)}
                      className="border-2 border-dashed border-neutral-200 rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 text-neutral-400 hover:border-brand hover:text-brand hover:bg-brand-50 transition-all duration-300 group"
                    >
                      <div className="w-14 h-14 rounded-full bg-neutral-50 group-hover:bg-white flex items-center justify-center transition-colors shadow-sm">
                        <Plus size={28} />
                      </div>
                      <span className="font-bold">Add Another Address</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowAddressModal(false)}></div>
          <div className="bg-white rounded-[40px] w-full max-w-xl relative z-10 shadow-2xl animate-fade-in-up overflow-hidden">
            <div className="px-10 py-8 border-b border-neutral-100 flex items-center justify-between">
              <h4 className="text-2xl font-bold text-neutral-900">Add New Address</h4>
              <button onClick={() => setShowAddressModal(false)} className="text-neutral-400 hover:text-neutral-900 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setNewAddress({ ...newAddress, label: 'Home' })}
                  className={`py-3 rounded-xl border-2 font-bold transition-all ${newAddress.label === 'Home' ? 'border-brand bg-brand-50 text-brand' : 'border-neutral-100 text-neutral-400'}`}
                >Home</button>
                <button
                  type="button"
                  onClick={() => setNewAddress({ ...newAddress, label: 'Work' })}
                  className={`py-3 rounded-xl border-2 font-bold transition-all ${newAddress.label === 'Work' ? 'border-brand bg-brand-50 text-brand' : 'border-neutral-100 text-neutral-400'}`}
                >Work</button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl border border-neutral-100 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all bg-neutral-50/50"
                  placeholder="Flat No, House, Street"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">City</label>
                  <input
                    type="text"
                    required
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl border border-neutral-100 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all bg-neutral-50/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">Pincode</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl border border-neutral-100 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all bg-neutral-50/50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 py-2 cursor-pointer" onClick={() => setNewAddress({ ...newAddress, isDefault: !newAddress.isDefault })}>
                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${newAddress.isDefault ? 'bg-brand border-brand text-white' : 'border-neutral-200'}`}>
                  {newAddress.isDefault && <Check size={14} strokeWidth={3} />}
                </div>
                <span className="text-sm font-bold text-neutral-600">Set as default address</span>
              </div>

              <Button type="submit" className="w-full py-5 text-lg shadow-xl shadow-brand/20">Save Address</Button>
            </form>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowVerifyModal(false)}></div>
          <div className="bg-white rounded-[32px] w-full max-w-md relative z-10 shadow-2xl animate-fade-in-up overflow-hidden">
            <div className="px-8 py-6 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${verifyType === 'email' ? 'bg-blue-500' : 'bg-emerald-500'}`}>
                  {verifyType === 'email' ? <Mail size={20} /> : <Phone size={20} />}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-neutral-900">Verify {verifyType === 'email' ? 'Email' : 'Phone'}</h4>
                  <p className="text-xs text-neutral-500">Step {verifyStep} of 2</p>
                </div>
              </div>
              <button onClick={() => setShowVerifyModal(false)} className="text-neutral-400 hover:text-neutral-900 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8">
              {verifyError && (
                <div className="mb-6 p-4 bg-error-bg border border-error/10 rounded-2xl flex items-center gap-3 text-error text-sm font-medium">
                  <AlertCircle size={18} className="shrink-0" />
                  {verifyError}
                </div>
              )}

              {verifyStep === 1 ? (
                // Step 1: Send OTP
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center mx-auto mb-6">
                    {verifyType === 'email' ? <Mail size={28} className="text-blue-500" /> : <Phone size={28} className="text-emerald-500" />}
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">Verify your {verifyType}</h3>
                  <p className="text-neutral-500 mb-6">
                    We'll send a 6-digit OTP to<br />
                    <span className="font-bold text-neutral-900">{verifyType === 'email' ? user?.email : user?.phone}</span>
                  </p>
                  <Button
                    onClick={handleSendVerifyOtp}
                    isLoading={verifyLoading}
                    className="w-full py-4 shadow-lg shadow-brand/20"
                  >
                    Send OTP
                  </Button>
                </div>
              ) : (
                // Step 2: Enter OTP
                <div>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-4">
                      <Lock size={28} className="text-brand" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-1">Enter OTP</h3>
                    <p className="text-neutral-500 text-sm">
                      OTP sent to {verifyType === 'email' ? user?.email : user?.phone}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      value={verifyOtp}
                      onChange={(e) => setVerifyOtp(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl border border-neutral-200 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none text-center text-2xl tracking-[0.5em] font-mono"
                      placeholder="000000"
                      maxLength={6}
                    />

                    <Button
                      onClick={handleVerifyOtp}
                      isLoading={verifyLoading}
                      className="w-full py-4 shadow-lg shadow-brand/20"
                      disabled={verifyOtp.length !== 6}
                    >
                      Verify
                    </Button>

                    <button
                      onClick={() => setVerifyStep(1)}
                      className="w-full py-3 text-neutral-500 hover:text-brand font-medium text-sm transition-colors"
                    >
                      Didn't receive OTP? Send again
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};