import { useLocation, useNavigate } from 'react-router-dom';
import { ReportBuilder } from './components/report-builder';

const Reports = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = (location.state || {}) as { initialDate?: string };
  const initialDate = state.initialDate ? new Date(state.initialDate) : undefined;

  return (
    <div className="h-full p-6">
      <ReportBuilder
        open={true}
        onOpenChange={(open) => {
          if (!open) navigate('/attendance');
        }}
        initialDate={initialDate}
        onExportSuccess={() => {
          // stay on reports page, or navigate back if desired
        }}
      />
    </div>
  );
};

export default Reports;
