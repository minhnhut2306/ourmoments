
import React from 'react';

function PullRefreshAnimation({ pullDistance, isRefreshing, threshold }) {
  return (
    <>
      {/* 🔥 PULL TO REFRESH ANIMATION 🔥 */}
      <div 
        className="fixed left-0 right-0 flex flex-col items-center justify-center pointer-events-none"
        style={{
          top: '80px',
          zIndex: 100,
          opacity: Math.min(pullDistance / threshold, 1)
        }}
      >
        <div className="relative mb-4">
          
          {/* Outer spinning ring 1 */}
          <div 
            className="absolute w-24 h-24 rounded-full border-[4px] border-white/30 border-t-white border-r-pink-200"
            style={{ 
              animation: isRefreshing ? 'spin 1.5s linear infinite' : 'none',
              transform: !isRefreshing ? `rotate(${(pullDistance / threshold) * 720}deg)` : 'none',
              left: '50%',
              top: '50%',
              marginLeft: '-48px',
              marginTop: '-48px',
              filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.6))'
            }}
          />
          
          {/* Outer spinning ring 2 - opposite */}
          <div 
            className="absolute w-24 h-24 rounded-full border-[4px] border-transparent border-b-purple-200 border-l-blue-200"
            style={{ 
              animation: isRefreshing ? 'spin 2s linear infinite reverse' : 'none',
              transform: !isRefreshing ? `rotate(${-(pullDistance / threshold) * 540}deg)` : 'none',
              left: '50%',
              top: '50%',
              marginLeft: '-48px',
              marginTop: '-48px',
              filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.5))'
            }}
          />

          {/* Center heart with glow */}
          <div 
            className="absolute flex items-center justify-center"
            style={{
              width: '96px',
              height: '96px',
              left: '50%',
              top: '50%',
              marginLeft: '-48px',
              marginTop: '-48px',
              transform: `scale(${0.7 + (pullDistance / threshold) * 0.4})`,
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            {/* Glow effect */}
            <div 
              className="absolute inset-0 rounded-full blur-2xl opacity-70"
              style={{
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%)',
                animation: isRefreshing ? 'pulse 1.2s ease-in-out infinite' : 'none'
              }}
            />
            
            {/* Heart icon */}
            <svg 
              width="48" 
              height="48" 
              viewBox="0 0 20 20"
              className={isRefreshing ? 'animate-bounce' : ''}
              style={{ 
                filter: 'drop-shadow(0 3px 12px rgba(255, 255, 255, 0.8))',
                transform: isRefreshing ? 'none' : `rotate(${(pullDistance / threshold) * 360}deg)`,
                transition: isRefreshing ? 'none' : 'transform 0.2s ease-out'
              }}
            >
              <defs>
                <linearGradient id="heartGradPull" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#ffffff' }} />
                  <stop offset="50%" style={{ stopColor: '#fce7f3' }} />
                  <stop offset="100%" style={{ stopColor: '#fbcfe8' }} />
                </linearGradient>
              </defs>
              <path 
                fill="url(#heartGradPull)" 
                fillRule="evenodd" 
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>

          {/* Orbiting sparkles */}
          {isRefreshing && (
            <>
              {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                    marginLeft: '-4px',
                    marginTop: '-4px',
                    transform: `rotate(${angle}deg) translateY(-50px)`,
                    animation: `sparkle-fade 1.5s ease-out infinite`,
                    animationDelay: `${i * 0.2}s`,
                    boxShadow: '0 0 12px rgba(255, 255, 255, 0.9)'
                  }}
                />
              ))}
            </>
          )}

          {/* Progress circle */}
          {!isRefreshing && pullDistance > 0 && (
            <svg 
              width="120" 
              height="120"
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                marginLeft: '-60px',
                marginTop: '-60px',
                pointerEvents: 'none'
              }}
            >
              <circle
                cx="60"
                cy="60"
                r="55"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="2"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r="55"
                stroke="white"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 55}`}
                strokeDashoffset={`${2 * Math.PI * 55 * (1 - pullDistance / threshold)}`}
                transform="rotate(-90 60 60)"
                style={{ 
                  transition: 'stroke-dashoffset 0.1s ease-out',
                  filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.5))'
                }}
              />
            </svg>
          )}
        </div>

        {/* Text loading */}
        <div className="text-center">
          <p 
            className="text-white text-lg font-bold tracking-wide"
            style={{
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              animation: isRefreshing ? 'pulse 1s ease-in-out infinite' : 'none'
            }}
          >
            {isRefreshing ? 'Đang tải...' : pullDistance >= threshold ? 'Thả ra' : 'Kéo xuống'}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes sparkle-fade {
          0% { opacity: 0; transform: rotate(var(--angle, 0deg)) translateY(-50px) scale(0); }
          50% { opacity: 1; transform: rotate(var(--angle, 0deg)) translateY(-80px) scale(1.2); }
          100% { opacity: 0; transform: rotate(var(--angle, 0deg)) translateY(-100px) scale(0); }
        }
      `}</style>
    </>
  );
}

export default PullRefreshAnimation;