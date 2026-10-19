import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  currentStep: number; // 0 to 5
  onNavigateStep?: (step: number) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentStep, onNavigateStep }) => {
  const steps = [
    { label: 'Overview', step: 0 },
    { label: 'Personal', step: 1 },
    { label: 'Employment', step: 2 },
    { label: 'Credit History', step: 3 },
    { label: 'Predicting', step: 4 },
    { label: 'Results', step: 5 },
  ];

  return (
    <header id="app-header" className="bg-[#0B2447] text-white border-b border-[#19376D] sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Badge */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => onNavigateStep?.(0)}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F2A93B] to-[#D98E2B] flex items-center justify-center text-[#0B2447] font-bold shadow-sm">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-white font-sans uppercase">
                  AI CREDIT CARD APPROVAL PREDICTOR
                </span>
                <span className="badge bg-[#F2A93B] text-[#0B2447] text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">
                  Credit Risk Engine
                </span>
              </div>
            </div>
          </div>

          {/* Stepper indicator (Desktop & Tablet) */}
          <div className="hidden md:flex items-center space-x-1 sm:space-x-2">
            {steps.slice(1, 4).map((s) => {
              const isPassed = currentStep > s.step;
              const isCurrent = currentStep === s.step;
              const isClickable = currentStep > 0 && currentStep <= 3;

              return (
                <button
                  key={s.step}
                  disabled={!isClickable}
                  onClick={() => onNavigateStep?.(s.step)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isCurrent
                      ? 'bg-[#F2A93B] text-[#0B2447] font-bold shadow'
                      : isPassed
                      ? 'bg-[#19376D] text-white hover:bg-[#214685]'
                      : 'text-white bg-slate-800/40 opacity-80'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurrent
                        ? 'bg-[#0B2447] text-[#F2A93B]'
                        : isPassed
                        ? 'bg-[#F2A93B] text-[#0B2447]'
                        : 'bg-slate-700 text-white'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.step}
                  </span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
