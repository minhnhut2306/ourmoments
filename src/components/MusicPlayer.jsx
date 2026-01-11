
import React from 'react';

function MusicPlayer() {
  const nenNhacSvg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzJhMmEyYSIvPjwvc3ZnPg==';
  const tayDiaSvg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PGxpbmUgeDE9IjAiIHkxPSIwIiB4Mj0iMTAwIiB5Mj0iMTAwIiBzdHJva2U9IiM4ODgiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==';
  const musicImage = 'https://cdn-media.sforum.vn/storage/app/media/Van%20Pham/hinh-nen-anime-83.jpg';

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg">
      <img 
        src={nenNhacSvg}
        alt="Music Player"
        className="w-full object-cover"
      />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="w-64 h-64 rounded-full shadow-2xl overflow-hidden border-2 border-gray-800 bg-black animate-spin" style={{ animationDuration: '10s' }}>
            <img 
              src={musicImage}
              alt="Vinyl Record"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full shadow-inner border border-gray-600"></div>
          
          <div className="absolute -top-12 -right-24 w-52 h-52">
            <img 
              src={tayDiaSvg}
              alt="Tonearm"
              className="w-full h-full object-contain drop-shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;