import { Button } from "@/components/ui/button";
import { Loader2, Merge, X } from "lucide-react";

interface MergeActionBarProps {
    selectedCount: number;
    onMerge: () => void;
    onClear: () => void;
    isMerging: boolean;
}

const MergeActionBar = ({ selectedCount, onMerge, onClear, isMerging }: MergeActionBarProps) => {
    if (selectedCount === 0) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5">
            <div className="flex items-center gap-4 px-6 py-4 bg-background border shadow-lg rounded-full">
                {isMerging ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-sm font-medium pr-2">
                            Merging {selectedCount} identities... Please wait
                        </span>
                    </>
                ) : (
                    <>
                        <span className="text-sm font-medium">
                            {selectedCount} selected
                        </span>
                        
                        <div className="h-4 w-px bg-border" />
                        
                        <Button 
                            variant="default" 
                            size="sm" 
                            onClick={onMerge} 
                            disabled={selectedCount < 2}
                            className="gap-2"
                        >
                            <Merge className="h-4 w-4" />
                            Merge
                        </Button>
                        
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={onClear}
                            className="gap-2"
                        >
                            <X className="h-4 w-4" />
                            Clear
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default MergeActionBar;
