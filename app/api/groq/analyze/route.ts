import { NextResponse } from "next/server"
import { analyzeFlow } from "@/lib/groq-client"

export async function POST(request: Request) {
  try {
    const { flow, network, options } = await request.json()

    if (!flow || !flow.nodes || !Array.isArray(flow.nodes)) {
      return NextResponse.json({ success: false, error: "Invalid flow structure" }, { status: 400 })
    }

    // Call the Groq client to analyze the flow
    const analysis = await analyzeFlow({
      flow,
      network,
      options: options || { analysisType: "trading", depth: "detailed" },
    })

    return NextResponse.json({
      success: true,
      analysis,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Analysis failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
