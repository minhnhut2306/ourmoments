import { useEffect } from 'react';

function usePreventSwipe() {
  useEffect(() => {
    // CHỈ chặn swipe NGANG (browser back/forward)
    // CHO PHÉP swipe DỌC (scroll & pull-to-refresh)
    
    let startX = 0;
    let startY = 0;
    
    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e) => {
      const deltaX = Math.abs(e.touches[0].clientX - startX);
      const deltaY = Math.abs(e.touches[0].clientY - startY);
      
      // CHỈ preventDefault nếu swipe NGANG nhiều hơn DỌC
      if (deltaX > deltaY && deltaX > 50) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);
}

export { usePreventSwipe };