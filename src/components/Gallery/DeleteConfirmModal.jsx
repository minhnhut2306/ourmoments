import { X, Trash2, AlertTriangle } from 'lucide-react';

function DeleteConfirmModal({ show, item, onClose, onConfirm, deleting }) {
  if (!show || !item) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              Xác nhận xóa
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Bạn có chắc muốn xóa {item.type === 'video' ? 'video' : 'ảnh'} này không?
          </p>
          
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            {item.type === 'video' ? (
              item.thumbnail ? (
                <img
                  src={item.thumbnail}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded"
                />
              ) : (
                <div className="w-full h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded flex items-center justify-center">
                  <span className="text-white font-semibold">VIDEO</span>
                </div>
              )
            ) : (
              <img
                src={item.url}
                alt="Preview"
                className="w-full h-32 object-cover rounded"
              />
            )}
            
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={deleting}
            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {deleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang xóa...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Xóa
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;