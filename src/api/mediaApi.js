import { api } from './baseApi';

// ==================== MEDIA API ====================

/**
 * Upload media (image or video)
 */
export const uploadMedia = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Upload media error:', error);
    throw error;
  }
};

/**
 * Get all media with pagination and type filter
 * @param {string} type - 'image' | 'video' | null
 * @param {number} page
 * @param {number} limit
 */
export const getAllMedia = async (type = null, page = 1, limit = 20) => {
  try {
    const params = { page, limit };
    if (type) params.type = type;

    const response = await api.get('/media', { params });
    return response.data;
  } catch (error) {
    console.error('Get all media error:', error);
    throw error;
  }
};

/**
 * Get only images
 */
export const getImageMedia = async (page = 1, limit = 20) => {
  try {
    const response = await api.get('/media/images', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Get images error:', error);
    throw error;
  }
};

/**
 * Get only videos
 */
export const getVideoMedia = async (page = 1, limit = 20) => {
  try {
    const response = await api.get('/media/videos', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Get videos error:', error);
    throw error;
  }
};

/**
 * Get media by ID
 */
export const getMediaById = async (id) => {
  try {
    const response = await api.get(`/media/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get media by id error:', error);
    throw error;
  }
};

/**
 * Update media
 */
export const updateMedia = async (id, updateData) => {
  try {
    const response = await api.put(`/media/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Update media error:', error);
    throw error;
  }
};

/**
 * Delete media
 */
export const deleteMedia = async (id) => {
  try {
    const response = await api.delete(`/media/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete media error:', error);
    throw error;
  }
};