export type CaptchaType = 
  | 'text' | 'image-select' | 'orientation' | 'slider' | 'click'
  | 'drag-drop' | 'math' | 'logic' | 'emoji' | 'audio'
  | 'behavioral' | 'memory' | 'puzzle' | 'game' | 'shape'
  | 'color' | 'time' | 'word' | 'qr' | 'ai-detect';

export type RiskLevel = 'low' | 'medium' | 'high';

export type CaptchaState = 'idle' | 'loading' | 'challenge' | 'verifying' | 'success' | 'failed' | 'expired' | 'blocked';

export interface CaptchaChallenge {
  id: string;
  type: CaptchaType;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  data: any;
  answerHash: string;
  rayId: string;
  token: string;
  expiresAt: string;
  attempts: number;
}

export interface CaptchaResult {
  valid: boolean;
  rayId: string;
  reason?: string;
  blocked?: boolean;
  nextRequired?: boolean;
}

export interface RiskScore {
  score: number;
  level: RiskLevel;
  reasons: string[];
}

export interface BehavioralData {
  mouseMovements: { x: number; y: number; t: number }[];
  keyPresses: { key: string; t: number }[];
  scrollEvents: { t: number; dy: number }[];
  timeOnPage: number;
  timeToFirstClick: number;
  clickCount: number;
  focusBlurs: number;
}
