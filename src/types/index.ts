// Enums
export enum SkillType {
  Marketing = 'Marketing',
  Finance = 'Finance',
  Management = 'Management',
  Leadership = 'Leadership',
  Communication = 'Communication',
  Sales = 'Sales'
}

export enum LevelStatus {
  Locked = 'Locked',
  Available = 'Available',
  Completed = 'Completed'
}

// User-related types
export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  settings: UserSettings;
  role: 'user' | 'admin';
  disabled?: boolean;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  emailNotificationsEnabled?: boolean; // Optional field
}

// Progress-related types
export interface UserProgress {
  userId: string;
  currentLevelId: string;
  completedLevelIds: string[];
  watchedVideoIds: string[];
  completedTestIds: string[];
  downloadedArtifactIds: string[];
  skillProgress: Record<SkillType, number>;
  badges: Badge[];
  lastUpdated: Date;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  earnedAt: Date;
}

// Content-related types
export interface Level {
  id: string;
  title: string;
  description: string;
  order: number;
  videoContent: VideoContent[];
  tests: Test[];
  relatedArtifactIds: string[];
  completionCriteria: CompletionCriteria;
  skillFocus: SkillType[];
}

export interface VideoContent {
  id: string;
  title: string;
  url: string;
  duration: number;
  watched?: boolean; // client-side property
}

export interface Test {
  id: string;
  title: string;
  questions: Question[];
  completed?: boolean; // client-side property
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'single-choice' | 'text';
  options?: string[];
  correctAnswer: string | string[];
}

export interface CompletionCriteria {
  videosRequired: number;
  testsRequired: number;
}

export interface Artifact {
  id: string;
  title: string;
  description: string;
  fileURL: string;
  fileName: string;
  fileType: string;
  levelId: string;
  downloadCount: number;
  uploadedAt: string;
  downloaded?: boolean; // client-side property
  tags?: string[]; // Optional array of tags for categorization
  isPublic?: boolean; // Whether the artifact is public or restricted
  downloadUrl?: string; // URL for direct download (may be different from fileURL)
}

// Helper types
export type LevelWithStatus = Level & { status: LevelStatus };

// Chat-related types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Note: Additional types will be added as needed for other features in the application 