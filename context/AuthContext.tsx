import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe, User as AuthUser } from '../services/authService';

interface Address {
  id: string;
  label: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

// Extend or alias the User from authService
export type User = AuthUser;

interface AuthContextType {
  user: User | null;
  addresses: Address[];
  login: (userData: User) => void;
  logout: () => void;
  updateProfile: (userData: User) => void;
  fetchUserProfile: () => Promise<void>;
  addAddress: (address: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initial load
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        await fetchUserProfile();
      } catch (error) {
        // No active session or invalid token, that's fine
      } finally {
        setIsLoading(false);
      }

      const savedAddresses = localStorage.getItem('kcnuts_addresses');
      if (savedAddresses) setAddresses(JSON.parse(savedAddresses));
    };

    initAuth();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userData = await getMe();
      setUser(userData);
      localStorage.setItem('kcnuts_user', JSON.stringify(userData));
    } catch (error) {
      setUser(null);
      localStorage.removeItem('kcnuts_user');
      throw error;
    }
  };

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('kcnuts_user', JSON.stringify(userData));
    // Set some mock addresses if none exist for a new "login" demo (Legacy logic kept for compatibility)
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
    document.cookie = 'Authorization=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
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
      fetchUserProfile,
      addAddress,
      deleteAddress,
      isAuthenticated: !!user,
      isLoading
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