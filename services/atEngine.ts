// services/atsEngine.ts

export interface ATSInput {
  requiredSkills: string[];
  candidateSkills: string[];
  minExperience: number;
  candidateExperience: number;
  seniority: "junior" | "mid" | "senior";
  isStudent: boolean;
}


export interface ATSResult {
  score: number;          // 0–100
  rejected: boolean;
  reasons: string[];
}

export function runATS(input: ATSInput): ATSResult {
  let score = 100;
  const reasons: string[] = [];

  // Skill matching
  const matchedSkills = input.requiredSkills.filter(skill =>
    input.candidateSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
  );

  const skillMatchRatio =
    matchedSkills.length / input.requiredSkills.length;

  if (skillMatchRatio < 0.5) {
    score -= 40;
    reasons.push("Less than 50% required skills matched");
  }

  // Experience check
  if (input.candidateExperience < input.minExperience) {
    score -= 30;
    reasons.push("Insufficient professional experience");
  }

  // Seniority mismatch
  if (input.seniority === "senior" && input.isStudent) {
    score -= 50;
    reasons.push("Student profile not suitable for senior role");
  }

  // Clamp score
  score = Math.max(0, score);

  return {
    score,
    rejected: score < 40,
    reasons
  };
}
