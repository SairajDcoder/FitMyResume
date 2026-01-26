export interface ParsedResume {
  name: string;
  email: string;
  phone: string;
  summary: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    duration: string;
    responsibilities: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
}

export interface ScoringResult {
  score: number;
  strengths: string;
  weaknesses: string;
  reasoning: string;
}

export interface Candidate {
  id: string;
  fileName: string;
  jobId: string; // Relates candidate to a job
  parsedData: ParsedResume | null;
  scoringResult: ScoringResult | null;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}

export interface JobSkill {
  name: string;
  weight: number; // From 1 to 100
}

export interface Job {
  id: string;
  title: string;
  description: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Hybrid';
  experienceLevel: 'Entry' | 'Mid-level' | 'Senior';
  requiredSkills: JobSkill[];
  responsibilities: string[];
  status: 'Draft' | 'Active' | 'Closed';
}

// Represents the authenticated user object
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'HR' | 'Admin'; // Future-proofing for roles
  profilePictureUrl?: string; // Optional field for the avatar
}

// Renamed from UserSettings for clarity, now represents app preferences
export interface AppPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    inApp: boolean;
  };
}

// The old UserSettings is deprecated by the combination of User and AppPreferences
export interface UserSettings extends Pick<User, 'name' | 'email'>, AppPreferences {}