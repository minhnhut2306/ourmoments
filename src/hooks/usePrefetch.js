/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { api } from '../api/baseApi';


function usePrefetch() {
  useEffect(() => {
    const warmUpServer = async () => {
      try {
        console.log('🔥 Warming up server...');
        
        await api.get('/');
        
        console.log('✅ Server is warm and ready!');
      } catch (error) {
        console.log(' Server warm-up failed (might already be warm)');
      }
    };

    warmUpServer();
    const interval = setInterval(warmUpServer, 240000); 

    return () => clearInterval(interval);
  }, []);
}

export { usePrefetch };