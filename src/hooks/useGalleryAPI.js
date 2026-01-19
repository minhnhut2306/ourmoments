import { useState, useEffect, useCallback, useMemo } from 'react';
import { uploadMedia, getImageMedia, getVideoMedia, deleteMedia } from '../api/mediaApi';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

function useGalleryAPI() {
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  }, []);

  const loadGalleryData = useCallback(async () => {
    try {
      setLoading(true);
      
      console.log('📥 Loading gallery data...');
      
      const [imagesResponse, videosResponse] = await Promise.all([
        getImageMedia(1, 100),
        getVideoMedia(1, 100)
      ]);

      if (imagesResponse.status === 'success') {
        const imageList = imagesResponse.data.media;
        const groupedImages = groupMediaByDate(imageList);
        console.log(`✅ Loaded ${imageList.length} images`);
        setImages(groupedImages);
      }

      if (videosResponse.status === 'success') {
        const videoList = videosResponse.data.media;
        const groupedVideos = groupMediaByDate(videoList);
        console.log(`✅ Loaded ${videoList.length} videos`);
        setVideos(groupedVideos);
      }
    } catch (error) {
      console.error('❌ Load gallery error:', error);
      showToast('Lỗi tải dữ liệu', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadGalleryData();
  }, [loadGalleryData]);

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
        
        if (failedCount > 0) {
          showToast(`Đã tải lên ${successCount}/${validFiles.length} file! (${failedCount} file lỗi)`, 'warning');
        } else {
          showToast(`✅ Đã tải lên ${successCount} file thành công!`, 'success');
        }
        
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

  const totalCounts = useMemo(() => {
    let imageCount = 0;
    let videoCount = 0;
    
    images.forEach(group => {
      imageCount += group.items.length;
    });
    
    videos.forEach(group => {
      videoCount += group.items.length;
    });
    
    return { 
      images: imageCount, 
      videos: videoCount, 
      total: imageCount + videoCount 
    };
  }, [images, videos]);

  return {
    images,
    videos,
    loading,
    uploading,
    uploadProgress,
    toast,
    handleUploadFiles,
    handleDeleteMedia,
    totalCounts,
    loadGalleryData
  };
}

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