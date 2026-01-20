import heic2any from 'heic2any';

// Hàm convert HEIC với error handling tốt hơn
async function convertHeicToJpeg(file) {
  try {
    console.log('🔄 Converting HEIC to JPEG...', file.name);
    
    const convertedBlob = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.9
    });
    
    // heic2any có thể trả về array of blobs, cần xử lý
    const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
    
    const convertedFile = new File(
      [blob],
      file.name.replace(/\.heic$/i, '.jpg'),
      { type: 'image/jpeg', lastModified: Date.now() }
    );
    
    console.log('✅ HEIC converted:', convertedFile.name, convertedFile.size);
    return convertedFile;
  } catch (error) {
    console.error('❌ HEIC conversion error:', error);
    throw error;
  }
}

export async function compressImage(file, maxSizeMB = 10, maxWidthOrHeight = 1920) {
  try {
    // Check và convert HEIC
    const isHeic = file.type === 'image/heic' || 
                   file.type === 'image/heif' ||
                   file.name.toLowerCase().endsWith('.heic') ||
                   file.name.toLowerCase().endsWith('.heif');
    
    if (isHeic) {
      console.log('📸 Detected HEIC file, converting...');
      file = await convertHeicToJpeg(file);
    }
    
    // Kiểm tra file type sau khi convert
    if (!file.type.startsWith('image/')) {
      console.warn('⚠️ Not an image file:', file.type);
      return file;
    }

    const originalSizeMB = file.size / (1024 * 1024);
    
    console.log(`📸 Processing image: ${file.name} - ${originalSizeMB.toFixed(2)}MB`);

    if (originalSizeMB <= maxSizeMB) {
      console.log(`✅ Image is small enough (${originalSizeMB.toFixed(2)}MB), no compression needed`);
      return file;
    }

    console.log(`🔄 Compressing image to under ${maxSizeMB}MB...`);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          
          console.log(`📐 Original dimensions: ${width}x${height}`);
          
          if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
            if (width > height) {
              height = (height / width) * maxWidthOrHeight;
              width = maxWidthOrHeight;
            } else {
              width = (width / height) * maxWidthOrHeight;
              height = maxWidthOrHeight;
            }
          }
          
          console.log(`📐 Resizing to: ${Math.round(width)}x${Math.round(height)}`);
          
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
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
                
                if (compressedSizeMB > maxSizeMB && quality > 0.1) {
                  quality -= 0.1;
                  tryCompress();
                } else {
                  const compressedFile = new File(
                    [blob], 
                    file.name.replace(/\.\w+$/, '.jpg'),
                    { type: 'image/jpeg', lastModified: Date.now() }
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
          console.error('❌ Failed to load image');
          reject(new Error('Không thể tải ảnh'));
        };
        
        img.src = e.target.result;
      };
      
      reader.onerror = () => {
        console.error('❌ Failed to read file');
        reject(new Error('Không thể đọc file'));
      };
      
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('❌ compressImage error:', error);
    throw error;
  }
}

export async function compressImages(files, maxSizeMB = 10, onProgress) {
  const results = [];
  const errors = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    if (onProgress) {
      onProgress(i + 1, files.length);
    }
    
    try {
      console.log(`\n📦 Processing file ${i + 1}/${files.length}: ${file.name}`);
      const compressed = await compressImage(file, maxSizeMB);
      results.push(compressed);
      console.log(`✅ File ${i + 1} processed successfully`);
    } catch (error) {
      console.error(`❌ Failed to process ${file.name}:`, error);
      errors.push({ file: file.name, error: error.message });
    }
  }
  
  if (errors.length > 0) {
    console.error('❌ Errors occurred:', errors);
    const errorMsg = errors.map(e => `${e.file}: ${e.error}`).join('\n');
    alert(`Một số file gặp lỗi:\n${errorMsg}`);
  }
  
  return results;
}