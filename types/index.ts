export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  currentDay: number;
  streak: number;
  joinDate: string;
}

export interface DailyProtocol {
  id: string;
  title: string;
  completed: boolean;
  order: number;
}

export interface VoiceRecording {
  id: string;
  date: string;
  duration: number;
  transcript: string;
  audioUrl: string;
}

export interface VisionBoardItem {
  id: string;
  imageUrl: string;
  caption: string;
  category: 'financial' | 'lifestyle' | 'relationship' | 'health';
}

export interface ViolentAction {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  targetTime: string;
}