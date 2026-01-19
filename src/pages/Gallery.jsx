import { useState } from 'react';
import { useGalleryAPI } from '../hooks/useGalleryAPI';
import { useFavorites } from '../hooks/useFavorites';
import { usePrefetch } from '../hooks/usePrefetch';
import GalleryHeader from '../components/Gallery/GalleryHeader';
import GalleryGrid from '../components/Gallery/GalleryGrid';
import UploadModal from '../components/Gallery/UploadModal';
import ImageModal from '../components/Gallery/ImageModal';
import VideoModal from '../components/Gallery/VideoModal';
import DeleteConfirmModal from '../components/Gallery/DeleteConfirmModal';
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
  
  // Delete state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  usePrefetch();

  const {
    images,
    videos,
    loading,
    uploading,
    uploadProgress,
    toast: uploadToast,
    handleUploadFiles,
    handleDeleteMedia,
    totalCounts,
    loadGalleryData
  } = useGalleryAPI();

  const {
    isFavoriteItem,
    toggleFavorite: toggleFav,
    MAX_FAVORITES,
    getFavoritesCount
  } = useFavorites();

  const displayData = filterType === 'image' ? images : videos;

  const showToast = (message, type = 'success') => {
    setLocalToast({ show: true, message, type });
    setTimeout(() => setLocalToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleToggleFavorite = async (item) => {
    const result = await toggleFav(item);
    if (result) {
      showToast(result.message, result.type || 'success');
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
    setShowUploadModal(false);
    const success = await handleUploadFiles(files);
    
    if (success) {
      setTimeout(() => {
        loadGalleryData();
      }, 1000);
    }
  };

  // Handle delete
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setDeleting(true);
      await handleDeleteMedia(itemToDelete.id);
      
      setShowDeleteModal(false);
      setItemToDelete(null);
      showToast(`Đã xóa ${itemToDelete.type === 'video' ? 'video' : 'ảnh'} thành công`, 'success');
      
      // Reload data
      await loadGalleryData();
    } catch (error) {
      console.error('Delete error:', error);
      showToast('Lỗi khi xóa', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ touchAction: 'pan-y' }}>
      <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200" style={{ touchAction: 'pan-y' }}>
        <div className="min-h-full bg-gradient-to-b from-white via-pink-50 to-purple-50">

          <GalleryHeader
            favorites={getFavoritesCount()}
            maxFavorites={MAX_FAVORITES}
            onUploadClick={() => setShowUploadModal(true)}
            onBackClick={onBack}
            filterType={filterType}
            setFilterType={setFilterType}
            counts={totalCounts}
          />

          <LoadingOverlay loading={loading} />
          <UploadingAnimation uploading={uploading} progress={uploadProgress} />

          {/* Toast Upload */}
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

          {/* Toast Local */}
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

          {/* Refresh Button */}
          <button
            onClick={loadGalleryData}
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
            onDelete={handleDeleteClick}
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

      <DeleteConfirmModal
        show={showDeleteModal}
        item={itemToDelete}
        onClose={() => {
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