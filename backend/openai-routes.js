const express = require('express');
const router = express.Router();

/**
 * OpenAI API Routes
 * Proxy OpenAI requests through backend to secure API key
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const OPENAI_BASE_URL = 'https://api.openai.com/v1';

/**
 * Enhanced content endpoint
 * POST /api/openai/enhance
 */
router.post('/enhance', async (req, res) => {
  try {
    const { content, type, niche, tone, targetLength } = req.body;

    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Build system prompt
    const systemPrompt = getSystemPrompt(type, tone);
    const userPrompt = getUserPrompt(content, niche, type, targetLength);

    // Call OpenAI
    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: targetLength || 2000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.error?.message || 'OpenAI request failed' });
    }

    const data = await response.json();

    res.json({
      enhanced: data.choices[0].message.content,
      usage: data.usage,
      cost: calculateCost(data.usage.prompt_tokens, data.usage.completion_tokens, OPENAI_MODEL)
    });

  } catch (error) {
    console.error('OpenAI enhance error:', error);
    res.status(500).json({ error: 'Failed to enhance content' });
  }
});

/**
 * Batch enhance endpoint
 * POST /api/openai/enhance-batch
 */
router.post('/enhance-batch', async (req, res) => {
  try {
    const { items } = req.body;

    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Items array is required' });
    }

    const results = [];
    let totalCost = 0;

    for (const item of items) {
      try {
        const systemPrompt = getSystemPrompt(item.type, item.tone);
        const userPrompt = getUserPrompt(item.content, item.niche, item.type, item.targetLength);

        const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: OPENAI_MODEL,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.8,
            max_tokens: item.targetLength || 2000
          })
        });

        if (response.ok) {
          const data = await response.json();
          const cost = calculateCost(data.usage.prompt_tokens, data.usage.completion_tokens, OPENAI_MODEL);

          results.push({
            original: item.content,
            enhanced: data.choices[0].message.content,
            usage: data.usage,
            cost
          });

          totalCost += cost;
        }

        // Rate limiting delay
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        console.error('Batch item error:', error);
        results.push({ original: item.content, error: error.message });
      }
    }

    res.json({
      results,
      totalCost,
      successCount: results.filter(r => !r.error).length,
      errorCount: results.filter(r => r.error).length
    });

  } catch (error) {
    console.error('Batch enhance error:', error);
    res.status(500).json({ error: 'Failed to enhance batch' });
  }
});

/**
 * Generate YouTube script
 * POST /api/openai/youtube-script
 */
router.post('/youtube-script', async (req, res) => {
  try {
    const { topic, facts } = req.body;

    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const prompt = `Create an engaging YouTube script (8-10 minutes) about "${topic}".

Use these facts:
${facts.map((f, i) => `${i + 1}. ${f}`).join('\n')}

Include:
- Strong hook in first 10 seconds
- Main content with timestamps [0:00], [0:30], etc.
- "Like and subscribe" reminder
- Call to action at end
- Smooth transitions
- Engaging storytelling`;

    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: 'You are a viral YouTube scriptwriter with millions of views.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.error?.message || 'OpenAI request failed' });
    }

    const data = await response.json();

    res.json({
      script: data.choices[0].message.content,
      usage: data.usage,
      cost: calculateCost(data.usage.prompt_tokens, data.usage.completion_tokens, OPENAI_MODEL)
    });

  } catch (error) {
    console.error('YouTube script error:', error);
    res.status(500).json({ error: 'Failed to generate YouTube script' });
  }
});

/**
 * Generate TikTok hooks
 * POST /api/openai/tiktok-hooks
 */
