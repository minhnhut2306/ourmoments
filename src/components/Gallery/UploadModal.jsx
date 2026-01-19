import { X, Camera, Video, Upload as UploadIcon } from 'lucide-react';
import { useState } from 'react';
import { compressImages } from '../../utils/imageCompressor';

function UploadModal({ show, onClose, onUpload }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [compressing, setCompressing] = useState(false);

  if (!show) return null;

  const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
  const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      
      if (isImage) return true;
      if (isVideo && file.size <= MAX_VIDEO_SIZE) return true;
      return false;
    });

    setSelectedFiles(validFiles);
  };

  const handleUploadClick = async () => {
    if (selectedFiles.length === 0) return;

    try {
      setCompressing(true);
      const compressedFiles = await compressImages(selectedFiles, 10);
      
      onUpload(compressedFiles);
      setSelectedFiles([]);
      setCompressing(false);
    } catch (error) {
      console.error('Compression error:', error);
      setCompressing(false);
    }
  };

  const handleClose = () => {
    setSelectedFiles([]);
    setCompressing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Thêm ảnh & video
          </h3>
          <button
            onClick={handleClose}
            disabled={compressing}
            className="p-2 hover:bg-gray-100 rounded-full transition disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Compressing State */}
        {compressing && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm font-semibold text-blue-700">Đang xử lý...</p>
          </div>
        )}

        {/* Selected Files Count */}
        {selectedFiles.length > 0 && !compressing && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm font-semibold text-green-700 text-center">
              ✓ Đã chọn {selectedFiles.length} file
            </p>
          </div>
        )}

        {/* File Input Area */}
        <label className={`block ${compressing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} mb-4`}>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            disabled={compressing}
          />
          <div className="border-2 border-dashed border-pink-300 rounded-2xl p-8 text-center hover:border-purple-400 hover:bg-pink-50 transition">
            <div className="flex justify-center gap-4 mb-3">
              <Camera className="w-12 h-12 text-pink-400" />
              <Video className="w-12 h-12 text-purple-400" />
            </div>
            <p className="text-gray-700 font-semibold mb-2">Chọn ảnh hoặc video</p>
            <p className="text-xs text-gray-500">
              📷 Ảnh: tự động nén | 🎥 Video: tối đa 50MB
            </p>
          </div>
        </label>

        {/* Upload Button */}
        <button
          onClick={handleUploadClick}
          disabled={selectedFiles.length === 0 || compressing}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {compressing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Đang tải lên...
            </>
          ) : (
            <>
              <UploadIcon className="w-5 h-5" />
              {selectedFiles.length > 0 
                ? `Tải lên ${selectedFiles.length} file` 
                : 'Chọn file để tải lên'}
            </>
          )}
        </button>

      </div>
    </div>
  );
}

export default UploadModal;