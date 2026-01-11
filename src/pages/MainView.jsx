import { useState, useEffect } from 'react';
import { Grid } from 'lucide-react';
import { useTimeCounter } from '../hooks/useTimeCounter';
import HeaderSection from '../components/HeaderSection';
import MemoryCarousel from '../components/MemoryCarousel';
import MusicPlayer from '../components/MusicPlayer';
import { memories } from '../data/constants';

function MainView({ onShowGallery }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { timeDisplay, handleTimeClick } = useTimeCounter(1083);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % memories.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ touchAction: 'pan-y' }}>
      <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200" style={{ touchAction: 'pan-y' }}>
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