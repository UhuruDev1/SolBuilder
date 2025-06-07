import { NextResponse } from "next/server"
import { analyzePool } from "@/lib/groq-client"

export async function POST(request: Request) {
  try {
    const { pool, network } = await request.json()

    if (!pool) {
      return NextResponse.json({ success: false, error: "Pool data is required" }, { status: 400 })
    }

    // Call the Groq client to analyze the pool
    const analysis = await analyzePool({
      pool,
      network: network || "devnet",
    })

    return NextResponse.json({
      success: true,
      analysis,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Pool analysis failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
