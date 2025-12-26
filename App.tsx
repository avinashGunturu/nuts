
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Checkout } from './pages/Checkout';
import { Corporate } from './pages/Corporate';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Profile } from './pages/Profile';
import { Orders } from './pages/Orders';

// Dashboard Components
import { DashboardLayout } from './components/Dashboard/DashboardLayout';
import { DashboardOverview } from './pages/Dashboard/Overview';
import { AdminProducts } from './pages/Dashboard/Products';
import { AddProduct } from './pages/Dashboard/AddProduct';
import { EditProduct } from './pages/Dashboard/EditProduct';
import { AdminOrders } from './pages/Dashboard/AdminOrders';
import { AdminOrderDetails } from './pages/Dashboard/AdminOrderDetails';
import { AdminTransactions } from './pages/Dashboard/AdminTransactions';
import { AdminCustomers } from './pages/Dashboard/AdminCustomers';
import { AdminCustomerDetails } from './pages/Dashboard/AdminCustomerDetails';
import { AdminContactRequests } from './pages/Dashboard/AdminContactRequests';
import { AdminWholesaleRequests } from './pages/Dashboard/AdminWholesaleRequests';
import { AdminWholesaleDetails } from './pages/Dashboard/AdminWholesaleDetails';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
         <HashRouter>
            <Routes>
               {/* Shop Routes */}
               <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="shop" element={<Shop />} />
                  <Route path="product/:id" element={<ProductDetails />} />
                  <Route path="about" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="corporate" element={<Corporate />} />
                  <Route path="login" element={<Login />} />
                  <Route path="signup" element={<Signup />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="orders" element={<Orders />} />
               </Route>

               {/* Admin Portal Routes */}
               <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardOverview />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products/add" element={<AddProduct />} />
                  <Route path="products/edit/:id" element={<EditProduct />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="orders/:id" element={<AdminOrderDetails />} />
                  <Route path="transactions" element={<AdminTransactions />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="customers/:id" element={<AdminCustomerDetails />} />
                  <Route path="contact-requests" element={<AdminContactRequests />} />
                  <Route path="wholesale-requests" element={<AdminWholesaleRequests />} />
                  <Route path="wholesale-requests/:id" element={<AdminWholesaleDetails />} />
                  
                  {/* Other Dashboard Sub-routes */}
                  <Route path="analytics" element={<div className="p-10 text-2xl font-bold">Advanced Analytics (Coming Soon)</div>} />
                  <Route path="settings" element={<div className="p-10 text-2xl font-bold">Portal Settings (Coming Soon)</div>} />
               </Route>
            </Routes>
         </HashRouter>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
