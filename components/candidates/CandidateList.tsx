    import React from 'react';
    import { Candidate } from '../../types';
    import Card, { CardContent } from '../ui/Card';
    import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '../icons';

    interface CandidateListProps {
    candidates: Candidate[];
    onViewCandidate: (candidateId: string) => void;
    }

    const getScoreColor = (score: number | null | undefined) => {
        if (score === null || score === undefined) return 'bg-gray-400';
        if (score >= 90) return 'bg-green-500';
        if (score >= 80) return 'bg-lime-500';
        if (score >= 70) return 'bg-yellow-500';
        if (score >= 60) return 'bg-orange-500';
        return 'bg-red-500';
    };

    const getRecommendationFromScore = (score?: number) => {
  if (score === undefined || score === null) return null;

  if (score >= 75) {
    return { label: "Strong Match", color: "text-green-600", type: "strong" };
  }
  if (score >= 60) {
    return { label: "Potential", color: "text-yellow-600", type: "potential" };
  }
  return { label: "Not Recommended", color: "text-red-600", type: "reject" };
};


    const CandidateRow: React.FC<{candidate: Candidate, onViewCandidate: (id: string) => void}> = ({ candidate, onViewCandidate }) => {
        const score = candidate.finalScore;
        
        return (
            <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="p-4">
                    <p className="font-medium text-foreground">{candidate.parsedData?.name || candidate.fileName}</p>
                    <p className="text-sm text-muted-foreground">{candidate.parsedData?.email || 'N/A'}</p>
                    {candidate.status === 'error' && (
                        <p className="text-xs text-red-500 mt-1 truncate max-w-[200px]" title={candidate.error}>
                            Error: {candidate.error}
                        </p>
                    )}
                </td>
                <td className="p-4 text-center">
                    {candidate.status === 'completed' && score !== undefined && score !== null ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${getScoreColor(score)}`}></div>
                            <span className="font-mono text-sm">{score}</span>
                        </div>
                    ) : candidate.status === 'error' ? (
                        <div className="flex items-center justify-center text-red-500" title="Scoring Failed">
                            <XCircleIcon className="w-5 h-5" />
                        </div>
                    ) : (
                        <span className="text-xs text-muted-foreground italic capitalize px-2 py-1 bg-muted rounded-md">{candidate.status}...</span>
                    )}
                </td>
                <td className="p-4 text-center">
  {candidate.status === "completed" && score !== undefined ? (
    (() => {
      const rec = getRecommendationFromScore(score);
      if (!rec) return <span>-</span>;

      return (
        <div className={`flex items-center justify-center gap-2 ${rec.color}`}>
          {rec.type === "strong" && <CheckCircleIcon className="w-5 h-5" />}
          {rec.type === "potential" && <InformationCircleIcon className="w-5 h-5" />}
          {rec.type === "reject" && <XCircleIcon className="w-5 h-5" />}
          <span className="text-sm font-medium">{rec.label}</span>
        </div>
      );
    })()
  ) : (
    <span className="text-muted-foreground">—</span>
  )}
</td>


                <td className="p-4 text-right">
                    <button 
                        onClick={() => onViewCandidate(candidate.id)}
                        className="text-sm font-medium text-primary hover:underline disabled:text-muted-foreground disabled:no-underline disabled:cursor-not-allowed"
                        disabled={!candidate.parsedData}
                        title={!candidate.parsedData ? "Wait for parsing to complete" : "View Candidate Details"}
                    >
                        View Details
                    </button>
                </td>
            </tr>
        );
    };

    const CandidateList: React.FC<CandidateListProps> = ({ candidates, onViewCandidate }) => {
    return (
        <Card>
        <CardContent className="p-0">
            <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-muted/50">
                    <tr className="border-b border-border">
                        <th scope="col" className="p-4 text-left font-semibold text-muted-foreground">Candidate</th>
                        <th scope="col" className="p-4 text-center font-semibold text-muted-foreground">Fit Score</th>
                        <th scope="col" className="p-4 text-center font-semibold text-muted-foreground">Recommended</th>
                        <th scope="col" className="p-4 text-right font-semibold text-muted-foreground">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {candidates
                        .sort((a, b) => (b.scoringResult?.score ?? 0) - (a.scoringResult?.score ?? 0))
                        .map(candidate => (
                        <CandidateRow key={candidate.id} candidate={candidate} onViewCandidate={onViewCandidate} />
                    ))}
                </tbody>
            </table>
            {candidates.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                    <p className="font-semibold">No candidates found.</p>
                    <p className="text-sm">Upload resumes or adjust your filters.</p>
                </div>
            )}
            </div>
        </CardContent>
        </Card>
    );
    };

    export default CandidateList;