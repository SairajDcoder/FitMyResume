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
}

export function analyzeResources(
  input: ResourceInput
): ResourceEvidence {
  let boost = 0;
  const notes: string[] = [];

  // GitHub
  let githubSignal: ResourceEvidence["githubSignal"] = "none";

  if (input.githubUrl) {
    githubSignal = "weak";
    boost += 5;
    notes.push("GitHub profile provided");

    // You can later replace this with real GitHub API checks
  } else {
    notes.push("No GitHub profile provided");
  }

  // Publications
  let publicationSignal: ResourceEvidence["publicationSignal"] = "none";

  if (input.publications && input.publications.length > 0) {
    publicationSignal = "weak";
    boost += 3;
    notes.push("Publications listed");
  }

  return {
    githubReviewed: Boolean(input.githubUrl),
    githubSignal,
    publicationSignal,
    evidenceBoost: Math.min(boost, 10),
    notes
  };
}
