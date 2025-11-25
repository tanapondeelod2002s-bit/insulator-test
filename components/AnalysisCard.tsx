import React from 'react';
import { AnalysisResult, InsulatorStatus, SeverityLevel } from '../types';
import { CheckCircle, Zap, XCircle, HelpCircle, AlertCircle, Wrench, AlertTriangle, Info } from 'lucide-react';

interface AnalysisCardProps {
  result: AnalysisResult;
  onReset: () => void;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ result, onReset }) => {
  const getStatusConfig = (status: InsulatorStatus) => {
    switch (status) {
      case InsulatorStatus.NORMAL:
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: <CheckCircle className="w-12 h-12 text-green-500" />,
          label: 'ปกติ (Normal)',
          headerGradient: 'from-green-400 to-green-500',
          barColor: 'bg-green-400'
        };
      case InsulatorStatus.FLASHOVER:
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          text: 'text-purple-900',
          icon: <Zap className="w-12 h-12 text-purple-500" />,
          label: 'เกิด Flashover',
          headerGradient: 'from-purple-400 to-purple-600',
          barColor: 'bg-purple-500'
        };
      case InsulatorStatus.BROKEN:
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-900',
          icon: <XCircle className="w-12 h-12 text-red-500" />,
          label: 'แตกหัก (Broken)',
          headerGradient: 'from-red-400 to-red-500',
          barColor: 'bg-red-500'
        };
      case InsulatorStatus.DIRTY:
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-900',
          icon: <AlertCircle className="w-12 h-12 text-yellow-500" />,
          label: 'สกปรก/มีคราบ (Dirty)',
          headerGradient: 'from-yellow-400 to-amber-500',
          barColor: 'bg-yellow-500'
        };
      case InsulatorStatus.CORROSION:
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-orange-900',
          icon: <Wrench className="w-12 h-12 text-orange-500" />,
          label: 'มีสนิม (Corrosion)',
          headerGradient: 'from-orange-400 to-orange-500',
          barColor: 'bg-orange-500'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          icon: <HelpCircle className="w-12 h-12 text-gray-400" />,
          label: 'ไม่ชัดเจน (Unclear)',
          headerGradient: 'from-gray-400 to-gray-500',
          barColor: 'bg-gray-400'
        };
    }
  };

  const getSeverityConfig = (severity: SeverityLevel) => {
    switch (severity) {
      case SeverityLevel.HIGH:
        return { label: 'CRITICAL / สูง', color: 'bg-red-100 text-red-700 border-red-200', icon: <AlertTriangle className="w-4 h-4" /> };
      case SeverityLevel.MEDIUM:
        return { label: 'MODERATE / ปานกลาง', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: <AlertCircle className="w-4 h-4" /> };
      case SeverityLevel.LOW:
        return { label: 'LOW / ต่ำ', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: <Info className="w-4 h-4" /> };
      default:
        return { label: 'NORMAL / ปกติ', color: 'bg-green-100 text-green-700 border-green-200', icon: <CheckCircle className="w-4 h-4" /> };
    }
  };

  const config = getStatusConfig(result.status);
  const severityConfig = getSeverityConfig(result.severity);

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in-up border border-white ring-1 ring-gray-100">
      <div className={`bg-gradient-to-r ${config.headerGradient} p-6 flex flex-col items-center justify-center relative`}>
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <h2 className="text-white text-2xl font-bold tracking-wide relative z-10 shadow-black/5 drop-shadow-md">{config.label}</h2>
        <div className={`mt-3 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border ${severityConfig.color} bg-white/90 backdrop-blur-sm relative z-10`}>
          {severityConfig.icon}
          <span>Severity: {severityConfig.label}</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="mb-3 p-4 rounded-full bg-gray-50 shadow-inner border border-gray-100">
            {config.icon}
          </div>
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Confidence Score
          </span>
          <div className="flex items-center gap-2 w-full max-w-[200px] mt-1">
             <span className="text-xs font-bold text-gray-400">0</span>
             <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
               <div 
                 className={`h-full rounded-full ${config.barColor} transition-all duration-1000 ease-out`} 
                 style={{ width: `${result.confidence}%` }}
               ></div>
             </div>
             <span className="text-xs font-bold text-gray-600">{result.confidence}%</span>
          </div>
        </div>

        <div className="space-y-5">
          
          {/* Detected Issues Tags */}
          {result.detectedIssues && result.detectedIssues.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {result.detectedIssues.map((issue, index) => (
                <span key={index} className="px-3 py-1.5 rounded-xl bg-gray-100 border border-gray-200 text-gray-600 text-xs font-semibold shadow-sm">
                  • {issue}
                </span>
              ))}
            </div>
          )}

          <div className={`p-5 rounded-2xl border ${config.bg} ${config.border}`}>
            <h3 className={`font-bold mb-2 ${config.text}`}>ผลการวิเคราะห์</h3>
            <p className="text-sm leading-relaxed text-gray-700">{result.description}</p>
          </div>

          <div className="p-5 bg-indigo-50 text-indigo-900 rounded-2xl border border-indigo-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Info className="w-16 h-16" />
            </div>
            <h3 className="font-bold mb-2 flex items-center gap-2 text-indigo-700 relative z-10">
              <span className="text-xl">💡</span> คำแนะนำ (Recommendation)
            </h3>
            <p className="text-sm leading-relaxed text-indigo-800/90 relative z-10">{result.recommendation}</p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="mt-8 w-full py-4 px-4 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-black hover:to-gray-900 text-white rounded-xl font-bold transition-all shadow-lg shadow-gray-300 hover:shadow-xl active:transform active:scale-95"
        >
          ตรวจสอบรายการใหม่
        </button>
      </div>
    </div>
  );
};

export default AnalysisCard;