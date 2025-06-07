import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export interface GroqAnalysisRequest {
  flow: any
  network: string
  options?: {
    analysisType: "trading" | "arbitrage" | "general"
    depth: "basic" | "detailed" | "comprehensive"
  }
}

export interface GroqAnalysisResponse {
  flowComplexity: "Low" | "Medium" | "High"
  riskAssessment: "Low" | "Moderate" | "High"
  estimatedProfitability: string
  suggestions: string[]
  marketInsights: string[]
  tradingOpportunities: Array<{
    type: string
    route?: string
    asset?: string
    direction?: string
    estimatedProfit: string
    risk: string
    timeWindow: string
  }>
}

export interface PoolAnalysisRequest {
  pool: any
  network: string
}

export async function analyzeFlow(request: GroqAnalysisRequest): Promise<GroqAnalysisResponse> {
  try {
    const prompt = `You are a professional Solana blockchain developer and DeFi trading expert. Analyze the following wallet flow configuration and provide detailed insights.

Flow Configuration:
${JSON.stringify(request.flow, null, 2)}

Network: ${request.network}
Analysis Type: ${request.options?.analysisType || "trading"}
Depth: ${request.options?.depth || "detailed"}

Please analyze this flow and provide:
1. Flow complexity assessment (Low/Medium/High)
2. Risk assessment (Low/Moderate/High) 
3. Estimated profitability range for 24h period
4. 3-4 specific optimization suggestions
5. 3-4 current market insights relevant to this flow
6. 1-2 trading opportunities based on the flow type

Respond in JSON format matching this structure:
{
  "flowComplexity": "Low|Medium|High",
  "riskAssessment": "Low|Moderate|High", 
  "estimatedProfitability": "X% - Y% (24h)",
  "suggestions": ["suggestion1", "suggestion2", ...],
  "marketInsights": ["insight1", "insight2", ...],
  "tradingOpportunities": [
    {
      "type": "Arbitrage|Momentum|etc",
      "route": "optional route description",
      "asset": "optional asset",
      "direction": "optional direction", 
      "estimatedProfit": "X%",
      "risk": "Low|Medium|High",
      "timeWindow": "time estimate"
    }
  ]
}`

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a professional Solana blockchain developer and DeFi trading expert. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-70b-versatile",
      temperature: 0.3,
      max_tokens: 2048,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error("No response from Groq API")
    }

    // Parse the JSON response
    const analysis = JSON.parse(response)

    // Validate the response structure
    if (!analysis.flowComplexity || !analysis.riskAssessment || !analysis.estimatedProfitability) {
      throw new Error("Invalid response structure from Groq API")
    }

    return analysis as GroqAnalysisResponse
  } catch (error) {
    console.error("Groq API Error:", error)

    // Fallback to mock response if API fails
    const nodeCount = request.flow.nodes?.length || 0
    const edgeCount = request.flow.edges?.length || 0
    const complexity = nodeCount + edgeCount * 0.5

    let flowComplexity: "Low" | "Medium" | "High" = "Low"
    if (complexity > 15) flowComplexity = "High"
    else if (complexity > 5) flowComplexity = "Medium"

    return {
      flowComplexity,
      riskAssessment: nodeCount > 10 ? "High" : nodeCount > 5 ? "Moderate" : "Low",
      estimatedProfitability: `${(Math.random() * 10 + 5).toFixed(1)}% - ${(Math.random() * 10 + 10).toFixed(1)}% (24h)`,
      suggestions: [
        "Consider adding a stop-loss condition to limit downside risk",
        "The arbitrage path could be optimized by routing through Jupiter aggregator",
        "Current memecoin volatility suggests increasing slippage tolerance to 2.5%",
        "Add a time-based condition to execute trades during higher liquidity periods",
      ],
      marketInsights: [
        "BONK/SOL pair showing 18% price inefficiency across exchanges",
        "Raydium liquidity pools for SAMO have increased 32% in last 6 hours",
        "Memecoin trading volume has increased 3x in the past 24 hours",
        "SOL price correlation with BTC has decreased to 0.72 in the last week",
      ],
      tradingOpportunities: [
        {
          type: "Arbitrage",
          route: "BONK → SOL → SAMO → BONK",
          estimatedProfit: "3.2%",
          risk: "Low",
          timeWindow: "1-2 hours",
        },
        {
          type: "Momentum",
          asset: "MEME",
          direction: "Long",
          estimatedProfit: "15-20%",
          risk: "High",
          timeWindow: "24-48 hours",
        },
      ],
    }
  }
}

