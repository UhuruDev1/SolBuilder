"use client"
import { useCallback, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlaygroundControls } from "@/components/playground-controls"
import { NodePalette } from "@/components/node-palette"
import { SimulationPanel } from "@/components/simulation-panel"
import { CustomFlowEditor } from "@/components/custom-flow-editor"
import { useToast } from "@/hooks/use-toast"

interface FlowNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: any
}

interface FlowEdge {
  id: string
  source: string
  target: string
}

interface FlowPlaygroundProps {
  network: "devnet" | "testnet" | "mainnet"
  onCompile: (flow: any) => void
  initialFlow?: any
  simulationResults?: any
}

export function FlowPlayground({ network, onCompile, initialFlow, simulationResults }: FlowPlaygroundProps) {
  const [nodes, setNodes] = useState<FlowNode[]>([
    {
      id: "start",
      type: "wallet",
      position: { x: 100, y: 100 },
      data: {
        label: "Start Wallet",
        network: "devnet",
        address: "",
        balance: 0,
      },
    },
  ])
  const [edges, setEdges] = useState<FlowEdge[]>([])
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationStep, setSimulationStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const { toast } = useToast()

  // Load initial flow if provided
  useEffect(() => {
    if (initialFlow) {
      setNodes(initialFlow.nodes || [])
      setEdges(initialFlow.edges || [])
    }
  }, [initialFlow])

  const addNode = useCallback(
    (type: string, position: { x: number; y: number }) => {
      const newNode: FlowNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: getDefaultNodeData(type, network),
      }
      setNodes((prev) => [...prev, newNode])
    },
    [network],
  )

  const updateNode = useCallback((id: string, data: any) => {
    setNodes((prev) => prev.map((node) => (node.id === id ? { ...node, data: { ...node.data, ...data } } : node)))
  }, [])

  const deleteNode = useCallback((id: string) => {
    setNodes((prev) => prev.filter((node) => node.id !== id))
    setEdges((prev) => prev.filter((edge) => edge.source !== id && edge.target !== id))
  }, [])

  const connectNodes = useCallback((sourceId: string, targetId: string) => {
    const newEdge: FlowEdge = {
      id: `${sourceId}-${targetId}`,
      source: sourceId,
      target: targetId,
    }
    setEdges((prev) => [...prev.filter((edge) => edge.target !== targetId), newEdge])
  }, [])

  const getDefaultNodeData = (type: string, network: string) => {
    const defaults = {
      wallet: {
        label: "Wallet Node",
        network,
        address: "",
        balance: 0,
      },
      funding: {
        label: "Funding Node",
        amount: 1,
        source: "faucet",
        currency: "SOL",
      },
      transaction: {
        label: "Transaction Node",
        type: "transfer",
        amount: 0,
        recipient: "",
      },
      inputValue: {
        label: "Input Value",
        valueType: "number",
        defaultValue: 0,
        validation: "required",
      },
      conditionalTimer: {
        label: "Timer Condition",
        duration: 60,
        unit: "seconds",
        condition: "after",
      },
      oracleCheck: {
        label: "Oracle Check",
        oracle: "pyth",
        asset: "SOL/USD",
        condition: "price > 100",
      },
      output: {
        label: "Output Node",
        format: "json",
        destination: "console",
      },
    }

    return defaults[type as keyof typeof defaults] || { label: "Node" }
  }

  const compileFlow = () => {
    if (nodes.length <= 1) {
      toast({
        title: "Insufficient Flow",
        description: "Please add more nodes to create a complete flow",
        variant: "destructive",
      })
      return
    }

    const flow = {
      version: "2.0.0",
      network,
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
      })),
      edges: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
      })),
      metadata: {
        createdAt: new Date().toISOString(),
        network,
        nodeCount: nodes.length,
        edgeCount: edges.length,
        flowType: "wallet-flow",
      },
    }

    onCompile(flow)
    toast({
      title: "Flow Compiled",
      description: "Your wallet flow has been successfully compiled",
    })
  }

  const startSimulation = () => {
    setIsSimulating(true)
    setIsPlaying(true)
    setSimulationStep(0)
    toast({
      title: "Simulation Started",
      description: "Your flow is now being simulated",
    })
  }

  const pauseSimulation = () => {
    setIsPlaying(false)
    toast({
      title: "Simulation Paused",
      description: "You can resume or stop the simulation",
    })
  }

  const stopSimulation = () => {
    setIsSimulating(false)
    setIsPlaying(false)
    setSimulationStep(0)
    toast({
      title: "Simulation Stopped",
      description: "Simulation has been reset",
    })
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 h-[calc(100vh-200px)]">
      {/* Node Palette */}
      <div className="xl:col-span-1">
        <NodePalette onAddNode={addNode} />
      </div>

      {/* Main Flow Editor */}
      <div className="xl:col-span-3">
        <Card className="h-full bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Flow Designer</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{network}</Badge>
                <PlaygroundControls
                  isSimulating={isSimulating}
                  isPlaying={isPlaying}
                  onPlay={startSimulation}
                  onPause={pauseSimulation}
                  onStop={stopSimulation}
                  onCompile={compileFlow}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-80px)]">
            <CustomFlowEditor
              nodes={nodes}
              edges={edges}
              onUpdateNode={updateNode}
              onDeleteNode={deleteNode}
              onConnectNodes={connectNodes}
              onAddNode={addNode}
              isSimulating={isSimulating}
              currentStep={simulationStep}
            />
          </CardContent>
        </Card>
      </div>

      {/* Simulation Panel */}
      <div className="xl:col-span-1">
        <SimulationPanel
          isSimulating={isSimulating}
          currentStep={simulationStep}
          nodes={nodes}
          edges={edges}
          simulationResults={simulationResults}
        />
      </div>
    </div>
  )
}
