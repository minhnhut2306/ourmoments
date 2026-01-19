import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  uploadMedia,
  getAllMedia,
  deleteMedia
} from '../api/mediaApi';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

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
   * ✅ Load media với pagination thông minh
   */
  const loadGalleryData = useCallback(async () => {
    try {
      setLoading(true);
      
      console.log('📥 Loading gallery data...');
      
      // ✅ CHỈ load 100 items thay vì 1000
      const response = await getAllMedia(null, 1, 100);

      if (response.status === 'success') {
        const mediaList = response.data.media;
        const grouped = groupMediaByDate(mediaList);
        
        console.log(`✅ Loaded ${mediaList.length} items, grouped into ${grouped.length} dates`);
        
        setGalleryData(grouped);
      }
    } catch (error) {
      console.error('❌ Load gallery error:', error);
      showToast('Lỗi tải dữ liệu', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // ✅ Load data chỉ 1 lần khi mount
  useEffect(() => {
    loadGalleryData();
  }, [loadGalleryData]);

  // ==================== UPLOAD FILES ====================
  
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
        const limit = f.type === 'image' ? '10MB' : '50MB';
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
        
        // ✅ Show toast trước
        if (failedCount > 0) {
          showToast(`Đã tải lên ${successCount}/${validFiles.length} file! (${failedCount} file lỗi)`, 'warning');
        } else {
          showToast(`✅ Đã tải lên ${successCount} file thành công!`, 'success');
        }
        
        // ✅ Reload data SAU toast (quan trọng!)
        console.log('🔄 Reloading gallery data...');
        await loadGalleryData();
        console.log('✅ Gallery data reloaded!');
        
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

  // ==================== DELETE MEDIA ====================
  
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
   * ✅ useMemo để tránh re-calculate
   */
  const getFilteredData = useCallback((filterType) => {
    return galleryData.map(group => ({
      ...group,
      items: group.items.filter(item => item.type === filterType)
    })).filter(group => group.items.length > 0);
  }, [galleryData]);

  /**
   * ✅ useMemo để cache counts
   */
  const totalCounts = useMemo(() => {
    let images = 0;
    let videos = 0;
    
    galleryData.forEach(group => {
      group.items.forEach(item => {
        if (item.type === 'image') images++;
        else if (item.type === 'video') videos++;
      });
    });
    
    return { images, videos, total: images + videos };
  }, [galleryData]);

  return {
    galleryData,
    loading,
    uploading,
    uploadProgress,
    toast,
    handleUploadFiles,
    handleDeleteMedia,
    getFilteredData,
    totalCounts,
    loadGalleryData
  };
}

// ==================== HELPER FUNCTIONS ====================

/**
 * ✅ Optimized grouping với Map
 */
function groupMediaByDate(mediaList) {
  const grouped = new Map();

  mediaList.forEach(media => {
    const date = new Date(media.createdAt);
    const dateStr = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;

    if (!grouped.has(dateStr)) {
      grouped.set(dateStr, []);
    }

    grouped.get(dateStr).push({
      id: media._id,
      type: media.type,
      url: media.url,
      thumbnail: media.thumbnail || media.url,
      publicId: media.publicId,
      name: `${media.type}_${dateStr}_${media._id}`,
      createdAt: media.createdAt
    });
  });

  // ✅ Convert to array và sort
  return Array.from(grouped.entries())
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