import { NextResponse } from "next/server"
import { Keypair } from "@solana/web3.js"
import { encode } from "bs58"

export async function POST() {
  try {
    // Generate a new Solana keypair
    const keypair = Keypair.generate()

    // Get the public and private keys
    const publicKey = keypair.publicKey.toString()
    const privateKey = encode(keypair.secretKey)

    return NextResponse.json({
      success: true,
      publicKey,
      privateKey,
    })
  } catch (error) {
    console.error("Failed to generate wallet:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate wallet",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
