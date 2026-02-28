import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check } from 'lucide-react';
import imageCompression from 'browser-image-compression';

const ImageCropper = ({ image, onCancel, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        async (blob) => {
          const compressedFile = await compressImage(blob);
          resolve(compressedFile);
        },
        'image/jpeg',
        0.95 
      );
    });
  };

  const compressImage = async (blob) => {
    const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
    
    const options = {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 500,
      useWebWorker: true,
      fileType: 'image/jpeg'
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Compression error:', error);
      return file; 
    }
  };

  const handleCropConfirm = async () => {
    try {
      if (!croppedAreaPixels) return;
      
      const croppedFile = await getCroppedImg(image, croppedAreaPixels);
      onCropComplete(croppedFile);
    } catch (e) {
      console.error('Error cropping image:', e);
    }
  };

  return (
    <>
      
      <div className="fixed inset-0 z-[9999] overflow-hidden">
       
        <div className="absolute inset-0 bg-black/90" onClick={onCancel}></div>
        
        
        <div className="absolute inset-0 flex justify-center p-4">
          <div 
            className="relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Crop Image</h3>
              <button 
                onClick={onCancel}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Cropper area */}
            <div className="relative h-[400px] w-full bg-gray-950">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropCompleteHandler}
                onZoomChange={setZoom}
                classes={{
                  containerClassName: 'absolute inset-0',
                  mediaClassName: 'object-contain',
                }}
              />
            </div>
            
            {/* Zoom control */}
            <div className="px-6 py-4 border-t border-gray-800">
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400">Zoom</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-xs text-gray-400 w-8 text-right">{zoom.toFixed(1)}x</span>
              </div>
            </div>

            {/* Action buttons  */}
            <div className="px-6 py-4 bg-gray-900 flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={handleCropConfirm}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Check size={18} />
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS to prevent body scroll when cropper is open */}
      <style>{`
        body.modal-open {
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default ImageCropper;