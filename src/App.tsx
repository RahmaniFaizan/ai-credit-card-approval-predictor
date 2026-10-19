import React, { useState } from 'react';
import { Header } from './components/Header';
import { Step0Landing } from './components/Step0Landing';
import { Step1Personal } from './components/Step1Personal';
import { Step2Employment } from './components/Step2Employment';
import { Step3Credit } from './components/Step3Credit';
import { Step4Pipeline } from './components/Step4Pipeline';
import { Step5Results } from './components/Step5Results';
import { ApplicantProfile, PredictionResult } from './types';
import { predictApproval } from './utils/scoringEngine';
import { Sparkles, AlertCircle, Lock } from 'lucide-react';

const Footer: React.FC = () => (
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

const initialProfile: ApplicantProfile = {
  fullName: '',
  age: 28,
  maritalStatus: 'Single',
  dependents: 0,
  education: 'Graduate',
  housing: 'Rented',
  pinCode: '400001',
  employmentType: 'Salaried',
  netMonthlyIncome: 75000,
  jobTenureYears: 3.5,
  salaryPaymentMode: 'Bank Transfer',
  employerCategory: 'Tier 1 / Super Corporate (MNC/Listed)',
  hasExistingLoans: false,
  loans: [],
  recentEnquiries: 0,
  inquiriesLast30Days: 0,
  isNewToCredit: false,
  creditAgeMonths: 36,
  cibilScoreBand: '750 - 779',
  hasSettledOrWrittenOffLoans: false,
  bouncedEmiInLast6Months: false,
  hasExistingCreditCard: true,
  existingCardLimit: 100000,
  panNumber: '',
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(0); // 0 to 5
  const [profile, setProfile] = useState<ApplicantProfile>(initialProfile);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);

  const handleUpdateProfile = (updated: Partial<ApplicantProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleStart = () => {
    setCurrentStep(1);
  };

  const handleRunPrediction = () => {
    setCurrentStep(4);
  };

  const handlePipelineComplete = () => {
    const res = predictApproval(profile);
    setPredictionResult(res);
    setCurrentStep(5);
  };

  const handleReset = () => {
    setProfile(initialProfile);
    setPredictionResult(null);
    setCurrentStep(0);
  };

  // Preset Scenario Loaders for quick testing
  const loadScenario1 = () => {
    setProfile({
      fullName: 'Sania Khan',
      age: 32,
      maritalStatus: 'Married',
      dependents: 1,
      education: 'Graduate',
      housing: 'Own',
      pinCode: '400050',
      employmentType: 'Salaried',
      netMonthlyIncome: 95000,
      jobTenureYears: 6.0,
      salaryPaymentMode: 'Bank Transfer',
      employerCategory: 'Tier 1 / Super Corporate (MNC/Listed)',
      hasExistingLoans: false,
      loans: [],
      recentEnquiries: 0,
      inquiriesLast30Days: 0,
      isNewToCredit: false,
      creditAgeMonths: 72,
      cibilScoreBand: '780+',
      hasSettledOrWrittenOffLoans: false,
      bouncedEmiInLast6Months: false,
      hasExistingCreditCard: true,
      existingCardLimit: 250000,
      panNumber: 'ABCDE1234F',
    });
    setCurrentStep(1);
  };

  const loadScenario2 = () => {
    setProfile({
      fullName: 'Rohit Verma',
      age: 29,
      maritalStatus: 'Single',
      dependents: 0,
      education: 'Graduate',
      housing: 'Rented',
      pinCode: '110001',
      employmentType: 'Salaried',
      netMonthlyIncome: 60000,
      jobTenureYears: 2.0,
      salaryPaymentMode: 'Bank Transfer',
      employerCategory: 'Tier 2 / Mid Corporate',
      cibilScoreBand: '650 - 709',
      hasSettledOrWrittenOffLoans: false,
      bouncedEmiInLast6Months: true,
      recentEnquiries: 5,
      inquiriesLast30Days: 3,
      isNewToCredit: false,
      creditAgeMonths: 24,
      hasExistingLoans: true,
      loans: [
        {
          id: 'loan_bounce',
          type: 'Personal Loan',
          outstandingAmount: 120000,
          monthlyEmi: 15000,
          hasLatePayment: true,
          latePaymentCount: 2,
          recentBounceWithin3Months: true,
        },
      ],
      hasExistingCreditCard: false,
      panNumber: 'XYZDE5678K',
    });
    setCurrentStep(1);
  };

  const loadScenario3 = () => {
    setProfile({
      fullName: 'Ananya Sharma',
      age: 26,
      maritalStatus: 'Single',
      dependents: 0,
      education: 'Graduate',
      housing: 'Rented',
      pinCode: '560001',
      employmentType: 'Salaried',
      netMonthlyIncome: 42000,
      jobTenureYears: 1.2,
      salaryPaymentMode: 'Bank Transfer',
      employerCategory: 'Small Firm / Unlisted / Startup',
      cibilScoreBand: '710 - 749',
      hasSettledOrWrittenOffLoans: false,
      bouncedEmiInLast6Months: false,
      recentEnquiries: 2,
      inquiriesLast30Days: 1,
      isNewToCredit: false,
      creditAgeMonths: 18,
      hasExistingLoans: true,
      loans: [
        {
          id: 'loan_1',
          type: 'Personal Loan',
          outstandingAmount: 90000,
          monthlyEmi: 16500,
          hasLatePayment: false,
          latePaymentCount: 0,
          recentBounceWithin3Months: false,
        },
      ],
      hasExistingCreditCard: false,
      panNumber: '',
    });
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-[#F2A93B]/30 selection:text-[#0B2447]">
      {/* Header */}
      <Header
        currentStep={currentStep}
        onNavigateStep={(step) => {
          if (step <= currentStep || currentStep > 0) {
            setCurrentStep(step);
          }
        }}
      />

      {/* Quick Test Scenario Bar (visible on steps 0-3 for easy testing) */}
      {currentStep < 4 && (
        <div className="bg-[#0B2447] text-white text-xs py-2 px-4 border-b border-[#19376D]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center space-x-1.5 font-semibold text-white">
              <Sparkles className="w-3.5 h-3.5 text-[#F2A93B]" />
              <span>Bank Underwriting Presets:</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={loadScenario1}
                className="px-2.5 py-1 rounded bg-[#19376D] hover:bg-[#214685] text-amber-300 font-medium transition-colors cursor-pointer"
                title="CAT-A Corporate, CIBIL 780+, 0 Bounces -> Instant Approval for Select Tier"
              >
                1: Prime Corporate Approved (6/6 Stages Passed)
              </button>
              <button
                onClick={loadScenario2}
                className="px-2.5 py-1 rounded bg-[#19376D] hover:bg-[#214685] text-red-300 font-medium transition-colors cursor-pointer"
                title="Statement Bounce & 5 Inquiries -> Auto-Decline (Secured FD Option)"
              >
                2: Statement Bounce & Credit Hunger (Declined)
              </button>
              <button
                onClick={loadScenario3}
                className="px-2.5 py-1 rounded bg-[#19376D] hover:bg-[#214685] text-emerald-300 font-medium transition-colors cursor-pointer"
                title="Unlisted Employer + 40% FOIR -> Strict Underwriter Review (Refer)"
              >
                3: Unlisted Employer & High FOIR (Refer Review)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {currentStep === 0 && <Step0Landing onStart={handleStart} />}

        {currentStep === 1 && (
          <Step1Personal
            formData={profile}
            onChange={handleUpdateProfile}
            onNext={() => setCurrentStep(2)}
            onBack={() => setCurrentStep(0)}
          />
        )}

        {currentStep === 2 && (
          <Step2Employment
            formData={profile}
            onChange={handleUpdateProfile}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <Step3Credit
            formData={profile}
            onChange={handleUpdateProfile}
            onPredict={handleRunPrediction}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && <Step4Pipeline onComplete={handlePipelineComplete} onBack={() => setCurrentStep(3)} />}

        {currentStep === 5 && predictionResult && (
          <Step5Results formData={profile} result={predictionResult} onReset={handleReset} onEdit={() => setCurrentStep(3)} />
        )}
      </main>

      {/* Permanent Footer */}
      <Footer />
    </div>
  );
}
