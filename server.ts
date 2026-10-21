import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';
import {
  generateLocalRiskAnalysis,
  isPlaceholderApiKey,
  RiskAnalysisPayload,
} from './src/utils/aiExplainer.ts';

const app = express();
const port = Number(process.env.PORT || 3001);
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json({ limit: '32kb' }));

function isValidRequest(body: RiskAnalysisPayload): boolean {
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

// Health check endpoint
app.get('/api/ai-status', (_request, response) => {
  const envKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
  const isConfigured = !isPlaceholderApiKey(envKey);

  response.json({
    status: 'ok',
    configured: isConfigured,
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  });
});

app.post('/api/risk-analysis', async (request, response) => {
  const payload = request.body as RiskAnalysisPayload;

  if (!isValidRequest(payload)) {
    response.status(400).json({ error: 'Invalid risk-analysis request.' });
    return;
  }

  // Load API key exclusively from server environment
  const envKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
  const apiKey = !isPlaceholderApiKey(envKey) ? envKey : '';

  // If no valid key is configured on the server, serve the local underwriting analysis directly
  if (!apiKey) {
    const analysis = generateLocalRiskAnalysis(payload);
    response.json({
      analysis,
      source: 'simulated',
      provider: 'AI Underwriting Intelligence',
    });
    return;
  }

  // Attempt live Gemini generation with graceful fallback across candidate models
  const preferredModel = (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim();
  const candidateModels = [preferredModel, 'gemini-2.0-flash', 'gemini-1.5-flash'].filter(
    (val, idx, arr) => arr.indexOf(val) === idx
  );

  let successAnalysis: string | null = null;
  let activeModelUsed = preferredModel;

  try {
    const ai = new GoogleGenAI({ apiKey });

    for (const modelName of candidateModels) {
      try {
        const result = await ai.models.generateContent({
          model: modelName,
          contents: `Analyse this simulated credit-card underwriting result:\n${JSON.stringify(payload)}`,
          config: {
            systemInstruction:
              'You are a careful banking-risk explainer for an educational simulator. The deterministic policy engine is the source of truth; do not alter its score, decision, limit, or APR. Give a concise recruiter-quality explanation in plain English with exactly three short sections titled Decision drivers, Risk-reduction actions, and Important disclaimer. Do not claim to access credit bureaus, bank accounts, Account Aggregator, or live lender policies. Do not give financial advice, guarantee approval, request personal data, or repeat sensitive identifiers.',
            temperature: 0.25,
            maxOutputTokens: 450,
          },
        });

        const text = result.text?.trim();
        if (text) {
          successAnalysis = text;
          activeModelUsed = modelName;
          break;
        }
      } catch (modelErr) {
        console.warn(`Gemini model "${modelName}" failed:`, (modelErr as any)?.message || modelErr);
      }
    }

    if (successAnalysis) {
      response.json({
        analysis: successAnalysis,
        source: 'gemini',
        provider: 'AI Underwriting Intelligence',
        model: activeModelUsed,
      });
      return;
    }

    throw new Error('Candidate models did not produce an analysis.');
  } catch (error) {
    console.error('Gemini call failed, providing rule-based explanation:', error);
    const fallbackAnalysis = generateLocalRiskAnalysis(payload);
    response.json({
      analysis: fallbackAnalysis,
      source: 'simulated',
      provider: 'AI Underwriting Intelligence',
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
