import { useState, useEffect, useRef } from 'react';

function usePullToRefresh() {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = useRef(0);
  const canPullRef = useRef(false);
  const pullDistanceRef = useRef(0);

  const threshold = 80;

  useEffect(() => {
    pullDistanceRef.current = pullDistance;
  }, [pullDistance]);

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
        const dampedDistance = Math.min(distance * 0.5, 120);
        setPullDistance(dampedDistance);
        
        if (distance > 10) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = async () => {
      if (!canPullRef.current) return;
      
      canPullRef.current = false;

      if (pullDistanceRef.current >= threshold) {
        setIsRefreshing(true);
        setPullDistance(threshold);
        
        await new Promise(resolve => setTimeout(resolve, 800));
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
  }, [isRefreshing]);

  return {
    pullDistance,
    isRefreshing,
    threshold
  };
}

export { usePullToRefresh };