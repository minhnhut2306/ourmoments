import axios from "axios";

const API_URL = "http://localhost:5000/api/";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    // ✅ HEADERS TỐI ƯU CHO VERCEL
    "Cache-Control": "no-cache",
    "Accept": "application/json",
  },
  timeout: 60000, // ✅ Tăng timeout lên 60s cho Vercel cold start
});

// ✅ KEEP-ALIVE: Ping server mỗi 4 phút để tránh cold start
let keepAliveInterval = null;

const startKeepAlive = () => {
  if (keepAliveInterval) return; // Đã chạy rồi thì thôi

  // Ping server mỗi 4 phút (240000ms)
  keepAliveInterval = setInterval(async () => {
    try {
      await api.get('/'); // Ping endpoint root
      console.log('✅ Keep-alive ping successful');
    } catch (error) {
      console.log('⚠️ Keep-alive ping failed (server might be sleeping)');
    }
  }, 240000); // 4 phút

  console.log('🔥 Keep-alive started - Server will stay warm');
};

const stopKeepAlive = () => {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
    console.log('⏹️ Keep-alive stopped');
  }
};

// ✅ Tự động start keep-alive khi app load
if (typeof window !== 'undefined') {
  startKeepAlive();

  // Stop khi user rời trang
  window.addEventListener('beforeunload', stopKeepAlive);
}

// ✅ Request Interceptor - Retry logic cho cold start
api.interceptors.request.use(
  (config) => {
    // Log request để debug
    console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor - Xử lý lỗi & retry
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url} - ${response.status}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      const { status, data } = error.response;

      console.error(`🔥 API Error [${status}]:`, data?.msg || error.message);

      // ✅ RETRY cho timeout/network errors (có thể do cold start)
      if (!originalRequest._retry && (error.code === 'ECONNABORTED' || status >= 500)) {
        originalRequest._retry = true;
        
        console.log('🔄 Retrying request due to server error/timeout...');
        
        // Đợi 2s rồi retry
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return api(originalRequest);
      }

      // Xử lý các loại lỗi khác
      if (status === 404) {
        console.warn("⚠️ Resource not found");
      }

      if (status === 500) {
        console.error("🔥 Server error");
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error("⏱️ Request timeout - Server might be cold starting");
    } else {
      console.error("🌐 Network Error:", error.message);
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

// ✅ Export keep-alive controls (optional)
export { startKeepAlive, stopKeepAlive };