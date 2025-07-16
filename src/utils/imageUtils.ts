export const compressImage = async (file, options = {}) => {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
    type = 'image/jpeg',
    stripMetadata = true
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    
    reader.onload = async (event) => {
      try {
        // Create a blob from the array buffer
        const blob = new Blob([event.target.result], { type: file.type });
        const blobUrl = URL.createObjectURL(blob);
        
        const img = new Image();
        img.src = blobUrl;
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions maintaining aspect ratio
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        
        // Use white background (for PNG transparency)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        
        // This is the key part - drawing to canvas strips metadata
        ctx.drawImage(img, 0, 0, width, height);
        
        // Clean up the blob URL
        URL.revokeObjectURL(blobUrl);
        
        // Convert to blob with stripped metadata
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          type,
          quality
        );
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
  });
}; 