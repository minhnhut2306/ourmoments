import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Download, Heart, Star } from 'lucide-react';
import { galleryData } from '../data/constants';
import ImageModal from '../components/ImageModal';

function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  const MAX_FAVORITES = 5;

  // Load favorites từ storage khi component mount
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    try {
      const result = localStorage.getItem('gallery-favorites');
      if (result) {
        setFavorites(JSON.parse(result));
      }
    } catch (error) {
      console.log('Chưa có ảnh yêu thích');
    }
  };

  const saveFavorites = (newFavorites) => {
    try {
      localStorage.setItem('gallery-favorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Lỗi lưu yêu thích:', error);
    }
  };

  const toggleFavorite = (item) => {
    const isFavorite = favorites.some(fav => fav.id === item.id);

    if (isFavorite) {
      // Xóa khỏi yêu thích
      const newFavorites = favorites.filter(fav => fav.id !== item.id);
      saveFavorites(newFavorites);
    } else {
      // Thêm vào yêu thích
      if (favorites.length >= MAX_FAVORITES) {
        setShowLimitWarning(true);
        setTimeout(() => setShowLimitWarning(false), 3000);
        return;
      }
      const newFavorites = [...favorites, item];
      saveFavorites(newFavorites);
    }
  };

  const isFavoriteItem = (itemId) => {
    return favorites.some(fav => fav.id === itemId);
  };

  const handleDownload = async (url, filename) => {
    setDownloading(true);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      alert('Không thể tải xuống. Vui lòng thử lại!');
    }
    setDownloading(false);
  };

  // Lọc dữ liệu
  const displayData = galleryData;

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ touchAction: 'pan-y' }}>
      <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200" style={{ touchAction: 'pan-y' }}>
        <div className="min-h-full bg-gradient-to-b from-white via-pink-50 to-purple-50">

          {/* Header */}
          <div className="sticky top-0 z-50 bg-gradient-to-br from-pink-100 to-purple-100 px-4 py-4 shadow-md">
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-pink-200 rounded-full transition"
              >
                <ArrowLeft className="w-6 h-6 text-purple-600" />
              </button>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Kỷ niệm của chúng mình
                </h2>
                <p className="text-xs text-gray-500">Nhấn ❤️ để yêu thích (tối đa {MAX_FAVORITES})</p>
              </div>
            </div>
          </div>

          {/* Warning message */}
          {showLimitWarning && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2">
                <Star className="w-5 h-5 fill-white" />
                <span className="font-semibold">Tối đa {MAX_FAVORITES} ảnh yêu thích!</span>
              </div>
            </div>
          )}

          {/* Gallery Content */}
          <div className="p-4 space-y-6 pb-8">
            {displayData.map((dateGroup) => (
              <div key={dateGroup.date} className="space-y-3">
                <div className="flex items-center gap-2 sticky top-16 bg-gradient-to-r from-pink-50 to-purple-50 py-2 px-3 rounded-lg shadow-sm z-40">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-semibold text-purple-700">{dateGroup.date}</span>
                  <span className="text-xs text-gray-500">({dateGroup.items.length} ảnh)</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {dateGroup.items.map((item) => (
                    <div
                      key={item.id}
                      className="relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow group cursor-pointer"
                      onClick={() => setSelectedImage(item)}
                    >
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-black/30 rounded-full transition-all z-20"
                      >
                        <Heart
                          className={`w-5 h-5 transition-all ${isFavoriteItem(item.id)
                            ? 'text-red-500'
                            : 'text-white'
                            }`}
                          strokeWidth={2}
                          fill={isFavoriteItem(item.id) ? '#ef4444' : 'none'}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
        onDownload={handleDownload}
        downloading={downloading}
      />
    </div>
  );
}

export default Gallery;