import { useState } from 'react';
import { useGalleryAPI } from '../hooks/useGalleryAPI';
import { useFavorites } from '../hooks/useFavorites';
import { usePrefetch } from '../hooks/usePrefetch';
import GalleryHeader from '../components/Gallery/GalleryHeader';
import GalleryGrid from '../components/Gallery/GalleryGrid';
import UploadModal from '../components/Gallery/UploadModal';
import ImageModal from '../components/Gallery/ImageModal';
import VideoModal from '../components/Gallery/VideoModal';
import UploadingAnimation from '../components/Gallery/UploadingAnimation';
import LoadingOverlay from '../components/Gallery/LoadingOverlay';
import { downloadImage } from '../utils/downloadHelper';
import { RefreshCw } from 'lucide-react';

function Gallery({ onBack }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filterType, setFilterType] = useState('image');
  const [localToast, setLocalToast] = useState({ show: false, message: '', type: 'success' });

  // ✅ Warm-up server để tránh cold start
  usePrefetch();

  // Gallery Data Hook
  const {
    loading,
    uploading,
    uploadProgress,
    toast: uploadToast,
    handleUploadFiles,
    getFilteredData,
    totalCounts,
    loadGalleryData // ✅ Expose loadGalleryData
  } = useGalleryAPI();

  // Favorites Hook
  const {
    favorites,
    isFavoriteItem,
    toggleFavorite: toggleFav,
    MAX_FAVORITES
  } = useFavorites();

  const displayData = getFilteredData(filterType);
  // ✅ Không cần gọi totalCounts() nữa
  const counts = totalCounts;

  // Handle toggle favorite với toast
  const handleToggleFavorite = async (item) => {
    const result = await toggleFav(item);
    if (result) {
      setLocalToast({ 
        show: true, 
        message: result.message, 
        type: result.type || 'success' 
      });
      setTimeout(() => setLocalToast({ show: false, message: '', type: 'success' }), 3000);
    }
  };

  const handleDownload = async (url, filename) => {
    setDownloading(true);
    const success = await downloadImage(url, filename);
    setDownloading(false);
    if (!success) {
      alert('Không thể tải xuống. Vui lòng thử lại!');
    }
  };

  const onUpload = async (files) => {
    setShowUploadModal(false); // ✅ Đóng modal ngay lập tức
    const success = await handleUploadFiles(files); // Upload ở background
    
    // ✅ Force reload nếu upload thành công
    if (success) {
      console.log('✅ Upload successful, waiting then reloading...');
      setTimeout(() => {
        console.log('🔄 Force reloading gallery...');
        loadGalleryData();
      }, 1000); // Delay 1s để backend kịp process
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ touchAction: 'pan-y' }}>
      <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200" style={{ touchAction: 'pan-y' }}>
        <div className="min-h-full bg-gradient-to-b from-white via-pink-50 to-purple-50">

          <GalleryHeader
            favorites={favorites.length}
            maxFavorites={MAX_FAVORITES}
            onUploadClick={() => setShowUploadModal(true)}
            onBackClick={onBack}
            filterType={filterType}
            setFilterType={setFilterType}
            counts={counts}
          />

          {/* Loading Overlay với cold start warning */}
          <LoadingOverlay loading={loading} />

          {/* Upload Animation */}
          <UploadingAnimation uploading={uploading} progress={uploadProgress} />

          {/* Toast Notification - Upload */}
          {uploadToast.show && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
              <div className={`px-4 py-2 rounded-lg shadow-lg text-white text-sm font-medium ${
                uploadToast.type === 'success' ? 'bg-green-500' :
                uploadToast.type === 'warning' ? 'bg-orange-500' :
                uploadToast.type === 'error' ? 'bg-red-500' :
                'bg-blue-500'
              }`}>
                {uploadToast.message}
              </div>
            </div>
          )}

          {/* Toast Notification - Favorites */}
          {localToast.show && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
              <div className={`px-4 py-2 rounded-lg shadow-lg text-white text-sm font-medium ${
                localToast.type === 'success' ? 'bg-green-500' :
                localToast.type === 'warning' ? 'bg-orange-500' :
                localToast.type === 'error' ? 'bg-red-500' :
                localToast.type === 'info' ? 'bg-blue-500' :
                'bg-gray-500'
              }`}>
                {localToast.message}
              </div>
            </div>
          )}

          {/* ✅ Manual Refresh Button for testing */}
          <button
            onClick={() => {
              console.log('🔄 Manual refresh triggered');
              loadGalleryData();
            }}
            disabled={loading}
            className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition active:scale-95 disabled:opacity-50"
            title="Refresh gallery"
          >
            <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <UploadModal
            show={showUploadModal}
            onClose={() => setShowUploadModal(false)}
            onUpload={onUpload}
          />

          <GalleryGrid
            displayData={displayData}
            filterType={filterType}
            isFavoriteItem={isFavoriteItem}
            onToggleFavorite={handleToggleFavorite}
            onImageClick={setSelectedImage}
            onVideoClick={setSelectedVideo}
          />
        </div>
      </div>

      <ImageModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
        onDownload={handleDownload}
        downloading={downloading}
      />

      <VideoModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  );
}

export default Gallery;