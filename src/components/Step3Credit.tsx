import React, { useState } from 'react';
import {
  BarChart3,
  HelpCircle,
  Plus,
  Trash2,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { ApplicantProfile, ExistingLoan, LoanType, CibilScoreBand } from '../types';
import { parseRupeeInput } from '../utils/scoringEngine';

interface Step3CreditProps {
  formData: ApplicantProfile;
  onChange: (updated: Partial<ApplicantProfile>) => void;
  onPredict: () => void;
  onBack: () => void;
}

export const Step3Credit: React.FC<Step3CreditProps> = ({
  formData,
  onChange,
  onPredict,
  onBack,
}) => {
  const [showFoirTooltip, setShowFoirTooltip] = useState(false);
  const [showCibilTooltip, setShowCibilTooltip] = useState(false);

  // Add existing loan row
  const handleAddLoan = () => {
    const newLoan: ExistingLoan = {
      id: `loan_${Date.now()}`,
      type: 'Personal Loan',
      outstandingAmount: 50000,
      monthlyEmi: 3000,
      hasLatePayment: false,
      latePaymentCount: 0,
      recentBounceWithin3Months: false,
    };
    onChange({ loans: [...formData.loans, newLoan] });
  };

  const handleRemoveLoan = (id: string) => {
    onChange({ loans: formData.loans.filter((l) => l.id !== id) });
  };

  const handleUpdateLoan = (id: string, updated: Partial<ExistingLoan>) => {
    onChange({
      loans: formData.loans.map((l) => (l.id === id ? { ...l, ...updated } : l)),
    });
  };

  // Form validity check
  const isEnquiriesValid = formData.recentEnquiries !== undefined && formData.recentEnquiries >= 0;
  const isCreditAgeValid =
    formData.isNewToCredit || (formData.creditAgeMonths !== undefined && formData.creditAgeMonths >= 0);

  const isValid = isEnquiriesValid && isCreditAgeValid;

  return (
    <div id="step-3-credit" className="max-w-3xl mx-auto py-6 px-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-[#0B2447] text-white px-6 py-5 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#F2A93B]/20 text-[#F2A93B] flex items-center justify-center font-bold">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Step 3: Bureau Standing & Bank Audit Verification</h2>
            <p className="text-xs text-white">Credit bureau history, Account Aggregator statement scrub, & active debt</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* CIBIL / Bureau Score Band (Primary Real-World Bank Underwriting Metric) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-[#0B2447] flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-[#F2A93B]" />
                <span>Credit Bureau (CIBIL / Experian) Standing <span className="text-red-500">*</span></span>
              </label>

              {/* Tooltip */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCibilTooltip(!showCibilTooltip)}
                  className="text-slate-600 hover:text-[#0B2447] flex items-center space-x-1 text-xs transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-[#F2A93B]" />
                  <span>Bureau Norms</span>
                </button>
                {showCibilTooltip && (
                  <div className="absolute right-0 top-6 w-64 p-3 bg-[#0B2447] text-white text-xs rounded-xl shadow-xl z-30 border border-[#19376D]">
                    <p className="font-semibold text-[#F2A93B] mb-1">CIBIL Score Cutoffs</p>
                    <p className="leading-relaxed">
                      Private banks require 750+ for instant prime approval. Scores below 710 are referred or declined for unsecured cards.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(
                [
                  '780+',
                  '750 - 779',
                  '710 - 749',
                  '650 - 709',
                  '< 650',
                  'No Score / New to Credit',
                ] as CibilScoreBand[]
              ).map((band) => (
                <button
                  key={band}
                  type="button"
                  onClick={() => {
                    const isNtc = band === 'No Score / New to Credit';
                    onChange({
                      cibilScoreBand: band,
                      isNewToCredit: isNtc,
                      creditAgeMonths: isNtc ? 0 : formData.creditAgeMonths || 24,
                    });
                  }}
                  className={`py-2.5 px-2 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    (formData.cibilScoreBand || '750 - 779') === band
                      ? 'border-[#0B2447] bg-[#0B2447] text-white shadow-sm font-semibold'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-bold">{band}</span>
                  <span className="text-[10px] opacity-75 mt-0.5">
                    {band === '780+'
                      ? 'Super-Prime'
                      : band === '750 - 779'
                      ? 'Prime'
                      : band === '710 - 749'
                      ? 'Standard'
                      : band === '650 - 709'
                      ? 'Marginal'
                      : band === '< 650'
                      ? 'High Risk'
                      : 'Thin File'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Account Aggregator Statement & Derogatory Scrub (Real Bank Knockout Triggers) */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-[#0B2447] uppercase tracking-wider flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Account Aggregator & Delinquency Verification</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">Real-world Bank Scrub</span>
            </div>

            {/* Toggle 1: Cheque / ECS / NACH Bounce in last 6 months */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs sm:text-sm font-semibold text-[#0B2447] block">
                  Any ECS / NACH EMI or Cheque bounce in bank statement within last 6 months?
                </label>
                <p className="text-[11px] text-slate-500">
                  Detected automatically during bank statement fetch via Account Aggregator.
                </p>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onChange({ bouncedEmiInLast6Months: false })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                    !formData.bouncedEmiInLast6Months
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-600 border-slate-300'
                  }`}
                >
                  No (Clean)
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ bouncedEmiInLast6Months: true })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                    formData.bouncedEmiInLast6Months
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-slate-600 border-slate-300'
                  }`}
                >
                  Yes (Bounce)
                </button>
              </div>
            </div>

            {/* Toggle 2: Settled / Written-off loans on CIBIL */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-200/80">
              <div>
                <label className="text-xs sm:text-sm font-semibold text-[#0B2447] block">
                  Any loan or credit card ever Written-off, Settled, or Restructured on CIBIL?
                </label>
                <p className="text-[11px] text-slate-500">
                  Derogatory bureau remarks trigger instant automatic rejection in private banks.
                </p>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onChange({ hasSettledOrWrittenOffLoans: false })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                    !formData.hasSettledOrWrittenOffLoans
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-600 border-slate-300'
                  }`}
                >
                  No (0 Remarks)
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ hasSettledOrWrittenOffLoans: true })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                    formData.hasSettledOrWrittenOffLoans
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-slate-600 border-slate-300'
                  }`}
                >
                  Yes (Settled)
                </button>
              </div>
            </div>
          </div>

          {/* Hard Credit Enquiries (Inquiry Velocity Scrub) */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#0B2447]">
                  Credit inquiries in the last 30 days <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 1, 2, 3].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => onChange({ inquiriesLast30Days: num })}
                      className={`py-2 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                        (formData.inquiriesLast30Days ?? 0) === num
                          ? 'border-[#0B2447] bg-[#0B2447] text-white shadow-sm'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {num === 3 ? '3+' : num}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500">≥2 in 30 days triggers credit hunger scrutiny.</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#0B2447]">
                  Total inquiries in last 6 months <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[0, 1, 2, 3, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => onChange({ recentEnquiries: num })}
                      className={`py-2 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                        formData.recentEnquiries === num
                          ? 'border-[#0B2447] bg-[#0B2447] text-white shadow-sm'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {num === 5 ? '5+' : num}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500">≥5 hard enquiries is an auto-knockout.</p>
              </div>
            </div>
          </div>

          {/* Card-to-Card Surrogate Route */}
          <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-semibold text-[#0B2447] flex items-center space-x-1.5">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Do you hold an existing active credit card with another bank?</span>
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => onChange({ hasExistingCreditCard: true })}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                    formData.hasExistingCreditCard
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-white text-slate-600 border-slate-300'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ hasExistingCreditCard: false })}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                    !formData.hasExistingCreditCard
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-600 border-slate-300'
                  }`}
                >
                  No
                </button>
              </div>
            </div>
            {formData.hasExistingCreditCard && (
              <p className="text-[11px] text-blue-900 font-medium">
                Card-to-Card Surrogate Activated: Holding a prime credit card with another bank enhances approval odds and limit assignment.
              </p>
            )}
          </div>

          {/* Toggle: Existing Loans & Monthly EMIs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-[#0B2447]">
                Do you currently have any existing loan EMIs? <span className="text-red-500">*</span>
              </label>

              {/* FOIR Tooltip button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowFoirTooltip(!showFoirTooltip)}
                  className="text-slate-600 hover:text-[#0B2447] flex items-center space-x-1 text-xs transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-[#F2A93B]" />
                  <span>50% FOIR Rule</span>
                </button>
                {showFoirTooltip && (
                  <div className="absolute right-0 top-6 w-64 p-3 bg-[#0B2447] text-white text-xs rounded-xl shadow-xl z-30 border border-[#19376D]">
                    <p className="font-semibold text-[#F2A93B] mb-1">50% FOIR Rule</p>
                    <p className="leading-relaxed">
                      Banks reject applications if existing monthly EMIs exceed 50% of your net monthly income.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-xs">
              <button
                type="button"
                onClick={() => {
                  onChange({ hasExistingLoans: false, loans: [] });
                }}
                className={`py-2 px-4 rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  !formData.hasExistingLoans
                    ? 'border-[#0B2447] bg-[#0B2447] text-white shadow-sm font-semibold'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                No Existing Loans
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange({ hasExistingLoans: true });
                  if (formData.loans.length === 0) {
                    handleAddLoan();
                  }
                }}
                className={`py-2 px-4 rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  formData.hasExistingLoans
                    ? 'border-[#0B2447] bg-[#0B2447] text-white shadow-sm font-semibold'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Yes, I Have Loans
              </button>
            </div>
          </div>

          {/* Existing Loans List */}
          {formData.hasExistingLoans && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Existing Loan Details & Monthly EMIs
                </span>
                <button
                  type="button"
                  onClick={handleAddLoan}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#0B2447] bg-[#F2A93B]/20 hover:bg-[#F2A93B]/30 px-3 py-1.5 rounded-lg border border-[#F2A93B]/40 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Loan</span>
                </button>
              </div>

              {formData.loans.map((loan, index) => (
                <div
                  key={loan.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0B2447]">Loan Obligation #{index + 1}</span>
                    {formData.loans.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLoan(loan.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-md transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Loan Type
                      </label>
                      <select
                        value={loan.type}
                        onChange={(e) => handleUpdateLoan(loan.id, { type: e.target.value as LoanType })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#0B2447]"
                      >
                        <option value="Personal Loan">Personal Loan</option>
                        <option value="Home Loan">Home Loan</option>
                        <option value="Car Loan">Car / Vehicle Loan</option>
                        <option value="Credit Card">Credit Card EMI</option>
                        <option value="Other">Other Retail Loan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Monthly EMI Amount (₹)
                      </label>
                      <input
                        type="text"
                        value={loan.monthlyEmi ? loan.monthlyEmi.toLocaleString('en-IN') : ''}
                        onChange={(e) => {
                          const val = parseRupeeInput(e.target.value);
                          handleUpdateLoan(loan.id, { monthlyEmi: val });
                        }}
                        placeholder="e.g. 15,000"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#0B2447]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Credit Vintage / Age */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-[#0B2447]">
                First-ever Loan/Credit Card Vintage <span className="text-red-500">*</span>
              </label>
            </div>

            {!formData.isNewToCredit && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { label: '1 – 6 Months', months: 4 },
                  { label: '6 – 24 Months', months: 18 },
                  { label: '2 – 5 Years', months: 42 },
                  { label: '5+ Years (60m+)', months: 72 },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => onChange({ creditAgeMonths: opt.months })}
                    className={`py-2.5 px-2 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                      formData.creditAgeMonths === opt.months
                        ? 'border-[#0B2447] bg-[#0B2447] text-white shadow-sm font-semibold'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-slate-600 hover:text-[#0B2447] font-semibold text-sm px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="button"
            id="btn-predict-approval"
            disabled={!isValid}
            onClick={onPredict}
            className={`inline-flex items-center space-x-2 px-8 py-3 rounded-xl font-bold text-base shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5 ${
              isValid
                ? 'bg-[#F2A93B] hover:bg-[#e0982d] text-[#0B2447]'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-70'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span>Run Banking Verification & Underwriting</span>
          </button>
        </div>
      </div>
    </div>
  );
};
