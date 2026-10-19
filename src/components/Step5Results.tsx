import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RotateCcw,
  Sparkles,
  Info,
  Users,
  ShieldCheck,
  CreditCard,
  ArrowLeft,
  Percent,
  Clock,
  Gift,
  Lock,
  LineChart as LineChartIcon,
} from 'lucide-react';
import { ApplicantProfile, PredictionResult } from '../types';
import { formatRupee } from '../utils/scoringEngine';
import { predictApproval } from '../utils/scoringEngine';
import { AiRiskAnalysis } from './AiRiskAnalysis';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';

interface Step5ResultsProps {
  formData: ApplicantProfile;
  result: PredictionResult;
  onReset: () => void;
  onEdit: () => void;
}

export const Step5Results: React.FC<Step5ResultsProps> = ({
  formData,
  result,
  onReset,
  onEdit,
}) => {
  const {
    totalScore,
    cibilCategory,
    outcome,
    confidencePercent,
    predictedLimit,
    cardVariant,
    dynamicAprPercent,
    monthlyAprPercent,
    atmCashFreeDays,
    scoreBands,
    similarApplicantsApprovalRate,
    reasoningNotes,
    securedAlternative,
  } = result;

  // What-If Scenarios using the exact TransUnion CIBIL scoring engine
  const plusIncomeProfile = { ...formData, netMonthlyIncome: formData.netMonthlyIncome * 1.2 };
  const plusIncomeResult = predictApproval(plusIncomeProfile, true);

  const reducedDebtProfile = {
    ...formData,
    loans: formData.loans.map((l) => ({ ...l, monthlyEmi: l.monthlyEmi * 0.8 })),
  };
  const reducedDebtResult = predictApproval(reducedDebtProfile, true);

  const trendData = [
    { name: 'Current', score: totalScore },
    { name: '+20% Income', score: plusIncomeResult.totalScore },
    { name: '-20% Debt', score: reducedDebtResult.totalScore },
  ];

  // Outcome styling
  const outcomeConfig = {
    Approved: {
      bg: 'bg-emerald-50/80 border-emerald-300',
      badgeBg: 'bg-emerald-600 text-white',
      textColor: 'text-emerald-900',
      icon: CheckCircle2,
      label: 'Approved',
    },
    Refer: {
      bg: 'bg-amber-50/80 border-amber-300',
      badgeBg: 'bg-amber-500 text-slate-950 font-bold',
      textColor: 'text-amber-900',
      icon: AlertTriangle,
      label: 'Refer for Underwriter Review',
    },
    Rejected: {
      bg: 'bg-rose-50/80 border-rose-300',
      badgeBg: 'bg-rose-600 text-white',
      textColor: 'text-rose-900',
      icon: XCircle,
      label: 'Unsecured Declined',
    },
  }[outcome];

  const OutcomeIcon = outcomeConfig.icon;

  // TransUnion CIBIL Gauge Needle Calculation (300 to 900 score -> -90deg to +90deg rotation)
  const clampedScore = Math.min(900, Math.max(300, totalScore));
  const scorePercent = (clampedScore - 300) / 600; // 0.0 to 1.0
  const needleAngle = -90 + scorePercent * 180; // -90 deg (300) to +90 deg (900)

  // TransUnion CIBIL category text color
  let categoryColor = 'text-red-600';
  if (totalScore >= 750) {
    categoryColor = 'text-emerald-700';
  } else if (totalScore >= 700) {
    categoryColor = 'text-teal-600';
  } else if (totalScore >= 650) {
    categoryColor = 'text-amber-600';
  }

  // Card background theme by variant
  const cardThemes: Record<string, { bg: string; badge: string; text: string }> = {
    Wealth: {
      bg: 'bg-gradient-to-tr from-slate-950 via-zinc-900 to-amber-950 border-amber-500/40 text-amber-200',
      badge: 'bg-amber-400 text-slate-950 font-black',
      text: 'text-amber-300',
    },
    Select: {
      bg: 'bg-gradient-to-tr from-[#0B2447] via-[#102F5A] to-[#19376D] border-amber-300/40 text-white',
      badge: 'bg-[#F2A93B] text-[#0B2447] font-bold',
      text: 'text-[#F2A93B]',
    },
    'Classic / Millennial': {
      bg: 'bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-900 border-indigo-400/30 text-white',
      badge: 'bg-indigo-400 text-slate-950 font-bold',
      text: 'text-indigo-200',
    },
    'Secured (FD-Backed)': {
      bg: 'bg-gradient-to-tr from-emerald-950 via-teal-900 to-slate-900 border-emerald-400/40 text-emerald-100',
      badge: 'bg-emerald-400 text-slate-950 font-bold',
      text: 'text-emerald-300',
    },
    'N/A': {
      bg: 'bg-gradient-to-tr from-slate-800 to-slate-900 border-slate-700 text-slate-300',
      badge: 'bg-slate-600 text-white',
      text: 'text-slate-400',
    },
  };
  const activeCardTheme = cardThemes[cardVariant] || cardThemes['Classic / Millennial'];

  return (
    <div id="step-5-results" className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Title & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#F2A93B] uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Underwriting & CIBIL Assessment Complete</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2447]">
            Credit Risk & Approval Dashboard
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
          <button
            onClick={onEdit}
            className="inline-flex items-center space-x-2 bg-white border border-[#0B2447] text-[#0B2447] hover:bg-slate-50 text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Modify Application</span>
          </button>
          <button
            onClick={onReset}
            id="btn-try-another-scenario"
            className="inline-flex items-center space-x-2 bg-[#0B2447] hover:bg-[#102F5A] text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#F2A93B]" />
            <span>Reset & Try Scenario</span>
          </button>
        </div>
      </div>

      {/* TOP CARD: Outcome Badge, Limit & Card Offer */}
      <div className={`rounded-3xl border-2 p-6 sm:p-8 shadow-sm space-y-6 ${outcomeConfig.bg}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-black/10 pb-6">
          {/* Left: Outcome Badge & Confidence */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-base sm:text-lg font-black shadow-sm ${outcomeConfig.badgeBg}`}>
                <OutcomeIcon className="w-5 h-5" />
                <span>{outcomeConfig.label}</span>
              </span>

              <span className="inline-flex items-center space-x-1.5 bg-white/80 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold border border-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{confidencePercent}% Underwriting Confidence</span>
              </span>
            </div>

            <p className={`text-sm sm:text-base font-semibold ${outcomeConfig.textColor}`}>
              {outcome === 'Approved' && 'Applicant meets automated underwriting criteria for unsecured card issuance.'}
              {outcome === 'Refer' && 'Marginal risk profile detected. Application routed to credit underwriters for salary slip / ITR verification.'}
              {outcome === 'Rejected' && 'Applicant did not meet unsecured underwriting norms. 100% Guaranteed Secured Card option available below.'}
            </p>

            {/* Decision Notes List */}
            {reasoningNotes.length > 0 && (
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                {reasoningNotes.map((note, idx) => (
                  <li key={idx} className="leading-relaxed font-medium">
                    {note}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right: Credit Limit & Card Variant (if approved/refer) */}
          {(outcome === 'Approved' || outcome === 'Refer') && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm min-w-[280px] space-y-3 text-center md:text-right">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Approved Credit Limit
              </span>
              <div className="text-3xl sm:text-2xl font-extrabold text-[#0B2447]">
                {formatRupee(predictedLimit)}
              </div>

              {cardVariant !== 'N/A' && (
                <div className="pt-2 border-t border-slate-200 flex items-center justify-center md:justify-end space-x-2">
                  <CreditCard className="w-4 h-4 text-[#F2A93B]" />
                  <span className="text-xs font-bold text-slate-700">Recommended Card:</span>
                  <span className="text-xs font-extrabold text-[#0B2447] bg-[#F2A93B]/20 px-2.5 py-0.5 rounded-md border border-[#F2A93B]/40">
                    {cardVariant}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* POLICY BENEFIT TILES (Dynamic APR, Lifetime Free, Interest-free ATM, Reward Points) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Dynamic APR */}
          <div className="bg-white/90 p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#0B2447]">
              <Percent className="w-4 h-4 text-[#F2A93B]" />
              <span>Dynamic APR</span>
            </div>
            <div className="text-lg font-black text-[#0B2447]">
              {dynamicAprPercent}% <span className="text-xs font-medium text-slate-500">p.a.</span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium">
              {monthlyAprPercent}% / month based on TransUnion risk score
            </p>
          </div>

          {/* Lifetime Free */}
          <div className="bg-white/90 p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800">
              <Gift className="w-4 h-4 text-emerald-600" />
              <span>Card Fee Structure</span>
            </div>
            <div className="text-lg font-black text-emerald-700">₹0 Lifetime Free</div>
            <p className="text-[11px] text-slate-600 font-medium">
              Zero joining fee & zero annual renewal fees
            </p>
          </div>

          {/* Interest-Free ATM Cash */}
          <div className="bg-white/90 p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#0B2447]">
              <Clock className="w-4 h-4 text-[#F2A93B]" />
              <span>ATM Cash Withdrawal</span>
            </div>
            <div className="text-lg font-black text-[#0B2447]">{atmCashFreeDays} Days Free</div>
            <p className="text-[11px] text-slate-600 font-medium">
              Interest-free ATM withdrawals until statement due date
            </p>
          </div>

          {/* Rewards Policy */}
          <div className="bg-white/90 p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#0B2447]">
              <Sparkles className="w-4 h-4 text-[#F2A93B]" />
              <span>Reward Expiry</span>
            </div>
            <div className="text-lg font-black text-[#0B2447]">Never Expire</div>
            <p className="text-[11px] text-slate-600 font-medium">
              Accumulate and redeem points anytime
            </p>
          </div>
        </div>

        {/* Card Visual Graphic (if approved or refer) */}
        {(outcome === 'Approved' || outcome === 'Refer') && cardVariant !== 'N/A' && (
          <div className="pt-2">
            <div className={`rounded-2xl p-6 shadow-xl border max-w-md mx-auto relative overflow-hidden ${activeCardTheme.bg}`}>
              <div className="absolute right-0 top-0 w-32 h-32 bg-[#F2A93B]/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="flex items-center justify-between mb-8">
                <div className="text-[10px] font-bold tracking-widest uppercase">CARD ISSUER &bull; LIFETIME FREE</div>
                <div className={`text-xs px-2.5 py-0.5 rounded-md ${activeCardTheme.badge}`}>
                  {cardVariant}
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-mono tracking-widest mb-6">
                •••• •••• •••• 8842
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-wider block opacity-80">CARDHOLDER</span>
                  <span className="text-xs font-bold uppercase">
                    {formData.fullName ? formData.fullName.toUpperCase() : 'VALUED CARDHOLDER'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-wider block opacity-80">APPROVED LIMIT</span>
                  <span className={`text-sm font-extrabold ${activeCardTheme.text}`}>
                    {formatRupee(predictedLimit)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AiRiskAnalysis profile={formData} result={result} />

      {/* 6-STAGE BANKING VERIFICATION AUDIT REPORT */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#F2A93B] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Automated Underwriting Report</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B2447]">
              Multi-Stage Bank Verification Audit
            </h2>
          </div>

          <div>
            {result.verificationSummary && (
              <span
                className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-sm ${
                  result.verificationSummary.failCount > 0
                    ? 'bg-rose-50 text-rose-800 border-rose-300'
                    : result.verificationSummary.warnCount > 0
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                }`}
              >
                <span>
                  {result.verificationSummary.failCount > 0
                    ? `⚠️ ${result.verificationSummary.failCount} Stage(s) Failed Underwriting`
                    : result.verificationSummary.warnCount > 0
                    ? `⚠️ Verified with ${result.verificationSummary.warnCount} Scrutiny Flag(s)`
                    : `✓ All 6 Verification Stages Passed Clean`}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Grid of the 6 verification stages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.verificationChecks?.map((check, idx) => {
            const isPass = check.status === 'PASS';
            const isWarn = check.status === 'WARN';
            const isFail = check.status === 'FAIL';

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all space-y-2 flex flex-col justify-between ${
                  isPass
                    ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                    : isWarn
                    ? 'bg-amber-50/60 border-amber-300 text-slate-800'
                    : 'bg-rose-50/60 border-rose-300 text-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {check.stage} &bull; {check.mandatory ? 'Mandatory' : 'Optional'}
                  </span>
                  <span
                    className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      isPass
                        ? 'bg-emerald-600 text-white'
                        : isWarn
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {isPass && <CheckCircle2 className="w-3 h-3" />}
                    {isWarn && <AlertTriangle className="w-3 h-3" />}
                    {isFail && <XCircle className="w-3 h-3" />}
                    <span>{check.status}</span>
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#0B2447] leading-snug">
                    {check.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {check.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {outcome === 'Refer' && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-2">
            <div className="font-bold flex items-center space-x-1.5 text-amber-950">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Underwriter Action Required for Approval:</span>
            </div>
            <p className="leading-relaxed">
              To proceed from 'Refer' to formal card sanction, private banks require: (1) Account Aggregator OTP consent to electronically verify 6 months of bank salary credits; (2) Upload of 3 latest monthly salary slips / Form 16; (3) 2-minute Video-KYC (V-KYC) with original physical PAN card and live geo-tagging.
            </p>
          </div>
        )}
      </div>

      {/* GUARANTEED SECURED CARD ALTERNATIVE (IF REJECTED OR NEW-TO-CREDIT) */}
      {securedAlternative && (
        <div className="rounded-3xl border-2 border-emerald-400 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 sm:p-8 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-200 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  100% Guaranteed Approval Path
                </span>
                <h3 className="text-xl font-extrabold text-[#0B2447]">
                  {securedAlternative.title}
                </h3>
              </div>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-emerald-300 shadow-sm text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Instant Credit Limit</span>
              <span className="text-xl font-black text-emerald-700">
                {formatRupee(securedAlternative.limit)}
              </span>
              <span className="text-[10px] text-slate-500 block">100% against matching FD</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            Even if unsecured requirements are not currently met, you can secure this credit card with <strong>100% guaranteed approval</strong> backed by a flexible Fixed Deposit. Earn full bank FD interest rates while establishing your bureau credit vintage.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            {securedAlternative.features.map((feat, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-xs font-semibold text-slate-800 bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TRANSUNION CIBIL SCORE GAUGE & 5-FACTOR PILLARS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: TransUnion CIBIL 300-900 Score Gauge (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-between space-y-4">
          <div className="text-center w-full">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
              TransUnion CIBIL Standard
            </span>
            <h3 className="text-xl font-extrabold text-[#0B2447] flex items-center justify-center space-x-1.5">
              <span>CIBIL Score:</span>
              <span className={`text-base font-black ${categoryColor}`}>
                {cibilCategory}
              </span>
            </h3>
          </div>

          {/* SVG Arc Gauge calibrated mathematically to TransUnion CIBIL bands */}
          <div className="relative w-64 h-36 flex items-end justify-center">
            <svg viewBox="0 0 200 110" className="w-full h-full">
              {/* Background Arc */}
              <path
                d="M 25 95 A 75 75 0 0 1 175 95"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="16"
                strokeLinecap="round"
              />

              {/* Band 1: Poor (300 to 649) -> Red */}
              <path
                d="M 25 95 A 75 75 0 0 1 119.41 22.56"
                fill="none"
                stroke="#ef4444"
                strokeWidth="16"
              />

              {/* Band 2: Fair (650 to 699) -> Amber */}
              <path
                d="M 119.41 22.56 A 75 75 0 0 1 137.5 30.05"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="16"
              />

              {/* Band 3: Good (700 to 749) -> Teal */}
              <path
                d="M 137.5 30.05 A 75 75 0 0 1 153.03 41.97"
                fill="none"
                stroke="#10b981"
                strokeWidth="16"
              />

              {/* Band 4: Excellent (750 to 900) -> Deep Emerald Prime */}
              <path
                d="M 153.03 41.97 A 75 75 0 0 1 175 95"
                fill="none"
                stroke="#047857"
                strokeWidth="16"
                strokeLinecap="round"
              />

              {/* Needle Indicator */}
              <g transform={`rotate(${needleAngle}, 100, 95)`}>
                <line
                  x1="100"
                  y1="95"
                  x2="100"
                  y2="28"
                  stroke="#0B2447"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="95" r="7" fill="#F2A93B" stroke="#0B2447" strokeWidth="2.5" />
              </g>
            </svg>

            {/* Score Callout */}
            <div className="absolute bottom-0 text-center">
              <span className="text-3xl font-black text-[#0B2447] tracking-tight">{totalScore}</span>
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">
                Range 300 – 900
              </span>
            </div>
          </div>

          {/* Official TransUnion Score Band Legend */}
          <div className="grid grid-cols-4 gap-1 w-full text-[10px] text-center pt-2 border-t border-slate-200">
            <div
              className={`p-1.5 rounded-lg font-bold transition-all ${
                totalScore < 650 ? 'bg-red-500 text-white shadow-sm ring-2 ring-red-400' : 'bg-red-50 text-red-700'
              }`}
            >
              300–649 <br /> Poor
            </div>
            <div
              className={`p-1.5 rounded-lg font-bold transition-all ${
                totalScore >= 650 && totalScore < 700
                  ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-400'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              650–699 <br /> Fair
            </div>
            <div
              className={`p-1.5 rounded-lg font-bold transition-all ${
                totalScore >= 700 && totalScore < 750
                  ? 'bg-teal-600 text-white shadow-sm ring-2 ring-teal-400'
                  : 'bg-teal-50 text-teal-700'
              }`}
            >
              700–749 <br /> Good
            </div>
            <div
              className={`p-1.5 rounded-lg font-bold transition-all ${
                totalScore >= 750
                  ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-500'
                  : 'bg-emerald-50 text-emerald-800'
              }`}
            >
              750–900 <br /> Excellent
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center w-full">
            <p className="text-[10px] text-slate-600 font-medium leading-snug">
              ⭐ <strong>79%</strong> of all credit cards sanctioned in India are issued to applicants with a score of <strong>750+</strong>.
            </p>
          </div>
        </div>

        {/* Middle Column: What-If Trend Line (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-bold text-[#F2A93B] uppercase tracking-widest block mb-1">
              TransUnion Score Trajectory
            </span>
            <h3 className="text-lg font-bold text-[#0B2447] flex items-center gap-2">
              <LineChartIcon className="w-5 h-5 text-[#F2A93B]" />
              Score Sensitivity Analysis
            </h3>
          </div>

          <div className="flex-1 w-full min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                  tickMargin={10}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[300, 900]}
                  stroke="#94a3b8"
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '8px',
                    color: '#0f172a',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#0B2447', fontWeight: 700 }}
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#0B2447"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#ffffff', stroke: '#0B2447', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: '#0B2447', stroke: '#ffffff' }}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-500 text-center uppercase tracking-wider font-bold">
            TransUnion CIBIL score shifts based on debt reduction and income surplus
          </p>
        </div>

        {/* Right Column: 5 Official TransUnion Score Factors (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <span className="text-[10px] font-bold text-[#F2A93B] uppercase tracking-widest block mb-1">
              TransUnion CIBIL Factor Model
            </span>
            <h3 className="text-lg font-bold text-[#0B2447]">
              5 Bureau Scoring Pillars
            </h3>
          </div>

          <div className="space-y-3.5">
            {scoreBands.map((band, idx) => {
              const isHigh = band.percentage >= 75;
              const isMedium = band.percentage >= 50 && band.percentage < 75;

              const barColor = isHigh ? 'bg-emerald-500' : isMedium ? 'bg-amber-500' : 'bg-red-500';
              const badgeBg = isHigh
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : isMedium
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-red-50 text-red-800 border-red-200';

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-slate-800">{band.name}</span>
                      <span className="text-[10px] text-slate-500 font-semibold">({band.weightPercentage}%)</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold ${badgeBg}`}>
                      {band.earnedPoints} / {band.maxPoints} pts
                    </span>
                  </div>

                  {/* Horizontal Progress Bar */}
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
                      style={{ width: `${Math.max(5, band.percentage)}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="italic truncate max-w-[210px]">{band.description}</span>
                    <span className="font-semibold text-slate-700">{band.transUnionImpact}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* BOTTOM CARDS: Benchmark Stat & Policy Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Similar Applicants Stat */}
        <div className="bg-gradient-to-br from-[#0B2447] to-[#19376D] text-white p-6 rounded-3xl border border-slate-300 shadow-sm flex items-start space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F2A93B]/20 text-[#F2A93B] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#F2A93B] uppercase tracking-wider block">
              Portfolio Similarity Benchmark
            </span>
            <div className="text-3xl font-extrabold text-white">
              {similarApplicantsApprovalRate}% Approved
            </div>
            <p className="text-xs text-white leading-relaxed">
              Applicants in the same income tier ({formatRupee(formData.netMonthlyIncome)}/mo) and credit age category were approved in{' '}
              <span className="font-bold text-[#F2A93B]">{similarApplicantsApprovalRate}%</span> of simulated retail portfolio benchmarks.
            </p>
          </div>
        </div>

        {/* TransUnion CIBIL Standards Info Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-start space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#102F5A] text-white flex items-center justify-center shrink-0 border border-slate-200">
            <Info className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-2 text-xs text-slate-600">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Underwriting Standards
            </span>
            <p className="font-bold text-[#0B2447] text-sm">
              TransUnion CIBIL Scoring & Banking Approval Standards
            </p>
            <p className="leading-relaxed">
              Credit bureaus in India calculate consumer scores between 300 and 900. Lenders enforce strict underwriting norms: (1) 750+ TransUnion CIBIL score for prime approval; (2) Account Aggregator scrub for zero ECS/cheque bounces; (3) Hard 50% FOIR ceiling; (4) Minimum income thresholds (₹25k Salaried / ₹35k Self-Employed); and (5) 100% Guaranteed Secured Card option backed by Fixed Deposit for credit building.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
