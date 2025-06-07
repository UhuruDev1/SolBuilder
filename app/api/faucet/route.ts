import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { publicKey, network } = await request.json()

    if (network === "mainnet") {
      return NextResponse.json({ success: false, error: "Faucet not available on mainnet" }, { status: 400 })
    }

    // Mock airdrop - in production, use connection.requestAirdrop()
    const airdropAmount = network === "devnet" ? 2 : 1

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return NextResponse.json({
      success: true,
      signature: generateMockSignature(),
      amount: airdropAmount,
      network,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Airdrop failed" }, { status: 500 })
  }
}

function generateMockSignature(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < 88; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
