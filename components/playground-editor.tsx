"use client"

import type React from "react"

import { useCallback, useState, useRef } from "react"
import ReactFlow, {
  type Node,
  type Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Connection,
  ReactFlowProvider,
  Panel,
} from "reactflow"
import "reactflow/dist/style.css"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Wallet,
  Send,
  ArrowRightLeft,
  Coins,
  Play,
  Save,
  Upload,
  Maximize2,
  Minimize2,
  Copy,
  TrendingUp,
  Percent,
  DollarSign,
  BarChart2,
  Shuffle,
  Zap,
  BrainCircuit,
} from "lucide-react"
import { WalletNode } from "@/components/nodes/wallet-node"
import { TransactionNode } from "@/components/nodes/transaction-node"
import { TokenNode } from "@/components/nodes/token-node"
import { ConditionalNode } from "@/components/nodes/conditional-node"
import { CopyTradeNode } from "@/components/nodes/copy-trade-node"
import { ProfitLossNode } from "@/components/nodes/profit-loss-node"
import { ArbitrageNode } from "@/components/nodes/arbitrage-node"
import { MemeTradeNode } from "@/components/nodes/meme-trade-node"
import { FundingNode } from "@/components/nodes/funding-node"
import { useToast } from "@/hooks/use-toast"

const nodeTypes = {
  wallet: WalletNode,
  transaction: TransactionNode,
  token: TokenNode,
  conditional: ConditionalNode,
  copyTrade: CopyTradeNode,
  profitLoss: ProfitLossNode,
  arbitrage: ArbitrageNode,
  memeTrade: MemeTradeNode,
  funding: FundingNode,
}

const initialNodes: Node[] = [
  {
    id: "1",
    type: "wallet",
    position: { x: 100, y: 100 },
    data: {
      label: "Wallet Connection",
      network: "devnet",
      address: "",
      balance: 0,
    },
  },
]

const initialEdges: Edge[] = []

interface PlaygroundEditorProps {
  network: "devnet" | "testnet" | "mainnet"
  onCompile: (json: any) => void
  isFullscreen: boolean
  setIsFullscreen: (value: boolean) => void
}

