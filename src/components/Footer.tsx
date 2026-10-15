import React from 'react';
import { AlertCircle, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="app-footer" className="bg-[#0B2447] text-white border-t border-[#19376D] py-6 px-4 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs space-y-4 md:space-y-0 text-center md:text-left">
        <div className="flex items-start space-x-2 max-w-3xl">
          <AlertCircle className="w-5 h-5 text-[#F2A93B] shrink-0 mt-0.5" />
          <p className="leading-relaxed text-white font-normal">
            <span className="font-semibold text-white">System Disclaimer:</span> This platform operates on a rules-based evaluation model trained on historical banking metrics. Predictions and credit limits are simulated strictly for structural risk modeling and do not constitute actual financial approvals.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-white bg-[#19376D]/60 px-3 py-1.5 rounded-md border border-[#19376D]">
          <Lock className="w-3.5 h-3.5 text-[#F2A93B]" />
          <span>Client-Side Simulator &bull; 100% Privacy Protected</span>
        </div>
      </div>
    </footer>
  );
};
