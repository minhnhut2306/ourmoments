import { useState } from 'react';
import { Grid } from 'lucide-react';
import { useTimeCounter } from '../hooks/useTimeCounter';
import { usePullToRefresh } from '../hooks/usePullToRefresh';
import HeaderSection from '../components/MainView/HeaderSection';
import MemoryCarousel from '../components/MainView/MemoryCarousel';
import MusicPlayer from '../components/MainView/MusicPlayer';
import PullRefreshAnimation from '../components/MainView/PullRefreshAnimation';
import PasswordModal from '../components/MainView/PasswordModal';

function MainView({ onShowGallery }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { timeDisplay, handleTimeClick } = useTimeCounter();
  const { pullDistance, isRefreshing, threshold } = usePullToRefresh();

  const handleGalleryClick = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordSuccess = () => {
    setShowPasswordModal(false);
    onShowGallery();
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-pink-100" style={{ touchAction: 'pan-y' }}>
      
      <PullRefreshAnimation 
        pullDistance={pullDistance}
        isRefreshing={isRefreshing}
        threshold={threshold}
      />

      <div 
        data-scroll-container
        className="w-full h-full overflow-y-auto overflow-x-hidden"
        style={{ 
          touchAction: 'pan-y',
          transform: `translateY(${pullDistance}px)`,
          transition: isRefreshing || pullDistance === 0 ? 'transform 0.3s ease-out' : 'none'
        }}
      >
        <div className="min-h-full bg-pink-50">
          
          <HeaderSection 
            timeDisplay={timeDisplay}
            onTimeClick={handleTimeClick}
          />

          <div className="p-4 space-y-4 bg-pink-50">
            <MemoryCarousel 
              currentSlide={currentSlide}
              onSlideChange={setCurrentSlide}
            />
            
            <MusicPlayer />

            <button 
              onClick={handleGalleryClick}
              className="w-full bg-pink-300 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:bg-pink-400 transition text-base active:scale-95"
            >
              <Grid size={22} />
              Xem tất cả ảnh & video
            </button>
          </div>
        </div>
      </div>

      <PasswordModal
        show={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handlePasswordSuccess}
      />
    </div>
  );
}

export default MainView;