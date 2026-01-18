import React from 'react';

function UploadingAnimation({ uploading, progress = 0 }) {
  if (!uploading) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          
          {/* Outer spinning ring 1 */}
          <div className="relative w-32 h-32">
            <div 
              className="absolute w-32 h-32 rounded-full border-[5px] border-white/30 border-t-white border-r-pink-300"
              style={{ 
                animation: 'spin 1.5s linear infinite',
                filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.7))'
              }}
            />
            
            {/* Outer spinning ring 2 - opposite */}
            <div 
              className="absolute w-32 h-32 rounded-full border-[5px] border-transparent border-b-purple-300 border-l-blue-300"
              style={{ 
                animation: 'spin 2s linear infinite reverse',
                filter: 'drop-shadow(0 0 12px rgba(168, 85, 247, 0.6))'
              }}
            />

            {/* Center upload icon with glow */}
            <div 
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* Glow effect */}
              <div 
                className="absolute inset-0 rounded-full blur-2xl opacity-70"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%)',
                  animation: 'pulse 1.2s ease-in-out infinite'
                }}
              />
              
              {/* Heart icon */}
              <svg 
                width="56" 
                height="56" 
                viewBox="0 0 20 20"
                className="animate-bounce"
                style={{ 
                  filter: 'drop-shadow(0 3px 15px rgba(255, 255, 255, 0.9))',
                }}
              >
                <defs>
                  <linearGradient id="heartGradUpload" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#ffffff' }} />
                    <stop offset="50%" style={{ stopColor: '#fce7f3' }} />
                    <stop offset="100%" style={{ stopColor: '#fbcfe8' }} />
                  </linearGradient>
                </defs>
                <path 
                  fill="url(#heartGradUpload)" 
                  fillRule="evenodd" 
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>

            {/* Orbiting sparkles */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <div
                key={i}
                className="absolute w-2.5 h-2.5 bg-white rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  marginLeft: '-5px',
                  marginTop: '-5px',
                  transform: `rotate(${angle}deg) translateY(-60px)`,
                  animation: `sparkle-fade 1.5s ease-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                  boxShadow: '0 0 15px rgba(255, 255, 255, 1)'
                }}
              />
            ))}

            {/* Progress Circle */}
            <svg 
              width="140" 
              height="140"
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                marginLeft: '-70px',
                marginTop: '-70px',
                pointerEvents: 'none'
              }}
            >
              {/* Background circle */}
              <circle
                cx="70"
                cy="70"
                r="63"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="3"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="70"
                cy="70"
                r="63"
                stroke="white"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 63}`}
                strokeDashoffset={`${2 * Math.PI * 63 * (1 - progress / 100)}`}
                transform="rotate(-90 70 70)"
                style={{ 
                  transition: 'stroke-dashoffset 0.3s ease-out',
                  filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))'
                }}
              />
            </svg>
          </div>

          {/* Text loading */}
          <div className="mt-8 text-center">
            <p 
              className="text-white text-xl font-bold tracking-wide mb-2"
              style={{
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                animation: 'pulse 1s ease-in-out infinite'
              }}
            >
              Đang tải lên... {progress}%
            </p>
            <p 
              className="text-white/80 text-sm"
              style={{
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)'
              }}
            >
              Vui lòng đợi một chút
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2 mt-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white rounded-full"
                style={{
                  animation: 'bounce 1.4s ease-in-out infinite',
                  animationDelay: `${i * 0.2}s`,
                  boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes sparkle-fade {
          0% { 
            opacity: 0; 
            transform: rotate(var(--angle, 0deg)) translateY(-60px) scale(0); 
          }
          50% { 
            opacity: 1; 
            transform: rotate(var(--angle, 0deg)) translateY(-90px) scale(1.3); 
          }
          100% { 
            opacity: 0; 
            transform: rotate(var(--angle, 0deg)) translateY(-110px) scale(0); 
          }
        }

        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(1) translateY(0); 
          }
          40% { 
            transform: scale(1.2) translateY(-8px); 
          }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </>
  );
}

export default UploadingAnimation;