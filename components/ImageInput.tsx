import React, { useRef } from 'react';
import { Camera, Upload, Image as ImageIcon, Sparkles } from 'lucide-react';

interface ImageInputProps {
  onImageSelected: (file: File) => void;
  isLoading: boolean;
}

const ImageInput: React.FC<ImageInputProps> = ({ onImageSelected, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageSelected(event.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      {/* Hidden inputs */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main Action Buttons */}
      <button
        onClick={() => cameraInputRef.current?.click()}
        disabled={isLoading}
        className="flex items-center justify-center gap-4 w-full py-5 bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white rounded-2xl shadow-lg shadow-rose-200 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <div className="p-2.5 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors backdrop-blur-sm">
          <Camera className="w-7 h-7" />
        </div>
        <div className="text-left">
          <div className="font-bold text-xl">ถ่ายภาพ</div>
          <div className="text-xs text-rose-100 font-medium">Take Photo (Camera)</div>
        </div>
      </button>

      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-rose-200"></div>
        <span className="flex-shrink-0 mx-4 text-rose-400 text-sm font-medium">หรือ</span>
        <div className="flex-grow border-t border-rose-200"></div>
      </div>

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        className="flex items-center justify-center gap-4 w-full py-5 bg-white hover:bg-rose-50 text-gray-700 border-2 border-rose-100 rounded-2xl shadow-sm transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <div className="p-2.5 bg-rose-50 rounded-xl group-hover:bg-rose-100 transition-colors">
          <Upload className="w-7 h-7 text-rose-400" />
        </div>
        <div className="text-left">
          <div className="font-bold text-xl text-gray-800">อัปโหลดรูปภาพ</div>
          <div className="text-xs text-gray-500">Upload Image</div>
        </div>
      </button>

      <div className="mt-6 p-5 bg-white/80 rounded-2xl border border-rose-100 shadow-sm backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-50 rounded-full">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-sm text-gray-600">
            <p className="font-bold mb-1 text-indigo-900">คำแนะนำในการถ่ายภาพ:</p>
            <ul className="list-disc pl-4 space-y-1.5 text-gray-600/80">
              <li>ถ่ายให้เห็นลูกถ้วยชัดเจนและเต็มใบ</li>
              <li>หลีกเลี่ยงการถ่ายย้อนแสง</li>
              <li>หากเป็นไปได้ ควรถ่ายให้เห็นรอยไหม้หรือรอยแตกชัดเจน</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageInput;