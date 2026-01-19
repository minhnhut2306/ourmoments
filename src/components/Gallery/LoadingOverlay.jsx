import { useState, useEffect } from 'react';

function LoadingOverlay({ loading }) {
  const [showSlowWarning, setShowSlowWarning] = useState(false);

  useEffect(() => {
    if (!loading) {
      setShowSlowWarning(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowSlowWarning(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [loading]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm mx-4">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
          </div>

          <p className="text-gray-700 font-semibold text-lg mb-2">
            Đang tải dữ liệu...
          </p>

          {showSlowWarning && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm text-center">
                ⏳ Server đang khởi động...<br/>
                <span className="text-xs text-yellow-600">
                  (Lần đầu có thể hơi lâu)
                </span>
              </p>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingOverlay;