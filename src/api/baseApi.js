/* eslint-disable no-unused-vars */
import axios from "axios";

const API_URL = "http://localhost:5000/api/";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  timeout: 120000,
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
  withCredentials: false,
  validateStatus: function (status) {
    return status >= 200 && status < 500;
  }
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
  }, 600000);

  console.log('Keep-alive started - Ping every 10 minutes');
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
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.params);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.url} - ${response.status}`, {
      dataLength: response.data?.data?.media?.length || response.data?.data?.favorites?.length || 0
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      const { status, data } = error.response;
      console.error(`API Error [${status}]:`, data?.msg || error.message);

      if (!originalRequest._retry && error.code === 'ECONNABORTED') {
        originalRequest._retry = true;
        await new Promise(resolve => setTimeout(resolve, 1000));
        return api(originalRequest);
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error("Request timeout");
    } else {
      console.error("Network Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export const apiRequest = async (endpoint, method = "GET", body = null) => {
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