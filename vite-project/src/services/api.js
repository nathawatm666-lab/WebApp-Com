import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: { 'Content-Type': 'application/json' }
});

// Products
export const getProducts = (params = {}) => api.get('/products', { params });
export const getProductBySlug = (slug) => api.get('/products', { params: { slug } }).then(r => r.data[0]);
export const getProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Categories
export const getCategories = () => api.get('/categories');
export const getCategoryBySlug = (slug) => api.get('/categories', { params: { slug } }).then(r => r.data[0]);
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Brands
export const getBrands = () => api.get('/brands');

// Users
export const getUsers = () => api.get('/users');
export const getUserByEmail = (email) => api.get('/users', { params: { email } }).then(r => r.data[0]);
export const createUser = (data) => api.post('/users', data);
export const updateUser = (id, data) => api.patch(`/users/${id}`, data);

// Orders
export const getOrders = (params = {}) => api.get('/orders', { params });
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const createOrder = (data) => api.post('/orders', data);
export const updateOrder = (id, data) => api.patch(`/orders/${id}`, data);

// Reviews
export const getReviews = (params = {}) => api.get('/reviews', { params });
export const createReview = (data) => api.post('/reviews', data);

// Promotions
export const getPromotions = () => api.get('/promotions');
export const getPromotionByCode = (code) => api.get('/promotions', { params: { code, active: true } }).then(r => r.data[0]);

export default api;
