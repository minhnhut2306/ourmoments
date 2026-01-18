/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Download, Heart, Star, Upload, X, Camera, Image, Video, Play  } from 'lucide-react';
import { galleryData as initialGalleryData } from '../data/constants';
import ImageModal from '../components/ImageModal';
import VideoModal from '../components/VideoModal';


function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [galleryData, setGalleryData] = useState(initialGalleryData);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [filterType, setFilterType] = useState('image'); // 'image', 'video'

  const MAX_FAVORITES = 5;

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
    // Chỉ cho phép yêu thích ảnh
    if (item.type !== 'image') {
      showToast('Chỉ có thể yêu thích ảnh!', 'warning');
      return;
    }

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

  const handleUploadFiles = async (files) => {
    const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
    const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    
    const validFiles = [];
    const rejectedFiles = [];
    
    Array.from(files).forEach((file) => {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
      
      if (isImage && file.size > MAX_IMAGE_SIZE) {
        rejectedFiles.push({ name: file.name, size: fileSizeMB, type: 'image' });
      } else if (isVideo && file.size > MAX_VIDEO_SIZE) {
        rejectedFiles.push({ name: file.name, size: fileSizeMB, type: 'video' });
      } else {
        validFiles.push(file);
      }
    });
    
    if (rejectedFiles.length > 0) {
      const msg = rejectedFiles.map(f => {
        const limit = f.type === 'image' ? '10MB' : '100MB';
        return `${f.name} (${f.size}MB > ${limit})`;
      }).join(', ');
      showToast(`File quá lớn: ${msg}`, 'error');
    }
    
    if (validFiles.length === 0) {
      setShowUploadModal(false);
      return;
    }
    
    // Generate thumbnails for videos
    const generateVideoThumbnail = (file) => {
      return new Promise((resolve) => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        video.preload = 'metadata';
        video.muted = true;
        video.playsInline = true;
        
        video.onloadeddata = () => {
          video.currentTime = 1; // Seek to 1 second
        };
        
        video.onseeked = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          canvas.toBlob((blob) => {
            const thumbnailUrl = URL.createObjectURL(blob);
            resolve(thumbnailUrl);
          }, 'image/jpeg', 0.8);
        };
        
        video.onerror = () => {
          resolve(null); // Fallback if error
        };
        
        video.src = URL.createObjectURL(file);
      });
    };
    
    const newItemsPromises = validFiles.map(async (file, index) => {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      
      let thumbnail = null;
      if (type === 'video') {
        thumbnail = await generateVideoThumbnail(file);
      }
      
      return {
        id: Date.now() + index,
        type: type,
        url: url,
        thumbnail: thumbnail || url,
        name: file.name,
        size: file.size
      };
    });
    
    const newItems = await Promise.all(newItemsPromises);

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
    showToast(`Đã thêm ${newItems.length} file!`, 'success');
  };

  // Filter data based on selected type
  const getFilteredData = () => {
    return galleryData.map(group => ({
      ...group,
      items: group.items.filter(item => item.type === filterType)
    })).filter(group => group.items.length > 0);
  };

  const displayData = getFilteredData();

  // Count totals
  const getTotalCounts = () => {
    let images = 0;
    let videos = 0;
    galleryData.forEach(group => {
      group.items.forEach(item => {
        if (item.type === 'image') images++;
        else if (item.type === 'video') videos++;
      });
    });
    return { images, videos, total: images + videos };
  };

  const counts = getTotalCounts();

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ touchAction: 'pan-y' }}>
      <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200" style={{ touchAction: 'pan-y' }}>
        <div className="min-h-full bg-gradient-to-b from-white via-pink-50 to-purple-50">

          {/* Header */}
          <div className="sticky top-0 z-50 bg-gradient-to-br from-pink-100 to-purple-100 px-4 py-4 shadow-md">
            <div className="flex items-center justify-between mb-3">
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

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('image')}
                className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  filterType === 'image'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Image className="w-4 h-4" />
                Hình ảnh ({counts.images})
              </button>
              
              <button
                onClick={() => setFilterType('video')}
                className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  filterType === 'video'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Video className="w-4 h-4" />
                Video ({counts.videos})
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {toast.show && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
              <div className={`px-4 py-2 rounded-lg shadow-lg text-white text-sm font-medium ${
                toast.type === 'success' ? 'bg-green-500' :
                toast.type === 'warning' ? 'bg-orange-500' :
                toast.type === 'error' ? 'bg-red-500' :
                'bg-blue-500'
              }`}>
                {toast.message}
              </div>
            </div>
          )}

          {/* Upload Modal */}
          {showUploadModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    Thêm ảnh & video
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
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleUploadFiles(e.target.files);
                      }
                    }}
                  />
                  <div className="border-2 border-dashed border-pink-300 rounded-2xl p-8 text-center hover:border-purple-400 hover:bg-pink-50 transition">
                    <div className="flex justify-center gap-4 mb-3">
                      <Camera className="w-12 h-12 text-pink-400" />
                      <Video className="w-12 h-12 text-purple-400" />
                    </div>
                    <p className="text-gray-700 font-semibold mb-1">Chọn ảnh hoặc video</p>
                    <p className="text-sm text-gray-500 mb-3">Có thể chọn nhiều file cùng lúc</p>
                    <p className="text-xs text-gray-400">Ảnh: tối đa 10MB • Video: tối đa 100MB</p>
                  </div>
                </label>

                <p className="text-xs text-gray-500 text-center mt-4">
                  File sẽ được thêm vào ngày hôm nay
                </p>
              </div>
            </div>
          )}

          {/* Gallery Content */}
          <div className="p-4 space-y-6 pb-8">
            {displayData.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">
                  {filterType === 'video' ? <Video className="w-16 h-16 mx-auto" /> :
                   <Image className="w-16 h-16 mx-auto" />}
                </div>
                <p className="text-gray-500 font-semibold">
                  {filterType === 'video' ? 'Chưa có video nào' : 'Chưa có ảnh nào'}
                </p>
              </div>
            ) : (
              displayData.map((dateGroup) => (
                <div key={dateGroup.date} className="space-y-3">
                  <div className="flex items-center gap-2 sticky top-32 bg-gradient-to-r from-pink-50 to-purple-50 py-2 px-3 rounded-lg shadow-sm z-40">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-semibold text-purple-700">{dateGroup.date}</span>
                    <span className="text-xs text-gray-500">({dateGroup.items.length})</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {dateGroup.items.map((item) => (
                      <div
                        key={item.id}
                        className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group cursor-pointer"
                        onClick={() => {
                          if (item.type === 'video') {
                            setSelectedVideo(item);
                          } else {
                            setSelectedImage(item);
                          }
                        }}
                      >
                        {item.type === 'video' ? (
                          <>
                            {/* Hiển thị thumbnail image thay vì video tag */}
                            {item.thumbnail ? (
                              <img
                                src={item.thumbnail}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400" />
                            )}
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-center justify-center">
                              <div className="bg-white rounded-full p-3 group-hover:scale-110 transition-transform shadow-lg">
                                <Play className="w-6 h-6 text-purple-600 fill-purple-600" />
                              </div>
                            </div>
                            
                            <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
                              VIDEO
                            </div>
                          </>
                        ) : (
                          <>
                            <img
                              src={item.url}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            {/* Favorite Button - Chỉ hiện cho ảnh */}
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
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
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

      {/* Video Modal */}
      <VideoModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  );
}

export default Gallery;