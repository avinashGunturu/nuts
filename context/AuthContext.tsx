import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe, User as AuthUser, UserAddress, addUserAddress, updateUserAddress, deleteUserAddress, AddressPayload } from '../services/authService';

// Extend or alias the User from authService
export type User = AuthUser;
export type Address = UserAddress;

interface AuthContextType {
  user: User | null;
  addresses: Address[];
  login: (userData: User) => void;
  logout: () => void;
  updateProfile: (userData: User) => void;
  fetchUserProfile: () => Promise<void>;
  addAddress: (address: AddressPayload) => Promise<void>;
  updateAddress: (addressId: string, address: Partial<AddressPayload>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
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
    };

    initAuth();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userData = await getMe();
      setUser(userData);
      setAddresses(userData.addresses || []);
      localStorage.setItem('kcnuts_user', JSON.stringify(userData));
    } catch (error) {
      setUser(null);
      setAddresses([]);
      localStorage.removeItem('kcnuts_user');
      throw error;
    }
  };

  const login = (userData: User) => {
    setUser(userData);
    setAddresses(userData.addresses || []);
    localStorage.setItem('kcnuts_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setAddresses([]);

    // Clear all localStorage items related to auth
    localStorage.removeItem('kcnuts_user');
    localStorage.removeItem('kcnuts_addresses');
    localStorage.removeItem('kcnuts_cart');
    localStorage.removeItem('token'); // Important: also clear the 'token' key

    // Clear sessionStorage completely
    sessionStorage.clear();

    // Clear all auth cookies with various combinations
    const cookiesToClear = ['Authorization', 'token', 'auth'];
    const paths = ['/', ''];

    cookiesToClear.forEach(cookieName => {
      paths.forEach(path => {
        // Clear without domain
        document.cookie = `${cookieName}=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
        // Clear with SameSite
        document.cookie = `${cookieName}=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;`;
        document.cookie = `${cookieName}=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict;`;
        document.cookie = `${cookieName}=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=None; Secure;`;
      });
    });
  };

  const updateProfile = (userData: User) => {
    setUser(userData);
    setAddresses(userData.addresses || []);
    localStorage.setItem('kcnuts_user', JSON.stringify(userData));
  };

  const addAddress = async (address: AddressPayload) => {
    const updatedAddresses = await addUserAddress(address);
    setAddresses(updatedAddresses);
  };

  const updateAddress = async (addressId: string, address: Partial<AddressPayload>) => {
    const updatedAddresses = await updateUserAddress(addressId, address);
    setAddresses(updatedAddresses);
  };

  const deleteAddress = async (id: string) => {
    const updatedAddresses = await deleteUserAddress(id);
    setAddresses(updatedAddresses);
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
      updateAddress,
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