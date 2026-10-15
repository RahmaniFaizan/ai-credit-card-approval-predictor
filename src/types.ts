/**
 * Credit Card Approval Predictor Data Types
 */

export type EmploymentType = 'Salaried' | 'Self-Employed' | 'Business Owner' | 'Unemployed' | 'Student';
export type MaritalStatus = 'Single' | 'Married' | 'Divorced';
export type EducationLevel = 'High School' | 'Graduate' | 'Postgraduate' | 'Doctorate';
export type HousingType = 'Own' | 'Rented' | 'Living with Family';
export type LoanType = 'Personal Loan' | 'Home Loan' | 'Car Loan' | 'Credit Card' | 'Other';

export type SalaryPaymentMode = 'Bank Transfer' | 'Cheque' | 'Cash';
export type EmployerCategory =
  | 'Tier 1 / Super Corporate (MNC/Listed)'
  | 'Tier 2 / Mid Corporate'
  | 'Small Firm / Unlisted / Startup'
  | 'Proprietorship / Freelance';

export type CibilScoreBand =
  | '780+'
  | '750 - 779'
  | '710 - 749'
  | '650 - 709'
  | '< 650'
  | 'No Score / New to Credit';

export interface ExistingLoan {
  id: string;
  type: LoanType;
  outstandingAmount: number;
  monthlyEmi: number;
  hasLatePayment: boolean;
  latePaymentCount: number;
  recentBounceWithin3Months: boolean;
}

export interface ApplicantProfile {
  // Step 1: Personal
  fullName: string;
  age: number;
  maritalStatus: MaritalStatus;
  dependents: number;
  education: EducationLevel;
  housing: HousingType;
  pinCode?: string;

  // Step 2: Employment & Income Verification
  employmentType: EmploymentType;
  netMonthlyIncome: number;
  jobTenureYears: number;
  salaryPaymentMode?: SalaryPaymentMode;
  employerCategory?: EmployerCategory;

  // Step 3: Credit History & Bureau Verification
  hasExistingLoans: boolean;
  loans: ExistingLoan[];
  recentEnquiries: number; // in last 6 months
  inquiriesLast30Days?: number; // in last 30 days
  isNewToCredit: boolean;
  creditAgeMonths: number; // months since first loan/card
  panNumber?: string;
  cibilScoreBand?: CibilScoreBand;
  hasSettledOrWrittenOffLoans?: boolean;
  bouncedEmiInLast6Months?: boolean;
  hasExistingCreditCard?: boolean;
  existingCardLimit?: number;
}

export type OutcomeType = 'Approved' | 'Refer' | 'Rejected';

export interface ScoreBandDetail {
  name: string;
  category: string;
  earnedPoints: number;
  maxPoints: number;
  percentage: number; // earnedPoints / maxPoints * 100
  weightPercentage: number; // 35%, 30%, 15%, 10%, 10%
  impact: 'positive' | 'neutral' | 'negative';
  transUnionImpact: 'High Impact' | 'Medium Impact' | 'Low Impact';
  description: string;
}

export interface SecuredCardAlternative {
  title: string;
  minDeposit: number;
  limit: number;
  features: string[];
}

export interface VerificationCheck {
  stage: string;
  title: string;
  status: 'PASS' | 'WARN' | 'FAIL';
  detail: string;
  mandatory: boolean;
}

export interface PredictionResult {
  totalScore: number; // 300 to 900
  cibilCategory: 'Excellent (Prime)' | 'Good (Standard)' | 'Fair (Marginal)' | 'Poor (High Risk)' | 'New to Credit (NH/NA)';
  outcome: OutcomeType;
  confidencePercent: number;
  foirPercent: number;
  predictedLimit: number;
  cardVariant: 'Classic / Millennial' | 'Select' | 'Wealth' | 'Secured (FD-Backed)' | 'N/A';
  dynamicAprPercent: number; // e.g. 9.0 to 36.0 % p.a.
  monthlyAprPercent: number; // e.g. 0.75 to 3.0 % per month
  annualFee: string; // e.g. "Lifetime Free (₹0)"
  atmCashFreeDays: number; // e.g. 48 days interest-free cash
  policyHighlights: string[];
  scoreBands: ScoreBandDetail[];
  similarApplicantsApprovalRate: number;
  reasoningNotes: string[];
  isNewToCreditApplied: boolean;
  securedAlternative?: SecuredCardAlternative;
  verificationChecks: VerificationCheck[];
  verificationSummary: {
    passedCount: number;
    warnCount: number;
    failCount: number;
    totalStages: number;
  };
}

export interface SyntheticApplicant {
  id: string;
  employmentType: EmploymentType;
  netMonthlyIncome: number;
  creditAgeMonths: number;
  foirPercent: number;
  outcome: OutcomeType;
  predictedLimit: number;
  totalScore: number;
}
