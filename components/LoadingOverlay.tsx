import React from 'react';
import { Loader2, Flower } from 'lucide-react';

const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white border-2 border-rose-100 p-8 rounded-3xl shadow-2xl shadow-rose-100/50 flex flex-col items-center max-w-sm w-full mx-4">
        <div className="relative mb-2">
          <div className="absolute inset-0 bg-rose-400 rounded-full animate-ping opacity-20"></div>
          <div className="relative bg-rose-50 p-5 rounded-full shadow-inner border border-rose-100">
            <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
          </div>
          <div className="absolute -bottom-2 -right-2">
             <Flower className="w-6 h-6 text-purple-400 animate-bounce" />
          </div>
        </div>
        <h3 className="mt-6 text-xl font-bold text-gray-800">กำลังวิเคราะห์...</h3>
        <p className="text-rose-400 text-center mt-2 font-medium">
          ระบบ AI กำลังตรวจสอบสภาพลูกถ้วย
          <br />กรุณารอสักครู่ 🌸
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;