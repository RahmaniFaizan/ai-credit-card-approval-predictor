import { isPlaceholderApiKey } from '../src/utils/aiExplainer.js';

export default function handler(_request: any, response: any) {
  const envKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
  const isConfigured = !isPlaceholderApiKey(envKey);

  response.status(200).json({
    status: 'ok',
    configured: isConfigured,
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  });
}
