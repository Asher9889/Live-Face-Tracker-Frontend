import React from "react";
import type { ReportMode } from "../types";

interface ReportToolbarProps {
  mode: ReportMode;
  onModeChange: (mode: ReportMode) => void;
}

export const ReportToolbar: React.FC<ReportToolbarProps> = ({ mode, onModeChange }) => {
  return (
    <div className="sticky top-0 z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full p-4 bg-background/80 backdrop-blur-md border-b border-border/40 gap-4">
      {/* LEFT: Title & Subtitle */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Attendance Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">Generate, preview and export employee attendance insights.</p>
      </div>

      {/* CENTER: Mode Switcher */}
      <div className="flex items-center p-1 bg-secondary/50 rounded-lg border border-border/50">
        {(["daily", "monthly", "custom"] as ReportMode[]).map((m) => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
              mode === m
                ? "bg-background text-foreground shadow-sm ring-1 ring-border/20"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            }`}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};
