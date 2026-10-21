/**
 * AI Underwriting Explainer Utility
 * Provides deterministic plain-English risk analysis for credit card underwriting
 * and helpers for Gemini API configuration.
 */

export interface RiskAnalysisApplicant {
  employmentType?: string;
  monthlyIncome?: number;
  jobTenureYears?: number;
  creditAgeMonths?: number;
  hasExistingLoans?: boolean;
}

export interface RiskAnalysisAssessment {
  outcome?: string;
  score?: number;
  scoreCategory?: string;
  foirPercent?: number;
  cardVariant?: string;
  aprPercent?: number;
  verificationSummary?: { passedCount?: number; warnCount?: number; failCount?: number };
  reasoningNotes?: string[];
}

export interface RiskAnalysisPayload {
  applicant?: RiskAnalysisApplicant;
  assessment?: RiskAnalysisAssessment;
}

/**
 * Checks whether an API key string is empty, null, or a template placeholder.
 */
export function isPlaceholderApiKey(key?: string | null): boolean {
  if (!key) return true;
  const trimmed = key.trim().toLowerCase();
  return (
    trimmed === '' ||
    trimmed === 'replace-with-your-google-ai-studio-key' ||
    trimmed.startsWith('replace-') ||
    trimmed.includes('your-google-ai-studio-key') ||
    trimmed.includes('your-api-key') ||
    trimmed.includes('your_gemini_api_key') ||
    trimmed === 'todo' ||
    trimmed === 'null' ||
    trimmed === 'undefined'
  );
}

/**
 * Generates an institutional recruiter-quality plain-English explanation of the
 * simulated underwriting decision in the exact required 3 sections:
 * - Decision drivers
 * - Risk-reduction actions
 * - Important disclaimer
 */
export function generateLocalRiskAnalysis(payload: RiskAnalysisPayload): string {
  const applicant = payload.applicant || {};
  const assessment = payload.assessment || {};

  const outcome = assessment.outcome || 'Refer';
  const score = assessment.score ?? 700;
  const scoreCategory = assessment.scoreCategory || 'Good (Standard)';
  const foir = Math.round(assessment.foirPercent ?? 35);
  const cardVariant = assessment.cardVariant || 'Classic / Millennial Card';
  const apr = assessment.aprPercent ?? 18.0;
  const tenure = applicant.jobTenureYears ?? 2;
  const empType = applicant.employmentType || 'Salaried';
  const income = applicant.monthlyIncome ?? 50000;
  const creditAgeYrs = Math.max(1, Math.round((applicant.creditAgeMonths ?? 36) / 12));
  const verification = assessment.verificationSummary || { passedCount: 6, warnCount: 0, failCount: 0 };

  const formattedIncome = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(income);

  // --- SECTION 1: Decision Drivers ---
  const drivers: string[] = [];

  if (outcome === 'Approved') {
    drivers.push(
      `Credit Standing: The simulated TransUnion CIBIL score of ${score} (${scoreCategory}) exceeds the prime threshold (750+), indicating exemplary debt servicing discipline and low statistical default probability.`
    );
    drivers.push(
      `Debt-to-Income (FOIR): Monthly debt obligations stand at ${foir}% of net income (${formattedIncome}/mo), comfortably below the institutional 50% regulatory ceiling, ensuring ample disposable cash flow.`
    );
    drivers.push(
      `Profile Stability: A sustained tenure of ${tenure} year${tenure === 1 ? '' : 's'} in a ${empType} capacity provides verified cash-flow stability, qualifying the applicant for the ${cardVariant} tier at an optimal risk-based APR of ${apr}% p.a.`
    );
    if (verification.passedCount && verification.passedCount >= 5) {
      drivers.push(
        `Verification Audit: Cleared ${verification.passedCount} of 6 institutional compliance stages (clean bank statements, zero mandate bounces, verified employer standing, and clean inquiry velocity).`
      );
    }
  } else if (outcome === 'Refer') {
    drivers.push(
      `Marginal Bureau Score: The simulated CIBIL score of ${score} places this file in the "${scoreCategory}" band, satisfying baseline criteria but requiring senior underwriter review before credit line sanction.`
    );
    drivers.push(
      `Debt Servicing Ratio (FOIR): Active obligations consume ${foir}% of monthly income. While within nominal limits, it restricts discretionary repayment buffer against unexpected liquidity shocks.`
    );
    drivers.push(
      `Underwriting Scrutiny: ${verification.warnCount ?? 1} stage(s) in the multi-stage banking audit flagged borderline observations, requiring manual verification of recent pay slips or unlisted employer credentials.`
    );
  } else {
    // Rejected / Subprime
    drivers.push(
      `Institutional Policy Knockout: A simulated score of ${score} (${scoreCategory}) falls below the unsecured underwriting cutoff, presenting elevated portfolio default risk.`
    );
    drivers.push(
      `Leverage & Tradeline Stress: High FOIR (${foir}%) and/or adverse bureau remarks (such as mandate bounces, write-offs, or elevated inquiry frequency) breached automated credit risk rules.`
    );
    drivers.push(
      `Credit Allocation Outcome: Unsecured card issuance is declined; the applicant is automatically routed to the 100% Guaranteed Secured (FD-Backed) credit builder card.`
    );
  }

  if (assessment.reasoningNotes && assessment.reasoningNotes.length > 0) {
    const keyNotes = assessment.reasoningNotes.slice(0, 2).join('; ');
    drivers.push(`Policy Observations: ${keyNotes}.`);
  }

  // --- SECTION 2: Risk-Reduction Actions ---
  const actions: string[] = [];

  if (foir > 35) {
    actions.push(
      `Lower Debt Obligations: Prepay higher-interest unsecured loans or revolving credit balances to reduce monthly FOIR from ${foir}% down below 30%, which immediately unlocks higher credit limits.`
    );
  } else {
    actions.push(
      `Maintain Credit Utilization Discipline: Keep monthly revolving credit card balances under 30% of total sanctioned credit limits across all billing cycles to optimize the bureau exposure pillar.`
    );
  }

  if (outcome !== 'Approved') {
    actions.push(
      `Eliminate Mandate Bounces: Ensure uninterrupted bank account balance to prevent NACH, ECS, or cheque return flags for at least 6 consecutive statement cycles.`
    );
    actions.push(
      `Pause Hard Credit Inquiries: Refrain from applying for new loans or cards for 90–180 days to extinguish credit hunger velocity flags on bureau reports.`
    );
    actions.push(
      `Rebuild via Secured Tradeline: Open a Fixed Deposit (FD) backed credit card (minimum Rs 10,000 deposit) and maintain perfect on-time settlements to steadily push CIBIL back toward 750+.`
    );
  } else {
    actions.push(
      `Preserve Credit Vintage: Retain your oldest active credit card accounts (current credit age: ~${creditAgeYrs} years) to maximize vintage scoring points.`
    );
    actions.push(
      `Automate Repayments: Activate automated NACH/ECS mandate for Total Amount Due (TAD) to eliminate any risk of accidental late payment charges.`
    );
  }

  // --- SECTION 3: Important Disclaimer ---
  const disclaimer =
    `Educational simulation only. This analysis reflects the deterministic underwriting rules engine and is provided for demonstration purposes. It does not contact real credit bureaus (TransUnion CIBIL), Account Aggregators, or financial institutions, does not guarantee credit issuance, and does not constitute financial advice.`;

  return [
    `Decision drivers:\n${drivers.map((d) => `• ${d}`).join('\n')}`,
    `\nRisk-reduction actions:\n${actions.map((a) => `• ${a}`).join('\n')}`,
    `\nImportant disclaimer:\n${disclaimer}`,
  ].join('\n');
}