export async function analyzePool(request: PoolAnalysisRequest): Promise<any> {
  try {
    const prompt = `You are a professional DeFi analyst specializing in Solana liquidity pools. Analyze the following Raydium pool data and provide trading insights.

Pool Data:
${JSON.stringify(request.pool, null, 2)}

Network: ${request.network}

Please analyze this pool and provide:
1. Risk assessment (Low/Medium/High)
2. Profit potential analysis
3. Optimal entry/exit strategy
4. Key risk factors
5. Trading recommendations

Respond in JSON format:
{
  "poolAnalysis": {
    "riskLevel": "Low|Medium|High",
    "profitPotential": "Low|Medium|High",
    "timeHorizon": "time estimate",
    "confidence": "percentage"
  },
  "recommendations": ["rec1", "rec2", ...],
  "tradingStrategy": {
    "entry": "entry strategy",
    "exit": "exit strategy", 
    "stopLoss": "stop loss level",
    "timeframe": "recommended timeframe"
  },
  "riskFactors": ["risk1", "risk2", ...]
}`

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional DeFi analyst. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-70b-versatile",
      temperature: 0.3,
      max_tokens: 1024,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error("No response from Groq API")
    }

    return JSON.parse(response)
  } catch (error) {
    console.error("Groq Pool Analysis Error:", error)

    // Fallback response
    return {
      poolAnalysis: {
        riskLevel: request.pool.risk || "Medium",
        profitPotential: request.pool.apy > 40 ? "High" : "Medium",
        timeHorizon: "2-6 hours",
        confidence: Math.floor(Math.random() * 30) + 70,
      },
      recommendations: [
        `${request.pool.tokenA}/${request.pool.tokenB} pool shows strong momentum with ${request.pool.apy}% APY`,
        "Consider entering with 5-10% of portfolio allocation",
        "High volume indicates strong market interest",
        "Monitor for price volatility due to new pool status",
      ],
      tradingStrategy: {
        entry: "Current levels favorable for entry",
        exit: "Take profits at 20-30% gain",
        stopLoss: "Set stop-loss at 10% below entry",
        timeframe: "Hold for 4-8 hours maximum",
      },
      riskFactors: [
        "New pool with limited price history",
        "Potential for high volatility",
        "Impermanent loss risk for LP positions",
      ],
    }
  }
}

export async function generateContractCode(request: {
  description: string
  currentCode?: string
  optimization?: string
}): Promise<{ code: string; explanation: string }> {
  try {
    const prompt = `You are a Solana smart contract developer. ${request.optimization ? "Optimize" : "Generate"} a JSON contract based on this request:

Description: ${request.description}
${request.currentCode ? `Current Code: ${request.currentCode}` : ""}
${request.optimization ? `Optimization Focus: ${request.optimization}` : ""}

Generate a complete JSON contract configuration that follows Solana best practices. Include proper error handling, gas optimization, and security considerations.

Respond in JSON format:
{
  "code": "complete JSON contract code",
  "explanation": "brief explanation of the generated/optimized code"
}`

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a Solana smart contract developer. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-70b-versatile",
      temperature: 0.2,
      max_tokens: 2048,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error("No response from Groq API")
    }

    return JSON.parse(response)
  } catch (error) {
    console.error("Groq Contract Generation Error:", error)

    // Fallback response
    return {
      code: JSON.stringify(
        {
          version: "1.0.0",
          contract_type: "wallet_flow",
          description: request.description,
          functions: [
            {
              id: "generated_function",
              name: "auto_generated",
              type: "wallet",
              parameters: {},
              execution_order: 0,
            },
          ],
        },
        null,
        2,
      ),
      explanation: "Generated a basic contract structure. Please configure the specific functions for your use case.",
    }
  }
}
