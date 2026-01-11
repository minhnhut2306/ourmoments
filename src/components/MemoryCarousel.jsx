import React from 'react';
import { Heart } from 'lucide-react';
import { memories } from '../data/constants';

function MemoryCarousel({ currentSlide, onSlideChange }) {
  const getSlideStyle = (index) => {
    const diff = index - currentSlide;
    const totalSlides = memories.length;
    
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
  };

  return (
    <div className="bg-gradient-to-br from-slate-100 via-gray-50 to-slate-100 rounded-2xl p-4 shadow-xl relative overflow-hidden">
      <div className="absolute top-2 left-2 opacity-20">
        <Heart className="w-6 h-6 text-pink-400 fill-pink-400" />
      </div>
      <div className="absolute top-2 right-2 opacity-20">
        <Heart className="w-5 h-5 text-purple-400 fill-purple-400" />
      </div>
      <div className="absolute bottom-20 left-4 opacity-15">
        <Heart className="w-4 h-4 text-pink-300 fill-pink-300" />
      </div>
      <div className="absolute bottom-20 right-4 opacity-15">
        <Heart className="w-4 h-4 text-purple-300 fill-purple-300" />
      </div>

      <div className="text-center mb-3">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          Cùng nhau viết nên câu chuyện
        </h3>
        <p className="text-xs text-gray-500 mt-1">Những trang đẹp nhất</p>
      </div>

      <div className="relative h-64 mb-4" style={{ perspective: '1500px' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-pink-50/30 to-purple-50/30 rounded-xl"></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          {memories.map((memory, index) => (
            <div
              key={memory.id}
              className="absolute w-44 h-56 transition-all duration-700 ease-out cursor-pointer group"
              style={getSlideStyle(index)}
              onClick={() => onSlideChange(index)}
            >
              <div className="w-full h-full rounded-2xl shadow-xl overflow-hidden relative border-4 border-white">
                <img 
                  src={memory.image} 
                  alt={`Memory ${memory.id}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 justify-between px-2">
        {memories.map((memory, index) => (
          <button
            key={memory.id}
            onClick={() => onSlideChange(index)}
            className={`flex-1 max-w-[60px] h-14 rounded-xl transition-all duration-300 shadow-md overflow-hidden ${index === currentSlide ? 'border-4 border-pink-500' : 'opacity-60 hover:opacity-100'}`}
          >
            <img 
              src={memory.image} 
              alt={`Memory ${memory.id}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default MemoryCarousel;