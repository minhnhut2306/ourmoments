/**
 * Tự động nén ảnh nếu quá lớn
 * Sử dụng Canvas API để resize và compress
 */

/**
 * Nén ảnh xuống dưới maxSizeMB
 * @param {File} file - File ảnh gốc
 * @param {number} maxSizeMB - Kích thước tối đa (MB)
 * @param {number} maxWidthOrHeight - Chiều rộng/cao tối đa (px)
 * @returns {Promise<File>} - File ảnh đã nén
 */
export async function compressImage(file, maxSizeMB = 10, maxWidthOrHeight = 1920) {
  // Chỉ nén ảnh, không nén video
  if (!file.type.startsWith('image/')) {
    return file;
  }

  const originalSizeMB = file.size / (1024 * 1024);
  
  console.log(`📸 Original image: ${file.name} - ${originalSizeMB.toFixed(2)}MB`);

  // Nếu ảnh đã nhỏ hơn giới hạn, không cần nén
  if (originalSizeMB <= maxSizeMB) {
    console.log(`✅ Image is already small enough, no compression needed`);
    return file;
  }

  console.log(`🔄 Compressing image to under ${maxSizeMB}MB...`);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Tính toán kích thước mới
        let width = img.width;
        let height = img.height;
        
        // Resize nếu quá lớn
        if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
          if (width > height) {
            height = (height / width) * maxWidthOrHeight;
            width = maxWidthOrHeight;
          } else {
            width = (width / height) * maxWidthOrHeight;
            height = maxWidthOrHeight;
          }
        }
        
        console.log(`📐 Resizing from ${img.width}x${img.height} to ${Math.round(width)}x${Math.round(height)}`);
        
        // Tạo canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress với quality giảm dần cho đến khi đạt maxSize
        let quality = 0.9;
        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Canvas to Blob failed'));
                return;
              }
              
              const compressedSizeMB = blob.size / (1024 * 1024);
              
              console.log(`🔍 Quality ${(quality * 100).toFixed(0)}% → ${compressedSizeMB.toFixed(2)}MB`);
              
              // Nếu vẫn còn quá lớn và quality > 0.1, giảm quality
              if (compressedSizeMB > maxSizeMB && quality > 0.1) {
                quality -= 0.1;
                tryCompress();
              } else {
                // Tạo File mới từ Blob
                const compressedFile = new File(
                  [blob], 
                  file.name.replace(/\.\w+$/, '.jpg'), // Đổi extension thành .jpg
                  { type: 'image/jpeg' }
                );
                
                const finalSizeMB = compressedFile.size / (1024 * 1024);
                const reduction = ((1 - finalSizeMB / originalSizeMB) * 100).toFixed(1);
                
                console.log(`✅ Compressed: ${originalSizeMB.toFixed(2)}MB → ${finalSizeMB.toFixed(2)}MB (giảm ${reduction}%)`);
                
                resolve(compressedFile);
              }
            },
            'image/jpeg',
            quality
          );
        };
        
        tryCompress();
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Batch compress nhiều ảnh
 * @param {File[]} files - Mảng files
 * @param {number} maxSizeMB - Kích thước tối đa mỗi ảnh
 * @param {Function} onProgress - Callback progress (index, total)
 * @returns {Promise<File[]>} - Mảng files đã nén
 */
export async function compressImages(files, maxSizeMB = 10, onProgress) {
  const results = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    if (onProgress) {
      onProgress(i + 1, files.length);
    }
    
    try {
      const compressed = await compressImage(file, maxSizeMB);
      results.push(compressed);
    } catch (error) {
      console.error(`Failed to compress ${file.name}:`, error);
      // Nếu nén lỗi, dùng file gốc
      results.push(file);
    }
  }
  
  return results;
}