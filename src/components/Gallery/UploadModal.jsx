import { useState } from 'react';
import { compressImages } from '../../utils/imageCompressor';

function UploadModal({ show, onClose, onUpload }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [compressing, setCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState({ current: 0, total: 0 });

  if (!show) return null;

  const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
  const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    console.log('📁 Selected files:', files.length);
    
    const validFiles = [];
    const rejectedFiles = [];
    
    files.forEach((file) => {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/') || 
                      file.name.toLowerCase().endsWith('.heic') ||
                      file.name.toLowerCase().endsWith('.heif');
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
      
      console.log(`📄 File: ${file.name}, Type: ${file.type}, Size: ${fileSizeMB}MB`);

      if (isImage) {
        validFiles.push(file);
      } else if (isVideo && file.size <= MAX_VIDEO_SIZE) {
        validFiles.push(file);
      } else if (isVideo && file.size > MAX_VIDEO_SIZE) {
        rejectedFiles.push({ name: file.name, size: fileSizeMB, type: 'video' });
      }
    });

    if (rejectedFiles.length > 0) {
      const msg = rejectedFiles.map(f => 
        `${f.name} (${f.size}MB > 50MB)`
      ).join(', ');
      alert(`Video quá lớn: ${msg}`);
    }

    console.log(`✅ Valid files: ${validFiles.length}, ❌ Rejected: ${rejectedFiles.length}`);
    setSelectedFiles(validFiles);
  };

  const handleUploadClick = async () => {
    if (selectedFiles.length === 0) return;

    try {
      setCompressing(true);
      setCompressionProgress({ current: 0, total: selectedFiles.length });
      
      console.log('🚀 Starting compression...');
      
      const compressedFiles = await compressImages(selectedFiles, 10, (current, total) => {
        setCompressionProgress({ current, total });
      });
      
      console.log(`✅ Compression complete. ${compressedFiles.length}/${selectedFiles.length} files ready`);
      
      if (compressedFiles.length > 0) {
        onUpload(compressedFiles);
        setSelectedFiles([]);
      } else {
        alert('Không có file nào được xử lý thành công');
      }
      
      setCompressing(false);
      setCompressionProgress({ current: 0, total: 0 });
    } catch (error) {
      console.error('❌ Upload error:', error);
      alert(`Lỗi: ${error.message}`);
      setCompressing(false);
      setCompressionProgress({ current: 0, total: 0 });
    }
  };

  const handleClose = () => {
    setSelectedFiles([]);
    setCompressing(false);
    setCompressionProgress({ current: 0, total: 0 });
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
            className="p-2 hover:bg-gray-100 rounded-full transition disabled:opacity-50 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Compressing State */}
        {compressing && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm font-semibold text-blue-700">
              Đang xử lý {compressionProgress.current}/{compressionProgress.total}...
            </p>
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
            accept="image/*,video/*,.heic,.heif,.HEIC,.HEIF"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            disabled={compressing}
          />
          <div className="border-2 border-dashed border-pink-300 rounded-2xl p-8 text-center hover:border-purple-400 hover:bg-pink-50 transition">
            <p className="text-gray-700 font-semibold mb-2 text-2xl">📷 🎥</p>
            <p className="text-gray-700 font-semibold mb-2">Chọn ảnh hoặc video</p>
            <p className="text-xs text-gray-500">
              Ảnh: JPG, PNG, HEIC (tự động nén)<br/>
              Video: tối đa 50MB
            </p>
          </div>
        </label>

        {/* Upload Button */}
        <button
          onClick={handleUploadClick}
          disabled={selectedFiles.length === 0 || compressing}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {compressing ? (
            <>
              <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Đang xử lý...
            </>
          ) : (
            <>
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