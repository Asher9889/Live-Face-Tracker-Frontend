import { useState } from 'react';
import VisitorTable from '@/components/visitors/VisitorTable';
import MergeActionBar from '@/components/visitors/MergeActionBar';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Filter, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const Visitors = () => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isMerging, setIsMerging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const handleSelectionChange = (id: string) => {
        if (isMerging) return;
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };

    const handleClearSelection = () => {
        if (isMerging) return;
        setSelectedIds([]);
        setError(null);
    };

    const handleMerge = async () => {
        if (selectedIds.length < 2) return;

        try {
            setIsMerging(true);
            setError(null);

            const response = await fetch("/unknown/merge", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sourceIds: selectedIds
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Merge failed. Try again.");
            }

            // Success
            toast.success('Identities merged successfully');
            setSelectedIds([]);
            
            // Refetch visitor list
            queryClient.invalidateQueries({ queryKey: ['visitorDetails'] });
            
        } catch (err: any) {
            const errorMessage = err.message || "Something went wrong";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsMerging(false);
        }
    };

    return (
        <div className="space-y-6 relative pb-20">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Visitor Logs</h2>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled={isMerging}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Date Range
                    </Button>
                    <Button variant="outline" size="sm" disabled={isMerging}>
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                </div>
            </div>

            {error && (
                <div className="bg-destructive/15 text-destructive text-sm px-4 py-3 rounded-md border border-destructive/20 animate-in fade-in">
                    {error}
                </div>
            )}

            <div className="relative">
                <VisitorTable 
                    selectedIds={selectedIds} 
                    onSelectionChange={handleSelectionChange} 
                    isMerging={isMerging}
                />
                
                {isMerging && (
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex flex-col items-center justify-center z-10 rounded-md">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                        <span className="text-sm font-medium text-foreground">Merging identities...</span>
                    </div>
                )}
            </div>

            <MergeActionBar 
                selectedCount={selectedIds.length}
                isMerging={isMerging}
                onClear={handleClearSelection}
                onMerge={handleMerge}
            />
        </div>
    );
};

export default Visitors;
