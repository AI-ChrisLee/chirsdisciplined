import { User, DailyProtocol, VoiceRecording, VisionBoardItem, ViolentAction } from '@/types';

export const mockUser: User = {
  id: '1',
  name: 'Chris Disciplined',
  email: 'chris@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris',
  currentDay: 7,
  streak: 7,
  joinDate: '2024-01-01'
};

export const mockProtocols: DailyProtocol[] = [
  { id: '1', title: 'Vision Review', completed: false, order: 1 },
  { id: '2', title: 'Record Affirmations', completed: false, order: 2 },
  { id: '3', title: 'Set Violent Actions', completed: false, order: 3 },
];

export const mockRecordings: VoiceRecording[] = [
  {
    id: '1',
    date: '2024-01-07',
    duration: 600,
    transcript: 'I am building the global standard for success programming. My vision is clear and my actions are deliberate.',
    audioUrl: '#'
  },
  {
    id: '2',
    date: '2024-01-06',
    duration: 540,
    transcript: 'Today I commit to taking massive action. I am unstoppable in my pursuit of excellence.',
    audioUrl: '#'
  }
];

export const mockVisionBoard: VisionBoardItem[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400',
    caption: 'CEO of $100M Company',
    category: 'financial'
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
    caption: 'Dream Home in California',
    category: 'lifestyle'
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400',
    caption: 'Happy Family Life',
    category: 'relationship'
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    caption: 'Peak Physical Condition',
    category: 'health'
  }
];

export const mockViolentActions: ViolentAction[] = [
  { id: '1', title: 'Close 3 high-ticket sales calls', completed: false, priority: 'high', targetTime: '10:00 AM' },
  { id: '2', title: 'Complete product launch sequence', completed: false, priority: 'high', targetTime: '2:00 PM' },
  { id: '3', title: 'Record podcast episode', completed: false, priority: 'medium', targetTime: '4:00 PM' },
];