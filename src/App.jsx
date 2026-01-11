
import { useState } from 'react';
import MainView from './pages/MainView';
import Gallery from './pages/Gallery';
import ImageModal from './components/ImageModal';
import { usePreventSwipe } from './hooks/usePreventSwipe';
import { downloadImage } from './utils/downloadHelper';

export default function App() {
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [downloading, setDownloading] = useState(false);
  
  usePreventSwipe();

  const handleDownload = async (url, filename) => {
    setDownloading(true);
    const success = await downloadImage(url, filename);
    setDownloading(false);
    if (!success) {
      alert('Không thể tải xuống. Vui lòng thử lại!');
    }
  };

  if (showGallery) {
    return (
      <>
        <Gallery 
          onBack={() => setShowGallery(false)}
          onImageClick={setSelectedImage}
        />
        <ImageModal 
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onDownload={handleDownload}
          downloading={downloading}
        />
      </>
    );
  }

  return (
    <MainView onShowGallery={() => setShowGallery(true)} />
  );
}