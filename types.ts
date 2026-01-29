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
  jobId: string;
  parsedData: ParsedResume | null;
  scoringResult: ScoringResult | null;

  systemScreeningResult?: SystemScreeningResult | null;

  status: "pending" | "processing" | "completed" | "error";
  error?: string;
}


export type EvidenceReview = {
  githubReviewed: boolean;
  githubSignal: "none" | "weak" | "strong";
  publicationSignal: "none" | "weak" | "strong";
  evidenceBoost: number;
  notes: string[];
}

export type SystemScreeningResult =
  | {
      fitScore: number;
      status: "REJECTED";
      atsReasons: string[];
    }
  | {
      fitScore: number;
      status: "EVALUATED";
      atsScore: number;
      evidenceReview: {
        githubReviewed: boolean;
        githubSignal: "none" | "weak" | "strong";
        publicationSignal: "none" | "weak" | "strong";
        evidenceBoost: number;
        notes: string[];
      };
    };


export interface JobSkill {
  name: string;
  weight: number; // From 1 to 100
}

export interface Job {
  id: string;
  title: string;
  description: string;
  employmentType: "Full-time" | "Part-time" | "Contract" | "Remote" | "Hybrid";
  experienceLevel: "Entry" | "Mid-level" | "Senior";
  requiredSkills: JobSkill[];
  responsibilities: string[];
  status: "Draft" | "Active" | "Closed";
}


// Represents the authenticated user object
export interface User {
  id: string;
  name: string;
  email: string;
  role: "HR" | "Admin"; // Future-proofing for roles
  profilePictureUrl?: string; // Optional field for the avatar
}

// Renamed from UserSettings for clarity, now represents app preferences
export interface AppPreferences {
  theme: "light" | "dark" | "system";
  notifications: {
    email: boolean;
    inApp: boolean;
  };
}

// The old UserSettings is deprecated by the combination of User and AppPreferences
export interface UserSettings
  extends Pick<User, "name" | "email">, AppPreferences {}