router.post('/tiktok-hooks', async (req, res) => {
  try {
    const { content, count = 10 } = req.body;

    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const prompt = `Generate ${count} viral TikTok hooks (first 3 seconds) for this content:

${content}

Requirements:
- 10 words or less
- Create curiosity/shock/intrigue
- Make people stop scrolling
- Start with numbers, questions, or bold statements
- Examples: "You won't believe...", "5 things about...", "This is insane:"

Return only the hooks, one per line.`;

    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: 'You are a viral TikTok content creator with millions of followers.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.9,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.error?.message || 'OpenAI request failed' });
    }

    const data = await response.json();
    const hooks = data.choices[0].message.content
      .split('\n')
      .filter(h => h.trim())
      .map(h => h.replace(/^\d+\.\s*/, '').trim()); // Remove numbering

    res.json({
      hooks,
      usage: data.usage,
      cost: calculateCost(data.usage.prompt_tokens, data.usage.completion_tokens, OPENAI_MODEL)
    });

  } catch (error) {
    console.error('TikTok hooks error:', error);
    res.status(500).json({ error: 'Failed to generate TikTok hooks' });
  }
});

/**
 * Content ideas generator
 * POST /api/openai/content-ideas
 */
router.post('/content-ideas', async (req, res) => {
  try {
    const { niche, count = 20 } = req.body;

    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const prompt = `Generate ${count} viral content ideas for the niche: "${niche}"

Include ideas for YouTube, TikTok, Blog posts, and Twitter threads.

Return as JSON array with format:
{
  "ideas": [
    {
      "title": "...",
      "description": "...",
      "platform": "youtube|tiktok|blog|twitter",
      "estimatedViews": 50000
    }
  ]
}`;

    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: 'You are a viral content strategist.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.error?.message || 'OpenAI request failed' });
    }

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);

    res.json({
      ideas: parsed.ideas || [],
      usage: data.usage,
      cost: calculateCost(data.usage.prompt_tokens, data.usage.completion_tokens, OPENAI_MODEL)
    });

  } catch (error) {
    console.error('Content ideas error:', error);
    res.status(500).json({ error: 'Failed to generate content ideas' });
  }
});

/**
 * Health check
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    configured: !!OPENAI_API_KEY,
    model: OPENAI_MODEL
  });
});

// Helper functions

function getSystemPrompt(type, tone = 'casual') {
  const toneDescriptions = {
    professional: 'professional and authoritative',
    casual: 'casual and conversational',
    energetic: 'energetic and enthusiastic',
    educational: 'educational and informative',
    humorous: 'humorous and entertaining'
  };

  const typeInstructions = {
    youtube: 'You are a successful YouTuber who creates engaging, watch-time optimized scripts.',
    tiktok: 'You are a viral TikTok creator who hooks viewers in 3 seconds.',
    blog: 'You are a professional blogger who writes engaging, SEO-friendly content.',
    medium: 'You are a top Medium writer with 100K+ followers.',
    twitter: 'You are a Twitter expert who creates viral threads.',
    instagram: 'You are an Instagram content creator with high engagement.'
  };

  const instruction = typeInstructions[type] || typeInstructions.blog;
  const toneDesc = toneDescriptions[tone] || toneDescriptions.casual;

  return `${instruction}\nYour tone is ${toneDesc}.\nMake content engaging, valuable, and shareable.`;
}

function getUserPrompt(content, niche, type, targetLength) {
  let prompt = `Enhance this content for ${type}:\n\n${content}\n\n`;
  prompt += `Niche: ${niche}\n`;

  if (targetLength) {
    prompt += `Target length: approximately ${targetLength} words\n`;
  }

  prompt += '- Add powerful hooks\n';
  prompt += '- Include strong call-to-action\n';
  prompt += '- Make it engaging and viral\n';

  return prompt;
}

function calculateCost(inputTokens, outputTokens, model) {
  const pricing = {
    'gpt-4o': { input: 2.50 / 1000000, output: 10 / 1000000 },
    'gpt-4o-mini': { input: 0.15 / 1000000, output: 0.60 / 1000000 },
    'gpt-3.5-turbo': { input: 0.50 / 1000000, output: 1.50 / 1000000 }
  };

  const prices = pricing[model] || pricing['gpt-4o-mini'];
  return (inputTokens * prices.input) + (outputTokens * prices.output);
}

module.exports = router;
