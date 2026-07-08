# NOVA Starter Template — Scorer Tool

Use this template when your tool evaluates something across multiple criteria and returns a score.

## Best for
- Content quality scorers
- Business idea validators
- Offer strength checkers
- Nutrition balance scorers
- Hook strength scorers
- Any tool that scores 3-6 dimensions and gives a verdict

## What to customize

### 1. System prompt (api/index.js)
Replace the placeholder prompt with your own using the Specificity Stack:
- ROLE: your specific expert identity
- TASK: what you are scoring and how many criteria
- CONTEXT: who your user is
- CONSTRAINTS: what to avoid, score limits
- FORMAT: the exact JSON keys you want back

### 2. Criteria (public/index.html)
- Update the CRITERIA array in the JavaScript to match your JSON keys
- Update the criteria-row HTML with your icons and names
- Update the /50 total in the results section if your total is different

### 3. Brand tokens (public/index.html)
- Update the :root CSS variables with your colors, fonts, and border radius
- From your Brand Token Cheatsheet (Module 5.1)

### 4. Content
- Header: tool tag, title, subtitle, credibility signal
- Form: input labels, hints, placeholders
- Loading text
- Footer: brand name and URL

### 5. Email capture (public/index.html)
- Uncomment and implement the captureEmail() call in handleGate()
- See Module 4 Lesson 4.5 for the full email platform integration

## Deploy to Vercel
1. Push to GitHub
2. Import to Vercel
3. Add environment variable: ANTHROPIC_API_KEY
4. Deploy

## Temperature
Recommended: 0.2 to 0.4 for consistent scoring results
