import React, { useState } from 'react';
import { Bot, RefreshCw, Sparkles } from 'lucide-react';
import { ApplicantProfile, PredictionResult } from '../types';

interface AiRiskAnalysisProps {
  profile: ApplicantProfile;
  result: PredictionResult;
}

export const AiRiskAnalysis: React.FC<AiRiskAnalysisProps> = ({ profile, result }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestAnalysis = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/risk-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
      });

      const data = (await response.json()) as { analysis?: string; error?: string };
      if (!response.ok || !data.analysis) {
        throw new Error(data.error || 'The AI analysis could not be generated.');
      }

      setAnalysis(data.analysis);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'The AI analysis could not be generated.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-6 sm:p-8 shadow-sm space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start space-x-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-700 text-white shadow-sm">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-violet-700">Gemini-powered feature</p>
            <h2 className="text-xl font-extrabold text-[#0B2447]">AI Risk Analyst</h2>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-600">
              Generate a plain-English explanation of this simulation’s decision drivers and potential risk-reduction actions.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={requestAnalysis}
          disabled={isLoading}
          className="inline-flex shrink-0 items-center justify-center space-x-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-65"
        >
          {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          <span>{isLoading ? 'Analysing…' : analysis ? 'Refresh analysis' : 'Generate AI analysis'}</span>
        </button>
      </div>

      {analysis && (
        <div className="whitespace-pre-line rounded-2xl border border-violet-100 bg-white/85 p-4 text-sm leading-relaxed text-slate-700">
          {analysis}
        </div>
      )}

      {error && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-800">{error}</p>
      )}

      <p className="text-[11px] leading-relaxed text-slate-500">
        Privacy by design: the request excludes name, PAN, PIN code, and loan-level details. AI explains the local rules-engine output; it does not access credit-bureau or bank data and cannot approve a card.
      </p>
    </section>
  );
};
