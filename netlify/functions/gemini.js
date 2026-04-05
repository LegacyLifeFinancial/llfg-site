/**
 * LLFG Portal — Google Gemini AI Proxy
 * Keeps API key server-side, proxies requests to Gemini API
 *
 * Endpoints (via POST body { action, ... }):
 *   generate       — Generate text/analysis from prompt
 *   reorganize-crm — Analyze CRM data and suggest reorganization
 *   reorganize-web — Analyze website structure and suggest improvements
 *   score-lead     — AI-powered lead scoring
 *   summarize      — Summarize contact/deal history
 *   insights       — Generate business insights from data
 *
 * ENV: GEMINI_API_KEY (from Google AI Studio: aistudio.google.com)
 */

const https = require('https');

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

function res(code, body) {
  return { statusCode: code, headers: HEADERS, body: JSON.stringify(body) };
}

function callGemini(apiKey, prompt, systemInstruction) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: 'text/plain'
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
    };

    const req = https.request(options, (resp) => {
      let data = '';
      resp.on('data', (chunk) => { data += chunk; });
      resp.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.candidates && parsed.candidates[0]) {
            resolve(parsed.candidates[0].content.parts[0].text);
          } else if (parsed.error) {
            reject(new Error(parsed.error.message || 'Gemini API error'));
          } else {
            resolve(data);
          }
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// System prompts for different tasks
const SYSTEM_PROMPTS = {
  'reorganize-crm': `You are an expert CRM consultant for an insurance agency (LLFG — Legacy Life Financial Group).
Analyze the CRM data provided and output a JSON reorganization plan with these sections:
1. "contactSegments" — suggested smart segments based on the data
2. "pipelineOptimizations" — suggestions for pipeline stage improvements
3. "automationRules" — recommended automation rules (trigger → action pairs)
4. "dataQuality" — flag missing fields, duplicates, stale records
5. "priorityActions" — top 5 immediate actions ranked by impact
Keep responses actionable and specific to insurance agency operations.`,

  'reorganize-web': `You are a premium web design consultant specializing in financial services.
Analyze the website structure and content provided. Output a JSON reorganization plan:
1. "layoutChanges" — specific section reordering for better conversion
2. "contentOptimizations" — copy improvements for each section
3. "ctaImprovements" — call-to-action optimization suggestions
4. "seoRecommendations" — meta, heading, and content SEO improvements
5. "uxFixes" — user experience pain points and fixes
Focus on conversion rate optimization for insurance agent recruiting.`,

  'score-lead': `You are a lead scoring AI for an insurance agency.
Given the lead data, output a JSON score:
{ "score": 0-100, "factors": [{"name":"...", "impact": +/- points, "reason":"..."}], "recommendation": "..." }
High scores = likely to convert. Consider: response speed, experience, state licensing, referral source, engagement level.`,

  'summarize': `You are a concise business analyst. Summarize the contact/deal data provided into:
1. Key facts (3-5 bullets)
2. Risk assessment (low/medium/high with reason)
3. Next best action (one specific recommendation)
Keep it under 150 words.`,

  'insights': `You are an insurance agency business intelligence analyst for LLFG.
Analyze the business data provided and output:
1. "topInsights" — 3 most important findings
2. "risks" — 2-3 risks to watch
3. "opportunities" — 2-3 growth opportunities
4. "predictions" — 1-2 forward-looking predictions with confidence level
5. "actionItems" — 3 specific actions ranked by impact
Use specific numbers from the data. Be direct and actionable.`
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return res(200, {});
  if (event.httpMethod !== 'POST') return res(405, { error: 'POST only' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res(500, { error: 'GEMINI_API_KEY not configured in Netlify env vars' });

  let body;
  try { body = JSON.parse(event.body); }
  catch (e) { return res(400, { error: 'Invalid JSON' }); }

  const { action, prompt, data, context } = body;
  if (!action) return res(400, { error: 'Missing action field' });

  try {
    let systemPrompt = SYSTEM_PROMPTS[action] || '';
    let userPrompt = '';

    switch (action) {
      case 'generate':
        userPrompt = prompt || 'Help me improve this insurance agency portal.';
        break;

      case 'reorganize-crm':
        userPrompt = `Here is the current CRM data to analyze:\n\n${JSON.stringify(data, null, 2)}\n\nContext: ${context || 'Insurance agency with agents selling life insurance, IUL, annuities, and Medicare products.'}`;
        break;

      case 'reorganize-web':
        userPrompt = `Here is the current website structure to analyze:\n\n${JSON.stringify(data, null, 2)}\n\nContext: ${context || 'Insurance FMO recruiting page targeting independent agents.'}`;
        break;

      case 'score-lead':
        userPrompt = `Score this lead:\n\n${JSON.stringify(data, null, 2)}`;
        break;

      case 'summarize':
        userPrompt = `Summarize this data:\n\n${JSON.stringify(data, null, 2)}`;
        break;

      case 'insights':
        userPrompt = `Analyze this business data:\n\n${JSON.stringify(data, null, 2)}`;
        break;

      default:
        userPrompt = prompt || JSON.stringify(data);
    }

    const result = await callGemini(apiKey, userPrompt, systemPrompt);
    return res(200, { success: true, action, result });

  } catch (err) {
    console.error('[Gemini] Error:', err.message);
    return res(500, { error: err.message });
  }
};