export interface ParsedAnalysisSection {
  title: string;
  items: string[];
  rawText: string;
}

export interface ParsedAnalysis {
  decisionDrivers?: ParsedAnalysisSection;
  riskReductionActions?: ParsedAnalysisSection;
  disclaimer?: ParsedAnalysisSection;
  rawText: string;
}

/**
 * Parses a plain-English 3-section analysis into structured data for rich UI rendering.
 */
export function parseAnalysisSections(text: string): ParsedAnalysis {
  const result: ParsedAnalysis = { rawText: text };

  // Match sections by standard headings
  const driversMatch = text.match(/(?:decision drivers|1[\.\)]\s*decision drivers):?([\s\S]*?)(?=(?:risk-reduction actions|risk reduction actions|2[\.\)]|important disclaimer|3[\.\)]|$))/i);
  const actionsMatch = text.match(/(?:risk-reduction actions|risk reduction actions|2[\.\)]\s*risk-reduction actions):?([\s\S]*?)(?=(?:important disclaimer|3[\.\)]|$))/i);
  const disclaimerMatch = text.match(/(?:important disclaimer|3[\.\)]\s*important disclaimer):?([\s\S]*?)$/i);

  const extractItems = (sectionBody: string): string[] => {
    return sectionBody
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => line.replace(/^[\u2022\u2023\u25E6\u2043\u2219\*\-\d\.\)]\s*/, '').trim())
      .filter((line) => line.length > 0);
  };

  if (driversMatch && driversMatch[1]) {
    const raw = driversMatch[1].trim();
    result.decisionDrivers = {
      title: 'Decision Drivers',
      rawText: raw,
      items: extractItems(raw),
    };
  }

  if (actionsMatch && actionsMatch[1]) {
    const raw = actionsMatch[1].trim();
    result.riskReductionActions = {
      title: 'Risk-Reduction Actions',
      rawText: raw,
      items: extractItems(raw),
    };
  }

  if (disclaimerMatch && disclaimerMatch[1]) {
    const raw = disclaimerMatch[1].trim();
    result.disclaimer = {
      title: 'Important Disclaimer',
      rawText: raw,
      items: extractItems(raw),
    };
  }

  return result;
}
