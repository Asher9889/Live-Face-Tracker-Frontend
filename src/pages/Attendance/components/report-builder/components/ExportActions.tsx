import { Download, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface ExportActionsProps {
  isExporting: boolean;
  isLoadingPreview: boolean;
  exportError: string | null;
  onExport: () => void;
  onReset: () => void;
  hasValidConfig: boolean;
}

export const ExportActions = ({
  isExporting,
  isLoadingPreview,
  exportError,
  onExport,
  onReset,
  hasValidConfig,
}: ExportActionsProps) => {
  return (
    <div className="space-y-3 p-4 border-t bg-background">
      {exportError && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-xs text-destructive">{exportError}</p>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onReset}
          disabled={isExporting}
          className="flex-1"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button
          onClick={onExport}
          disabled={
            isExporting ||
            isLoadingPreview ||
            !hasValidConfig
          }
          className="flex-1"
        >
          {isExporting ? (
            <>
              <Spinner className="w-4 h-4 mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        {isExporting
          ? 'Generating your report...'
          : 'Click download to generate and download the report'}
      </p>
    </div>
  );
};
