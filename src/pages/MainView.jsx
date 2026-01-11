import { useState, useEffect } from 'react';
import { Grid } from 'lucide-react';
import { useTimeCounter } from '../hooks/useTimeCounter';
import { usePullToRefresh } from '../hooks/usePullToRefresh';
import HeaderSection from '../components/HeaderSection';
import MemoryCarousel from '../components/MemoryCarousel';
import MusicPlayer from '../components/MusicPlayer';
import { memories } from '../data/constants';

function MainView({ onShowGallery }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { timeDisplay, handleTimeClick } = useTimeCounter(1083);
  const { pullDistance, isRefreshing, threshold } = usePullToRefresh();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % memories.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300" style={{ touchAction: 'pan-y' }}>
      <div 
        data-scroll-container
        className="w-full h-full overflow-y-auto overflow-x-hidden"
        style={{ 
          touchAction: 'pan-y',
          transform: `translateY(${pullDistance}px)`,
          transition: isRefreshing || pullDistance === 0 ? 'transform 0.3s ease-out' : 'none'
        }}
      >
        {/* Simple Beautiful Pull Indicator */}
        <div 
          className="absolute top-0 left-0 right-0 flex items-center justify-center pointer-events-none"
          style={{
            height: '100px',
            marginTop: '-100px',
            opacity: Math.min(pullDistance / threshold, 1)
          }}
        >
          <div className="flex flex-col items-center gap-2">
            {/* Rotating Heart Spinner */}
            <div 
              className={`${isRefreshing ? 'animate-spin' : ''}`}
              style={{
                transform: isRefreshing ? 'none' : `rotate(${(pullDistance / threshold) * 360}deg)`,
                transition: isRefreshing ? 'none' : 'transform 0.1s ease-out'
              }}
            >
              <svg className="w-12 h-12 drop-shadow-2xl" viewBox="0 0 20 20">
                <defs>
                  <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#ec4899' }} />
                    <stop offset="50%" style={{ stopColor: '#a855f7' }} />
                    <stop offset="100%" style={{ stopColor: '#3b82f6' }} />
                  </linearGradient>
                </defs>
                <path fill="url(#heartGrad)" fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            
            {/* Text */}
            <p className="text-sm font-bold text-white drop-shadow-lg">
              {isRefreshing ? 'Đang tải...' : pullDistance >= threshold ? 'Thả ra' : 'Kéo xuống'}
            </p>
          </div>
        </div>

        <div className="min-h-full bg-gradient-to-b from-white via-pink-50 to-purple-50">
          
          <HeaderSection 
            timeDisplay={timeDisplay}
            onTimeClick={handleTimeClick}
          />

          <div className="p-4 space-y-4 bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50">
            <MemoryCarousel 
              currentSlide={currentSlide}
              onSlideChange={setCurrentSlide}
            />
            
            <MusicPlayer />

            <button 
              onClick={onShowGallery}
              className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition text-base active:scale-95"
            >
              <Grid size={22} />
              Xem tất cả ảnh & video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainView;