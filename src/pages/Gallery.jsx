import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Download, Heart, Star, Upload, X, Camera } from 'lucide-react';
import { galleryData as initialGalleryData } from '../data/constants';
import ImageModal from '../components/ImageModal';

function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [galleryData, setGalleryData] = useState(initialGalleryData);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const MAX_FAVORITES = 5;

  // Load favorites và gallery data từ storage khi component mount
  useEffect(() => {
    loadFavorites();
    loadGalleryData();
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

  const loadGalleryData = () => {
    try {
      const stored = localStorage.getItem('gallery-data');
      if (stored) {
        setGalleryData(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Sử dụng dữ liệu mặc định');
    }
  };

  const saveGalleryData = (data) => {
    try {
      localStorage.setItem('gallery-data', JSON.stringify(data));
      setGalleryData(data);
    } catch (error) {
      console.error('Lỗi lưu dữ liệu:', error);
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

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const toggleFavorite = (item) => {
    const isFavorite = favorites.some(fav => fav.id === item.id);

    if (isFavorite) {
      const newFavorites = favorites.filter(fav => fav.id !== item.id);
      saveFavorites(newFavorites);
      showToast('Đã xóa khỏi yêu thích', 'info');
    } else {
      if (favorites.length >= MAX_FAVORITES) {
        showToast(`Tối đa ${MAX_FAVORITES} ảnh yêu thích!`, 'warning');
        return;
      }
      const newFavorites = [...favorites, item];
      saveFavorites(newFavorites);
      showToast('Đã thêm vào yêu thích', 'success');
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
      showToast('Tải xuống thành công!', 'success');
    } catch (error) {
      showToast('Không thể tải xuống!', 'error');
    }
    setDownloading(false);
  };

  const handleUploadImages = (files) => {
    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    
    const newItems = Array.from(files).map((file, index) => {
      const url = URL.createObjectURL(file);
      return {
        id: Date.now() + index,
        type: 'image',
        url: url,
        name: file.name
      };
    });

    const newGalleryData = [...galleryData];
    const todayGroup = newGalleryData.find(g => g.date === dateStr);

    if (todayGroup) {
      todayGroup.items = [...newItems, ...todayGroup.items];
    } else {
      newGalleryData.unshift({
        date: dateStr,
        items: newItems
      });
    }

    saveGalleryData(newGalleryData);
    setShowUploadModal(false);
    showToast(`Đã thêm ${newItems.length} ảnh!`, 'success');
  };

  const displayData = galleryData;

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ touchAction: 'pan-y' }}>
      <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200" style={{ touchAction: 'pan-y' }}>
        <div className="min-h-full bg-gradient-to-b from-white via-pink-50 to-purple-50">

          {/* Header */}
          <div className="sticky top-0 z-50 bg-gradient-to-br from-pink-100 to-purple-100 px-4 py-4 shadow-md">
            <div className="flex items-center justify-between">
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
                  <p className="text-xs text-gray-500">❤️ Yêu thích: {favorites.length}/{MAX_FAVORITES}</p>
                </div>
              </div>
              
              <button
                onClick={() => setShowUploadModal(true)}
                className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition active:scale-95"
              >
                <Upload className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {toast.show && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
              <div className={`px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 ${
                toast.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                toast.type === 'warning' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                toast.type === 'error' ? 'bg-gradient-to-r from-red-500 to-rose-500' :
                'bg-gradient-to-r from-blue-500 to-indigo-500'
              } text-white`}>
                {toast.type === 'success' && <Heart className="w-5 h-5 fill-white" />}
                {toast.type === 'warning' && <Star className="w-5 h-5 fill-white" />}
                {toast.type === 'error' && <X className="w-5 h-5" />}
                {toast.type === 'info' && <Heart className="w-5 h-5" />}
                <span className="font-semibold">{toast.message}</span>
              </div>
            </div>
          )}

          {/* Upload Modal */}
          {showUploadModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    Thêm ảnh mới
                  </h3>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <label className="block cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleUploadImages(e.target.files);
                      }
                    }}
                  />
                  <div className="border-2 border-dashed border-pink-300 rounded-2xl p-8 text-center hover:border-purple-400 hover:bg-pink-50 transition">
                    <Camera className="w-16 h-16 mx-auto text-pink-400 mb-3" />
                    <p className="text-gray-700 font-semibold mb-1">Chọn ảnh để upload</p>
                    <p className="text-sm text-gray-500">Có thể chọn nhiều ảnh cùng lúc</p>
                  </div>
                </label>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Ảnh sẽ được thêm vào ngày hôm nay
                </p>
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
                        className="absolute top-2 right-2 p-1.5 bg-black/30 backdrop-blur-sm rounded-full transition-all z-20 hover:scale-110"
                      >
                        <Heart
                          className={`w-5 h-5 transition-all ${
                            isFavoriteItem(item.id)
                              ? 'text-red-500 scale-110'
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