/* eslint-disable no-unused-vars */
import axios from "axios";

const API_URL = "https://ourmoments-backend.vercel.app/api/";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    "Accept": "application/json",
  },
  timeout: 60000,
});

let keepAliveInterval = null;

const startKeepAlive = () => {
  if (keepAliveInterval) return;

  keepAliveInterval = setInterval(async () => {
    try {
      await api.get('/');
      console.log('Keep-alive ping successful');
    } catch (error) {
      console.log('Keep-alive ping failed (server might be sleeping)');
    }
  }, 240000);

  console.log('Keep-alive started - Server will stay warm');
};

const stopKeepAlive = () => {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
    console.log('Keep-alive stopped');
  }
};

if (typeof window !== 'undefined') {
  startKeepAlive();
  window.addEventListener('beforeunload', stopKeepAlive);
}

api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.url} - ${response.status}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      const { status, data } = error.response;

      console.error(`API Error [${status}]:`, data?.msg || error.message);

      if (!originalRequest._retry && (error.code === 'ECONNABORTED' || status >= 500)) {
        originalRequest._retry = true;
        
        console.log('Retrying request due to server error/timeout...');
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return api(originalRequest);
      }

      if (status === 404) {
        console.warn("Resource not found");
      }

      if (status === 500) {
        console.error("Server error");
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error("Request timeout - Server might be cold starting");
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

export { startKeepAlive, stopKeepAlive };