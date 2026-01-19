import { useState, useMemo } from 'react';
import { useGalleryAPI } from '../hooks/useGalleryAPI';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useFavorites } from '../hooks/useFavorites';
import { usePrefetch } from '../hooks/usePrefetch';
import GalleryHeader from '../components/Gallery/GalleryHeader';
import GalleryGrid from '../components/Gallery/GalleryGrid';
import UploadModal from '../components/Gallery/UploadModal';
import ImageModal from '../components/Gallery/ImageModal';
import VideoModal from '../components/Gallery/VideoModal';
import DeleteConfirmModal from '../components/Gallery/DeleteConfirmModal';
import UploadingAnimation from '../components/Gallery/UploadingAnimation';
import { downloadImage } from '../utils/downloadHelper';
import { RefreshCw } from 'lucide-react';

function Gallery({ onBack }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filterType, setFilterType] = useState('image');
  const [localToast, setLocalToast] = useState({ show: false, message: '', type: 'success' });
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  usePrefetch();

  const {
    loadImages,
    loadVideos,
    uploading,
    uploadProgress,
    deleting,
    toast: uploadToast,
    handleUploadFiles,
    handleDeleteMedia
  } = useGalleryAPI();

  const {
    data: imageData,
    loading: imageLoading,
    hasMore: imageHasMore,
    total: imageTotalCount,
    reset: resetImages
  } = useInfiniteScroll(loadImages, {
    threshold: 500,
    initialPage: 1,
    pageSize: 20
  });

  const {
    data: videoData,
    loading: videoLoading,
    hasMore: videoHasMore,
    total: videoTotalCount,
    reset: resetVideos
  } = useInfiniteScroll(loadVideos, {
    threshold: 500,
    initialPage: 1,
    pageSize: 20
  });

  const {
    isFavoriteItem,
    toggleFavorite: toggleFav,
    MAX_FAVORITES,
    getFavoritesCount
  } = useFavorites();

  const displayData = useMemo(() => {
    const rawData = filterType === 'image' ? imageData : videoData;
    
    const grouped = new Map();
    
    for (let i = 0; i < rawData.length; i++) {
      const item = rawData[i];
      const date = new Date(item.createdAt);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const dateStr = day + '-' + month + '-' + year;
      
      if (!grouped.has(dateStr)) {
        grouped.set(dateStr, []);
      }
      grouped.get(dateStr).push(item);
    }

    const result = [];
    grouped.forEach(function(items, dateKey) {
      const sortedItems = items.sort(function(a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      result.push({
        date: dateKey,
        items: sortedItems
      });
    });

    return result.sort(function(a, b) {
      const partsA = a.date.split('-');
      const partsB = b.date.split('-');
      const dateA = new Date(Number(partsA[2]), Number(partsA[1]) - 1, Number(partsA[0]));
      const dateB = new Date(Number(partsB[2]), Number(partsB[1]) - 1, Number(partsB[0]));
      return dateB.getTime() - dateA.getTime();
    });
  }, [imageData, videoData, filterType]);

  const totalCounts = useMemo(() => {
    return {
      images: imageTotalCount,
      videos: videoTotalCount,
      total: imageTotalCount + videoTotalCount
    };
  }, [imageTotalCount, videoTotalCount]);

  const showToast = function(message, type) {
    setLocalToast({ show: true, message: message, type: type || 'success' });
    setTimeout(function() {
      setLocalToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleToggleFavorite = async function(item) {
    const result = await toggleFav(item);
    if (result) {
      showToast(result.message, result.type || 'success');
    }
  };

  const handleDownload = async function(url, filename) {
    setDownloading(true);
    const success = await downloadImage(url, filename);
    setDownloading(false);
    if (!success) {
      alert('Không thể tải xuống. Vui lòng thử lại!');
    }
  };

  const onUpload = async function(files) {
    setShowUploadModal(false);
    const success = await handleUploadFiles(files);
    
    if (success) {
      setTimeout(function() {
        resetImages();
        resetVideos();
      }, 1000);
    }
  };

  const handleDeleteClick = function(item) {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async function() {
    if (!itemToDelete) return;

    const success = await handleDeleteMedia(itemToDelete.id);
    
    if (success) {
      setShowDeleteModal(false);
      setItemToDelete(null);
      showToast('Đã xóa ' + (itemToDelete.type === 'video' ? 'video' : 'ảnh') + ' thành công', 'success');
      
      resetImages();
      resetVideos();
    }
  };

  const handleRefresh = function() {
    resetImages();
    resetVideos();
  };

  const currentLoading = filterType === 'image' ? imageLoading : videoLoading;
  const currentHasMore = filterType === 'image' ? imageHasMore : videoHasMore;

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ touchAction: 'pan-y' }}>
      <div 
        data-scroll-container
        className="w-full h-full overflow-y-auto overflow-x-hidden bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200" 
        style={{ touchAction: 'pan-y' }}
      >
        <div className="min-h-full bg-gradient-to-b from-white via-pink-50 to-purple-50">

          <GalleryHeader
            favorites={getFavoritesCount()}
            maxFavorites={MAX_FAVORITES}
            onUploadClick={function() { setShowUploadModal(true); }}
            onBackClick={onBack}
            filterType={filterType}
            setFilterType={setFilterType}
            counts={totalCounts}
          />

          <UploadingAnimation uploading={uploading} progress={uploadProgress} />

          {uploadToast.show && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
              <div className={'px-4 py-2 rounded-lg shadow-lg text-white text-sm font-medium ' + (
                uploadToast.type === 'success' ? 'bg-green-500' :
                uploadToast.type === 'warning' ? 'bg-orange-500' :
                uploadToast.type === 'error' ? 'bg-red-500' :
                'bg-blue-500'
              )}>
                {uploadToast.message}
              </div>
            </div>
          )}

          {localToast.show && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
              <div className={'px-4 py-2 rounded-lg shadow-lg text-white text-sm font-medium ' + (
                localToast.type === 'success' ? 'bg-green-500' :
                localToast.type === 'warning' ? 'bg-orange-500' :
                localToast.type === 'error' ? 'bg-red-500' :
                localToast.type === 'info' ? 'bg-blue-500' :
                'bg-gray-500'
              )}>
                {localToast.message}
              </div>
            </div>
          )}

          <button
            onClick={handleRefresh}
            disabled={currentLoading}
            className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition active:scale-95 disabled:opacity-50"
            title="Refresh gallery"
          >
            <RefreshCw className={'w-6 h-6 ' + (currentLoading ? 'animate-spin' : '')} />
          </button>

          <UploadModal
            show={showUploadModal}
            onClose={function() { setShowUploadModal(false); }}
            onUpload={onUpload}
          />

          <GalleryGrid
            displayData={displayData}
            filterType={filterType}
            isFavoriteItem={isFavoriteItem}
            onToggleFavorite={handleToggleFavorite}
            onImageClick={setSelectedImage}
            onVideoClick={setSelectedVideo}
            onDelete={handleDeleteClick}
          />

          {currentLoading && (
            <div className="flex flex-col justify-center items-center py-12">
              <div className="relative w-24 h-24 mb-4">
                {/* Outer spinning rings */}
                <div 
                  className="absolute w-24 h-24 rounded-full border-[4px] border-white/30 border-t-white border-r-pink-200"
                  style={{ 
                    animation: 'spin 1.5s linear infinite',
                    filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.6))'
                  }}
                />
                
                <div 
                  className="absolute w-24 h-24 rounded-full border-[4px] border-transparent border-b-purple-200 border-l-blue-200"
                  style={{ 
                    animation: 'spin 2s linear infinite reverse',
                    filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.5))'
                  }}
                />

                {/* Center heart */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="absolute inset-0 rounded-full blur-2xl opacity-70"
                    style={{
                      background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%)',
                      animation: 'pulse 1.2s ease-in-out infinite'
                    }}
                  />
                  
                  <svg 
                    width="48" 
                    height="48" 
                    viewBox="0 0 20 20"
                    className="animate-bounce"
                    style={{ 
                      filter: 'drop-shadow(0 3px 12px rgba(255, 255, 255, 0.8))'
                    }}
                  >
                    <defs>
                      <linearGradient id="heartGradScroll" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#ffffff' }} />
                        <stop offset="50%" style={{ stopColor: '#fce7f3' }} />
                        <stop offset="100%" style={{ stopColor: '#fbcfe8' }} />
                      </linearGradient>
                    </defs>
                    <path 
                      fill="url(#heartGradScroll)" 
                      fillRule="evenodd" 
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>

                {/* Orbiting sparkles */}
                {[0, 60, 120, 180, 240, 300].map(function(angle, i) {
                  return (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-white rounded-full"
                      style={{
                        left: '50%',
                        top: '50%',
                        marginLeft: '-4px',
                        marginTop: '-4px',
                        transform: 'rotate(' + angle + 'deg) translateY(-50px)',
                        animation: 'sparkle-fade-scroll 1.5s ease-out infinite',
                        animationDelay: (i * 0.2) + 's',
                        boxShadow: '0 0 12px rgba(255, 255, 255, 0.9)'
                      }}
                    />
                  );
                })}
              </div>
              
              <p className="text-gray-700 text-lg font-bold tracking-wide" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}>
                Đang tải thêm...
              </p>
              
              <style>{`
                @keyframes sparkle-fade-scroll {
                  0% { opacity: 0; transform: rotate(var(--angle, 0deg)) translateY(-50px) scale(0); }
                  50% { opacity: 1; transform: rotate(var(--angle, 0deg)) translateY(-80px) scale(1.2); }
                  100% { opacity: 0; transform: rotate(var(--angle, 0deg)) translateY(-100px) scale(0); }
                }
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.7; }
                }
              `}</style>
            </div>
          )}

          {!currentHasMore && displayData.length > 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Đã hiển thị tất cả {filterType === 'image' ? 'ảnh' : 'video'} 🎉</p>
            </div>
          )}
        </div>
      </div>

      <ImageModal
        image={selectedImage}
        onClose={function() { setSelectedImage(null); }}
        onDownload={handleDownload}
        downloading={downloading}
      />

      <VideoModal
        video={selectedVideo}
        onClose={function() { setSelectedVideo(null); }}
      />

      <DeleteConfirmModal
        show={showDeleteModal}
        item={itemToDelete}
        onClose={function() {
          setShowDeleteModal(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDelete}
        deleting={deleting}
      />
    </div>
  );
}

export default Gallery;