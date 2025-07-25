export const compressImage = async (file: File, options: { maxWidth?: number; maxHeight?: number; quality?: number; type?: string; stripMetadata?: boolean } = {}) => {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
    type = 'image/jpeg',
  } = options;

  return new Promise<Blob>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    
    reader.onload = async (event) => {
      try {
        if (!event.target?.result) {
          reject(new Error("FileReader did not return a result."));
          return;
        }
        // Create a blob from the array buffer
        const blob = new Blob([event.target.result], { type: file.type });
        const blobUrl = URL.createObjectURL(blob);
        
        const img = new Image();
        img.src = blobUrl;
        
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
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
        if (!ctx) {
          reject(new Error("Could not get 2D context from canvas."));
          return;
        }
        
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
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Canvas toBlob failed."));
            }
          },
          type,
          quality
        );
      } catch {
        reject(new Error("Error compressing image."));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Error reading image."));
    };
  });
}; 