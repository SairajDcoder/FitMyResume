import React, { useState, useEffect } from 'react';
import { Job, JobSkill } from '../../types';
import { XIcon, PlusIcon, TrashIcon } from '../icons';

interface JobFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (job: Job) => void;
  jobToEdit: Job | null;
}

const emptyJob: Omit<Job, 'id'> = {
  title: '',
  description: '',
  employmentType: 'Full-time',
  experienceLevel: 'Mid-level',
  requiredSkills: [{ name: 'React', weight: 80 }],
  responsibilities: [],
  status: 'Draft',
};

const JobFormModal: React.FC<JobFormModalProps> = ({ isOpen, onClose, onSave, jobToEdit }) => {
  const [job, setJob] = useState<Omit<Job, 'id'> & { id?: string }>(emptyJob);

  useEffect(() => {
    if (jobToEdit) {
      setJob(jobToEdit);
    } else {
      setJob(emptyJob);
    }
  }, [jobToEdit, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJob(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSkillChange = (index: number, field: keyof JobSkill, value: string | number) => {
    const newSkills = [...job.requiredSkills];
    (newSkills[index] as any)[field] = value;
    setJob(prev => ({ ...prev, requiredSkills: newSkills }));
  };

  const addSkill = () => {
    setJob(prev => ({...prev, requiredSkills: [...prev.requiredSkills, { name: '', weight: 50 }]}));
  };
  
  const removeSkill = (index: number) => {
    setJob(prev => ({...prev, requiredSkills: prev.requiredSkills.filter((_, i) => i !== index)}));
  };

  const handleSave = () => {
    if (!job.title) {
        alert("Job title is required."); // Simple validation
        return;
    }
    const jobToSave: Job = {
        ...job,
        id: job.id || `job-${Date.now()}`
    };
    onSave(jobToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center">
      <div className="bg-card rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <h2 className="text-lg font-semibold text-foreground">{jobToEdit ? 'Edit Job Post' : 'Create New Job'}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-muted-foreground hover:bg-muted">
            <XIcon className="w-5 h-5" />
          </button>
        </header>
        <main className="p-6 overflow-y-auto space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="text-sm font-medium mb-1 block">Job Title</label>
                <input type="text" name="title" value={job.title} onChange={handleInputChange} className="w-full bg-input border border-border rounded-md p-2 text-sm" />
            </div>
             <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <select name="status" value={job.status} onChange={handleInputChange} className="w-full bg-input border border-border rounded-md p-2 text-sm">
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Job Description</label>
            <textarea name="description" value={job.description} onChange={handleInputChange} rows={4} className="w-full bg-input border border-border rounded-md p-2 text-sm" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="text-sm font-medium mb-1 block">Employment Type</label>
                <select name="employmentType" value={job.employmentType} onChange={handleInputChange} className="w-full bg-input border border-border rounded-md p-2 text-sm">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                </select>
            </div>
            <div>
                <label className="text-sm font-medium mb-1 block">Experience Level</label>
                <select name="experienceLevel" value={job.experienceLevel} onChange={handleInputChange} className="w-full bg-input border border-border rounded-md p-2 text-sm">
                    <option value="Entry">Entry</option>
                    <option value="Mid-level">Mid-level</option>
                    <option value="Senior">Senior</option>
                </select>
            </div>
          </div>
          {/* Required Skills */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Required Skills & Weighting</h3>
            <div className="space-y-2">
                {job.requiredSkills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <input type="text" placeholder="Skill name" value={skill.name} onChange={(e) => handleSkillChange(index, 'name', e.target.value)} className="w-full bg-input border border-border rounded-md p-2 text-sm" />
                        <input type="number" value={skill.weight} onChange={(e) => handleSkillChange(index, 'weight', parseInt(e.target.value, 10))} className="w-24 bg-input border border-border rounded-md p-2 text-sm" min="1" max="100"/>
                        <button onClick={() => removeSkill(index)} className="p-2 text-muted-foreground hover:text-destructive"><TrashIcon className="w-4 h-4"/></button>
                    </div>
                ))}
            </div>
            <button onClick={addSkill} className="flex items-center gap-1 text-sm text-primary mt-2 font-medium">
                <PlusIcon className="w-4 h-4" /> Add Skill
            </button>
          </div>
        </main>
        <footer className="flex justify-end items-center p-4 border-t border-border flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-muted">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 ml-2">Save Job</button>
        </footer>
      </div>
    </div>
  );
};

export default JobFormModal;