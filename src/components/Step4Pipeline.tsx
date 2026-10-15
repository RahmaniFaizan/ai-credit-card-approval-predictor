import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, Sparkles, Database, Layers, ArrowLeft, ShieldCheck, FileSearch } from 'lucide-react';

interface Step4PipelineProps {
  onComplete: () => void;
  onBack?: () => void;
}

export const Step4Pipeline: React.FC<Step4PipelineProps> = ({ onComplete, onBack }) => {
  const [pipelinePhase, setPipelinePhase] = useState<number>(0);

  const phases = [
    {
      title: 'Bureau Pull & CIBIL Derogatory Scrub…',
      subtitle: 'Querying credit bureau, checking for 30+ DPD, written-off accounts, and inquiry velocity',
      icon: Database,
    },
    {
      title: 'Account Aggregator Bank Statement Scrub…',
      subtitle: 'Scanning statement for electronic salary credits, ECS/NACH mandate bounces, and cash flow',
      icon: FileSearch,
    },
    {
      title: 'Employer Category & Policy Viability…',
      subtitle: 'Verifying corporate category (CAT-A/B/C), minimum income viability, and PIN code serviceability',
      icon: Layers,
    },
    {
      title: 'Underwriting Decision & Dynamic Pricing…',
      subtitle: 'Testing 50% FOIR ceiling, dynamic APR starting from 9% p.a., and Lifetime Free card tier',
      icon: Sparkles,
    },
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setPipelinePhase(1), 750);
    const t2 = setTimeout(() => setPipelinePhase(2), 1500);
    const t3 = setTimeout(() => setPipelinePhase(3), 2250);
    const t4 = setTimeout(() => {
      onComplete();
    }, 3100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div id="step-4-pipeline" className="max-w-2xl mx-auto py-16 px-4 text-center space-y-8">
      <div className="bg-[#0B2447] text-white p-8 sm:p-12 rounded-3xl border border-[#19376D] shadow-2xl relative overflow-hidden space-y-8">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-[#F2A93B] to-amber-300 transition-all duration-700 ease-out"
            style={{ width: `${((pipelinePhase + 1) / phases.length) * 100}%` }}
          ></div>
        </div>

        {/* Central Pulsing Icon */}
        <div className="absolute top-6 left-6">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 px-3 py-2 rounded-full border border-white/20 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Review</span>
          </button>
        </div>

        <div className="relative mx-auto w-20 h-20 rounded-2xl bg-[#19376D] border border-[#F2A93B]/40 flex items-center justify-center text-[#F2A93B]">
          <div className="absolute inset-0 rounded-2xl bg-[#F2A93B]/20 animate-ping opacity-30"></div>
          <Cpu className="w-10 h-10 animate-pulse text-[#F2A93B]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Retail Bank Verification Engine
          </h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Executing real-time multi-stage verification against bureau records, statement mandates, and corporate underwriting matrices
          </p>
        </div>

        {/* Steps progress list */}
        <div className="space-y-3 max-w-lg mx-auto text-left">
          {phases.map((p, idx) => {
            const isCompleted = pipelinePhase > idx;
            const isCurrent = pipelinePhase === idx;

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border transition-all duration-300 flex items-start space-x-3 ${
                  isCurrent
                    ? 'bg-[#19376D] border-[#F2A93B] text-white shadow-md'
                    : isCompleted
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-50'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : isCurrent ? (
                    <div className="w-5 h-5 rounded-full border-2 border-[#F2A93B] border-t-transparent animate-spin"></div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center text-[10px] text-slate-500">
                      {idx + 1}
                    </div>
                  )}
                </div>

                <div>
                  <p className={`text-xs sm:text-sm font-bold ${isCurrent ? 'text-[#F2A93B]' : 'text-slate-200'}`}>
                    {p.title}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{p.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
