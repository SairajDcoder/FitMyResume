import React, { useEffect, useState } from "react";

const STEPS = [
  { label: "Analyzing resume", progress: 20 },
  { label: "Running ATS checks", progress: 45 },
  { label: "Reviewing GitHub profile", progress: 70 },
  { label: "Finalizing score", progress: 90 },
];

const Loader: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        const next = Math.min(prev + 1, STEPS.length - 1);
        setProgress(STEPS[next].progress);
        return next;
      });
    }, 1400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">

      {/* Spinner */}
      <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />

      {/* Status text */}
      <p className="text-primary text-lg tracking-wide mb-4">
        {STEPS[stepIndex].label}…
      </p>

      {/* Progress bar */}
      <div className="w-[320px] h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Hint text */}
      <p className="mt-4 text-xs text-muted-foreground italic">
        This may take a few seconds
      </p>
    </div>
  );
};

export const FullScreenLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default Loader;
