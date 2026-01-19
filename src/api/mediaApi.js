import { api } from './baseApi';

// ========================================
// ⚠️ QUAN TRỌNG: THAY CLOUD NAMES CỦA BẠN
// ========================================
// Lấy từ Cloudinary Dashboard: https://console.cloudinary.com/
// Settings > Account > Cloud name

const CLOUDINARY_IMAGE = {
  cloud_name: 'dcb0icdta', // ← THAY BẰNG CLOUD NAME THẬT
  upload_preset: 'ourmoments_unsigned'  // ← Tạo trong Cloudinary Dashboard
};

const CLOUDINARY_VIDEO = {
  cloud_name: 'dqfida9tv', // ← THAY BẰNG CLOUD NAME THẬT
  upload_preset: 'ourmoments_unsigned'
};

// ========================================
// UPLOAD TRỰC TIẾP LÊN CLOUDINARY
// ========================================
/**
 * Upload file trực tiếp lên Cloudinary (không qua backend)
 * Sau đó lưu metadata vào database
 */
export const uploadMedia = async (file, onProgress) => {
  try {
    console.log('📤 Starting direct Cloudinary upload:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      lastModified: new Date(file.lastModified)
    });

    const isVideo = file.type.startsWith('video/');
    const config = isVideo ? CLOUDINARY_VIDEO : CLOUDINARY_IMAGE;
    
    // 1️⃣ Tạo FormData để upload lên Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', config.upload_preset);
    formData.append('folder', isVideo ? 'ourmoments/videos' : 'ourmoments/images');

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${config.cloud_name}/${isVideo ? 'video' : 'image'}/upload`;

    console.log(`📡 Uploading to: ${cloudinaryUrl}`);

    // 2️⃣ Upload bằng XMLHttpRequest để track progress
    const xhr = new XMLHttpRequest();
    
    return new Promise((resolve, reject) => {
      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded * 100) / e.total);
          console.log(`📊 Cloudinary upload progress: ${percentComplete}%`);
          if (onProgress) {
            onProgress(percentComplete);
          }
        }
      });

      // Upload thành công
      xhr.addEventListener('load', async () => {
        if (xhr.status === 200) {
          try {
            const cloudinaryResult = JSON.parse(xhr.responseText);
            console.log('✅ Cloudinary upload successful:', cloudinaryResult.secure_url);

            // 3️⃣ Lưu metadata vào database (rất nhanh)
            const metadata = {
              url: cloudinaryResult.secure_url,
              type: isVideo ? 'video' : 'image',
              publicId: cloudinaryResult.public_id,
              thumbnail: isVideo ? cloudinaryResult.secure_url.replace(/\.[^.]+$/, '.jpg') : null
            };

            console.log('💾 Saving metadata to database...');
            const response = await api.post('/media/save-metadata', metadata);
            console.log('✅ Metadata saved successfully');
            
            resolve(response.data);
          } catch (error) {
            console.error('❌ Failed to save metadata:', error);
            reject(new Error('Upload thành công nhưng lỗi lưu database'));
          }
        } else {
          reject(new Error(`Cloudinary upload failed: ${xhr.status} ${xhr.statusText}`));
        }
      });

      // Upload lỗi
      xhr.addEventListener('error', () => {
        console.error('❌ Network error during Cloudinary upload');
        reject(new Error('Lỗi kết nối Cloudinary'));
      });

      // Upload bị hủy
      xhr.addEventListener('abort', () => {
        console.warn('⚠️ Upload cancelled');
        reject(new Error('Upload bị hủy'));
      });

      // Gửi request
      xhr.open('POST', cloudinaryUrl);
      xhr.send(formData);
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    throw error;
  }
};

// ========================================
// CÁC HÀM KHÁC (GIỮ NGUYÊN)
// ========================================

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