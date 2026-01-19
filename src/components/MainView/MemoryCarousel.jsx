import React, { useState, useEffect, useMemo, memo } from 'react';
import { Heart } from 'lucide-react';
import { getAllFavorites } from '../../api/favoritesApi';

const SlideItem = memo(({ memory, index, currentSlide, totalSlides, onClick }) => {
  const getSlideStyle = useMemo(() => {
    const diff = index - currentSlide;
    let normalizedDiff = diff;
    
    if (Math.abs(diff) > totalSlides / 2) {
      normalizedDiff = diff > 0 ? diff - totalSlides : diff + totalSlides;
    }
    
    if (normalizedDiff === 0) {
      return { 
        transform: 'translateX(0%) scale(1) rotateY(0deg)', 
        zIndex: 50, 
        opacity: 1 
      };
    } else if (normalizedDiff === 1) {
      return { 
        transform: 'translateX(85%) scale(0.9) rotateY(-25deg)', 
        zIndex: 40, 
        opacity: 0.8 
      };
    } else if (normalizedDiff === -1) {
      return { 
        transform: 'translateX(-85%) scale(0.9) rotateY(25deg)', 
        zIndex: 40, 
        opacity: 0.8 
      };
    } else {
      return { 
        transform: normalizedDiff > 0 ? 'translateX(200%) scale(0.5)' : 'translateX(-200%) scale(0.5)', 
        zIndex: 10, 
        opacity: 0 
      };
    }
  }, [index, currentSlide, totalSlides]);

  return (
    <div
      className="absolute w-48 h-60 transition-all duration-700 ease-out cursor-pointer group"
      style={getSlideStyle}
      onClick={() => onClick(index)}
    >
      <div className="w-full h-full rounded-2xl shadow-2xl overflow-hidden relative border-[5px] border-white/90 backdrop-blur-sm">
        <img 
          src={memory.image} 
          alt={`Memory ${memory.id}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );
});

SlideItem.displayName = 'SlideItem';

const Thumbnail = memo(({ memory, index, isActive, onClick }) => (
  <button
    onClick={() => onClick(index)}
    style={{
      opacity: isActive ? 1 : 0.5,
      transform: isActive ? 'scale(1.05)' : 'scale(1)',
      filter: isActive ? 'grayscale(0)' : 'grayscale(100%)'
    }}
    className={`flex-1 max-w-[60px] h-14 rounded transition-all duration-300 shadow-lg overflow-hidden hover:opacity-100 hover:scale-110 hover:grayscale-0 ${
      isActive ? 'ring-4 ring-pink-500 ring-offset-2' : ''
    }`}
  >
    <img
      src={memory.image}
      alt={`Memory ${memory.id}`}
      className="w-full h-full object-cover"
      loading="lazy"
    />
  </button>
));

Thumbnail.displayName = 'Thumbnail';

function MemoryCarousel({ currentSlide, onSlideChange }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadFavorites = async () => {
      try {
        setLoading(true);
        
        const response = await getAllFavorites(1, 20);
        
        if (mounted && response.status === 'success') {
          const favoritesList = response.data.favorites
            .filter(fav => fav.mediaId && fav.mediaId.type === 'image')
            .map((fav) => ({
              id: fav._id,
              image: fav.url || fav.mediaId.url,
              mediaId: fav.mediaId._id
            }));
          
          setMemories(favoritesList);
        }
      } catch (error) {
        console.error('Load favorites error:', error);
        if (mounted) setMemories([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadFavorites();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (memories.length === 0) return;

    const interval = setInterval(() => {
      onSlideChange((prev) => (prev + 1) % memories.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [memories.length, onSlideChange]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-3xl p-6 shadow-2xl relative overflow-hidden border border-white/50">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-500 mt-4">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (memories.length === 0) {
    return (
      <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-3xl p-6 shadow-2xl relative overflow-hidden border border-white/50">
        <div className="text-center py-12">
          <Heart className="w-16 h-16 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-semibold">Chưa có ảnh yêu thích</p>
          <p className="text-sm text-gray-400 mt-1">Hãy thêm ảnh vào yêu thích nhé!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-3xl p-6 shadow-2xl relative overflow-hidden border border-white/50">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 via-transparent to-purple-100/20"></div>
      
      <div className="text-center mb-4 relative z-10">
        <h3 className="text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent drop-shadow-sm">
          Cùng nhau viết nên câu chuyện
        </h3>
        <p className="text-sm text-gray-500 mt-1.5 font-medium">Những trang đẹp nhất ✨</p>
        
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="w-8 h-[2px] bg-gradient-to-r from-transparent to-pink-300 rounded-full"></div>
          <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
          <div className="w-8 h-[2px] bg-gradient-to-l from-transparent to-purple-300 rounded-full"></div>
        </div>
      </div>

      <div className="relative h-64 mb-4" style={{ perspective: '1500px' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100/40 via-purple-100/40 to-blue-100/40 rounded-2xl"></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          {memories.map((memory, index) => (
            <SlideItem
              key={memory.id}
              memory={memory}
              index={index}
              currentSlide={currentSlide}
              totalSlides={memories.length}
              onClick={onSlideChange}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2 justify-center px-2 relative z-10">
        {memories.map((memory, index) => (
          <Thumbnail
            key={memory.id}
            memory={memory}
            index={index}
            isActive={index === currentSlide}
            onClick={onSlideChange}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(MemoryCarousel);