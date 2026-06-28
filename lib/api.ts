/**
 * API Service for backend communication
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  token?: string;
  user?: T;
  error?: string;
  message?: string;
}

interface RegisterData {
  name: string;
  mobile: string;
  password: string;
}

interface LoginData {
  mobile: string;
  password: string;
}

interface UserData {
  id: string;
  name: string;
  mobile: string;
  role: string;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  private getHeaders(includeAuth: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'An error occurred');
    }

    return data;
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
  }

  // Authentication APIs
  async register(data: RegisterData): Promise<ApiResponse<UserData>> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
      credentials: 'include',
    });

    const result = await this.handleResponse<ApiResponse<UserData>>(response);
    
    // Store token if registration successful
    if (result.token) {
      this.setToken(result.token);
    }

    return result;
  }

  async login(data: LoginData): Promise<ApiResponse<UserData>> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
      credentials: 'include',
    });

    const result = await this.handleResponse<ApiResponse<UserData>>(response);
    
    // Store token if login successful
    if (result.token) {
      this.setToken(result.token);
    }

    return result;
  }

  async getMe(): Promise<ApiResponse<UserData>> {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: this.getHeaders(true),
      credentials: 'include',
    });

    return this.handleResponse<ApiResponse<UserData>>(response);
  }

  async logout(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getHeaders(true),
        credentials: 'include',
      });

      const result = await this.handleResponse<ApiResponse>(response);
      this.setToken(null);
      return result;
    } catch (error) {
      // Clear token even if logout fails
      this.setToken(null);
      throw error;
    }
  }

  async updateProfile(name: string): Promise<ApiResponse<UserData>> {
    const response = await fetch(`${API_URL}/auth/updateprofile`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify({ name }),
      credentials: 'include',
    });

    return this.handleResponse<ApiResponse<UserData>>(response);
  }

  async updatePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<UserData>> {
    const response = await fetch(`${API_URL}/auth/updatepassword`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify({ currentPassword, newPassword }),
      credentials: 'include',
    });

    const result = await this.handleResponse<ApiResponse<UserData>>(response);
    
    // Update token after password change
    if (result.token) {
      this.setToken(result.token);
    }

    return result;
  }

  // Product APIs
  async getProducts(queryParams?: string): Promise<ApiResponse<any[]>> {
    const url = queryParams ? `${API_URL}/products?${queryParams}` : `${API_URL}/products`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<ApiResponse<any[]>>(response);
  }

  async getProductById(id: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<ApiResponse<any>>(response);
  }

  // Cart APIs
  async getCart(): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_URL}/cart`, {
      method: 'GET',
      headers: this.getHeaders(true),
      credentials: 'include',
    });

    return this.handleResponse<ApiResponse<any>>(response);
  }

  async addToCart(productId: string, quantity: number): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ productId, quantity }),
      credentials: 'include',
    });

    return this.handleResponse<ApiResponse<any>>(response);
  }

  async updateCartItem(productId: string, quantity: number): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_URL}/cart/${productId}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify({ quantity }),
      credentials: 'include',
    });

    return this.handleResponse<ApiResponse<any>>(response);
  }

  async removeFromCart(productId: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_URL}/cart/${productId}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
      credentials: 'include',
    });

    return this.handleResponse<ApiResponse<any>>(response);
  }

  async clearCart(): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_URL}/cart`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
      credentials: 'include',
    });

    return this.handleResponse<ApiResponse<any>>(response);
  }

  // Order APIs
  async createOrder(orderData: any): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(orderData),
      credentials: 'include',
    });

    return this.handleResponse<ApiResponse<any>>(response);
  }

  async getOrders(): Promise<ApiResponse<any[]>> {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'GET',
      headers: this.getHeaders(true),
      credentials: 'include',
    });

    return this.handleResponse<ApiResponse<any[]>>(response);
  }

  async getOrderById(id: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'GET',
      headers: this.getHeaders(true),
      credentials: 'include',
    });

    return this.handleResponse<ApiResponse<any>>(response);
  }
}

// Export a singleton instance
export const api = new ApiService();
export default api;
