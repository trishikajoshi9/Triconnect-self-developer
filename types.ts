
export enum VibeMood {
  CREATIVE = 'Creative',
  LOGICAL = 'Logical',
  MINIMAL = 'Minimal',
  EXPERIMENTAL = 'Experimental'
}

export interface CodeVibe {
  id: string;
  title: string;
  prompt: string;
  code: string;
  language: string;
  timestamp: number;
}

export interface SkillProgress {
  skill: string;
  level: number; // 0 to 100
  color: string;
}
