/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { galleryData as initialGalleryData } from '../data/constants';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_FAVORITES = 5;

function useGallery() {
  const [favorites, setFavorites] = useState([]);
  const [galleryData, setGalleryData] = useState(initialGalleryData);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    loadFavorites();
    loadGalleryData();
  }, []);

  const loadFavorites = () => {
    try {
      const result = localStorage.getItem('gallery-favorites');
      if (result) {
        setFavorites(JSON.parse(result));
      }
    } catch (error) {
      console.log('Chưa có ảnh yêu thích');
    }
  };

  const loadGalleryData = () => {
    try {
      const stored = localStorage.getItem('gallery-data');
      if (stored) {
        setGalleryData(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Sử dụng dữ liệu mặc định');
    }
  };

  const saveGalleryData = (data) => {
    try {
      localStorage.setItem('gallery-data', JSON.stringify(data));
      setGalleryData(data);
    } catch (error) {
      console.error('Lỗi lưu dữ liệu:', error);
    }
  };

  const saveFavorites = (newFavorites) => {
    try {
      localStorage.setItem('gallery-favorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Lỗi lưu yêu thích:', error);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const toggleFavorite = (item) => {
    if (item.type !== 'image') {
      showToast('Chỉ có thể yêu thích ảnh!', 'warning');
      return;
    }

    const isFavorite = favorites.some(fav => fav.id === item.id);

    if (isFavorite) {
      const newFavorites = favorites.filter(fav => fav.id !== item.id);
      saveFavorites(newFavorites);
      showToast('Đã xóa khỏi yêu thích', 'info');
    } else {
      if (favorites.length >= MAX_FAVORITES) {
        showToast(`Tối đa ${MAX_FAVORITES} ảnh yêu thích!`, 'warning');
        return;
      }
      const newFavorites = [...favorites, item];
      saveFavorites(newFavorites);
      showToast('Đã thêm vào yêu thích', 'success');
    }
  };

  const isFavoriteItem = (itemId) => {
    return favorites.some(fav => fav.id === itemId);
  };

  const generateVideoThumbnail = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      
      video.onloadeddata = () => {
        video.currentTime = 1;
      };
      
      video.onseeked = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          const thumbnailUrl = URL.createObjectURL(blob);
          resolve(thumbnailUrl);
        }, 'image/jpeg', 0.8);
      };
      
      video.onerror = () => {
        resolve(null);
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const handleUploadFiles = async (files) => {
    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    
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
        const limit = f.type === 'image' ? '10MB' : '100MB';
        return `${f.name} (${f.size}MB > ${limit})`;
      }).join(', ');
      showToast(`File quá lớn: ${msg}`, 'error');
    }
    
    if (validFiles.length === 0) {
      return false;
    }
    
    const newItemsPromises = validFiles.map(async (file, index) => {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      
      let thumbnail = null;
      if (type === 'video') {
        thumbnail = await generateVideoThumbnail(file);
      }
      
      return {
        id: Date.now() + index,
        type: type,
        url: url,
        thumbnail: thumbnail || url,
        name: file.name,
        size: file.size
      };
    });
    
    const newItems = await Promise.all(newItemsPromises);

    const newGalleryData = [...galleryData];
    const todayGroup = newGalleryData.find(g => g.date === dateStr);

    if (todayGroup) {
      todayGroup.items = [...newItems, ...todayGroup.items];
    } else {
      newGalleryData.unshift({
        date: dateStr,
        items: newItems
      });
    }

    saveGalleryData(newGalleryData);
    showToast(`Đã thêm ${newItems.length} file!`, 'success');
    return true;
  };

  const getFilteredData = (filterType) => {
    return galleryData.map(group => ({
      ...group,
      items: group.items.filter(item => item.type === filterType)
    })).filter(group => group.items.length > 0);
  };

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
    favorites,
    galleryData,
    toast,
    toggleFavorite,
    isFavoriteItem,
    handleUploadFiles,
    getFilteredData,
    getTotalCounts,
    MAX_FAVORITES
  };
}

export { useGallery };