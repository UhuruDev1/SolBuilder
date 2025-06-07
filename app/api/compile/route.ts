import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { program, network } = await request.json()

    // Validate program structure
    if (!program.nodes || !Array.isArray(program.nodes)) {
      return NextResponse.json({ success: false, error: "Invalid program structure" }, { status: 400 })
    }

    // Mock compilation process
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const compiledProgram = {
      id: generateProgramId(),
      version: program.version || "1.0.0",
      network,
      bytecode: generateBytecode(program),
      instructions: generateInstructions(program),
      estimatedGas: calculateGasEstimate(program),
      compiledAt: new Date().toISOString(),
      metadata: {
        nodeCount: program.nodes.length,
        edgeCount: program.edges?.length || 0,
        complexity: calculateComplexity(program),
      },
    }

    return NextResponse.json({
      success: true,
      program: compiledProgram,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Compilation failed" }, { status: 500 })
  }
}

function generateProgramId(): string {
  return `prog_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
}

function generateBytecode(program: any): string {
  const instructions = []

  for (const node of program.nodes) {
    switch (node.type) {
      case "wallet":
        instructions.push("INIT_WALLET")
        instructions.push("LOAD_KEYPAIR")
        break
      case "transaction":
        instructions.push("CREATE_TX")
        instructions.push("SET_RECIPIENT")
        instructions.push("SET_AMOUNT")
        instructions.push("SIGN_TX")
        break
      case "token":
        instructions.push("TOKEN_INIT")
        instructions.push("TOKEN_TRANSFER")
        break
      case "conditional":
        instructions.push("EVAL_CONDITION")
        instructions.push("BRANCH")
        break
    }
  }

  return instructions.join("\n")
}

function generateInstructions(program: any): any[] {
  return program.nodes.map((node: any, index: number) => ({
    index,
    type: node.type,
    operation: getOperationName(node.type),
    gasEstimate: getNodeGasEstimate(node.type),
    data: node.data,
  }))
}

function getOperationName(nodeType: string): string {
  const operations = {
    wallet: "Initialize Wallet Connection",
    transaction: "Create and Execute Transaction",
    token: "SPL Token Operation",
    conditional: "Conditional Logic Evaluation",
  }
  return operations[nodeType as keyof typeof operations] || "Unknown Operation"
}

function getNodeGasEstimate(nodeType: string): number {
  const estimates = {
    wallet: 1000,
    transaction: 5000,
    token: 3000,
    conditional: 800,
  }
  return estimates[nodeType as keyof typeof estimates] || 1000
}

function calculateGasEstimate(program: any): number {
  return program.nodes.reduce((total: number, node: any) => {
    return total + getNodeGasEstimate(node.type)
  }, 0)
}

function calculateComplexity(program: any): "low" | "medium" | "high" {
  const nodeCount = program.nodes.length
  const edgeCount = program.edges?.length || 0
  const complexity = nodeCount + edgeCount * 0.5

  if (complexity < 5) return "low"
  if (complexity < 15) return "medium"
  return "high"
}
