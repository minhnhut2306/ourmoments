import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// ✅ Response Interceptor - Xử lý lỗi
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      console.error(`🔥 API Error [${status}]:`, data?.msg || error.message);

      // Xử lý các loại lỗi khác nếu cần
      if (status === 404) {
        console.warn("⚠️ Resource not found");
      }

      if (status === 500) {
        console.error("🔥 Server error");
      }
    } else {
      console.error("Network Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export const apiRequest = async (
  endpoint,
  method = "GET",
  body = null
) => {
  try {
    const config = {
      method,
      url: endpoint,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body && Object.keys(body).length > 0) {
      config.data = body;
    }

    const response = await api.request(config);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error.message);
    throw error;
  }
};