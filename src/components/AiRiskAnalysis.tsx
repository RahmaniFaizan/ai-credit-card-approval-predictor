import React, { useState, useEffect, useMemo } from 'react';
import {
  Bot,
  Check,
  Copy,
  Target,
  ShieldCheck,
  ShieldAlert,
  Info,
  Sparkles,
} from 'lucide-react';
import { ApplicantProfile, PredictionResult } from '../types';
import {
  generateLocalRiskAnalysis,
  parseAnalysisSections,
  RiskAnalysisPayload,
} from '../utils/aiExplainer';

interface AiRiskAnalysisProps {
  profile: ApplicantProfile;
  result: PredictionResult;
}

export const AiRiskAnalysis: React.FC<AiRiskAnalysisProps> = ({ profile, result }) => {
  const [copied, setCopied] = useState(false);

  // Construct request payload
  const payload: RiskAnalysisPayload = useMemo(
    () => ({
      applicant: {
        employmentType: profile.employmentType,
        monthlyIncome: profile.netMonthlyIncome,
        jobTenureYears: profile.jobTenureYears,
        creditAgeMonths: profile.creditAgeMonths,
        hasExistingLoans: profile.hasExistingLoans,
      },
      assessment: {
        outcome: result.outcome,
        score: result.totalScore,
        scoreCategory: result.cibilCategory,
        foirPercent: result.foirPercent,
        cardVariant: result.cardVariant,
        aprPercent: result.dynamicAprPercent,
        verificationSummary: result.verificationSummary,
        reasoningNotes: result.reasoningNotes.slice(0, 4),
      },
    }),
    [profile, result]
  );

  // Instant zero-delay analysis: Directly visible immediately without any user interaction
  const immediateAnalysis = useMemo(() => generateLocalRiskAnalysis(payload), [payload]);
  const [analysis, setAnalysis] = useState<string>(immediateAnalysis);

  // Update immediately whenever profile or result changes
  useEffect(() => {
    setAnalysis(generateLocalRiskAnalysis(payload));

    let isCurrent = true;
    // Silently query server-side Gemini in the background if configured
    fetch('/api/risk-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isCurrent && data?.analysis) {
          setAnalysis(data.analysis);
        }
      })
      .catch(() => {
        // Silently preserve the direct analysis
      });

    return () => {
      isCurrent = false;
    };
  }, [payload]);

  const copyToClipboard = () => {
    if (!analysis) return;
    navigator.clipboard.writeText(analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const parsed = parseAnalysisSections(analysis);
  const hasStructuredSections = Boolean(
    parsed && (parsed.decisionDrivers || parsed.riskReductionActions || parsed.disclaimer)
  );

  return (
    <section className="rounded-3xl border border-violet-200/90 bg-gradient-to-br from-violet-50/70 via-white to-indigo-50/70 p-6 sm:p-8 shadow-sm space-y-5">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start space-x-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-700 to-indigo-600 text-white shadow-md shadow-violet-200">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-violet-700 bg-violet-100/90 px-2.5 py-0.5 rounded-full border border-violet-200">
                Gemini-Powered Feature
              </span>
              <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-emerald-50 text-emerald-800 border-emerald-200">
                <Sparkles className="h-2.5 w-2.5 text-emerald-600" />
                <span>AI Underwriting Intelligence</span>
              </span>
            </div>

            <h2 className="mt-1 text-xl sm:text-2xl font-extrabold text-[#0B2447]">
              AI Risk Analyst
            </h2>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-600">
              Plain-English explanation of this simulation’s decision drivers, portfolio risk factors, and actionable risk-reduction steps.
            </p>
          </div>
        </div>

        {/* Copy Report Action */}
        <button
          type="button"
          onClick={copyToClipboard}
          className="inline-flex shrink-0 items-center space-x-1.5 self-start rounded-xl border border-violet-200 bg-white px-3.5 py-2 text-xs font-semibold text-violet-800 shadow-sm transition hover:bg-violet-50 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-emerald-700">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-violet-600" />
              <span>Copy Analysis</span>
            </>
          )}
        </button>
      </div>

      {/* DIRECTLY SHOWING ANALYSIS SECTIONS */}
      {hasStructuredSections && parsed ? (
        <div className="grid grid-cols-1 gap-4">
          {/* SECTION 1: Decision Drivers */}
          {parsed.decisionDrivers && (
            <div className="rounded-2xl border border-indigo-100 bg-white/95 p-5 shadow-xs">
              <div className="flex items-center space-x-2 text-indigo-950 font-bold text-sm mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                  <Target className="h-4 w-4" />
                </div>
                <span>Decision Drivers</span>
              </div>
              <ul className="space-y-2 text-xs leading-relaxed text-slate-700">
                {parsed.decisionDrivers.items.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* SECTION 2: Risk-Reduction Actions */}
          {parsed.riskReductionActions && (
            <div className="rounded-2xl border border-emerald-100 bg-white/95 p-5 shadow-xs">
              <div className="flex items-center space-x-2 text-emerald-950 font-bold text-sm mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span>Risk-Reduction Actions</span>
              </div>
              <ul className="space-y-2 text-xs leading-relaxed text-slate-700">
                {parsed.riskReductionActions.items.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* SECTION 3: Important Disclaimer */}
          {parsed.disclaimer && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-xs">
              <div className="flex items-center space-x-2 text-slate-800 font-bold text-xs mb-1.5">
                <ShieldAlert className="h-3.5 w-3.5 text-slate-500" />
                <span>Important Disclaimer</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600">
                {parsed.disclaimer.rawText.replace(/^Important disclaimer:?\s*/i, '')}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="whitespace-pre-line rounded-2xl border border-violet-100 bg-white/90 p-5 text-xs leading-relaxed text-slate-700 shadow-xs">
          {analysis}
        </div>
      )}

      {/* PRIVACY FOOTER */}
      <div className="flex items-start space-x-2 pt-1 border-t border-violet-100/60">
        <Info className="h-3.5 w-3.5 shrink-0 text-slate-400 mt-0.5" />
        <p className="text-[11px] leading-relaxed text-slate-500">
          Privacy by design: the request excludes name, PAN, PIN code, and loan-level details. AI explains the local rules-engine output; it does not access credit-bureau or bank data and cannot approve a card.
        </p>
      </div>
    </section>
  );
};
