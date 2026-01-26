import React, { useState, useRef } from 'react';
import { Job } from '../../types';
import Card, { CardHeader, CardTitle, CardContent, CardDescription } from '../ui/Card';
import { UploadIcon } from '../icons';

interface CandidateUploadPageProps {
  jobs: Job[];
  onUpload: (files: File[], jobId: string) => void;
  isLoading: boolean;
}

const CandidateUploadPage: React.FC<CandidateUploadPageProps> = ({ jobs, onUpload, isLoading }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || '');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFiles = (fileList: FileList | File[]) => {
    const selectedFiles = Array.from(fileList);
    const validFiles = selectedFiles.filter(file => file.type === 'application/pdf');

    if (validFiles.length !== selectedFiles.length) {
      setError("Please upload only PDF files.");
    } else {
      setError(null);
    }
    
    setFiles(prevFiles => {
        const newFiles = validFiles.filter(vf => !prevFiles.some(pf => pf.name === vf.name && pf.size === vf.size));
        return [...prevFiles, ...newFiles];
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      validateAndSetFiles(event.target.files);
    }
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => event.preventDefault();
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files) validateAndSetFiles(event.dataTransfer.files);
  };
  
  const handleRemoveFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  }

  const handleSubmit = () => {
    if (files.length === 0) {
      setError("Please select at least one file.");
      return;
    }
    if (!selectedJobId) {
        setError("Please select a job to screen for.");
        return;
    }
    onUpload(files, selectedJobId);
    setFiles([]);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Upload Resumes</h1>
        <p className="text-muted-foreground">Select a job and upload one or more resumes to begin screening.</p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Screening Configuration</CardTitle>
            <CardDescription>Choose the job you are screening candidates for.</CardDescription>
        </CardHeader>
        <CardContent>
            <label htmlFor="job-select" className="block text-sm font-medium text-foreground mb-2">Job Post</label>
            <select
                id="job-select"
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full bg-input border border-border rounded-md p-2 text-sm text-foreground focus:ring-2 focus:ring-ring focus:border-ring transition"
                disabled={jobs.length === 0}
            >
                {jobs.length > 0 ? (
                    jobs.map(job => <option key={job.id} value={job.id}>{job.title}</option>)
                ) : (
                    <option>Please create a job post first</option>
                )}
            </select>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Upload Resumes</CardTitle>
          <CardDescription>Only PDF files are accepted.</CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file" ref={fileInputRef} onChange={handleFileChange}
              className="hidden" accept="application/pdf" multiple
            />
            <UploadIcon className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Drag & drop resumes here, or click to select files.</p>
          </div>
          
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Selected Files:</h3>
                <ul className="max-h-40 overflow-y-auto pr-2 space-y-1">
                    {files.map((file, index) => (
                        <li key={index} className="flex justify-between items-center text-xs bg-secondary p-2 rounded">
                            <span className="text-secondary-foreground truncate pr-2">{file.name}</span>
                            <button onClick={() => handleRemoveFile(index)} className="text-red-500 hover:text-red-400 font-bold">&times;</button>
                        </li>
                    ))}
                </ul>
            </div>
          )}

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={isLoading || files.length === 0 || !selectedJobId}
            className="w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-lg mt-6 hover:bg-primary/90 transition disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
          >
            {isLoading ? 'Screening...' : `Screen ${files.length} Candidate(s)`}
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateUploadPage;
