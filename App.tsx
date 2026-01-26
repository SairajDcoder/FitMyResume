import React, { useState, useCallback } from 'react';
import { Candidate, Job, AppPreferences } from './types';
import { MOCK_CANDIDATE, MOCK_JOBS } from './constants';
import { parseResume, scoreCandidate } from './services/geminiService';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import PageWrapper from './components/layout/PageWrapper';
import CandidateProfile from './components/candidates/CandidateProfile';
import Loader, { FullScreenLoader } from './components/Loader';
import JobConfigPage from './components/jobs/JobConfigPage';
import CandidateUploadPage from './components/candidates/CandidateUploadPage';
import CandidatesByJobPage from './components/candidates/CandidatesByJobPage';
import DashboardPage from './components/dashboard/DashboardPage';
import SettingsPage from './components/settings/SettingsPage';
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';

export type Page = 'dashboard' | 'jobs' | 'candidates' | 'upload' | 'settings';
type AuthPage = 'login' | 'signup';

const App: React.FC = () => {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [candidates, setCandidates] = useState<Candidate[]>([MOCK_CANDIDATE]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isScreening, setIsScreening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [authPage, setAuthPage] = useState<AuthPage>('login');
  
  // App preferences are separate from user profile data now
  const [appPreferences, setAppPreferences] = useState<AppPreferences>({
    theme: 'system',
    notifications: { email: true, inApp: true },
  });

  const handleScreenCandidates = useCallback(async (files: File[], selectedJobId: string) => {
    const selectedJob = jobs.find(j => j.id === selectedJobId);
    if (!selectedJob) {
        setError("A valid job must be selected to screen candidates.");
        return;
    }

    setIsScreening(true);
    setError(null);
    
    const newCandidates: Candidate[] = files.map(file => ({
      id: `candidate-${Date.now()}-${file.name}-${Math.random()}`,
      fileName: file.name,
      jobId: selectedJob.id,
      status: 'processing',
      parsedData: null,
      scoringResult: null,
    }));
    
    setCandidates(prev => [...newCandidates, ...prev]);

    const jobDescription = `${selectedJob.title}\n\n${selectedJob.description}\n\nRequired Skills: ${selectedJob.requiredSkills.map(s => s.name).join(', ')}`;

    const screeningPromises = newCandidates.map((candidate, index) => {
      const file = files[index];
      return (async () => {
        try {
          const parsedData = await parseResume(file);
          setCandidates(prev => prev.map(c => c.id === candidate.id ? { ...c, parsedData } : c));

          const scoringResult = await scoreCandidate(parsedData, jobDescription);
          setCandidates(prev => prev.map(c => c.id === candidate.id ? { ...c, scoringResult, status: 'completed' } : c));
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
          console.error(`Failed to screen candidate ${file.name}:`, err);
          setCandidates(prev => prev.map(c => c.id === candidate.id ? { ...c, status: 'error', error: errorMessage } : c));
        }
      })();
    });

    await Promise.allSettled(screeningPromises);
    setIsScreening(false);
    setActivePage('candidates');

  }, [jobs]);
  
  const handleViewCandidate = (candidateId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (candidate) {
        setSelectedCandidate(candidate);
    }
  };

  const handleCloseProfile = () => {
    setSelectedCandidate(null);
  };
  
  const handleSaveJob = (jobToSave: Job) => {
    setJobs(prevJobs => {
        const exists = prevJobs.some(j => j.id === jobToSave.id);
        if (exists) {
            return prevJobs.map(j => j.id === jobToSave.id ? jobToSave : j);
        }
        return [...prevJobs, jobToSave];
    });
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs(prevJobs => prevJobs.filter(j => j.id !== jobId));
  };

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage jobs={jobs} candidates={candidates} />;
      case 'jobs':
        return <JobConfigPage jobs={jobs} candidates={candidates} onSaveJob={handleSaveJob} onDeleteJob={handleDeleteJob} />;
      case 'candidates':
        return <CandidatesByJobPage jobs={jobs} candidates={candidates} onViewCandidate={handleViewCandidate} />;
      case 'upload':
        return <CandidateUploadPage jobs={jobs} onUpload={handleScreenCandidates} isLoading={isScreening} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage jobs={jobs} candidates={candidates} />;
    }
  }

  if (isAuthLoading) {
    return <FullScreenLoader />;
  }

  if (!isAuthenticated || !user) {
     switch (authPage) {
        case 'login':
            return <LoginPage onSwitchToSignup={() => setAuthPage('signup')} />;
        case 'signup':
            return <SignupPage onSwitchToLogin={() => setAuthPage('login')} />;
        default:
            return <LoginPage onSwitchToSignup={() => setAuthPage('signup')} />;
     }
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {isScreening && <Loader />}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          pageTitle={activePage.charAt(0).toUpperCase() + activePage.slice(1)}
          setActivePage={setActivePage}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 md:p-8">
            <PageWrapper>
                {renderContent()}
            </PageWrapper>
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