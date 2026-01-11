import { useState, useEffect, useRef } from 'react';

function usePullToRefresh() {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = useRef(0);
  const canPullRef = useRef(false);

  const threshold = 100;

  useEffect(() => {
    const scrollContainer = document.querySelector('[data-scroll-container]');
    if (!scrollContainer) return;

    const handleTouchStart = (e) => {
      // CHỈ cho phép pull khi ở TOP của trang
      if (scrollContainer.scrollTop === 0) {
        canPullRef.current = true;
        startYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (!canPullRef.current || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const distance = currentY - startYRef.current;

      // CHỈ xử lý khi KÉO XUỐNG (distance > 0)
      if (distance > 0) {
        // Damping effect: càng kéo xa thì càng chậm
        const dampedDistance = Math.pow(distance, 0.85);
        setPullDistance(Math.min(dampedDistance, 200));
        
        // Prevent scroll xuống khi đang pull
        if (distance > 10) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = async () => {
      if (!canPullRef.current) return;
      
      canPullRef.current = false;

      // Nếu kéo đủ xa thì reload
      if (pullDistance >= threshold) {
        setIsRefreshing(true);
        
        // Giữ animation 2s để người dùng thấy rõ
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Reload trang
        window.location.reload();
      } else {
        // Không đủ xa thì reset về 0
        setPullDistance(0);
      }
    };

    scrollContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    scrollContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
    scrollContainer.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      scrollContainer.removeEventListener('touchstart', handleTouchStart);
      scrollContainer.removeEventListener('touchmove', handleTouchMove);
      scrollContainer.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isRefreshing, pullDistance]);

  return {
    pullDistance,
    isRefreshing,
    threshold
  };
}

export { usePullToRefresh };