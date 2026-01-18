import { useState, useEffect, useCallback } from 'react';
import {
  uploadMedia,
  getAllMedia,
  getImageMedia,
  getVideoMedia,
  deleteMedia
} from '../api/mediaApi';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_FAVORITES = 5;

function useGalleryAPI() {
  const [galleryData, setGalleryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // ==================== TOAST ====================
  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  }, []);

  // ==================== LOAD DATA ====================
  
  /**
   * Load all media and group by date
   */
  const loadGalleryData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllMedia(null, 1, 1000); // Load tất cả

      if (response.status === 'success') {
        const mediaList = response.data.media;
        
        // Group by date
        const grouped = groupMediaByDate(mediaList);
        setGalleryData(grouped);
      }
    } catch (error) {
      console.error('Load gallery error:', error);
      showToast('Lỗi tải dữ liệu', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Load data on mount
  useEffect(() => {
    loadGalleryData();
  }, [loadGalleryData]);

  // ==================== UPLOAD FILES ====================
  
  /**
   * Upload multiple files với progress tracking
   */
  const handleUploadFiles = async (files) => {
    const validFiles = [];
    const rejectedFiles = [];

    // Validate file size
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
        const limit = f.type === 'image' ? '10MB' : '100MB';
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
      const fileProgress = {}; // Track progress của từng file
      
      // Khởi tạo progress cho mỗi file
      validFiles.forEach((_, index) => {
        fileProgress[index] = 0;
      });

      // Hàm tính tổng progress
      const updateTotalProgress = () => {
        const total = Object.values(fileProgress).reduce((sum, val) => sum + val, 0);
        const avgProgress = Math.round(total / totalFiles);
        setUploadProgress(avgProgress);
      };

      // Upload từng file với progress tracking
      const uploadPromises = validFiles.map(async (file, index) => {
        const result = await uploadMedia(file, (progress) => {
          fileProgress[index] = progress;
          updateTotalProgress();
        });
        return result;
      });

      const results = await Promise.all(uploadPromises);

      const successCount = results.filter(r => r.status === 'success').length;
      
      if (successCount > 0) {
        setUploadProgress(100); // Đảm bảo hiển thị 100% cuối cùng
        await new Promise(resolve => setTimeout(resolve, 500)); // Delay 0.5s để user thấy 100%
        showToast(`Đã tải lên ${successCount}/${validFiles.length} file!`, 'success');
        await loadGalleryData(); // Reload data
        return true;
      } else {
        showToast('Lỗi tải lên file', 'error');
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

  // ==================== FAVORITES ====================
  
  // REMOVED - Favorites được quản lý bởi useFavorites hook riêng

  // ==================== DELETE MEDIA ====================
  
  /**
   * Delete media
   */
  const handleDeleteMedia = async (mediaId) => {
    try {
      const response = await deleteMedia(mediaId);
      
      if (response.status === 'success') {
        showToast('Đã xóa media', 'success');
        await loadGalleryData();
      }
    } catch (error) {
      console.error('Delete media error:', error);
      showToast('Lỗi xóa media', 'error');
    }
  };

  // ==================== FILTER & GROUP ====================
  
  /**
   * Get filtered data by type
   */
  const getFilteredData = (filterType) => {
    return galleryData.map(group => ({
      ...group,
      items: group.items.filter(item => item.type === filterType)
    })).filter(group => group.items.length > 0);
  };

  /**
   * Get total counts
   */
  const getTotalCounts = () => {
    let images = 0;
    let videos = 0;
    
    galleryData.forEach(group => {
      group.items.forEach(item => {
        if (item.type === 'image') images++;
        else if (item.type === 'video') videos++;
      });
    });
    
    return { images, videos, total: images + videos };
  };

  return {
    galleryData,
    loading,
    uploading,
    uploadProgress,
    toast,
    handleUploadFiles,
    handleDeleteMedia,
    getFilteredData,
    getTotalCounts,
    loadGalleryData
  };
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Group media by date (DD-MM-YYYY)
 */
function groupMediaByDate(mediaList) {
  const grouped = {};

  mediaList.forEach(media => {
    const date = new Date(media.createdAt);
    const dateStr = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;

    if (!grouped[dateStr]) {
      grouped[dateStr] = [];
    }

    grouped[dateStr].push({
      id: media._id,
      type: media.type,
      url: media.url,
      thumbnail: media.thumbnail || media.url,
      publicId: media.publicId,
      name: `${media.type}_${dateStr}_${media._id}`,
      createdAt: media.createdAt
    });
  });

  // Convert to array and sort by date (newest first)
  return Object.entries(grouped)
    .map(([date, items]) => ({
      date,
      items: items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }))
    .sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split('-').map(Number);
      const [dayB, monthB, yearB] = b.date.split('-').map(Number);
      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);
      return dateB - dateA;
    });
}

export { useGalleryAPI };