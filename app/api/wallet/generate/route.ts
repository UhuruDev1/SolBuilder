import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { network } = await request.json()

    // Mock wallet generation - in production, use @solana/web3.js
    const mockWallet = {
      publicKey: generateMockPublicKey(),
      privateKey: generateMockPrivateKey(),
      network,
      balance: 0,
      created: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      wallet: mockWallet,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to generate wallet" }, { status: 500 })
  }
}

function generateMockPublicKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function generateMockPrivateKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < 88; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
