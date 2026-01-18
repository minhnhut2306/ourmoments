import { useEffect } from 'react';
import { api } from '../api/baseApi';

/**
 * Hook để prefetch/warm-up server khi app load
 */
function usePrefetch() {
  useEffect(() => {
    const warmUpServer = async () => {
      try {
        console.log('🔥 Warming up server...');
        
        // Ping root endpoint để wake up server
        await api.get('/');
        
        console.log('✅ Server is warm and ready!');
      } catch (error) {
        console.log('⚠️ Server warm-up failed (might already be warm)');
      }
    };

    // Warm up ngay khi app load
    warmUpServer();

    // Warm up lại mỗi 4 phút để tránh cold start
    const interval = setInterval(warmUpServer, 240000); // 4 phút

    return () => clearInterval(interval);
  }, []);
}

export { usePrefetch };