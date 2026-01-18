import { X, Camera, Video } from 'lucide-react';

function UploadModal({ show, onClose, onUpload }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Thêm ảnh & video
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <label className="block cursor-pointer">
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                onUpload(e.target.files);
              }
            }}
          />
          <div className="border-2 border-dashed border-pink-300 rounded-2xl p-8 text-center hover:border-purple-400 hover:bg-pink-50 transition">
            <div className="flex justify-center gap-4 mb-3">
              <Camera className="w-12 h-12 text-pink-400" />
              <Video className="w-12 h-12 text-purple-400" />
            </div>
            <p className="text-gray-700 font-semibold mb-1">Chọn ảnh hoặc video</p>
            <p className="text-sm text-gray-500 mb-3">Có thể chọn nhiều file cùng lúc</p>
            <p className="text-xs text-gray-400">Ảnh: tối đa 10MB • Video: tối đa 100MB</p>
          </div>
        </label>

        <p className="text-xs text-gray-500 text-center mt-4">
          File sẽ được thêm vào ngày hôm nay
        </p>
      </div>
    </div>
  );
}

export default UploadModal;