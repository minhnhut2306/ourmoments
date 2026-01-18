import { useState } from 'react';
import { useGallery } from '../hooks/useGallery';
import GalleryHeader from '../components/Gallery/GalleryHeader';
import GalleryGrid from '../components/Gallery/GalleryGrid';
import UploadModal from '../components/Gallery/UploadModal';
import ImageModal from '../components/Gallery/ImageModal';
import VideoModal from '../components/Gallery/VideoModal';
import { downloadImage } from '../utils/downloadHelper';

function Gallery({ onBack }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filterType, setFilterType] = useState('image');

  const {
    favorites,
    toast,
    toggleFavorite,
    isFavoriteItem,
    handleUploadFiles,
    getFilteredData,
    getTotalCounts,
    MAX_FAVORITES
  } = useGallery();

  const displayData = getFilteredData(filterType);
  const counts = getTotalCounts();

  const handleDownload = async (url, filename) => {
    setDownloading(true);
    const success = await downloadImage(url, filename);
    setDownloading(false);
    if (!success) {
      alert('Không thể tải xuống. Vui lòng thử lại!');
    }
  };

  const onUpload = async (files) => {
    const success = await handleUploadFiles(files);
    if (success) {
      setShowUploadModal(false);
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

          <UploadModal
            show={showUploadModal}
            onClose={() => setShowUploadModal(false)}
            onUpload={onUpload}
          />

          <GalleryGrid
            displayData={displayData}
            filterType={filterType}
            isFavoriteItem={isFavoriteItem}
            onToggleFavorite={toggleFavorite}
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