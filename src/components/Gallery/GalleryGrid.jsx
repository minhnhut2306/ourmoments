import { Calendar, Heart, Play, Image, Video, X } from 'lucide-react';
import { memo } from 'react';

const GalleryItem = memo(({ item, isFavorite, onToggleFavorite, onImageClick, onVideoClick, onDelete }) => {
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

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(item);
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
              loading="lazy"
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

          {/* Delete button for video - top right */}
          <button
            onClick={handleDeleteClick}
            className="absolute top-0.5 right-0.5 p-0.5 transition-all z-20 active:scale-95"
            title="Xóa video"
          >
            <X 
              className="w-6 h-6 text-red-500" 
              strokeWidth={3}
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
            />
          </button>
        </>
      ) : (
        <>
          <img
            src={item.url}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300"
            loading="lazy"
          />
          
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Favorite button - top left */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-0.5 left-0.5 p-0.5 transition-all z-20 active:scale-95"
            title={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFavorite ? 'text-red-500' : 'text-white'
              }`}
              strokeWidth={2}
              fill={isFavorite ? '#ef4444' : 'none'}
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
            />
          </button>

          {/* Delete button - top right */}
          <button
            onClick={handleDeleteClick}
            className="absolute top-0.5 right-0.5 p-0.5 transition-all z-20 active:scale-95"
            title="Xóa ảnh"
          >
            <X 
              className="w-6 h-6 text-red-500" 
              strokeWidth={3}
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
            />
          </button>
        </>
      )}
    </div>
  );
});

GalleryItem.displayName = 'GalleryItem';

const DateGroup = memo(({ dateGroup, isFavoriteItem, onToggleFavorite, onImageClick, onVideoClick, onDelete }) => (
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
          onDelete={onDelete}
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
  onVideoClick,
  onDelete
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
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default memo(GalleryGrid);