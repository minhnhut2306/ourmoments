import { X, Camera, Video, AlertCircle } from 'lucide-react';
import { useState } from 'react';

function UploadModal({ show, onClose, onUpload }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errors, setErrors] = useState([]);

  if (!show) return null;

  const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_VIDEO_SIZE = 4 * 1024 * 1024; // ✅ 4MB - Giới hạn Vercel serverless

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const fileErrors = [];

    files.forEach((file) => {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);

      if (isImage) {
        if (file.size > MAX_IMAGE_SIZE) {
          fileErrors.push(`${file.name}: ${fileSizeMB}MB (tối đa 10MB)`);
        } else {
          validFiles.push(file);
        }
      } else if (isVideo) {
        if (file.size > MAX_VIDEO_SIZE) {
          fileErrors.push(`${file.name}: ${fileSizeMB}MB (tối đa 50MB)`);
        } else {
          validFiles.push(file);
        }
      }
    });

    setErrors(fileErrors);
    setSelectedFiles(validFiles);

    // ✅ Nếu có file hợp lệ thì upload ngay
    if (validFiles.length > 0) {
      setTimeout(() => {
        onUpload(validFiles);
        setSelectedFiles([]);
        setErrors([]);
      }, 500);
    }
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
            onClick={() => {
              onClose();
              setErrors([]);
              setSelectedFiles([]);
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* ✅ Hiển thị lỗi nếu có */}
        {errors.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-700 mb-1">
                  File quá lớn:
                </p>
                <ul className="text-xs text-red-600 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ✅ Hiển thị file đã chọn */}
        {selectedFiles.length > 0 && (
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
                  <span className="text-green-500 ml-2">
                    {formatFileSize(file.size)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <label className="block cursor-pointer">
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
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
                📷 Ảnh: tối đa <strong>10MB</strong>
              </p>
              <p className="text-xs text-gray-600">
                🎥 Video: tối đa <strong>4MB</strong>
              </p>
              <p className="text-xs text-red-500 font-semibold">
                ⚠️ Video lớn hơn 4MB sẽ bị lỗi do giới hạn server
              </p>
            </div>
          </div>
        </label>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700 text-center">
            💡 <strong>Mẹo:</strong> Nếu video quá lớn, hãy giảm độ phân giải khi quay hoặc nén video trước khi upload
          </p>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          File sẽ được thêm vào ngày hôm nay
        </p>
      </div>
    </div>
  );
}

export default UploadModal;