// Gemini AI service for startup idea analysis

export interface StartupAnalysis {
  executive_summary: {
    overview: string;
    vision: string;
    mission: string;
  };
  problem_statement: {
    one_line: string;
    why_it_matters: string;
  };
  solution: {
    one_line: string;
    how_it_works: string[];
    benefits: string[];
  };
  unique_selling_proposition: {
    one_line: string;
    key_differentiators: string[];
  };
  market_analysis: {
    target_customer: {
      segment: string;
      persona: string;
    };
    market_size_tam_sam_som: {
      TAM: string;
      SAM: string;
      SOM: string;
    };
    trends: string[];
    competitors: Array<{
      name: string;
      strength: string;
      weakness: string;
    }>;
  };
  business_model: {
    revenue_streams: string[];
    pricing_strategy: string;
    key_partnerships: string[];
  };
  go_to_market_strategy: {
    launch_plan: string;
    distribution_channels: string[];
    early_adopter_strategy: string;
  };
  growth_strategy: {
    initial_traction_plan: string;
    scaling_plan: string;
    retention_plan: string;
  };
  finance: {
    startup_cost_estimate: string;
    monetization_plan: string;
    funding_stage_and_ask: {
      stage: string;
      amount: string;
      use_of_funds: string[];
    };
  };
  swot_analysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  "4ps_marketing_mix": {
    product: string;
    price: string;
    place: string;
    promotion: string;
  };
  content_plan_5_days: Array<{
    day: number;
    theme: string;
    post_example: string;
  }>;
  pitch_deck_outline_7_slides: Array<{
    slide: number;
    title: string;
    points: string[];
  }>;
  elevator_pitch_1_minute: {
    hook: string;
    problem: string;
    solution: string;
    market: string;
    traction_or_potential: string;
    closing: string;
  };
}

const ANALYSIS_PROMPT = `You are StartupBuilderGPT — a world-class startup consultant and product strategist. Your job is to generate a complete business analysis and execution blueprint from an idea. Base your output on the input startup name and its short description. Your response must include all necessary dimensions of a startup strategy: product, market, business model, growth, positioning, and practical action steps. Avoid hypotheticals. Build the response as if you're helping a real founder take this idea to market with high confidence and readiness.

Startup Name: {{ideaName}}
Startup Description: {{ideaDescription}}

Generate a full business strategy and analysis based on the idea. Output only structured JSON in the following schema. Avoid character count instructions. Prioritize clarity, realistic strategies, and practical guidance.

Output Format (JSON Schema):

{
 "executive_summary": {
 "overview": "Summary of the business concept and goal",
 "vision": "Long-term aspiration of the startup",
 "mission": "Action-oriented purpose of the company"
 },
 "problem_statement": {
 "one_line": "The core problem your startup solves",
 "why_it_matters": "Why this problem is urgent or meaningful"
 },
 "solution": {
 "one_line": "Brief solution description",
 "how_it_works": ["Step-by-step or feature overview"],
 "benefits": ["2–3 key value propositions"]
 },
 "unique_selling_proposition": {
 "one_line": "Main reason why this startup is different",
 "key_differentiators": ["Unique tech, approach, or experience"]
 },
 "market_analysis": {
 "target_customer": {
 "segment": "Demographic or industry",
 "persona": "Customer behavior, goals, needs"
 },
 "market_size_tam_sam_som": {
 "TAM": "Total addressable market",
 "SAM": "Serviceable available market",
 "SOM": "Serviceable obtainable market"
 },
 "trends": ["2–4 market trends impacting this industry"],
 "competitors": [
 {
 "name": "Competitor name",
 "strength": "What they're doing well",
 "weakness": "Gaps or problems they haven't solved"
 }
 ]
 },
 "business_model": {
 "revenue_streams": ["Primary ways of making money"],
 "pricing_strategy": "Model used (freemium, subscription, etc.)",
 "key_partnerships": ["External partners or integrations"]
 },
 "go_to_market_strategy": {
 "launch_plan": "Initial steps to test and launch",
 "distribution_channels": ["Channels to reach users (online, offline, etc.)"],
 "early_adopter_strategy": "How to attract first users and feedback"
 },
 "growth_strategy": {
 "initial_traction_plan": "How to gain early users",
 "scaling_plan": "How to expand operations and user base",
 "retention_plan": "How to keep users loyal and engaged"
 },
 "finance": {
 "startup_cost_estimate": "Estimated funding required for first phase",
 "monetization_plan": "How the business will generate cash flow",
 "funding_stage_and_ask": {
 "stage": "Funding stage (pre-seed, seed, Series A, etc.)",
 "amount": "Target amount to raise",
 "use_of_funds": ["Marketing", "Product Dev", "Ops", etc.]
 }
 },
 "swot_analysis": {
 "strengths": ["Internal advantages"],
 "weaknesses": ["Internal limitations"],
 "opportunities": ["External trends or gaps to leverage"],
 "threats": ["External risks, competition, regulations"]
 },
 "4ps_marketing_mix": {
 "product": "What you are offering and what problem it solves",
 "price": "How it is priced and justified",
 "place": "Where the product is sold or distributed",
 "promotion": "How you will promote it to your audience"
 },
 "content_plan_5_days": [
 {"day": 1, "theme": "Topic of the day", "post_example": "Social post idea"},
 {"day": 2, "theme": "...", "post_example": "..."}
 ],
 "pitch_deck_outline_7_slides": [
 {"slide": 1, "title": "Problem", "points": ["...", "..."]},
 {"slide": 2, "title": "Solution", "points": ["...", "..."]},
 {"slide": 3, "title": "Market Size", "points": ["...", "..."]},
 {"slide": 4, "title": "Business Model", "points": ["...", "..."]},
 {"slide": 5, "title": "Go-to-Market", "points": ["...", "..."]},
 {"slide": 6, "title": "Competitive Edge", "points": ["...", "..."]},
 {"slide": 7, "title": "Ask & Roadmap", "points": ["...", "..."]}
 ],
 "elevator_pitch_1_minute": {
 "hook": "Grabs attention",
 "problem": "Real-world challenge",
 "solution": "What your startup does",
 "market": "Who it's for",
 "traction_or_potential": "Momentum or scale potential",
 "closing": "Why now or ask"
 }
}

Rules:
- Return only valid JSON, strictly in this format.
- No extra text, explanation, markdown, or code fences.
- Ground all analysis in practical, real-world logic.
- Use medium-length, detailed, but readable language.
- Consider feasibility, viability, and innovation.
- Do not include character limits or generic filler text.`;

export const analyzeStartupIdea = async (ideaName: string, ideaDescription: string): Promise<StartupAnalysis> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const prompt = ANALYSIS_PROMPT
      .replace('{{ideaName}}', ideaName)
      .replace('{{ideaDescription}}', ideaDescription);
    
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('No text content in API response');
    }
    
    // Clean the response to extract JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    const jsonString = jsonMatch[0];
    
    const analysis = JSON.parse(jsonString) as StartupAnalysis;
    
    return analysis;
  } catch (error) {
    throw new Error(`Failed to analyze startup idea: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

