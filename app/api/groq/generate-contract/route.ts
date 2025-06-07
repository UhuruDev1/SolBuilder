import { NextResponse } from "next/server"
import { generateContractCode } from "@/lib/groq-client"

export async function POST(request: Request) {
  try {
    const { description, currentCode, optimization } = await request.json()

    if (!description || typeof description !== "string") {
      return NextResponse.json({ success: false, error: "Description is required" }, { status: 400 })
    }

    const result = await generateContractCode({
      description,
      currentCode,
      optimization,
    })

    return NextResponse.json({
      success: true,
      result,
    })
  } catch (error) {
    console.error("Contract generation error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate contract",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