export function PlaygroundEditor({ network, onCompile, isFullscreen, setIsFullscreen }: PlaygroundEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNodeType, setSelectedNodeType] = useState<string>("")
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState("wallet")
  const { toast } = useToast()

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData("application/reactflow")
      if (typeof type === "undefined" || !type) {
        return
      }

      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNode: Node = {
        id: `${Date.now()}`,
        type,
        position,
        data: getDefaultNodeData(type, network),
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, setNodes, network],
  )

  const getDefaultNodeData = (type: string, network: string) => {
    switch (type) {
      case "wallet":
        return {
          label: "Wallet Node",
          network,
          address: "",
          balance: 0,
        }
      case "transaction":
        return {
          label: "Transaction Node",
          type: "transfer",
          amount: 0,
          recipient: "",
        }
      case "token":
        return {
          label: "Token Transfer",
          mint: "",
          amount: 0,
          decimals: 9,
        }
      case "conditional":
        return {
          label: "Conditional Logic",
          condition: "balance > 0",
          trueAction: "",
          falseAction: "",
        }
      case "copyTrade":
        return {
          label: "Copy Trading",
          targetWallet: "",
          copyPercent: 100,
          maxSlippage: 1.0,
          tokens: ["SOL", "BONK", "SAMO"],
        }
      case "profitLoss":
        return {
          label: "Profit/Loss Control",
          takeProfit: 15,
          stopLoss: 7,
          trailingStop: false,
          timeLimit: 24, // hours
        }
      case "arbitrage":
        return {
          label: "Arbitrage Strategy",
          path: ["DEX1", "DEX2", "DEX3"],
          minProfitPercent: 1.5,
          maxSlippage: 1.0,
          gasLimit: 500000,
        }
      case "memeTrade":
        return {
          label: "Meme Trading",
          tokens: ["BONK", "SAMO", "MEME"],
          strategy: "momentum",
          riskLevel: "medium",
          maxAllocation: 10, // percent
        }
      case "funding":
        return {
          label: "Wallet Funding",
          amount: 5,
          source: "faucet",
          currency: "SOL",
        }
      default:
        return { label: "Node" }
    }
  }

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  const compileToJson = () => {
    if (nodes.length <= 1) {
      toast({
        title: "Insufficient Flow",
        description: "Please add more nodes to create a complete trading flow",
        variant: "destructive",
      })
      return
    }

    const program = {
      version: "1.0.0",
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
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
      })),
      metadata: {
        createdAt: new Date().toISOString(),
        network,
        nodeCount: nodes.length,
        edgeCount: edges.length,
        flowType: detectFlowType(nodes),
      },
    }

    onCompile(program)
    toast({
      title: "Flow Compiled",
      description: "Your trading flow has been successfully compiled",
    })
    return program
  }

  const detectFlowType = (nodes: Node[]) => {
    const types = nodes.map((n) => n.type)

    if (types.includes("arbitrage")) return "arbitrage"
    if (types.includes("memeTrade")) return "meme-trading"
    if (types.includes("copyTrade")) return "copy-trading"
    if (types.filter((t) => t === "token").length > 2) return "multi-token-swap"
    return "general"
  }

  const nodeCategories = [
    {
      id: "wallet",
      title: "Wallet Operations",
      nodes: [
        { type: "wallet", label: "Wallet", icon: Wallet, color: "bg-blue-500" },
        { type: "funding", label: "Funding", icon: DollarSign, color: "bg-blue-500" },
      ],
    },
    {
      id: "transaction",
      title: "Transactions",
      nodes: [
        { type: "transaction", label: "Transaction", icon: Send, color: "bg-green-500" },
        { type: "token", label: "Token Transfer", icon: Coins, color: "bg-yellow-500" },
      ],
    },
    {
      id: "trading",
      title: "Trading",
      nodes: [
        { type: "copyTrade", label: "Copy Trading", icon: Copy, color: "bg-purple-500" },
        { type: "arbitrage", label: "Arbitrage", icon: Shuffle, color: "bg-red-500" },
        { type: "memeTrade", label: "Meme Trading", icon: TrendingUp, color: "bg-pink-500" },
      ],
    },
    {
      id: "control",
      title: "Control Flow",
      nodes: [
        { type: "conditional", label: "Conditional", icon: ArrowRightLeft, color: "bg-indigo-500" },
        { type: "profitLoss", label: "Profit/Loss", icon: Percent, color: "bg-orange-500" },
      ],
    },
  ]

  return (
    <div className={`grid ${isFullscreen ? "" : "grid-cols-1 lg:grid-cols-4"} gap-4 h-[800px]`}>
      {/* Node Palette - Hide in fullscreen mode */}
      {!isFullscreen && (
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Trading Blocks</h3>
              <Badge variant="outline">{network}</Badge>
            </div>

            <Tabs defaultValue="wallet" value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="wallet">
                  <Wallet className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="transaction">
                  <Send className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="trading">
                  <BarChart2 className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="control">
                  <ArrowRightLeft className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>

              {nodeCategories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="space-y-2 mt-2">
                  <h4 className="text-sm font-medium text-gray-700">{category.title}</h4>
                  <div className="space-y-2">
                    {category.nodes.map((node) => (
                      <div
                        key={node.type}
                        className="flex items-center space-x-2 p-2 rounded-lg border border-gray-200 cursor-grab hover:bg-gray-50 transition-colors"
                        draggable
                        onDragStart={(event) => onDragStart(event, node.type)}
                      >
                        <div className={`p-1 rounded ${node.color}`}>
                          <node.icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-medium">{node.label}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" onClick={compileToJson}>
                  <Play className="h-4 w-4 mr-1" />
                  Compile
                </Button>
                <Button size="sm" variant="outline">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="outline">
                  <Upload className="h-4 w-4 mr-1" />
                  Load
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsFullscreen(true)}>
                  <Maximize2 className="h-4 w-4 mr-1" />
                  Expand
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">AI Assistant</h4>
              <Button className="w-full" variant="default">
                <BrainCircuit className="h-4 w-4 mr-2" />
                Optimize Flow with Groq
              </Button>
              <p className="text-xs text-gray-500 mt-1">Let Groq AI analyze and optimize your trading strategy</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flow Editor */}
      <div className={isFullscreen ? "w-full" : "lg:col-span-3"}>
        <Card className="bg-white/50 backdrop-blur-sm h-full">
          <CardContent className="p-0 h-full relative">
            <div className="absolute top-2 right-2 z-10 flex space-x-2">
              {isFullscreen ? (
                <Button size="sm" variant="outline" onClick={() => setIsFullscreen(false)}>
                  <Minimize2 className="h-4 w-4 mr-1" />
                  Exit Fullscreen
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={compileToJson}>
                  <Zap className="h-4 w-4 mr-1" />
                  Run Flow
                </Button>
              )}
            </div>

            <div className="h-full" ref={reactFlowWrapper}>
              <ReactFlowProvider>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onInit={setReactFlowInstance}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  nodeTypes={nodeTypes}
                  fitView
                  className="bg-gradient-to-br from-gray-50 to-gray-100"
                >
                  <Controls />
                  <MiniMap />
                  <Background variant="dots" gap={12} size={1} />
                  <Panel position="top-left">
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 text-xs text-gray-600">
                      Drag blocks to build your trading flow
                    </div>
                  </Panel>
                </ReactFlow>
              </ReactFlowProvider>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
