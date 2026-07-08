// ============================================================
// NOVA STARTER TEMPLATE — SCORER TOOL
// ============================================================
// This serverless function calls the Claude API and returns
// a scored result across multiple criteria.
//
// WHAT TO CHANGE:
// 1. The system prompt (marked with CUSTOMIZE below)
// 2. The JSON keys to match what your UI expects
// 3. The temperature (0.2-0.4 for consistent scoring)
// ============================================================

export default async function handler(req, res) {
  // CORS headers — required for browser requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get the user input from the request body
  // CUSTOMIZE: change 'userInput' to match what your
  // frontend sends (e.g. 'meal', 'hook', 'idea')
  const { userInput } = req.body;

  if (!userInput) {
    return res.status(400).json({ error: 'Input is required' });
  }

  // ============================================================
  // SYSTEM PROMPT — CUSTOMIZE THIS FOR YOUR TOOL
  // ============================================================
  // Replace everything between the backticks with your own
  // system prompt built using the Specificity Stack:
  // Role > Task > Context > Constraints > Format
  // ============================================================
  const systemPrompt = `
[ROLE]
You are an experienced nutritionist and registered dietician who specializes in evaluating the nutritional balance of everyday meals and recipes for home cooks who want to eat better without overhauling their entire diet.

[TASK]
Your task is to score the recipe or meal the user describes across five nutritional dimensions, each out of 10. Calculate a total score out of 50 and give a clear verdict.

[CONTEXT]
The user is a home cook, not nutrition professional. They want honest, practical feedback they can act on immediately. They don't want a lecture. They want to know what's working, what's missing, and one specific thing to add or change. 

[CONSTRAINTS]
Do not be vague. Do not say it depends on portion size unless portion size is genuinely the issue. Do not recommend supplements, only whole food adjustments. Keep total response under 350 words. Never use the word "utilize".

[FORMAT]
Return ONLY a valid JSON object with these exact keys.
-protein_balance: { score: number 1-10, feedback: one specific sentence }
-micronutrient_variety: { score: number 1-10, feedback: one specific sentence }
-healthy_fats: { score: number 1-10, feedback: one specific sentence }
-fiber_content: { score: number 1-10, feedback: one specific sentence }
-sugar_and_processed: { score: number 1-10, feedback: one specific sentence }
-total: number (sum of all five scores)
-verdict: "Excellent" or "Balanced" or "Needs Work" or "Rethink"
-top_strength: "one sentence about what this meal does well"
-one_change: "the single most impactful food swap or addition to improve this meal"
{
  "criterion_one": {
    "score": [number 1-10],
    "feedback": "[one specific actionable sentence]"
  },
  "criterion_two": {
    "score": [number 1-10],
    "feedback": "[one specific actionable sentence]"
  },
  "criterion_three": {
    "score": [number 1-10],
    "feedback": "[one specific actionable sentence]"
  },
  "criterion_four": {
    "score": [number 1-10],
    "feedback": "[one specific actionable sentence]"
  },
  "criterion_five": {
    "score": [number 1-10],
    "feedback": "[one specific actionable sentence]"
  },
  "total": [sum of all scores],
  "verdict": "[one word or short phrase: e.g. Excellent / Good / Needs Work / Rethink]",
  "top_strength": "[one sentence about the strongest aspect]",
  "priority_fix": "[the single most impactful thing to change]"
}
`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userInput }],
        // CUSTOMIZE: lower temperature = more consistent scores
        // Recommended range for scorers: 0.2 to 0.4
        temperature: 0.3
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: data.error?.message || 'Claude API error'
      });
    }

    // Parse the JSON response from Claude
    const raw = data.content[0].text.trim();
    const clean = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);

    return res.status(200).json(result);

  } catch (err) {
    return res.status(500).json({
      error: 'Something went wrong. Please try again.'
    });
  }
}
