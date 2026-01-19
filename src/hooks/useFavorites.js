import { useState, useEffect, useCallback } from 'react';
import { addFavorite, getAllFavorites, removeFavoriteByMediaId } from '../api/favoritesApi';

const MAX_FAVORITES = 5;

function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllFavorites(1, 100);
      
      if (response.status === 'success') {
        const favoritesList = response.data.favorites.map(fav => ({
          id: fav._id,
          mediaId: fav.mediaId?._id || fav.mediaId,
          url: fav.url,
          publicId: fav.publicId,
          createdAt: fav.createdAt
        }));
        setFavorites(favoritesList);
      }
    } catch (error) {
      console.error('Load favorites error:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const addToFavorites = async (mediaId) => {
    try {
      const isFav = favorites.some(fav => fav.mediaId === mediaId);
      if (isFav) {
        throw new Error('Ảnh này đã có trong danh sách yêu thích');
      }

      if (favorites.length >= MAX_FAVORITES) {
        throw new Error(`Tối đa ${MAX_FAVORITES} ảnh yêu thích!`);
      }

      const response = await addFavorite(mediaId);
      
      if (response.status === 'success') {
        await loadFavorites();
        return { success: true, message: 'Đã thêm vào yêu thích' };
      }
    } catch (error) {
      console.error('Add to favorites error:', error);
      const errorMsg = error.response?.data?.msg || error.message || 'Lỗi thêm yêu thích';
      return { success: false, message: errorMsg };
    }
  };

  const removeFromFavorites = async (mediaId) => {
    try {
      const response = await removeFavoriteByMediaId(mediaId);
      
      if (response.status === 'success') {
        setFavorites(prev => prev.filter(fav => fav.mediaId !== mediaId));
        return { success: true, message: 'Đã xóa khỏi yêu thích' };
      }
    } catch (error) {
      console.error('Remove from favorites error:', error);
      const errorMsg = error.response?.data?.msg || 'Lỗi xóa yêu thích';
      return { success: false, message: errorMsg };
    }
  };

  const toggleFavorite = async (item) => {
    if (item.type !== 'image') {
      return { success: false, message: 'Chỉ có thể yêu thích ảnh!', type: 'warning' };
    }

    const isFav = favorites.some(fav => fav.mediaId === item.id);

    if (isFav) {
      const result = await removeFromFavorites(item.id);
      return { ...result, type: 'info' };
    } else {
      const result = await addToFavorites(item.id);
      return { ...result, type: result.success ? 'success' : 'warning' };
    }
  };

  const isFavoriteItem = (mediaId) => {
    return favorites.some(fav => fav.mediaId === mediaId);
  };

  return {
    favorites,
    loading,
    isFavoriteItem,
    toggleFavorite,
    loadFavorites,
    getFavoritesCount: () => favorites.length,
    MAX_FAVORITES
  };
}

export { useFavorites };