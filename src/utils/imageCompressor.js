export async function compressImage(file, maxSizeMB = 10, maxWidthOrHeight = 1920) {
  if (!file.type.startsWith('image/')) {
    return file;
  }

  const originalSizeMB = file.size / (1024 * 1024);
  
  console.log(`📸 Original image: ${file.name} - ${originalSizeMB.toFixed(2)}MB`);

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
        let width = img.width;
        let height = img.height;
        
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
      results.push(file);
    }
  }
  
  return results;
}