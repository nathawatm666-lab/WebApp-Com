import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import AdminLayout from '../components/layout/AdminLayout';
import HomePage from '../pages/HomePage';
import CategoryPage from '../pages/CategoryPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import SearchPage from '../pages/SearchPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrderConfirmPage from '../pages/OrderConfirmPage';
import LoginPage from '../pages/account/LoginPage';
import RegisterPage from '../pages/account/RegisterPage';
import ProfilePage from '../pages/account/ProfilePage';
import OrderHistoryPage from '../pages/account/OrderHistoryPage';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminCategories from '../pages/admin/AdminCategories';

export default function AppRouter() {
    return (
        <Routes>
            {/* Public routes */}
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/product/:slug" element={<ProductDetailPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirm/:id" element={<OrderConfirmPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/account/profile" element={<ProfilePage />} />
                <Route path="/account/orders" element={<OrderHistoryPage />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminOrders />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="categories" element={<AdminCategories />} />
            </Route>
        </Routes>
    );
}
