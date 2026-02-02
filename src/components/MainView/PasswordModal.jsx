import { useState } from 'react';
import { Lock, X, Eye, EyeOff } from 'lucide-react';

function PasswordModal({ show, onClose, onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password === '24012023') {
      setError('');
      setPassword('');
      onSuccess();
    } else {
      setError('Mật khẩu không đúng!');
      setPassword('');
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    setShowPassword(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-pink-100 rounded-full">
              <Lock className="w-5 h-5 text-pink-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              Nhập mật khẩu
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="text-gray-600 mb-3 text-sm">
              Vui lòng nhập mật khẩu để xem ảnh & video
            </p>
            
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Nhập mật khẩu..."
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none transition"
                autoFocus
              />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-500" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
            
            {error && (
              <p className="text-red-500 text-sm mt-2 font-medium">
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition active:scale-95"
            >
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PasswordModal;