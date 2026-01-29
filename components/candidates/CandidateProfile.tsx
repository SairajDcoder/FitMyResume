import React, { useEffect } from "react";
import { Candidate } from "../../types";
import {
  XIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon
} from "../icons";

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

const CandidateProfile: React.FC<CandidateProfileProps> = ({
  candidate,
  onClose
}) => {
  const {
    parsedData,
    scoringResult,
    systemScreeningResult,
    finalScore,
    error,
    status
  } = candidate;

  if (!parsedData) return null;

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const matchedSkills = new Set(parsedData.skills.slice(0, 5));

  const toBulletPoints = (text: string) => {
  if (!text) return [];

  return text
    // split by sentence endings
    .split(/\. (?=[A-Z])/)
    // cleanup
    .map(s => s.replace(/\.$/, "").trim())
    // remove very short junk
    .filter(s => s.length > 10);
};


  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-40"
      />

      {/* CENTERED MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="relative w-[80vw] h-[92vh] bg-card rounded-2xl shadow-2xl flex flex-col">

          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full text-muted-foreground hover:bg-muted"
          >
            <XIcon className="w-6 h-6" />
          </button>

          {/* HEADER */}
          <header className="px-10 py-4 pt-5 border-b border-border">
            <h2 className="text-xl font-semibold">
              {parsedData.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {parsedData.email} • {parsedData.phone}
            </p>
          </header>

          {/* CONTENT */}
          <main className="flex-grow p-6 overflow-y-auto space-y-6">

            {/* ================= FINAL SCORE ================= */}
            {finalScore !== undefined && (
              <section className="p-6 rounded-xl border border-border bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-3xl font-semibold">
                    Resume Fit Score
                  </h3>
                  <span className="text-3xl font-bold text-primary">
                    {finalScore}/100
                  </span>
                </div>

                {systemScreeningResult?.status === "EVALUATED" && (
                  <p className="text-sm text-muted-foreground italic">
                    {systemScreeningResult.evidenceReview.evidenceSummary}
                  </p>
                )}
              </section>
            )}

            {/* ================= ERROR ================= */}
            {status === "error" && (
              <section className="p-4 rounded-lg border border-red-200 bg-red-50">
                <div className="flex items-center gap-2 text-red-600 mb-2">
                  <InformationCircleIcon className="w-5 h-5" />
                  <h3 className="font-semibold">Analysis Failed</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {error}
                </p>
              </section>
            )}

            <div className="mx-3">
              {/* ================= AI EXPLANATION ================= */}
            {scoringResult && (
              <section>
                <h3 className="font-semibold mb-2">
                  AI Evaluation Summary
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {scoringResult.reasoning}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  
  {/* STRENGTHS */}
  <div className="rounded-xl border border-green-300 bg-green-500/10 p-4">
    <h4 className="font-semibold flex items-center mb-2 text-green-700">
      <CheckCircleIcon className="w-5 h-5 mr-2" />
      Strengths
    </h4>
    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
      {toBulletPoints(scoringResult.strengths).map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  </div>

  {/* WEAKNESSES */}
  <div className="rounded-xl border border-red-300 bg-red-500/10 p-4">
    <h4 className="font-semibold flex items-center mb-2 text-red-700">
      <XCircleIcon className="w-5 h-5 mr-2" />
      Weaknesses
    </h4>
    <ul className="list-disc pl-5 pb-3 space-y-1 text-sm text-muted-foreground">
      {toBulletPoints(scoringResult.weaknesses).map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  </div>

</div>

              </section>
            )}

            {/* ================= EXTRACTED DETAILS ================= */}
            <div className="border-t border-border pt-6 px-2">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <DocumentTextIcon className="w-5 h-5 mr-2 text-primary" />
                Extracted Resume Details
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
            </div>

          </main>
        </div>
      </div>
    </>
  );
};

export default CandidateProfile;
