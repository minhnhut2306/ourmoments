import { X } from 'lucide-react';

function VideoModal({ video, onClose }) {
  if (!video) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-[100] flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition z-10"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <div className="max-w-4xl w-full h-[80vh]">
        <iframe
          src={video.url}
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg shadow-2xl"
        />
        
        <div className="mt-4 text-center">
          <p className="text-white text-sm">{video.name}</p>
        </div>
      </div>
    </div>
  );
}

export default VideoModal;