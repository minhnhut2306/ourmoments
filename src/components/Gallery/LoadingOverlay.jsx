import React, { useState, useEffect } from 'react';

function LoadingOverlay({ loading }) {
  const [showSlowWarning, setShowSlowWarning] = useState(false);

  useEffect(() => {
    if (!loading) {
      setShowSlowWarning(false);
      return;
    }

    // Nếu loading quá 3s → hiển thị warning về cold start
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
          {/* Spinner */}
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
            <div 
              className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"
            ></div>
          </div>

          {/* Text */}
          <p className="text-gray-700 font-semibold text-lg mb-2">
            Đang tải dữ liệu...
          </p>

          {/* Warning về cold start */}
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

          {/* Progress dots */}
          <div className="flex gap-2 mt-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-purple-500 rounded-full"
                style={{
                  animation: 'bounce 1.4s ease-in-out infinite',
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(1) translateY(0); 
          }
          40% { 
            transform: scale(1.2) translateY(-8px); 
          }
        }
      `}</style>
    </div>
  );
}

export default LoadingOverlay;