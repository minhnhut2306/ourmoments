import { useState, useCallback } from 'react';
import { uploadMedia, getImageMedia, getVideoMedia, deleteMedia } from '../api/mediaApi';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 99 * 1024 * 1024; // 99MB (updated)

function useGalleryAPI() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [deleting, setDeleting] = useState(false);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  }, []);

  // Load images with pagination
  const loadImages = useCallback(async (page = 1, limit = 20) => {
    try {
      console.log(`📥 Loading images page ${page}...`);
      
      const response = await getImageMedia(page, limit);

      if (response.status === 'success') {
        const imageList = response.data.media.map(media => ({
          id: media._id,
          type: media.type,
          url: media.url,
          thumbnail: media.thumbnail || media.url,
          publicId: media.publicId,
          name: `${media.type}_${media._id}`,
          createdAt: media.createdAt
        }));
        
        console.log(`✅ Loaded ${imageList.length} images (page ${page})`);
        
        return {
          data: imageList,
          hasMore: response.data.pagination.page < response.data.pagination.totalPages,
          total: response.data.pagination.total
        };
      }
      
      return { data: [], hasMore: false, total: 0 };
    } catch (error) {
      console.error('❌ Load images error:', error);
      throw error;
    }
  }, []);

  // Load videos with pagination
  const loadVideos = useCallback(async (page = 1, limit = 20) => {
    try {
      console.log(`📥 Loading videos page ${page}...`);
      
      const response = await getVideoMedia(page, limit);

      if (response.status === 'success') {
        const videoList = response.data.media.map(media => ({
          id: media._id,
          type: media.type,
          url: media.url,
          thumbnail: media.thumbnail || media.url,
          publicId: media.publicId,
          name: `${media.type}_${media._id}`,
          createdAt: media.createdAt
        }));
        
        console.log(`✅ Loaded ${videoList.length} videos (page ${page})`);
        
        return {
          data: videoList,
          hasMore: response.data.pagination.page < response.data.pagination.totalPages,
          total: response.data.pagination.total
        };
      }
      
      return { data: [], hasMore: false, total: 0 };
    } catch (error) {
      console.error('❌ Load videos error:', error);
      throw error;
    }
  }, []);

  const handleUploadFiles = async (files) => {
    const validFiles = [];
    const rejectedFiles = [];

    Array.from(files).forEach((file) => {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);

      if (isImage && file.size > MAX_IMAGE_SIZE) {
        rejectedFiles.push({ name: file.name, size: fileSizeMB, type: 'image' });
      } else if (isVideo && file.size > MAX_VIDEO_SIZE) {
        rejectedFiles.push({ name: file.name, size: fileSizeMB, type: 'video' });
      } else {
        validFiles.push(file);
      }
    });

    if (rejectedFiles.length > 0) {
      const msg = rejectedFiles.map(f => {
        const limit = f.type === 'image' ? '10MB' : '99MB';
        return `${f.name} (${f.size}MB > ${limit})`;
      }).join(', ');
      showToast(`File quá lớn: ${msg}`, 'error');
    }

    if (validFiles.length === 0) {
      return false;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      
      const totalFiles = validFiles.length;
      const fileProgress = {};
      
      validFiles.forEach((_, index) => {
        fileProgress[index] = 0;
      });

      const updateTotalProgress = () => {
        const total = Object.values(fileProgress).reduce((sum, val) => sum + val, 0);
        const avgProgress = Math.round(total / totalFiles);
        setUploadProgress(avgProgress);
      };

      const uploadPromises = validFiles.map(async (file, index) => {
        try {
          const result = await uploadMedia(file, (progress) => {
            fileProgress[index] = progress;
            updateTotalProgress();
          });
          return result;
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
          return null;
        }
      });

      const results = await Promise.all(uploadPromises);
      const successCount = results.filter(r => r && r.status === 'success').length;
      const failedCount = validFiles.length - successCount;
      
      if (successCount > 0) {
        setUploadProgress(100);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (failedCount > 0) {
          showToast(`Đã tải lên ${successCount}/${validFiles.length} file! (${failedCount} file lỗi)`, 'warning');
        } else {
          showToast(`✅ Đã tải lên ${successCount} file thành công!`, 'success');
        }
        
        return true;
      } else {
        showToast('❌ Tất cả file đều lỗi khi upload', 'error');
        return false;
      }
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Lỗi tải lên file', 'error');
      return false;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteMedia = async (mediaId) => {
    try {
      setDeleting(true);
      const response = await deleteMedia(mediaId);
      
      if (response.status === 'success') {
        showToast('Đã xóa media', 'success');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Delete media error:', error);
      showToast('Lỗi xóa media', 'error');
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return {
    loadImages,
    loadVideos,
    uploading,
    uploadProgress,
    deleting,
    toast,
    handleUploadFiles,
    handleDeleteMedia
  };
}

export { useGalleryAPI };