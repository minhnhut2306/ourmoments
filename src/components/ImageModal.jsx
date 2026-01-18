import React from 'react';
import { X, Download } from 'lucide-react';

function ImageModal({ image, onClose, onDownload, downloading }) {
  if (!image) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-[100] flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <div className="max-w-4xl w-full">
        <img
          src={image.url}
          alt={image.name}
          className="w-full h-auto rounded-lg shadow-2xl"
        />
        
        <div className="mt-4 flex gap-3 justify-center">
          <button
            onClick={() => onDownload(image.url, image.name)}
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


export default ImageModal;