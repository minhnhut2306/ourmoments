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
  const {
    pullDistance,
    isRefreshing,
    threshold
  } = usePullToRefresh();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % memories.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Tính toán animation
  const rotation = (pullDistance / threshold) * 360;
  const opacity = Math.min(pullDistance / threshold, 1);
  const scale = Math.min(0.5 + (pullDistance / threshold) * 0.5, 1);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ touchAction: 'pan-y' }}>
      <div 
        data-scroll-container
        className="w-full h-full overflow-y-auto overflow-x-hidden bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200"
        style={{ 
          touchAction: 'pan-y',
          transform: `translateY(${pullDistance}px)`,
          transition: isRefreshing || pullDistance === 0 ? 'transform 0.3s ease-out' : 'none'
        }}
      >
        {/* Pull to Refresh Indicator - Colorful & Beautiful */}
        <div 
          className="absolute top-0 left-0 right-0 flex items-center justify-center z-50"
          style={{
            height: '120px',
            marginTop: '-120px',
            opacity: opacity,
            transform: `scale(${scale})`
          }}
        >
          <div className="flex flex-col items-center gap-3 relative">
            {/* Colorful rotating gradient background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 blur-2xl opacity-50 ${isRefreshing ? 'animate-pulse' : ''}`}></div>
            </div>
            
            {/* Main colorful spinner container */}
            <div className="relative">
              {/* Rotating rainbow ring */}
              <div 
                className={`w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-1 ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
                style={{
                  transform: isRefreshing ? 'none' : `rotate(${rotation}deg)`,
                  transition: isRefreshing ? 'none' : 'transform 0.1s ease-out',
                  animationDuration: '1s'
                }}
              >
                {/* Inner white circle */}
                <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center shadow-xl">
                  {/* Animated gradient heart */}
                  <svg className={`w-7 h-7 ${isRefreshing ? 'animate-pulse' : ''}`} viewBox="0 0 20 20" fill="url(#heartGradient)">
                    <defs>
                      <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                        <stop offset="50%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                      </linearGradient>
                    </defs>
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              {/* Colorful orbiting hearts */}
              <div className={`absolute -top-2 -right-2 ${isRefreshing ? 'animate-bounce' : ''}`}>
                <svg className="w-5 h-5 drop-shadow-lg" viewBox="0 0 20 20">
                  <path fill="#f43f5e" fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <div className={`absolute -bottom-2 -left-2 ${isRefreshing ? 'animate-bounce' : ''}`} style={{ animationDelay: '0.2s' }}>
                <svg className="w-4 h-4 drop-shadow-lg" viewBox="0 0 20 20">
                  <path fill="#a855f7" fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <div className={`absolute top-0 -left-3 ${isRefreshing ? 'animate-bounce' : ''}`} style={{ animationDelay: '0.4s' }}>
                <svg className="w-3 h-3 drop-shadow-lg" viewBox="0 0 20 20">
                  <path fill="#3b82f6" fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            {/* Colorful gradient text badge */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full blur-md opacity-40"></div>
              <div className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 px-6 py-2.5 rounded-full shadow-2xl">
                <p className="text-sm font-black text-white drop-shadow-lg">
                  {isRefreshing ? '✨ Đang tải...' : pullDistance >= threshold ? '💝 Thả ra' : '👇 Kéo xuống'}
                </p>
              </div>
            </div>
            
            {/* Colorful sparkles */}
            {isRefreshing && (
              <>
                <div className="absolute top-0 left-2 animate-ping">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full shadow-lg"></div>
                </div>
                <div className="absolute top-2 right-2 animate-ping" style={{ animationDelay: '0.2s' }}>
                  <div className="w-2 h-2 bg-pink-400 rounded-full shadow-lg"></div>
                </div>
                <div className="absolute bottom-2 left-4 animate-ping" style={{ animationDelay: '0.4s' }}>
                  <div className="w-2 h-2 bg-purple-400 rounded-full shadow-lg"></div>
                </div>
                <div className="absolute bottom-0 right-4 animate-ping" style={{ animationDelay: '0.6s' }}>
                  <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg"></div>
                </div>
              </>
            )}
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