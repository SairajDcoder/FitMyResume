import React, { useState, useMemo } from 'react';
import { Job, Candidate } from '../../types';
import CandidateList from './CandidateList';

interface CandidatesByJobPageProps {
  jobs: Job[];
  candidates: Candidate[];
  onViewCandidate: (candidateId: string) => void;
}

const CandidatesByJobPage: React.FC<CandidatesByJobPageProps> = ({ jobs, candidates, onViewCandidate }) => {
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || 'all');
  
  const filteredCandidates = useMemo(() => {
    if (selectedJobId === 'all') {
      return candidates;
    }
    return candidates.filter(c => c.jobId === selectedJobId);
  }, [candidates, selectedJobId]);

  return (
    <div className="space-y-8">
       <div>
            <h1 className="text-2xl font-bold tracking-tight">Candidates</h1>
            <p className="text-muted-foreground">Review and manage candidates for each job post.</p>
        </div>

      <div className="flex items-center gap-4">
        <label htmlFor="job-filter" className="text-sm font-medium">Filter by Job:</label>
        <select
            id="job-filter"
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="bg-input border border-border rounded-md p-2 text-sm text-foreground focus:ring-2 focus:ring-ring focus:border-ring transition"
        >
            <option value="all">All Jobs</option>
            {jobs.map(job => (
                <option key={job.id} value={job.id}>{job.title}</option>
            ))}
        </select>
      </div>

      <CandidateList 
        candidates={filteredCandidates}
        onViewCandidate={onViewCandidate}
      />
    </div>
  );
};

export default CandidatesByJobPage;
