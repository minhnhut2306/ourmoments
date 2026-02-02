import { X, Download } from 'lucide-react';
import { useState } from 'react';

function VideoModal({ video, onClose }) {
  const [downloading, setDownloading] = useState(false);

  if (!video) return null;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      
      // Tải video xuống
      const response = await fetch(video.url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${video.name || 'video'}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(blobUrl);
      setDownloading(false);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Không thể tải xuống. Vui lòng thử lại!');
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-[100] flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition z-10"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <div className="max-w-4xl w-full">
        <div className="w-full aspect-video bg-black rounded-lg shadow-2xl overflow-hidden">
          <video
            src={video.url}
            controls
            autoPlay
            className="w-full h-full"
            controlsList="nodownload"
          >
            Your browser does not support the video tag.
          </video>
        </div>
        
        <div className="mt-4 flex gap-3 justify-center items-center">
          <p className="text-white text-sm font-medium">{video.name}</p>
          
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition active:scale-95 disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            {downloading ? 'Đang tải...' : 'Tải xuống'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VideoModal;