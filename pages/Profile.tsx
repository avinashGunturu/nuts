import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { User, MapPin, Mail, Phone, Plus, Trash2, ShieldCheck, LogOut, ChevronRight, Settings, X, Check } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { user, logout, addresses, updateProfile, deleteAddress, addAddress, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'details' | 'addresses'>('details');
  const [isEditing, setIsEditing] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editData, setEditData] = useState({ ...user });
  
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    address: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  if (!isAuthenticated) return <Navigate to="/login" />;

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editData.name && editData.email) {
      updateProfile(editData as any);
      setIsEditing(false);
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress(newAddress);
    setShowAddressModal(false);
    setNewAddress({ label: 'Home', address: '', city: '', state: '', pincode: '', isDefault: false });
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
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">Full Name</label>
                            <input 
                              type="text" 
                              value={editData.name} 
                              onChange={(e) => setEditData({...editData, name: e.target.value})}
                              className="w-full px-5 py-4 rounded-xl border border-neutral-200 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none bg-neutral-50/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">Phone Number</label>
                            <input 
                              type="tel" 
                              value={editData.phone} 
                              onChange={(e) => setEditData({...editData, phone: e.target.value})}
                              className="w-full px-5 py-4 rounded-xl border border-neutral-200 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none bg-neutral-50/50"
                            />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">Email Address</label>
                          <input 
                            type="email" 
                            value={editData.email} 
                            onChange={(e) => setEditData({...editData, email: e.target.value})}
                            className="w-full px-5 py-4 rounded-xl border border-neutral-200 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none bg-neutral-50/50"
                          />
                       </div>
                       <div className="flex gap-4 pt-4">
                          <Button type="submit">Save Changes</Button>
                          <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                       </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                       <div className="space-y-10">
                          <div className="flex items-start gap-6">
                             <div className="w-14 h-14 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400"><User size={28}/></div>
                             <div>
                                <p className="text-xs text-neutral-400 font-bold uppercase tracking-[0.2em] mb-1">Full Name</p>
                                <p className="text-2xl font-bold text-neutral-900">{user?.name}</p>
                             </div>
                          </div>
                          <div className="flex items-start gap-6">
                             <div className="w-14 h-14 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400"><Mail size={28}/></div>
                             <div>
                                <p className="text-xs text-neutral-400 font-bold uppercase tracking-[0.2em] mb-1">Email</p>
                                <p className="text-2xl font-bold text-neutral-900">{user?.email}</p>
                             </div>
                          </div>
                          <div className="flex items-start gap-6">
                             <div className="w-14 h-14 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400"><Phone size={28}/></div>
                             <div>
                                <p className="text-xs text-neutral-400 font-bold uppercase tracking-[0.2em] mb-1">Phone</p>
                                <p className="text-2xl font-bold text-neutral-900">{user?.phone}</p>
                             </div>
                          </div>
                       </div>

                       <div className="bg-brand-50 p-10 rounded-[40px] border border-brand-100 relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                          <h4 className="font-bold text-brand-dark mb-6 flex items-center gap-3 text-lg">
                             <ShieldCheck size={24} /> Premium Membership
                          </h4>
                          <p className="text-neutral-600 text-base leading-relaxed mb-8">
                             Your account is verified and secured. As a premium member, you get:
                          </p>
                          <ul className="space-y-3 mb-8">
                            {['Priority Shipping', 'Early Harvest Access', 'Wholesale Pricing'].map(p => (
                              <li key={p} className="flex items-center gap-2 text-sm font-bold text-neutral-700">
                                <Check size={16} className="text-brand" /> {p}
                              </li>
                            ))}
                          </ul>
                          <div className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl flex items-center justify-between">
                             <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Active Since</span>
                             <span className="font-bold text-brand">Jan 2024</span>
                          </div>
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
                          {addr.address}<br/>
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
                  onClick={() => setNewAddress({...newAddress, label: 'Home'})}
                  className={`py-3 rounded-xl border-2 font-bold transition-all ${newAddress.label === 'Home' ? 'border-brand bg-brand-50 text-brand' : 'border-neutral-100 text-neutral-400'}`}
                >Home</button>
                <button 
                  type="button" 
                  onClick={() => setNewAddress({...newAddress, label: 'Work'})}
                  className={`py-3 rounded-xl border-2 font-bold transition-all ${newAddress.label === 'Work' ? 'border-brand bg-brand-50 text-brand' : 'border-neutral-100 text-neutral-400'}`}
                >Work</button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">Street Address</label>
                <input 
                  type="text" 
                  required
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
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
                    onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
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
                    onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                    className="w-full px-5 py-4 rounded-xl border border-neutral-100 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all bg-neutral-50/50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 py-2 cursor-pointer" onClick={() => setNewAddress({...newAddress, isDefault: !newAddress.isDefault})}>
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
    </div>
  );
};