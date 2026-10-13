export type PoomDanGrade = 
  | '1품' 
  | '2품' 
  | '3품' 
  | '4품' 
  | '1단' 
  | '2단' 
  | '3단' 
  | '4단';

export interface StudentCandidate {
  id: string;
  name: string;
  targetGrade: PoomDanGrade;
  testDate?: string;
  photoUrl?: string; // Data URL or external image
  customCheer?: string;
  beltType: 'poom' | 'black'; // poom = red/black collar & belt, black = black belt
  revealed?: boolean;
}

export type ScreenTheme = 'signature-navy' | 'periwinkle' | 'midnight' | 'gold-stadium' | 'pure-clean';

export interface DojangConfig {
  dojangName: string;
  eventTitle: string;
  countdownSeconds: number; // 3 or 5
  soundEnabled: boolean;
  theme: ScreenTheme;
  logoUrl?: string; // Dojang logo as Data URL (PNG keeps transparency)
  autoAdvance: boolean;
  autoAdvanceDelaySec: number;
}
