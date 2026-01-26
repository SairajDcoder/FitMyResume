import React from 'react';
import { Job, Candidate } from '../../types';
import Card, { CardHeader, CardTitle, CardContent, CardDescription } from '../ui/Card';

interface DashboardPageProps {
    jobs: Job[];
    candidates: Candidate[];
}

const StatCard: React.FC<{title: string, value: string | number, description: string}> = ({ title, value, description }) => (
    <Card>
        <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

const DashboardPage: React.FC<DashboardPageProps> = ({ jobs, candidates }) => {
    const completedCandidates = candidates.filter(c => c.status === 'completed').length;
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back! Here's a summary of your screening activity.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard 
                    title="Open Positions"
                    value={jobs.length}
                    description="Total number of active job posts."
                />
                <StatCard 
                    title="Candidates Screened"
                    value={completedCandidates}
                    description="Total resumes processed and scored."
                />
                <StatCard 
                    title="Avg. Fit Score"
                    value={
                        completedCandidates > 0 
                        ? (candidates.reduce((acc, c) => acc + (c.scoringResult?.score || 0), 0) / completedCandidates).toFixed(1)
                        : 'N/A'
                    }
                    description="Average score across all candidates."
                />
            </div>
            {/* Add more sections like "Recent Activity" or "Top Candidates" here */}
        </div>
    )
}

export default DashboardPage;
