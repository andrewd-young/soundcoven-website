import React, { useState } from 'react';
import { DEFAULT_PROFILE_IMAGE } from '../constants/images';

const ImageUpload = ({ onImageChange, label = "Professional Photo (best photo) of you/your band (PDF, Document or Image)" }) => {
  const [previewUrl, setPreviewUrl] = useState(DEFAULT_PROFILE_IMAGE);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageChange(e);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-2">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <div className="w-32 h-32 rounded-lg overflow-hidden border border-white">
          <img
            src={previewUrl}
            alt="Profile preview"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-grow">
          <input
            type="file"
            name="photo"
            accept=".pdf,.doc,.docx,image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 bg-[#432347] border border-white rounded"
          />
          <p className="text-sm text-gray-400 mt-1">
            Upload 1 supported file: PDF, document, or image. Max 100 MB.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload; 