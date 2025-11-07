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

const ANALYSIS_PROMPT = `You are StartupBuilderGPT — a world-class startup consultant and product strategist with 15+ years of experience helping 1000+ startups from idea to IPO. Your job is to generate a comprehensive, detailed business analysis and execution blueprint from an idea. 

You have deep expertise in:
- Market research and competitive analysis
- Business model design and validation
- Go-to-market strategy development
- Financial modeling and funding strategies
- Product development and user experience
- Growth hacking and scaling strategies
- Team building and operations

Base your analysis on the input startup name and description. Provide detailed, actionable insights that a real founder can immediately implement. Focus on practical, data-driven recommendations backed by industry best practices and real-world examples.

Startup Name: {{ideaName}}
Startup Description: {{ideaDescription}}

Generate a comprehensive business strategy and analysis. Be thorough, specific, and actionable. Include concrete examples, metrics, and step-by-step guidance. Output only structured JSON in the following schema. Prioritize clarity, realistic strategies, and practical guidance that founders can execute immediately.

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

DETAILED REQUIREMENTS:
- Provide specific, actionable insights with concrete examples
- Include realistic market size estimates with sources when possible
- Identify 3-5 real competitors with specific strengths/weaknesses
- Suggest specific pricing models with example price points
- Provide detailed go-to-market tactics with timelines
- Include specific metrics and KPIs to track
- Suggest real tools, platforms, and resources
- Provide industry-specific insights and trends
- Include potential risks and mitigation strategies
- Offer specific next steps with priorities and timelines

RULES:
- Return only valid JSON, strictly in this format
- No extra text, explanation, markdown, or code fences
- Ground all analysis in practical, real-world logic and data
- Use detailed, specific language with concrete examples
- Consider feasibility, viability, and innovation potential
- Include specific numbers, percentages, and metrics where relevant
- Provide actionable recommendations that founders can implement immediately
- Focus on the most critical success factors for this specific idea
- Consider the current market conditions and trends
- Include both short-term (0-6 months) and long-term (6-24 months) strategies`;

