import { api } from './baseApi';

// ==================== MEDIA API ====================

/**
 * Upload media (image or video) with progress tracking
 */
export const uploadMedia = async (file, onProgress) => {
  try {
    console.log('📤 Starting upload:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      lastModified: new Date(file.lastModified)
    });

    const formData = new FormData();
    formData.append('file', file);

    console.log('📦 FormData created:', {
      hasFile: formData.has('file'),
      entries: Array.from(formData.entries()).map(([key]) => key)
    });

    // ✅ Tăng timeout lên 5 phút cho video
    const isVideo = file.type.startsWith('video/');
    const timeout = isVideo ? 300000 : 60000; // 5 phút cho video, 1 phút cho ảnh

    console.log(`⏱️ Timeout set to: ${timeout / 1000}s`);

    const response = await api.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout, // ✅ Dynamic timeout
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`📊 Upload progress: ${percentCompleted}% (${progressEvent.loaded}/${progressEvent.total} bytes)`);
        if (onProgress) {
          onProgress(percentCompleted);
        }
      },
    });

    console.log('✅ Upload successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Upload failed with detailed error:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received');
      console.error('Request details:', {
        readyState: error.request.readyState,
        status: error.request.status,
        responseURL: error.request.responseURL
      });
    }
    
    console.error('Full error config:', error.config);

    // ✅ Ném lỗi rõ ràng hơn
    if (error.code === 'ECONNABORTED') {
      throw new Error('Upload timeout - Server quá chậm, thử lại sau');
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('Lỗi kết nối mạng - Kiểm tra CORS hoặc backend');
    } else if (error.response?.status === 413) {
      throw new Error('File quá lớn - Vượt giới hạn server');
    } else {
      throw new Error(error.response?.data?.msg || error.message || 'Upload failed');
    }
  }
};

/**
 * Get all media with pagination and type filter
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