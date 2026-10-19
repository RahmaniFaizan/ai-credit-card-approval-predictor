import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';

const app = express();
const port = Number(process.env.PORT || 3001);
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json({ limit: '32kb' }));

type RiskAnalysisRequest = {
  applicant?: {
    employmentType?: string;
    monthlyIncome?: number;
    jobTenureYears?: number;
    creditAgeMonths?: number;
    hasExistingLoans?: boolean;
  };
  assessment?: {
    outcome?: string;
    score?: number;
    scoreCategory?: string;
    foirPercent?: number;
    cardVariant?: string;
    aprPercent?: number;
    verificationSummary?: { passedCount?: number; warnCount?: number; failCount?: number };
    reasoningNotes?: string[];
  };
};

function isValidRequest(body: RiskAnalysisRequest): boolean {
  const { applicant, assessment } = body;
  return Boolean(
    applicant &&
      assessment &&
      typeof applicant.employmentType === 'string' &&
      typeof applicant.monthlyIncome === 'number' &&
      applicant.monthlyIncome >= 0 &&
      applicant.monthlyIncome <= 10000000 &&
      typeof assessment.outcome === 'string' &&
      typeof assessment.score === 'number' &&
      assessment.score >= 300 &&
      assessment.score <= 900 &&
      typeof assessment.foirPercent === 'number' &&
      assessment.foirPercent >= 0 &&
      assessment.foirPercent <= 100
  );
}

app.post('/api/risk-analysis', async (request, response) => {
  const payload = request.body as RiskAnalysisRequest;

  if (!isValidRequest(payload)) {
    response.status(400).json({ error: 'Invalid risk-analysis request.' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    response.status(503).json({
      error: 'AI analysis is not configured. Add GEMINI_API_KEY to a local .env file and restart the API server.',
    });
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: `Analyse this simulated credit-card underwriting result:\n${JSON.stringify(payload)}`,
      config: {
        systemInstruction:
          'You are a careful banking-risk explainer for an educational simulator. The deterministic policy engine is the source of truth; do not alter its score, decision, limit, or APR. Give a concise recruiter-quality explanation in plain English with exactly three short sections titled Decision drivers, Risk-reduction actions, and Important disclaimer. Do not claim to access credit bureaus, bank accounts, Account Aggregator, or live lender policies. Do not give financial advice, guarantee approval, request personal data, or repeat sensitive identifiers.',
        temperature: 0.25,
        maxOutputTokens: 450,
      },
    });

    const analysis = result.text?.trim();
    if (!analysis) {
      throw new Error('The model returned no analysis.');
    }

    response.json({ analysis });
  } catch (error) {
    console.error('Gemini risk-analysis request failed:', error);
    response.status(502).json({
      error: 'The AI service could not generate an analysis. Check the API key, model access, and server logs.',
    });
  }
});

app.use(express.static(path.join(currentDirectory, 'dist')));
app.get('*', (_request, response) => {
  response.sendFile(path.join(currentDirectory, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`AI risk-analysis API is listening on http://localhost:${port}`);
});
