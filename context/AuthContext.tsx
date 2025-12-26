import React, { createContext, useContext, useState, useEffect } from 'react';

interface Address {
  id: string;
  label: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface User {
  name: string;
  email: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  addresses: Address[];
  login: (userData: User) => void;
  logout: () => void;
  updateProfile: (userData: User) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('kcnuts_user');
    const savedAddresses = localStorage.getItem('kcnuts_addresses');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedAddresses) setAddresses(JSON.parse(savedAddresses));
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('kcnuts_user', JSON.stringify(userData));
    // Set some mock addresses if none exist for a new "login" demo
    if (addresses.length === 0) {
      const mockAddress = {
        id: '1',
        label: 'Home',
        address: '42, Blue Diamond Residency, Worli',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400018',
        isDefault: true
      };
      setAddresses([mockAddress]);
      localStorage.setItem('kcnuts_addresses', JSON.stringify([mockAddress]));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kcnuts_user');
  };

  const updateProfile = (userData: User) => {
    setUser(userData);
    localStorage.setItem('kcnuts_user', JSON.stringify(userData));
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    const newAddress = { ...address, id: Math.random().toString(36).substr(2, 9) };
    const updated = [...addresses, newAddress];
    setAddresses(updated);
    localStorage.setItem('kcnuts_addresses', JSON.stringify(updated));
  };

  const deleteAddress = (id: string) => {
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    localStorage.setItem('kcnuts_addresses', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      addresses, 
      login, 
      logout, 
      updateProfile, 
      addAddress, 
      deleteAddress,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};