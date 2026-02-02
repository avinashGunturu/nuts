
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import { AdminLogin } from './pages/AdminLogin';
import { Signup } from './pages/Signup';
import { Profile } from './pages/Profile';
import { Orders } from './pages/Orders';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsConditions } from './pages/TermsConditions';
import { RefundPolicy } from './pages/RefundPolicy';
import { ShippingPolicy } from './pages/ShippingPolicy';
import { AccessDenied } from './pages/AccessDenied';
import { NotFound } from './pages/NotFound';
import { ProtectedRoute } from './components/ProtectedRoute';

// Dashboard Components
import { DashboardLayout } from './components/Dashboard/DashboardLayout';
import { DashboardOverview } from './pages/Dashboard/Overview';
import { AdminProducts } from './pages/Dashboard/Products';
import { AddProduct } from './pages/Dashboard/AddProduct';
import { AdminOrders } from './pages/Dashboard/AdminOrders';
import { AdminOrderDetails } from './pages/Dashboard/AdminOrderDetails';
import { AdminTransactions } from './pages/Dashboard/AdminTransactions';
import { AdminCustomers } from './pages/Dashboard/AdminCustomers';
import { AdminCustomerDetails } from './pages/Dashboard/AdminCustomerDetails';
import { AdminContactRequests } from './pages/Dashboard/AdminContactRequests';
import { AdminWholesaleRequests } from './pages/Dashboard/AdminWholesaleRequests';
import { AdminWholesaleDetails } from './pages/Dashboard/AdminWholesaleDetails';
import { AdminCoupons } from './pages/Dashboard/AdminCoupons';
import { AdminBannerSettings } from './pages/Dashboard/AdminBannerSettings';

const App: React.FC = () => {
   return (
      <AuthProvider>
         <CartProvider>
            <BrowserRouter>
               <Routes>
                  {/* Shop Routes */}
                  <Route path="/adminportal/login" element={<AdminLogin />} />
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
                     <Route path="privacy-policy" element={<PrivacyPolicy />} />
                     <Route path="terms-conditions" element={<TermsConditions />} />
                     <Route path="refund-policy" element={<RefundPolicy />} />
                     <Route path="shipping-policy" element={<ShippingPolicy />} />
                  </Route>

                  {/* Admin Portal Routes */}
                  <Route path="/access-denied" element={<AccessDenied />} />

                  <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                     <Route path="/dashboard" element={<DashboardLayout />}>
                        <Route index element={<DashboardOverview />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="products/add" element={<AddProduct />} />
                        <Route path="products/edit/:id" element={<AddProduct />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="orders/:id" element={<AdminOrderDetails />} />
                        <Route path="transactions" element={<AdminTransactions />} />
                        <Route path="customers" element={<AdminCustomers />} />
                        <Route path="customers/:id" element={<AdminCustomerDetails />} />
                        <Route path="contact-requests" element={<AdminContactRequests />} />
                        <Route path="wholesale-requests" element={<AdminWholesaleRequests />} />
                        <Route path="wholesale-requests/:id" element={<AdminWholesaleDetails />} />
                        <Route path="coupons" element={<AdminCoupons />} />
                        <Route path="coupons" element={<AdminCoupons />} />
                        <Route path="banner" element={<AdminBannerSettings />} />

                        {/* Other Dashboard Sub-routes */}
                        <Route path="analytics" element={<div className="p-10 text-2xl font-bold">Advanced Analytics (Coming Soon)</div>} />
                        <Route path="settings" element={<div className="p-10 text-2xl font-bold">Portal Settings (Coming Soon)</div>} />
                     </Route>
                  </Route>

                  {/* 404 Catch-all - MUST be last */}
                  <Route path="*" element={<NotFound />} />
               </Routes>
            </BrowserRouter>
         </CartProvider>
      </AuthProvider >
   );
};

export default App;