export const analyzeStartupIdea = async (ideaName: string, ideaDescription: string): Promise<StartupAnalysis> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    // If no API key is configured, return a deterministic mock analysis so the front-end works in dev.
    if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey === 'AIzaSyBvQZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8Q') {
      console.warn('VITE_GEMINI_API_KEY not set or using placeholder — returning comprehensive mock analysis for development');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mock: StartupAnalysis = {
        executive_summary: {
          overview: `${ideaName} represents a promising opportunity in the current market landscape. Based on the description "${ideaDescription}", this startup addresses a real market need with innovative technology and strategic positioning. The business model shows strong potential for scalability and market penetration.`,
          vision: `To revolutionize the industry by making ${ideaName} the go-to solution for our target market, creating a sustainable and profitable business that serves millions of users worldwide.`,
          mission: `To deliver exceptional value through ${ideaName} by solving critical problems for our customers, enabling them to achieve their goals more efficiently and effectively.`
        },
        problem_statement: {
          one_line: `The core problem ${ideaName} solves is the inefficiency and complexity in current market solutions that prevent users from achieving their desired outcomes.`,
          why_it_matters: `This problem affects millions of potential users and represents a significant market opportunity. Current solutions are either too expensive, too complex, or don't address the specific needs of our target demographic. The market is ready for disruption.`
        },
        solution: {
          one_line: `${ideaName} provides an innovative, user-friendly solution that simplifies complex processes and delivers measurable results.`,
          how_it_works: [
            'Users sign up through our streamlined onboarding process',
            'Our AI-powered system analyzes their specific needs and requirements',
            'We provide personalized recommendations and automated solutions',
            'Users track progress through our intuitive dashboard',
            'Continuous optimization based on user feedback and data insights'
          ],
          benefits: [
            'Saves users 70% of their time compared to current solutions',
            'Reduces operational costs by 40-60%',
            'Provides real-time insights and analytics',
            'Scales automatically with user growth'
          ]
        },
        unique_selling_proposition: {
          one_line: `${ideaName} is the only solution that combines AI-powered automation with human expertise to deliver personalized results at scale.`,
          key_differentiators: [
            'Proprietary AI algorithm that learns and adapts to user behavior',
            'Industry-first integration with major platforms',
            '24/7 customer support with expert consultation',
            'Transparent pricing with no hidden fees',
            'White-label options for enterprise clients'
          ]
        },
        market_analysis: {
          target_customer: {
            segment: 'Small to medium businesses (SMBs) and tech-savvy professionals',
            persona: 'Decision-makers aged 25-45 who value efficiency, are comfortable with technology, and have budget authority for productivity tools. They are frustrated with current solutions and actively seeking better alternatives.'
          },
          market_size_tam_sam_som: {
            TAM: '$50 billion global market for productivity and automation tools',
            SAM: '$8 billion addressable market for SMB-focused solutions',
            SOM: '$200 million serviceable market in our initial geographic regions'
          },
          trends: [
            'Rapid adoption of AI-powered business tools (growing 40% annually)',
            'Remote work driving demand for digital solutions',
            'SMB digital transformation accelerating post-pandemic',
            'Integration-first approach becoming standard expectation'
          ],
          competitors: [
            {
              name: 'Competitor A',
              strength: 'Strong brand recognition and enterprise sales team',
              weakness: 'High pricing, complex setup, limited customization options'
            },
            {
              name: 'Competitor B',
              strength: 'User-friendly interface and good customer support',
              weakness: 'Limited AI capabilities, no enterprise features, scalability issues'
            },
            {
              name: 'Competitor C',
              strength: 'Advanced technology and strong technical team',
              weakness: 'Poor user experience, limited market reach, high customer churn'
            }
          ]
        },
        business_model: {
          revenue_streams: [
            'Monthly subscription plans (Basic: $29, Pro: $79, Enterprise: $199)',
            'One-time setup and onboarding fees ($500-$2000)',
            'White-label licensing for enterprise clients ($10K-$50K annually)',
            'Professional services and consulting ($150/hour)',
            'API usage fees for third-party integrations'
          ],
          pricing_strategy: 'Freemium model with tiered subscriptions based on features and usage limits. Enterprise pricing is custom based on requirements.',
          key_partnerships: [
            'Integration partnerships with major CRM platforms',
            'Technology partnerships with cloud providers',
            'Channel partnerships with business consultants',
            'Strategic partnerships with industry associations'
          ]
        },
        go_to_market_strategy: {
          launch_plan: 'Phase 1: Beta launch with 100 select customers for feedback and validation. Phase 2: Public launch with content marketing and PR. Phase 3: Scale through partnerships and paid acquisition.',
          distribution_channels: [
            'Direct sales through our website and sales team',
            'Partner channel through business consultants and agencies',
            'App marketplaces and integration directories',
            'Content marketing and SEO',
            'Social media and community engagement'
          ],
          early_adopter_strategy: 'Target industry influencers and thought leaders who can provide testimonials and referrals. Offer significant discounts and co-marketing opportunities in exchange for case studies and reviews.'
        },
        growth_strategy: {
          initial_traction_plan: 'Focus on content marketing, SEO, and community building. Target 1000 beta users in first 6 months through referrals and content marketing.',
          scaling_plan: 'Implement paid acquisition channels, expand sales team, and develop partner ecosystem. Target 10,000 users by end of year 2.',
          retention_plan: 'Comprehensive onboarding, regular check-ins, feature updates based on feedback, and customer success program to reduce churn below 5% monthly.'
        },
        finance: {
          startup_cost_estimate: 'Initial funding requirement of $500K for product development, team building, and market validation over 12 months.',
          monetization_plan: 'Revenue starts in month 6 with first paid customers. Break-even expected by month 18. Projected revenue of $2M by end of year 2.',
          funding_stage_and_ask: {
            stage: 'Seed round',
            amount: '$500,000',
            use_of_funds: [
              'Product development and engineering (40%)',
              'Sales and marketing (30%)',
              'Team expansion (20%)',
              'Operations and infrastructure (10%)'
            ]
          }
        },
        swot_analysis: {
          strengths: [
            'Strong technical team with relevant experience',
            'Clear market need and validated problem',
            'Differentiated technology and approach',
            'Experienced founding team with industry connections'
          ],
          weaknesses: [
            'Limited initial funding and resources',
            'No established brand recognition yet',
            'Small team limits execution speed',
            'Dependency on key team members'
          ],
          opportunities: [
            'Large and growing market with high demand',
            'Technology trends favoring our solution',
            'Potential for strategic partnerships',
            'International expansion possibilities'
          ],
          threats: [
            'Large competitors with more resources',
            'Rapid technology changes',
            'Economic downturn affecting SMB spending',
            'Regulatory changes in target markets'
          ]
        },
        "4ps_marketing_mix": {
          product: `${ideaName} is a comprehensive solution that addresses the core problem through innovative technology, providing users with measurable value and competitive advantage.`,
          price: 'Competitive pricing positioned between basic tools and enterprise solutions, offering clear value proposition and ROI within 6 months.',
          place: 'Primarily online through our website and app marketplaces, with enterprise sales through direct channels and partners.',
          promotion: 'Content marketing, SEO, social media, industry events, partnerships, and targeted digital advertising to reach decision-makers.'
        },
        content_plan_5_days: [
          {
            day: 1,
            theme: 'Problem Awareness',
            post_example: 'Did you know that 73% of businesses struggle with [specific problem]? Here\'s why this matters and how it\'s costing you money every day. #BusinessEfficiency #Productivity'
          },
          {
            day: 2,
            theme: 'Solution Introduction',
            post_example: 'Introducing [IdeaName] - the game-changing solution that\'s helping businesses save 70% of their time. Here\'s how it works in 3 simple steps. #Innovation #TimeSaving'
          },
          {
            day: 3,
            theme: 'Customer Success',
            post_example: 'Sarah from TechCorp increased her team\'s productivity by 150% using [IdeaName]. "It\'s been a game-changer for our business," she says. Read her full story. #SuccessStory #CustomerSpotlight'
          },
          {
            day: 4,
            theme: 'Industry Insights',
            post_example: 'The future of business automation is here. Here are 5 trends that will shape how companies operate in 2024. [IdeaName] is at the forefront of this revolution. #FutureOfWork #Automation'
          },
          {
            day: 5,
            theme: 'Call to Action',
            post_example: 'Ready to transform your business? Join 1000+ companies already using [IdeaName] to streamline their operations. Start your free trial today! #FreeTrial #BusinessGrowth'
          }
        ],
        pitch_deck_outline_7_slides: [
          {
            slide: 1,
            title: 'The Problem',
            points: [
              'Current solutions are inefficient and expensive',
              'Businesses lose $X annually due to inefficiencies',
              'Market is ready for disruption',
              'Clear pain point with measurable impact'
            ]
          },
          {
            slide: 2,
            title: 'Our Solution',
            points: [
              'Innovative approach to solving the problem',
              'Proven technology with measurable results',
              'User-friendly and scalable solution',
              'Clear competitive advantages'
            ]
          },
          {
            slide: 3,
            title: 'Market Opportunity',
            points: [
              '$50B total addressable market',
              'Growing at 40% annually',
              'Underserved SMB segment',
              'Clear path to $200M serviceable market'
            ]
          },
          {
            slide: 4,
            title: 'Business Model',
            points: [
              'Recurring revenue through subscriptions',
              'Multiple revenue streams',
              'Scalable pricing model',
              'Strong unit economics'
            ]
          },
          {
            slide: 5,
            title: 'Go-to-Market Strategy',
            points: [
              'Content marketing and SEO',
              'Partnership channel development',
              'Direct sales for enterprise',
              'Proven customer acquisition methods'
            ]
          },
          {
            slide: 6,
            title: 'Competitive Advantage',
            points: [
              'Proprietary technology',
              'Superior user experience',
              'Strong team and execution',
              'First-mover advantage in key areas'
            ]
          },
          {
            slide: 7,
            title: 'Ask & Roadmap',
            points: [
              'Seeking $500K seed funding',
              '12-month roadmap to profitability',
              'Clear milestones and metrics',
              'Experienced team ready to execute'
            ]
          }
        ],
        elevator_pitch_1_minute: {
          hook: 'What if I told you that businesses are losing millions of dollars every year due to inefficiencies that could be solved with the right technology?',
          problem: 'Current solutions in the market are either too expensive, too complex, or simply don\'t work for small to medium businesses. This is costing companies 40% more than necessary and wasting countless hours.',
          solution: 'We\'ve developed [IdeaName], an AI-powered platform that automates these processes and delivers results 70% faster than current solutions, at a fraction of the cost.',
          market: 'The market for productivity tools is $50 billion and growing 40% annually. Our target customers are the 2 million SMBs who are currently underserved by existing solutions.',
          traction_or_potential: 'We\'ve already validated this with 100 beta users who are seeing incredible results. One customer increased their efficiency by 150% in just 30 days.',
          closing: 'We\'re looking for $500K in seed funding to scale this solution and capture this massive market opportunity. Are you ready to be part of the next big thing?'
        }
      };

      return Promise.resolve(mock);
    }

    const prompt = ANALYSIS_PROMPT
      .replace('{{ideaName}}', ideaName)
      .replace('{{ideaDescription}}', ideaDescription);
    
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error response:', response.status, errorData);
      throw new Error(`API request failed: ${response.status} - ${errorData}`);
    }

    const data = await response.json();

    // The Gemini API may return text wrapped or with extra chars. Attempt a few tolerant parsing strategies.
    const candidates = data?.candidates || data?.outputs || [];
    let text: string | undefined;

    // Try common shapes
    if (Array.isArray(candidates) && candidates.length > 0) {
      const first = candidates[0];
      text = first?.content?.parts?.[0]?.text || first?.content?.[0]?.text || first?.text || first?.output;
    }

    if (!text && typeof data === 'string') {
      text = data as string;
    }

    if (!text) {
      console.error('Gemini: Unable to find textual content in response', data);
      throw new Error('No text content found in API response');
    }

    // Try to extract JSON object from the text (first {...} block)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // As a last resort, attempt to parse entire text as JSON
      try {
        const analysis = JSON.parse(text) as StartupAnalysis;
        return analysis;
      } catch (err) {
        console.error('Gemini: Failed to parse JSON from text', { textSnippet: text.slice(0, 500), err });
        throw new Error('No valid JSON found in response text');
      }
    }

    const jsonString = jsonMatch[0];

    try {
      const analysis = JSON.parse(jsonString) as StartupAnalysis;
      return analysis;
    } catch (err) {
      console.error('Gemini: JSON.parse failed', { jsonStringSnippet: jsonString.slice(0, 500), err });
      throw new Error('Failed to parse analysis JSON from API response');
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('analyzeStartupIdea error:', msg);
    throw new Error(`Failed to analyze startup idea: ${msg}`);
  }
};

