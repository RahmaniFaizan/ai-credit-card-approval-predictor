import React from 'react';
import { User, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { ApplicantProfile, EducationLevel, HousingType, MaritalStatus } from '../types';

interface Step1PersonalProps {
  formData: ApplicantProfile;
  onChange: (updated: Partial<ApplicantProfile>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step1Personal: React.FC<Step1PersonalProps> = ({
  formData,
  onChange,
  onNext,
  onBack,
}) => {
  // Age validation
  const age = formData.age;
  const isAgeValid = age >= 21 && age <= 65;
  const ageErrorMessage =
    age !== undefined && age !== 0 && !isAgeValid
      ? 'Age must be between 21 and 65 years to qualify for credit cards.'
      : '';

  // Check required fields completeness
  const isValid =
    Boolean(formData.fullName && formData.fullName.trim()) &&
    isAgeValid &&
    Boolean(formData.maritalStatus) &&
    formData.dependents !== undefined &&
    Boolean(formData.education) &&
    Boolean(formData.housing);

  return (
    <div id="step-1-personal" className="max-w-3xl mx-auto py-6 px-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-[#0B2447] text-white px-6 py-5 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#F2A93B]/20 text-[#F2A93B] flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Step 1: Personal & Demographic Details</h2>
            <p className="text-xs text-white">Basic applicant demographic profile evaluation</p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label id="lbl-fullname" className="block text-sm font-semibold text-[#0B2447]">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName || ''}
              onChange={(e) => onChange({ fullName: e.target.value })}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2447] focus:border-[#0B2447] transition-all"
            />
            <p className="text-[11px] text-slate-500">Enter your full legal name as it appears on documents.</p>
          </div>

          {/* Age */}
          <div className="space-y-1.5">
            <label id="lbl-age" className="block text-sm font-semibold text-[#0B2447]">
              Age <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={18}
              max={100}
              value={formData.age || ''}
              onChange={(e) => onChange({ age: parseInt(e.target.value, 10) || 0 })}
              placeholder="e.g. 28"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                ageErrorMessage
                  ? 'border-red-400 focus:ring-red-300 bg-red-50/50'
                  : 'border-slate-300 focus:ring-[#0B2447] focus:border-[#0B2447]'
              }`}
            />
            {ageErrorMessage ? (
              <p className="text-xs text-red-600 font-medium flex items-center mt-1">
                {ageErrorMessage}
              </p>
            ) : (
              <p className="text-[11px] text-slate-500">Applicant must be between 21 and 65 years old.</p>
            )}
          </div>

          {/* Marital Status */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0B2447]">
              Marital Status <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['Single', 'Married', 'Divorced'] as MaritalStatus[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => onChange({ maritalStatus: status })}
                  className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    formData.maritalStatus === status
                      ? 'border-[#0B2447] bg-[#0B2447] text-white shadow-sm font-semibold'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Number of Dependents */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0B2447]">
              Number of Dependents <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => onChange({ dependents: num })}
                  className={`py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    formData.dependents === num
                      ? 'border-[#0B2447] bg-[#0B2447] text-white shadow-sm font-semibold'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {num === 4 ? '4+' : num}
                </button>
              ))}
            </div>
          </div>

          {/* Highest Education */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0B2447]">
              Highest Education <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(['High School', 'Graduate', 'Postgraduate', 'Doctorate'] as EducationLevel[]).map((edu) => (
                <button
                  key={edu}
                  type="button"
                  onClick={() => onChange({ education: edu })}
                  className={`py-2.5 px-2 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                    formData.education === edu
                      ? 'border-[#0B2447] bg-[#0B2447] text-white shadow-sm font-semibold'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {edu}
                </button>
              ))}
            </div>
          </div>

          {/* Housing Type */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0B2447]">
              Housing Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['Own', 'Rented', 'Living with Family'] as HousingType[]).map((house) => (
                <button
                  key={house}
                  type="button"
                  onClick={() => onChange({ housing: house })}
                  className={`py-2.5 px-2 rounded-xl border text-xs sm:text-sm font-medium text-center transition-all cursor-pointer ${
                    formData.housing === house
                      ? 'border-[#0B2447] bg-[#0B2447] text-white shadow-sm font-semibold'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {house}
                </button>
              ))}
            </div>
          </div>

          {/* Postal PIN Code */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-[#0B2447]">
                Current Residence PIN Code <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Serviceability Check
              </span>
            </div>
            <input
              type="text"
              maxLength={6}
              value={formData.pinCode || ''}
              onChange={(e) => onChange({ pinCode: e.target.value.replace(/\D/g, '') })}
              placeholder="e.g. 400001 (6-digit PIN code)"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2447] focus:border-[#0B2447] transition-all"
            />
            <p className="text-[11px] text-slate-500">
              Required for card dispatch and checking positive / non-negative branch serviceability zones.
            </p>
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
            <span>Back to Overview</span>
          </button>

          <button
            type="button"
            id="btn-step1-next"
            disabled={!isValid}
            onClick={onNext}
            className={`inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow transition-all cursor-pointer ${
              isValid
                ? 'bg-[#0B2447] hover:bg-[#102F5A] text-white'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-70'
            }`}
          >
            <span>Next: Employment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
