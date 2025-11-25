export enum InsulatorStatus {
  NORMAL = 'NORMAL',
  FLASHOVER = 'FLASHOVER',
  BROKEN = 'BROKEN',
  DIRTY = 'DIRTY',
  CORROSION = 'CORROSION',
  UNCLEAR = 'UNCLEAR'
}

export enum SeverityLevel {
  NORMAL = 'NORMAL', // ปกติ
  LOW = 'LOW',       // ต่ำ (เฝ้าระวัง)
  MEDIUM = 'MEDIUM', // ปานกลาง (ควรวางแผนแก้ไข)
  HIGH = 'HIGH'      // สูง (อันตราย/แก้ไขทันที)
}

export interface AnalysisResult {
  status: InsulatorStatus;
  severity: SeverityLevel;
  confidence: number;
  description: string;
  recommendation: string;
  detectedIssues: string[];
}

export interface ImageFile {
  file: File;
  previewUrl: string;
}