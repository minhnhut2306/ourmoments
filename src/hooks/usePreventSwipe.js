/* eslint-disable no-undef */
function usePreventSwipe() {
  const { useEffect } = require('react');
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    const preventSwipe = (e) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        const startX = touch.clientX;
        
        const handleMove = (moveEvent) => {
          if (moveEvent.touches && moveEvent.touches.length > 0) {
            const moveTouch = moveEvent.touches[0];
            const deltaX = Math.abs(moveTouch.clientX - startX);
            const deltaY = Math.abs(moveTouch.clientY - touch.clientY);
            
            if (deltaX > deltaY) {
              moveEvent.preventDefault();
            }
          }
        };
        
        document.addEventListener('touchmove', handleMove, { passive: false });
        
        const cleanup = () => {
          document.removeEventListener('touchmove', handleMove);
        };
        
        document.addEventListener('touchend', cleanup, { once: true });
      }
    };
    
    document.addEventListener('touchstart', preventSwipe, { passive: false });
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.removeEventListener('touchstart', preventSwipe);
    };
  }, []);
}
export default { usePreventSwipe };