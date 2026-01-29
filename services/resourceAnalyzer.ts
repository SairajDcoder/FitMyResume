// services/resourceAnalyzer.ts

export interface ResourceInput {
  githubUrl?: string;
  publications?: string[];
}

export interface ResourceEvidence {
  githubReviewed: boolean;
  githubSignal: "none" | "weak" | "strong";
  publicationSignal: "none" | "weak" | "strong";
  evidenceBoost: number; // -5 to +10
  notes: string[];
  evidenceSummary: string;
}

// services/resourceAnalyzer.ts

export interface ResourceInput {
  githubUrl?: string;
  publications?: string[];
}

export interface ResourceEvidence {
  githubReviewed: boolean;
  githubSignal: "none" | "weak" | "strong";
  publicationSignal: "none" | "weak" | "strong";
  evidenceBoost: number;
  notes: string[];
  evidenceSummary: string;
}

export function analyzeResources(
  input: ResourceInput
): ResourceEvidence {
  let boost = 0;
  const notes: string[] = [];

  let githubSignal: ResourceEvidence["githubSignal"] = "none";
  let publicationSignal: ResourceEvidence["publicationSignal"] = "none";

  // ------------------
  // GitHub logic
  // ------------------
  const hasGithub =
    Boolean(input.githubUrl && input.githubUrl.trim() !== "");

  if (hasGithub) {
    githubSignal = "weak";
    boost += 5;
    notes.push("GitHub profile provided");
  } else {
    notes.push("No GitHub profile provided");
  }

  // ------------------
  // Publications logic
  // ------------------
  const hasPublications =
    Boolean(input.publications && input.publications.length > 0);

  if (hasPublications) {
    publicationSignal = "weak";
    boost += 3;
    notes.push("Publications listed");
  }

  // ------------------
  // Human-readable summary
  // ------------------
  let evidenceSummary = "No external resources were detected.";

  if (hasGithub && hasPublications) {
    evidenceSummary =
      "External resources reviewed: GitHub profile and publications were detected.";
  } else if (hasGithub) {
    evidenceSummary =
      "External resources reviewed: GitHub profile was detected.";
  } else if (hasPublications) {
    evidenceSummary =
      "External resources reviewed: Publications were detected.";
  }

  return {
    githubReviewed: hasGithub,
    githubSignal,
    publicationSignal,
    evidenceBoost: boost,
    notes,
    evidenceSummary
  };
}
