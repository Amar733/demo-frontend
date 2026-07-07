// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
// || 'https://demo-backend-1-uc12.onrender.com/api' 
|| 'http://localhost:5000/api';

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    ME: `${API_BASE_URL}/auth/me`,
  },
  PRODUCTS: {
    LIST: `${API_BASE_URL}/products`,
    DETAIL: (id: string) => `${API_BASE_URL}/products/${id}`,
  },
  CART: {
    GET: `${API_BASE_URL}/cart`,
    ADD: `${API_BASE_URL}/cart`,
    UPDATE: (itemId: string) => `${API_BASE_URL}/cart/${itemId}`,
    REMOVE: (itemId: string) => `${API_BASE_URL}/cart/${itemId}`,
    CLEAR: `${API_BASE_URL}/cart/clear`,
  },
  ORDERS: {
    LIST: `${API_BASE_URL}/orders`,
    CREATE: `${API_BASE_URL}/orders`,
    DETAIL: (id: string) => `${API_BASE_URL}/orders/${id}`,
  },
  USERS: {
    ADDRESSES: `${API_BASE_URL}/users/addresses`,
    ADDRESS_DETAIL: (id: string) => `${API_BASE_URL}/users/addresses/${id}`,
    SET_DEFAULT: (id: string) => `${API_BASE_URL}/users/addresses/${id}/set-default`,
  },
};