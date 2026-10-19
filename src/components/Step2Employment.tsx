import React from 'react';
import { Briefcase, ArrowRight, ArrowLeft, Building2, Wallet } from 'lucide-react';
import { ApplicantProfile, EmploymentType, EmployerCategory, SalaryPaymentMode } from '../types';
import { formatRupee, parseRupeeInput } from '../utils/scoringEngine';

interface Step2EmploymentProps {
  formData: ApplicantProfile;
  onChange: (updated: Partial<ApplicantProfile>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2Employment: React.FC<Step2EmploymentProps> = ({
  formData,
  onChange,
  onNext,
  onBack,
}) => {
  const isNoIncomeAllowed =
    formData.employmentType === 'Unemployed' || formData.employmentType === 'Student';

  const isIncomeValid = isNoIncomeAllowed
    ? formData.netMonthlyIncome >= 0
    : formData.netMonthlyIncome > 0;

  const isTenureValid = formData.jobTenureYears !== undefined && formData.jobTenureYears >= 0;

  const isValid = Boolean(formData.employmentType) && isIncomeValid && isTenureValid;

  return (
    <div id="step-2-employment" className="max-w-3xl mx-auto py-6 px-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-[#0B2447] text-white px-6 py-5 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#F2A93B]/20 text-[#F2A93B] flex items-center justify-center font-bold">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Step 2: Employment & Income Verification</h2>
            <p className="text-xs text-white">EPFO employment category and verified salary credit checks</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Employment Type */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0B2447]">
              Employment Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(['Salaried', 'Self-Employed', 'Business Owner', 'Student', 'Unemployed'] as EmploymentType[]).map(
                (emp) => (
                  <button
                    key={emp}
                    type="button"
                    onClick={() => {
                      const updates: Partial<ApplicantProfile> = { employmentType: emp };
                      onChange(updates);
                    }}
                    className={`py-3 px-3 rounded-xl border text-xs sm:text-sm font-medium text-center transition-all cursor-pointer ${
                      formData.employmentType === emp
                        ? 'border-[#0B2447] bg-[#0B2447] text-white shadow-sm font-semibold'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {emp}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Employer Category (Crucial Banking Underwriting Criterion) */}
          {!isNoIncomeAllowed && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-[#0B2447] flex items-center space-x-1.5">
                  <Building2 className="w-4 h-4 text-[#F2A93B]" />
                  <span>Employer Organization Category</span>
                </label>
                <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Bank Corporate List
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(
                  [
                    'Tier 1 / Super Corporate (MNC/Listed)',
                    'Tier 2 / Mid Corporate',
                    'Small Firm / Unlisted / Startup',
                    'Proprietorship / Freelance',
                  ] as EmployerCategory[]
                ).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => onChange({ employerCategory: cat })}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer flex items-center justify-between ${
                      (formData.employerCategory || 'Tier 1 / Super Corporate (MNC/Listed)') === cat
                        ? 'border-[#0B2447] bg-[#0B2447] text-white shadow-sm font-semibold'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[10px] opacity-70 ml-2">
                      {cat.includes('Tier 1') ? 'CAT-A' : cat.includes('Tier 2') ? 'CAT-B' : 'CAT-C'}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500">
                Banks assign higher credit limits and lower interest rates to Category A & B corporate employers.
              </p>
            </div>
          )}

          {/* Salary Payment Mode (Mandatory Bank Verification Check) */}
          {!isNoIncomeAllowed && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-[#0B2447] flex items-center space-x-1.5">
                  <Wallet className="w-4 h-4 text-[#F2A93B]" />
                  <span>Salary / Income Credit Mode <span className="text-red-500">*</span></span>
                </label>
                <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Audit Check
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {(['Bank Transfer', 'Cheque', 'Cash'] as SalaryPaymentMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => onChange({ salaryPaymentMode: mode })}
                    className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium text-center transition-all cursor-pointer ${
                      (formData.salaryPaymentMode || 'Bank Transfer') === mode
                        ? 'border-[#0B2447] bg-[#0B2447] text-white shadow-sm font-semibold'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {mode === 'Bank Transfer' ? 'Direct Bank Transfer' : mode}
                  </button>
                ))}
              </div>
              {formData.salaryPaymentMode === 'Cash' ? (
                <p className="text-xs text-red-600 font-semibold bg-red-50 p-2 rounded-lg border border-red-200">
                  ⚠️ Note: Private sector banks strictly require electronic bank credit verification. Cash salaries fail unsecured card underwriting.
                </p>
              ) : (
                <p className="text-[11px] text-slate-500">
                  Banks verify direct NEFT/RTGS salary credits via Account Aggregator or statement net banking fetch.
                </p>
              )}
            </div>
          )}

          {/* Net Monthly Income */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-[#0B2447]">
                Net Monthly In-Hand Income (₹) <span className="text-red-500">*</span>
              </label>
              {formData.netMonthlyIncome > 0 && (
                <span className="text-xs font-bold text-[#D98E2B] bg-[#F2A93B]/10 px-2.5 py-0.5 rounded-md border border-[#F2A93B]/20">
                  Formatted: {formatRupee(formData.netMonthlyIncome)}
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-600 font-bold text-sm">₹</span>
              <input
                type="text"
                value={formData.netMonthlyIncome ? formData.netMonthlyIncome.toLocaleString('en-IN') : ''}
                onChange={(e) => {
                  const val = parseRupeeInput(e.target.value);
                  onChange({ netMonthlyIncome: val });
                }}
                placeholder={isNoIncomeAllowed ? 'e.g. 0 or 25,000' : 'e.g. 75,000'}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2447] focus:border-[#0B2447] transition-all"
              />
            </div>
            {isNoIncomeAllowed ? (
              <p className="text-[11px] text-slate-500">
                Since you selected {formData.employmentType}, income can be ₹0 (eligible for Secured Card against FD).
              </p>
            ) : (
              <p className="text-[11px] text-slate-500">
                Verified take-home monthly salary credited to bank account after deductions.
              </p>
            )}
          </div>

          {/* Years in Current Job / Business */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0B2447]">
              Years in Current Job / Business <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: '< 1 Year', value: 0.5 },
                { label: '1 – 2 Years', value: 1.5 },
                { label: '2 – 5 Years', value: 3.5 },
                { label: '5+ Years', value: 6.0 },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => onChange({ jobTenureYears: opt.value })}
                  className={`py-3 px-2 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                    formData.jobTenureYears === opt.value
                      ? 'border-[#0B2447] bg-[#0B2447] text-white shadow-sm font-semibold'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
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
            id="btn-step2-next"
            disabled={!isValid}
            onClick={onNext}
            className={`inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow transition-all cursor-pointer ${
              isValid
                ? 'bg-[#0B2447] hover:bg-[#102F5A] text-white'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-70'
            }`}
          >
            <span>Next: Credit & Bureau History</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
