import React, { useState } from 'react';
import { Job, Candidate } from '../../types';
import Card, { CardContent } from '../ui/Card';
import { PlusIcon, PencilIcon, TrashIcon } from '../icons';
import JobFormModal from './JobFormModal';

interface JobConfigPageProps {
  jobs: Job[];
  candidates: Candidate[];
  onSaveJob: (job: Job) => void;
  onDeleteJob: (jobId: string) => void;
}

const getStatusColor = (status: Job['status']) => {
    switch (status) {
        case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'Draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'Closed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    }
}

const JobCard: React.FC<{
    job: Job;
    candidateCount: number;
    onEdit: (job: Job) => void;
    onDelete: (jobId: string) => void;
}> = ({ job, candidateCount, onEdit, onDelete }) => {
    return (
        <Card>
            <CardContent className="p-4 flex justify-between items-start">
                <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">{job.title}</h3>
                    <div className="flex items-center gap-2 text-xs">
                        <span className={`px-2 py-1 rounded-full font-medium ${getStatusColor(job.status)}`}>{job.status}</span>
                        <span className="text-muted-foreground">{job.employmentType}</span>
                        <span className="text-muted-foreground">&bull;</span>
                        <span className="text-muted-foreground">{job.experienceLevel}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{candidateCount} candidate(s) screened</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => onEdit(job)} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                        <PencilIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(job.id)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            </CardContent>
        </Card>
    );
};


const JobConfigPage: React.FC<JobConfigPageProps> = ({ jobs, candidates, onSaveJob, onDeleteJob }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<Job | null>(null);

    const handleOpenCreateModal = () => {
        setEditingJob(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (job: Job) => {
        setEditingJob(job);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingJob(null);
    };

    const getCandidateCountForJob = (jobId: string) => {
        return candidates.filter(c => c.jobId === jobId).length;
    };
  
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Job Posts</h1>
                    <p className="text-muted-foreground">Manage job descriptions and screening criteria.</p>
                </div>
                <button 
                    onClick={handleOpenCreateModal}
                    className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                    Create Job
                </button>
            </div>
            
            {jobs.length > 0 ? (
                <div className="space-y-4">
                    {jobs.map(job => (
                        <JobCard 
                            key={job.id}
                            job={job}
                            candidateCount={getCandidateCountForJob(job.id)}
                            onEdit={handleOpenEditModal}
                            onDelete={onDeleteJob}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-border rounded-lg">
                    <h3 className="text-lg font-semibold">No job posts yet.</h3>
                    <p>Click "Create Job" to get started.</p>
                </div>
            )}

            {isModalOpen && (
                <JobFormModal 
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={onSaveJob}
                    jobToEdit={editingJob}
                />
            )}
        </div>
    );
};

export default JobConfigPage;