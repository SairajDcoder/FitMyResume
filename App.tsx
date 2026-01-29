import React, { useState, useCallback } from "react";
import { Candidate, Job, AppPreferences } from "./types";
import { MOCK_CANDIDATE, MOCK_JOBS } from "./constants";
import {
  parseResume,
  scoreCandidate,
  screenCandidate
} from "./services/geminiService";

import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import PageWrapper from "./components/layout/PageWrapper";
import CandidateProfile from "./components/candidates/CandidateProfile";
import Loader, { FullScreenLoader } from "./components/Loader";
import JobConfigPage from "./components/jobs/JobConfigPage";
import CandidateUploadPage from "./components/candidates/CandidateUploadPage";
import CandidatesByJobPage from "./components/candidates/CandidatesByJobPage";
import DashboardPage from "./components/dashboard/DashboardPage";
import SettingsPage from "./components/settings/SettingsPage";
import { useAuth } from "./hooks/useAuth";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";

/* ======================
   ATS JOB MAPPING
====================== */
function mapJobToATS(job: Job) {
  const experienceMap: Record<Job["experienceLevel"], number> = {
    Entry: 0,
    "Mid-level": 2,
    Senior: 5
  };

  const seniorityMap: Record<
    Job["experienceLevel"],
    "junior" | "mid" | "senior"
  > = {
    Entry: "junior",
    "Mid-level": "mid",
    Senior: "senior"
  };

  return {
    requiredSkills: job.requiredSkills.map(s => s.name),
    minExperience: experienceMap[job.experienceLevel],
    seniority: seniorityMap[job.experienceLevel]
  };
}

export type Page =
  | "dashboard"
  | "jobs"
  | "candidates"
  | "upload"
  | "settings";

type AuthPage = "login" | "signup";

/* ======================
   APP
====================== */
const App: React.FC = () => {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [candidates, setCandidates] = useState<Candidate[]>([
    MOCK_CANDIDATE
  ]);
  const [selectedCandidate, setSelectedCandidate] =
    useState<Candidate | null>(null);

  const [isScreening, setIsScreening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<Page>("dashboard");
  const [authPage, setAuthPage] = useState<AuthPage>("login");

  const [appPreferences] = useState<AppPreferences>({
    theme: "system",
    notifications: { email: true, inApp: true }
  });

  /* ======================
     SCREEN CANDIDATES
  ====================== */
  const handleScreenCandidates = useCallback(
    async (files: File[], selectedJobId: string) => {
      const selectedJob = jobs.find(j => j.id === selectedJobId);
      if (!selectedJob) {
        setError("A valid job must be selected.");
        return;
      }

      setIsScreening(true);
      setError(null);

      const newCandidates: Candidate[] = files.map(file => ({
        id: `candidate-${Date.now()}-${file.name}-${Math.random()}`,
        fileName: file.name,
        jobId: selectedJob.id,
        status: "processing",
        parsedData: null,
        scoringResult: null,
        systemScreeningResult: null
      }));

      setCandidates(prev => [...newCandidates, ...prev]);

      const jobDescription = `
${selectedJob.title}

${selectedJob.description}

Required Skills:
${selectedJob.requiredSkills.map(s => s.name).join(", ")}
`;

      const screeningPromises = newCandidates.map((candidate, index) => {
        const file = files[index];

        return (async () => {
          try {
            /* 1️⃣ Parse Resume */
            const parsedData = await parseResume(file);

            setCandidates(prev =>
              prev.map(c =>
                c.id === candidate.id ? { ...c, parsedData } : c
              )
            );

            /* 2️⃣ ATS + Evidence (System) */
            const atsJobInput = mapJobToATS(selectedJob);
            const systemScreeningResult = await screenCandidate(
              parsedData,
              atsJobInput
            );

            /* 3️⃣ HR AI Scoring */
            const scoringResult = await scoreCandidate(
              parsedData,
              jobDescription
            );

            /* 4️⃣ FINAL SCORE (ONE SCORE ONLY) */
            const finalScore =
              systemScreeningResult.status === "EVALUATED"
                ? Math.round(
                    0.6 * systemScreeningResult.atsScore +
                      0.4 * scoringResult.score
                  )
                : systemScreeningResult.atsScore;

            /* 5️⃣ Save Everything */
            setCandidates(prev =>
              prev.map(c =>
                c.id === candidate.id
                  ? {
                      ...c,
                      scoringResult,
                      systemScreeningResult,
                      finalScore,
                      status: "completed"
                    }
                  : c
              )
            );
          } catch (err) {
            const message =
              err instanceof Error
                ? err.message
                : "An unknown error occurred";

            console.error(
              `Failed to screen candidate ${file.name}:`,
              err
            );

            setCandidates(prev =>
              prev.map(c =>
                c.id === candidate.id
                  ? { ...c, status: "error", error: message }
                  : c
              )
            );
          }
        })();
      });

      await Promise.allSettled(screeningPromises);
      setIsScreening(false);
      setActivePage("candidates");
    },
    [jobs]
  );

  /* ======================
     NAV HELPERS
  ====================== */
  const handleViewCandidate = (candidateId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (candidate) setSelectedCandidate(candidate);
  };

  const handleCloseProfile = () => setSelectedCandidate(null);

  const handleSaveJob = (jobToSave: Job) => {
    setJobs(prev =>
      prev.some(j => j.id === jobToSave.id)
        ? prev.map(j => (j.id === jobToSave.id ? jobToSave : j))
        : [...prev, jobToSave]
    );
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
  };

  /* ======================
     RENDER
  ====================== */
  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardPage jobs={jobs} candidates={candidates} />;
      case "jobs":
        return (
          <JobConfigPage
            jobs={jobs}
            candidates={candidates}
            onSaveJob={handleSaveJob}
            onDeleteJob={handleDeleteJob}
          />
        );
      case "candidates":
        return (
          <CandidatesByJobPage
            jobs={jobs}
            candidates={candidates}
            onViewCandidate={handleViewCandidate}
          />
        );
      case "upload":
        return (
          <CandidateUploadPage
            jobs={jobs}
            onUpload={handleScreenCandidates}
            isLoading={isScreening}
          />
        );
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage jobs={jobs} candidates={candidates} />;
    }
  };

  /* ======================
     AUTH
  ====================== */
  if (isAuthLoading) return <FullScreenLoader />;

  if (!isAuthenticated || !user) {
    return authPage === "signup" ? (
      <SignupPage onSwitchToLogin={() => setAuthPage("login")} />
    ) : (
      <LoginPage onSwitchToSignup={() => setAuthPage("signup")} />
    );
  }

  /* ======================
     APP LAYOUT
  ====================== */
  return (
    <div className="flex h-screen bg-background text-foreground">
      {isScreening && <Loader />}

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          pageTitle={
            activePage.charAt(0).toUpperCase() + activePage.slice(1)
          }
          setActivePage={setActivePage}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <PageWrapper>{renderContent()}</PageWrapper>
        </main>
      </div>

      {selectedCandidate && (
        <CandidateProfile
          candidate={selectedCandidate}
          onClose={handleCloseProfile}
        />
      )}
    </div>
  );
};

export default App;
