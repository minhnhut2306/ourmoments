import { Calendar, Heart, Play, Image, Video } from 'lucide-react';
import { memo } from 'react';

// ✅ Memoize từng item
const GalleryItem = memo(({ item, isFavorite, onToggleFavorite, onImageClick, onVideoClick }) => {
  const handleClick = () => {
    if (item.type === 'video') {
      onVideoClick(item);
    } else {
      onImageClick(item);
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(item);
  };

  return (
    <div
      className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group cursor-pointer"
      onClick={handleClick}
    >
      {item.type === 'video' ? (
        <>
          {item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy" // ✅ Lazy loading
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400" />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-center justify-center">
            <div className="bg-white rounded-full p-3 group-hover:scale-110 transition-transform shadow-lg">
              <Play className="w-6 h-6 text-purple-600 fill-purple-600" />
            </div>
          </div>
          
          <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
            VIDEO
          </div>
        </>
      ) : (
        <>
          <img
            src={item.url}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy" // ✅ Lazy loading
          />
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-1.5 bg-black/30 backdrop-blur-sm rounded-full transition-all z-20 hover:scale-110"
          >
            <Heart
              className={`w-5 h-5 transition-all ${
                isFavorite ? 'text-red-500 scale-110' : 'text-white'
              }`}
              strokeWidth={2}
              fill={isFavorite ? '#ef4444' : 'none'}
            />
          </button>
        </>
      )}
    </div>
  );
});

GalleryItem.displayName = 'GalleryItem';

// ✅ Memoize date group
const DateGroup = memo(({ dateGroup, isFavoriteItem, onToggleFavorite, onImageClick, onVideoClick }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 sticky top-32 bg-gradient-to-r from-pink-50 to-purple-50 py-2 px-3 rounded-lg shadow-sm z-40">
      <Calendar className="w-4 h-4 text-purple-500" />
      <span className="text-sm font-semibold text-purple-700">{dateGroup.date}</span>
      <span className="text-xs text-gray-500">({dateGroup.items.length})</span>
    </div>

    <div className="grid grid-cols-3 gap-2">
      {dateGroup.items.map((item) => (
        <GalleryItem
          key={item.id}
          item={item}
          isFavorite={isFavoriteItem(item.id)}
          onToggleFavorite={onToggleFavorite}
          onImageClick={onImageClick}
          onVideoClick={onVideoClick}
        />
      ))}
    </div>
  </div>
));

DateGroup.displayName = 'DateGroup';

function GalleryGrid({ 
  displayData, 
  filterType, 
  isFavoriteItem, 
  onToggleFavorite, 
  onImageClick, 
  onVideoClick 
}) {
  if (displayData.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-2">
          {filterType === 'video' ? <Video className="w-16 h-16 mx-auto" /> :
           <Image className="w-16 h-16 mx-auto" />}
        </div>
        <p className="text-gray-500 font-semibold">
          {filterType === 'video' ? 'Chưa có video nào' : 'Chưa có ảnh nào'}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 pb-8">
      {displayData.map((dateGroup) => (
        <DateGroup
          key={dateGroup.date}
          dateGroup={dateGroup}
          isFavoriteItem={isFavoriteItem}
          onToggleFavorite={onToggleFavorite}
          onImageClick={onImageClick}
          onVideoClick={onVideoClick}
        />
      ))}
    </div>
  );
}

export default memo(GalleryGrid);