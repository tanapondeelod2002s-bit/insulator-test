import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, InsulatorStatus, SeverityLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeInsulatorImage = async (file: File): Promise<AnalysisResult> => {
  try {
    const imagePart = await fileToGenerativePart(file);

    const prompt = `
      คุณคือผู้เชี่ยวชาญด้านวิศวกรรมไฟฟ้าและการตรวจสอบอุปกรณ์ระบบจำหน่ายไฟฟ้า (Patrol Officer)
      หน้าที่ของคุณคือวิเคราะห์ภาพถ่ายของลูกถ้วยไฟฟ้า (Electrical Insulator)
      
      กรุณาวิเคราะห์ภาพนี้และระบุข้อมูลดังต่อไปนี้:
      
      1. สถานะหลัก (Status) เลือก 1 อย่าง:
         - NORMAL (ปกติ)
         - FLASHOVER (เกิด Flashover/รอยไหม้)
         - BROKEN (แตกหัก/บิ่น)
         - DIRTY (สกปรก/มีคราบ)
         - CORROSION (สนิมกัดกร่อน)
         - UNCLEAR (ไม่ชัดเจน)
         
      2. ระดับความรุนแรง (Severity):
         - HIGH: อันตราย, เสียหายหนัก, แตกหัก, หรือมีรอยไหม้ชัดเจน (ต้องแก้ไขทันที)
         - MEDIUM: เสียหายปานกลาง, มีสนิมมาก, หรือสกปรกมากจนอาจเกิด Flashover (ควรวางแผนแก้ไข)
         - LOW: เสียหายเล็กน้อย, สกปรกเล็กน้อย, หรือสนิมเริ่มเกาะ (เฝ้าระวัง)
         - NORMAL: สภาพปกติ (ไม่ต้องดำเนินการ)
         
      3. จุดสังเกตที่พบ (Detected Issues):
         - ระบุสิ่งที่พบเป็นรายการสั้นๆ ภาษาไทย เช่น "รอยไหม้ที่ปีกนก", "รอยบิ่นที่ขอบ", "คราบสนิมที่สลัก", "ฝุ่นเกาะหนา"

      ให้คำตอบเป็น JSON เท่านั้น พร้อมคำอธิบายและคำแนะนำ
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
            imagePart,
            { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: {
              type: Type.STRING,
              enum: [
                InsulatorStatus.NORMAL,
                InsulatorStatus.FLASHOVER,
                InsulatorStatus.BROKEN,
                InsulatorStatus.DIRTY,
                InsulatorStatus.CORROSION,
                InsulatorStatus.UNCLEAR
              ],
              description: "The condition status of the insulator."
            },
            severity: {
              type: Type.STRING,
              enum: [
                SeverityLevel.NORMAL,
                SeverityLevel.LOW,
                SeverityLevel.MEDIUM,
                SeverityLevel.HIGH
              ],
              description: "The severity level of the issue."
            },
            confidence: {
              type: Type.NUMBER,
              description: "Confidence score between 0 and 100."
            },
            description: {
              type: Type.STRING,
              description: "Detailed description of the observation in Thai."
            },
            recommendation: {
              type: Type.STRING,
              description: "Actionable recommendation for the patrol officer in Thai."
            },
            detectedIssues: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of specific visual issues detected in Thai."
            }
          },
          required: ["status", "severity", "confidence", "description", "recommendation", "detectedIssues"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from AI");
    }

    return JSON.parse(resultText) as AnalysisResult;

  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("เกิดข้อผิดพลาดในการวิเคราะห์ภาพ กรุณาลองใหม่อีกครั้ง");
  }
};