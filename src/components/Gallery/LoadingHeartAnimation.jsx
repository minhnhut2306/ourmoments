
import React from 'react';


function LoadingHeartAnimation({ message = 'Đang tải...' }) {
  return (
    <div className="flex flex-col justify-center items-center py-12">
      <div className="relative w-24 h-24 mb-4">
        {/* Outer spinning ring 1 */}
        <div 
          className="absolute w-24 h-24 rounded-full border-[4px] border-white/30 border-t-white border-r-pink-200"
          style={{ 
            animation: 'spin 1.5s linear infinite',
            filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.6))'
          }}
        />
        
        {/* Outer spinning ring 2 */}
        <div 
          className="absolute w-24 h-24 rounded-full border-[4px] border-transparent border-b-purple-200 border-l-blue-200"
          style={{ 
            animation: 'spin 2s linear infinite reverse',
            filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.5))'
          }}
        />

        {/* Center heart */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="absolute inset-0 rounded-full blur-2xl opacity-70"
            style={{
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%)',
              animation: 'pulse 1.2s ease-in-out infinite'
            }}
          />
          
          <svg 
            width="48" 
            height="48" 
            viewBox="0 0 20 20"
            className="animate-bounce"
            style={{ 
              filter: 'drop-shadow(0 3px 12px rgba(255, 255, 255, 0.8))'
            }}
          >
            <defs>
              <linearGradient id="heartGradLoading" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#ffffff' }} />
                <stop offset="50%" style={{ stopColor: '#fce7f3' }} />
                <stop offset="100%" style={{ stopColor: '#fbcfe8' }} />
              </linearGradient>
            </defs>
            <path 
              fill="url(#heartGradLoading)" 
              fillRule="evenodd" 
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>

        {/* Orbiting sparkles */}
        {[0, 60, 120, 180, 240, 300].map(function(angle, i) {
          return (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: '50%',
                top: '50%',
                marginLeft: '-4px',
                marginTop: '-4px',
                transform: 'rotate(' + angle + 'deg) translateY(-50px)',
                animation: 'sparkle-fade-loading 1.5s ease-out infinite',
                animationDelay: (i * 0.2) + 's',
                boxShadow: '0 0 12px rgba(255, 255, 255, 0.9)'
              }}
            />
          );
        })}
      </div>
      
      <p 
        className="text-gray-700 text-lg font-bold tracking-wide" 
        style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}
      >
        {message}
      </p>
      
      <style>{`
        @keyframes sparkle-fade-loading {
          0% { 
            opacity: 0; 
            transform: rotate(var(--angle, 0deg)) translateY(-50px) scale(0); 
          }
          50% { 
            opacity: 1; 
            transform: rotate(var(--angle, 0deg)) translateY(-80px) scale(1.2); 
          }
          100% { 
            opacity: 0; 
            transform: rotate(var(--angle, 0deg)) translateY(-100px) scale(0); 
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
    </div>
  );
}

export default LoadingHeartAnimation;