import React from "react";
import { Candidate, SystemScreeningResult } from "../../types";
import {
  XIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon
} from "../icons";

/* ============================
   TYPE GUARDS (IMPORTANT)
============================ */

function isEvaluated(
  result: SystemScreeningResult | null | undefined
): result is Extract<SystemScreeningResult, { status: "EVALUATED" }> {
  return result?.status === "EVALUATED";
}

function isRejected(
  result: SystemScreeningResult | null | undefined
): result is Extract<SystemScreeningResult, { status: "REJECTED" }> {
  return result?.status === "REJECTED";
}


/* ============================
   COMPONENTS
============================ */

interface CandidateProfileProps {
  candidate: Candidate;
  onClose: () => void;
}

const SkillMatchBar: React.FC<{ skill: string; matched: boolean }> = ({
  skill,
  matched
}) => (
  <div className="flex items-center justify-between text-sm">
    <span className={matched ? "text-foreground" : "text-muted-foreground"}>
      {skill}
    </span>
    {matched ? (
      <CheckCircleIcon className="w-5 h-5 text-green-500" />
    ) : (
      <XCircleIcon className="w-5 h-5 text-red-500" />
    )}
  </div>
);

/* ============================
   MAIN FILE
============================ */

const CandidateProfile: React.FC<CandidateProfileProps> = ({
  candidate,
  onClose
}) => {
  const {
  parsedData,
  scoringResult,
  systemScreeningResult,
  error,
  status
} = candidate;


  if (!parsedData) return null;

  // Placeholder skill match logic
  const matchedSkills = new Set(parsedData.skills.slice(0, 5));

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-40"
      />

      {/* PANEL */}
      <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-card z-50 flex flex-col shadow-2xl">

        {/* HEADER */}
        <header className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {parsedData.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {parsedData.email} • {parsedData.phone}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-muted-foreground hover:bg-muted"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </header>

        {/* CONTENT */}
        <main className="flex-grow p-6 overflow-y-auto space-y-6">

          {/* ================= SYSTEM SCREENING ================= */}
{systemScreeningResult && (
  <section className="p-6 rounded-lg border border-blue-300 bg-blue-500/10">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-semibold text-foreground">
        System Screening (ATS)
      </h3>
      <span className="text-2xl font-bold text-blue-600">
        {systemScreeningResult.fitScore}/100
      </span>
    </div>

    <p className="text-sm text-muted-foreground mb-1">
      Status: <strong>{systemScreeningResult.status}</strong>
    </p>

    {/* REJECTED CASE */}
    {isRejected(systemScreeningResult) && (
      <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
        {systemScreeningResult.atsReasons.map((reason, i) => (
          <li key={i}>{reason}</li>
        ))}
      </ul>
    )}

    {/* EVALUATED CASE */}
    {isEvaluated(systemScreeningResult) && (
      <div className="mt-2 text-sm text-muted-foreground space-y-1">
        <p>
          ATS Score: {systemScreeningResult.atsScore}/100
        </p>
        <p>
          GitHub Reviewed:{" "}
          {systemScreeningResult.evidenceReview.githubReviewed
            ? "Yes"
            : "No"}
        </p>
        <p>
          Evidence Boost:{" "}
          {systemScreeningResult.evidenceReview.evidenceBoost}
        </p>
      </div>
    )}
  </section>
)}


          {/* ================= ERROR ================= */}
          {status === "error" && !scoringResult && (
            <section className="p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
              <div className="flex items-center gap-2 text-red-600 mb-2">
                <InformationCircleIcon className="w-5 h-5" />
                <h3 className="font-semibold">Scoring Failed</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {error || "An error occurred while analyzing this candidate."}
              </p>
            </section>
          )}

          {/* ================= GEMINI HR SCORE ================= */}
          {scoringResult ? (
            <>
              <section className="p-6 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    AI HR Evaluation (Gemini)
                  </h3>
                  <span className="text-2xl font-bold text-primary">
                    {scoringResult.score}/100
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {scoringResult.reasoning}
                </p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold flex items-center">
                    <CheckCircleIcon className="w-5 h-5 mr-2 text-green-500" />
                    Strengths
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {scoringResult.strengths}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold flex items-center">
                    <XCircleIcon className="w-5 h-5 mr-2 text-red-500" />
                    Weaknesses
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {scoringResult.weaknesses}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              Scoring information is unavailable.
            </div>
          )}

          {/* ================= EXTRACTED DETAILS ================= */}
          <div className="border-t border-border" />

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <DocumentTextIcon className="w-5 h-5 mr-2 text-primary" />
              Extracted Details
            </h3>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Skills</h4>
                <div className="space-y-2">
                  {parsedData.skills.slice(0, 7).map((skill, idx) => (
                    <SkillMatchBar
                      key={idx}
                      skill={skill}
                      matched={matchedSkills.has(skill)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Experience</h4>
                <ul className="space-y-3">
                  {parsedData.experience.map((exp, i) => (
                    <li key={i} className="text-sm">
                      <p className="font-medium">{exp.title}</p>
                      <p className="text-muted-foreground">
                        {exp.company} • {exp.duration}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Education</h4>
                <ul className="space-y-3">
                  {parsedData.education.map((edu, i) => (
                    <li key={i} className="text-sm">
                      <p className="font-medium">{edu.degree}</p>
                      <p className="text-muted-foreground">
                        {edu.institution} • {edu.year}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CandidateProfile;
