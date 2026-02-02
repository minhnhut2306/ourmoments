import { ArrowLeft, Image, Video } from 'lucide-react';

function GalleryHeader({ onBackClick, filterType, setFilterType, counts }) {
  return (
    <div className="sticky top-0 z-50 bg-pink-100 px-4 py-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackClick}
            className="p-2 hover:bg-pink-200 rounded-full transition"
          >
            <ArrowLeft className="w-6 h-6 text-pink-600" />
          </button>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 bg-clip-text text-transparent">
              Kỷ niệm của chúng mình
            </h2>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilterType('image')}
          className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            filterType === 'image'
              ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Image className="w-4 h-4" />
          Hình ảnh ({counts.images})
        </button>
        
        <button
          onClick={() => setFilterType('video')}
          className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            filterType === 'video'
              ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Video className="w-4 h-4" />
          Video ({counts.videos})
        </button>
      </div>
    </div>
  );
}

export default GalleryHeader;