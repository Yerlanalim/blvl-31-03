// Reorganize the types into logical groups

// ======= Enums =======
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

export enum UserRole {
  User = 'user',
  Admin = 'admin'
}

export enum QuestionType {
  MultipleChoice = 'multiple-choice',
  SingleChoice = 'single-choice',
  Text = 'text'
}

// ======= User-related types =======
export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  settings: UserSettings;
  role: UserRole;
  disabled?: boolean;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  emailNotificationsEnabled?: boolean;
}

// ======= Progress-related types =======
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

// ======= Level-related types =======
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
  type: QuestionType;
  options?: string[];
  correctAnswer: string | string[];
}

export interface CompletionCriteria {
  videosRequired: number;
  testsRequired: number;
}

export interface LevelWithStatus extends Level {
  status: LevelStatus;
}

// ======= Artifact-related types =======
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

// ======= Chat-related types =======
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  messages: Pick<ChatMessage, 'role' | 'content'>[];
}

export interface ChatResponse {
  message?: Pick<ChatMessage, 'role' | 'content'>;
  error?: string;
}

// ======= FAQ-related types =======
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

// ======= Common utility types =======
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type WithId<T> = T & { id: string };

export type WithoutId<T> = Omit<T, 'id'>;

export type ClientSideOnly<T> = {
  [P in keyof T]: P extends 'watched' | 'completed' | 'downloaded' ? T[P] : never;
};

export type ServerSideOnly<T> = Omit<T, keyof ClientSideOnly<T>>;

// Type for API success responses
export interface ApiSuccessResponse<T> {
  data: T;
  success: true;
}

// Type for API error responses
export interface ApiErrorResponse {
  error: string;
  success: false;
}

// Combined API response type
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Note: Additional types will be added as needed for other features in the application 