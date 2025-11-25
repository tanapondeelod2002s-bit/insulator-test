import React, { useState } from 'react';
import { analyzeInsulatorImage } from './services/geminiService';
import { AnalysisResult, ImageFile } from './types';
import ImageInput from './components/ImageInput';
import AnalysisCard from './components/AnalysisCard';
import LoadingOverlay from './components/LoadingOverlay';
import { Zap, ShieldCheck, Flower } from 'lucide-react';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = async (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setImageFile({ file, previewUrl });
    
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeInsulatorImage(file);
      setAnalysisResult(result);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (imageFile) {
      URL.revokeObjectURL(imageFile.previewUrl);
    }
    setImageFile(null);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50 text-gray-800 pb-12 relative overflow-hidden">
      
      {/* Floral Background Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Flower className="absolute top-[-50px] left-[-50px] w-64 h-64 text-rose-200/40 rotate-12" />
        <Flower className="absolute bottom-[-20px] right-[-20px] w-80 h-80 text-purple-200/40 -rotate-12" />
        <Flower className="absolute top-[20%] right-[10%] w-32 h-32 text-blue-200/30 rotate-45" />
        <Flower className="absolute bottom-[30%] left-[5%] w-24 h-24 text-pink-200/40 -rotate-45" />
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-rose-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-rose-400 to-purple-500 p-2.5 rounded-xl text-white shadow-lg shadow-rose-200">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="font-bold text-xl leading-none text-gray-800">Patrol AI</h1>
              <p className="text-xs text-rose-500 font-medium tracking-wide">Insulator Inspection</p>
            </div>
          </div>
          <div className="bg-green-50 px-3 py-1.5 rounded-full border border-green-200 flex items-center gap-1.5 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span className="text-xs font-bold text-green-700">Ready</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8 relative z-10">
        {isLoading && <LoadingOverlay />}

        <div className="space-y-8">
          {/* Welcome Text */}
          {!imageFile && (
            <div className="text-center space-y-3 mb-8 animate-fade-in">
              <div className="inline-block p-3 rounded-full bg-white shadow-md mb-2">
                 <Flower className="w-8 h-8 text-rose-400 animate-pulse" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">ตรวจสอบลูกถ้วยไฟฟ้า</h2>
              <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                ระบบ AI อัจฉริยะสำหรับวิเคราะห์ความเสียหาย
                <br />
                <span className="text-rose-500 font-medium">Flashover • Broken • Dirty</span>
              </p>
            </div>
          )}

          {/* Image Display */}
          {imageFile && (
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white aspect-video flex items-center justify-center group max-w-md mx-auto ring-1 ring-gray-200">
               <img 
                 src={imageFile.previewUrl} 
                 alt="Insulator Preview" 
                 className="w-full h-full object-contain"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                  <p className="text-white text-sm font-medium bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">Original Image</p>
               </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-start gap-4 max-w-md mx-auto shadow-sm">
               <span className="text-2xl">⚠️</span>
               <div>
                 <p className="font-bold text-lg">เกิดข้อผิดพลาด</p>
                 <p className="text-sm opacity-90">{error}</p>
                 <button 
                   onClick={handleReset}
                   className="mt-3 text-sm font-bold text-red-600 hover:text-red-800 bg-red-100 px-3 py-1 rounded-lg transition-colors"
                 >
                   ลองใหม่อีกครั้ง
                 </button>
               </div>
            </div>
          )}

          {/* Controls */}
          {!analysisResult && !isLoading && !imageFile && (
            <div className="animate-fade-in-up">
              <ImageInput onImageSelected={handleImageSelected} isLoading={isLoading} />
            </div>
          )}

          {/* Result */}
          {analysisResult && (
            <AnalysisCard result={analysisResult} onReset={handleReset} />
          )}
          
          {imageFile && !analysisResult && !isLoading && !error && (
             <div className="text-center text-gray-500 py-8">
               <p className="animate-bounce">กำลังเตรียมข้อมูล...</p>
             </div>
          )}

        </div>
      </main>
      
      {/* Footer */}
      {!imageFile && (
        <footer className="fixed bottom-0 w-full bg-white/60 backdrop-blur-sm border-t border-rose-100 py-4 text-center text-xs text-rose-400 font-medium">
          © {new Date().getFullYear()} Patrol AI System. Designed with 🌸
        </footer>
      )}
    </div>
  );
};

export default App;