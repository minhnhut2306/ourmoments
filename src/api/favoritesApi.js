import { api } from './baseApi';

export const addFavorite = async (mediaId) => {
  try {
    const response = await api.post('/favorites', { mediaId });
    return response.data;
  } catch (error) {
    console.error('Add favorite error:', error);
    throw error;
  }
};

export const getAllFavorites = async (page = 1, limit = 20) => {
  try {
    const response = await api.get('/favorites', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Get all favorites error:', error);
    throw error;
  }
};

export const getFavoriteById = async (id) => {
  try {
    const response = await api.get(`/favorites/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get favorite by id error:', error);
    throw error;
  }
};

export const checkIsFavorite = async (mediaId) => {
  try {
    const response = await api.get(`/favorites/check/${mediaId}`);
    return response.data;
  } catch (error) {
    console.error('Check is favorite error:', error);
    throw error;
  }
};

export const removeFavorite = async (id) => {
  try {
    const response = await api.delete(`/favorites/${id}`);
    return response.data;
  } catch (error) {
    console.error('Remove favorite error:', error);
    throw error;
  }
};

export const removeFavoriteByMediaId = async (mediaId) => {
  try {
    const response = await api.delete(`/favorites/media/${mediaId}`);
    return response.data;
  } catch (error) {
    console.error('Remove favorite by mediaId error:', error);
    throw error;
  }
};