import { useState, useEffect, useRef, useCallback } from 'react';

// ✅ Throttle helper
function throttle(func, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return func(...args);
    }
  };
}

function usePullToRefresh() {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = useRef(0);
  const canPullRef = useRef(false);
  const lastUpdateRef = useRef(0);

  const threshold = 100;

  // ✅ Throttled update để giảm re-render
  const updatePullDistance = useCallback(
    throttle((distance) => {
      setPullDistance(distance);
    }, 16), // ~60fps
    []
  );

  useEffect(() => {
    const scrollContainer = document.querySelector('[data-scroll-container]');
    if (!scrollContainer) return;

    const handleTouchStart = (e) => {
      if (scrollContainer.scrollTop === 0) {
        canPullRef.current = true;
        startYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (!canPullRef.current || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const distance = currentY - startYRef.current;

      if (distance > 0) {
        // ✅ Throttle để giảm tải
        const now = Date.now();
        if (now - lastUpdateRef.current > 16) { // ~60fps
          lastUpdateRef.current = now;
          
          const dampedDistance = Math.pow(distance, 0.85);
          updatePullDistance(Math.min(dampedDistance, 200));
          
          if (distance > 10) {
            e.preventDefault();
          }
        }
      }
    };

    const handleTouchEnd = async () => {
      if (!canPullRef.current) return;
      
      canPullRef.current = false;

      if (pullDistance >= threshold) {
        setIsRefreshing(true);
        
        // ✅ Delay ngắn hơn
        await new Promise(resolve => setTimeout(resolve, 1500)); // Giảm từ 2s → 1.5s
        
        window.location.reload();
      } else {
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
  }, [isRefreshing, pullDistance, updatePullDistance]);

  return {
    pullDistance,
    isRefreshing,
    threshold
  };
}

export { usePullToRefresh };