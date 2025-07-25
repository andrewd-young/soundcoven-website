import React, { useState } from "react";

interface ImageUploadProps {
  // eslint-disable-next-line no-unused-vars
    onImageChange: (file: File | null) => void;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageChange, 
  label = "Professional Photo (best photo) of you/your band (PDF, Document or Image)" 
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          setPreviewUrl(result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl("");
    }
    
    onImageChange(file);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type="file"
        accept="image/*,.pdf,.doc,.docx"
        onChange={handleImageChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-covenPurple file:text-white hover:file:bg-covenDarkPurple"
      />
      {previewUrl && (
        <div className="mt-2">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 