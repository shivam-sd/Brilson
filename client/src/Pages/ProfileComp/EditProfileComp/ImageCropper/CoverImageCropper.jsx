import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, Crop } from 'lucide-react';
import imageCompression from 'browser-image-compression';

const CoverImageCropper = ({ image, onCancel, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [aspect, setAspect] = useState(16/9); // Default to 16:9

  // Available aspect ratios
  const aspectRatios = [
    { value: 16/9, label: '16:9', icon: '🖥️' },
    // { value: 4/3, label: '4:3', icon: '📱' },
    // { value: 1/1, label: '1:1', icon: '⬛' },
    // { value: 2/3, label: '2:3', icon: '📸' },
    // { value: 21/9, label: '21:9', icon: '🎬' },
  ];

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
        
        <div className="absolute inset-0 flex justify-center lg:p-4 md:p-4">
          <div 
            className="relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-900">
              <h3 className="text-center text-lg font-semibold text-white flex items-center gap-2">
                <Crop size={20} className="text-blue-500" />
                Crop Cover Photo
              </h3>
              <button 
                onClick={onCancel}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Aspect Ratio Selector */}
            {/* <div className="px-6 py-3 bg-gray-900 border-b border-gray-800">
              <p className="text-sm text-gray-400 mb-3">Aspect Ratio</p>
              <div className="flex flex-wrap gap-2">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio.label}
                    onClick={() => setAspect(ratio.value)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                      aspect === ratio.value
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-900'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span>{ratio.icon}</span>
                    <span className="font-medium">{ratio.label}</span>
                  </button>
                ))}
              </div>
            </div> */}

            {/* Cropper area */}
            <div className="relative lg:h-[450px] md:h-[450px] h-[390px] w-full bg-gray-950">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                cropShape="rect"
                showGrid={true}
                onCropChange={setCrop}
                onCropComplete={onCropCompleteHandler}
                onZoomChange={setZoom}
                classes={{
                  containerClassName: 'absolute inset-0',
                  mediaClassName: 'object-contain',
                }}
              />
              
              {/* Overlay with aspect ratio label */}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white border border-gray-700">
                {aspectRatios.find(r => r.value === aspect)?.label || `${aspect.toFixed(2)}`}
              </div>
            </div>
            
            {/* Zoom control */}
            <div className="px-6 py-4 border-t border-gray-800 bg-gray-900">
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400">Zoom</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={5}
                  step={0.1}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-xs text-gray-400 w-8 text-right">{zoom.toFixed(1)}x</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="px-6 py-4 bg-gray-900 flex gap-3 border-t border-gray-800">
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

      <style>{`
        body.modal-open {
          overflow: hidden;
        }
        
        /* Custom range input styling */
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        input[type=range]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </>
  );
};

export default CoverImageCropper;