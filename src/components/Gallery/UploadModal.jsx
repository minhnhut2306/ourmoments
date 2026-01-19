import { X, Camera, Video, AlertCircle, Upload as UploadIcon } from 'lucide-react';
import { useState } from 'react';
import { compressImages } from '../../utils/imageCompressor';

function UploadModal({ show, onClose, onUpload }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const [compressing, setCompressing] = useState(false);
  const [compressProgress, setCompressProgress] = useState({ current: 0, total: 0 });

  if (!show) return null;

  const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const fileErrors = [];
    const needCompress = [];

    files.forEach((file) => {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);

      if (isImage) {
        if (file.size > MAX_IMAGE_SIZE) {
          // ✅ Ảnh quá lớn → sẽ nén tự động
          needCompress.push(file.name);
        }
        validFiles.push(file);
      } else if (isVideo) {
        if (file.size > MAX_VIDEO_SIZE) {
          fileErrors.push(`${file.name}: ${fileSizeMB}MB (tối đa 50MB) - Video không thể tự động nén`);
        } else {
          validFiles.push(file);
        }
      } else {
        fileErrors.push(`${file.name}: Định dạng không hỗ trợ`);
      }
    });

    // ✅ Thông báo nếu có ảnh cần nén
    if (needCompress.length > 0) {
      setErrors([
        ...fileErrors,
        `📸 ${needCompress.length} ảnh quá lớn sẽ được tự động nén xuống dưới 10MB: ${needCompress.join(', ')}`
      ]);
    } else {
      setErrors(fileErrors);
    }

    setSelectedFiles(validFiles);
  };

  const handleUploadClick = async () => {
    if (selectedFiles.length === 0) {
      setErrors(['Vui lòng chọn ít nhất 1 file']);
      return;
    }

    try {
      setCompressing(true);
      setCompressProgress({ current: 0, total: selectedFiles.length });

      // ✅ Tự động nén ảnh quá lớn
      console.log('🔄 Checking and compressing images...');
      const compressedFiles = await compressImages(
        selectedFiles,
        10, // Max 10MB
        (current, total) => {
          setCompressProgress({ current, total });
        }
      );

      console.log(`✅ Compression complete! Processing ${compressedFiles.length} files`);

      // Upload files đã nén
      onUpload(compressedFiles);
      
      // Reset state
      setSelectedFiles([]);
      setErrors([]);
      setCompressing(false);
      setCompressProgress({ current: 0, total: 0 });
    } catch (error) {
      console.error('Compression error:', error);
      setErrors(['❌ Lỗi nén ảnh: ' + error.message]);
      setCompressing(false);
    }
  };

  const handleClose = () => {
    setSelectedFiles([]);
    setErrors([]);
    setCompressing(false);
    setCompressProgress({ current: 0, total: 0 });
    onClose();
  };

  const formatFileSize = (bytes) => {
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(1)}MB` : `${(bytes / 1024).toFixed(0)}KB`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
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

        {/* ✅ Thông báo nén ảnh */}
        {compressing && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-700">
                  Đang nén ảnh... {compressProgress.current}/{compressProgress.total}
                </p>
                <p className="text-xs text-blue-600">
                  Vui lòng đợi, đang tối ưu hóa chất lượng...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ✅ Hiển thị lỗi/cảnh báo */}
        {errors.length > 0 && !compressing && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-yellow-700 mb-1">
                  Lưu ý:
                </p>
                <ul className="text-xs text-yellow-600 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ✅ Hiển thị file đã chọn */}
        {selectedFiles.length > 0 && !compressing && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-semibold text-green-700 mb-2">
              ✓ Đã chọn {selectedFiles.length} file:
            </p>
            <ul className="text-xs text-green-600 space-y-1 max-h-32 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span className="truncate flex-1">
                    {file.type.startsWith('video/') ? '🎥' : '📷'} {file.name}
                  </span>
                  <span className={`ml-2 ${file.size > MAX_IMAGE_SIZE && file.type.startsWith('image/') ? 'text-orange-500 font-semibold' : 'text-green-500'}`}>
                    {formatFileSize(file.size)}
                    {file.size > MAX_IMAGE_SIZE && file.type.startsWith('image/') && ' →📉'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ✅ Nút chọn file */}
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
            <p className="text-gray-700 font-semibold mb-1">Chọn ảnh hoặc video</p>
            <p className="text-sm text-gray-500 mb-3">Có thể chọn nhiều file cùng lúc</p>
            <div className="space-y-1">
              <p className="text-xs text-gray-600">
                📷 Ảnh: <strong>Không giới hạn</strong> (tự động nén nếu bé hơn 10MB)
              </p>
              <p className="text-xs text-gray-600">
                🎥 Video: tối đa <strong>50MB</strong>
              </p>
            </div>
          </div>
        </label>

        {/* ✅ Nút tải lên */}
        <button
          onClick={handleUploadClick}
          disabled={selectedFiles.length === 0 || compressing}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {compressing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Đang nén ảnh...
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

        <p className="text-xs text-gray-500 text-center mt-4">
          💡 Ảnh quá lớn sẽ tự động nén để tải nhanh hơn
        </p>
      </div>
    </div>
  );
}

export default UploadModal;