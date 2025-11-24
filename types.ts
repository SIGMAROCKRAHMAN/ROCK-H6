export interface PostPreview {
  id: string;
  type: 'REEL' | 'IMAGE' | 'CAROUSEL';
  caption: string;
  likes: string;
  comments: string;
  thumbnailUrl?: string; // Placeholder for UI
}

export interface TargetProfile {
  username: string;
  realName: string; // Simulated
  location: string; // Simulated
  ipAddress: string; // Simulated
  riskLevel: 'LOW' | 'MODERATE' | 'CRITICAL' | 'EXTREME' | 'INVALID';
  device: string;
  bio: string;
  email: string; // Simulated/Masked
  phone: string; // Simulated/Masked
  weaknesses: string[];
  recentActivity: string[];
  followers: string; // e.g. "1.2M"
  following: string; // e.g. "450"
  posts: string;     // e.g. "54"
  // New: For Live Verify
  postPreviews?: PostPreview[];
  isVerifiedLive?: boolean;
}

export enum SystemState {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  BREACHING = 'BREACHING',
  DECRYPTING = 'DECRYPTING',
  ACCESS_GRANTED = 'ACCESS_GRANTED',
  ERROR = 'ERROR'
}