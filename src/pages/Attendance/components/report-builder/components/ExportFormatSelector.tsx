import { FileText, Table2 } from 'lucide-react';
import type { ExportFormat } from '../types';

interface ExportFormatSelectorProps {
  value: ExportFormat;
  onChange: (format: ExportFormat) => void;
  disabled?: boolean;
}

const formats = [
  {
    id: 'csv' as const,
    label: 'CSV',
    description: 'Universal spreadsheet format',
    icon: Table2,
  },
  {
    id: 'xlsx' as const,
    label: 'Excel',
    description: 'Microsoft Excel format',
    icon: FileText,
  },
];

export const ExportFormatSelector = ({
  value,
  onChange,
  disabled = false,
}: ExportFormatSelectorProps) => {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Export Format</h3>
        <p className="text-xs text-muted-foreground">Choose file format for download</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {formats.map((format) => {
          const Icon = format.icon;
          const isSelected = value === format.id;

          return (
            <button
              key={format.id}
              onClick={() => !disabled && onChange(format.id)}
              disabled={disabled}
              className={`p-3 rounded-lg border transition-all text-center ${
                isSelected
                  ? 'border-primary bg-primary/5 ring-1 ring-primary'
                  : 'border-border hover:border-border/50 hover:bg-accent'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Icon
                className={`w-5 h-5 mx-auto mb-2 ${
                  isSelected ? 'text-primary' : 'text-muted-foreground'
                }`}
              />
              <p className="text-sm font-medium">{format.label}</p>
              <p className="text-xs text-muted-foreground">{format.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
