"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Play, TrendingUp, Copy, Shuffle, DollarSign, BarChart2, Zap, Target, Coins } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SampleFlow {
  id: string
  name: string
  description: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  estimatedProfit: string
  timeframe: string
  icon: any
  flow: any
}

const sampleFlows: SampleFlow[] = [
  {
    id: "simple-transfer",
    name: "Simple Wallet Transfer",
    description: "Basic wallet funding and SOL transfer between accounts",
    category: "basic",
    difficulty: "Beginner",
    estimatedProfit: "0%",
    timeframe: "Instant",
    icon: DollarSign,
    flow: {
      version: "2.0.0",
      network: "devnet",
      nodes: [
        {
          id: "wallet-1",
          type: "wallet",
          position: { x: 100, y: 100 },
          data: { label: "Source Wallet", network: "devnet", balance: 0 },
        },
        {
          id: "funding-1",
          type: "funding",
          position: { x: 350, y: 100 },
          data: { label: "Fund Wallet", amount: 5, source: "faucet", currency: "SOL" },
        },
        {
          id: "transaction-1",
          type: "transaction",
          position: { x: 600, y: 100 },
          data: { label: "Transfer SOL", type: "transfer", amount: 1, recipient: "target_wallet" },
        },
      ],
      edges: [
        { id: "e1", source: "wallet-1", target: "funding-1" },
        { id: "e2", source: "funding-1", target: "transaction-1" },
      ],
    },
  },
  {
    id: "arbitrage-flow",
    name: "DEX Arbitrage Bot",
    description: "Automated arbitrage trading across multiple DEXs for profit",
    category: "trading",
    difficulty: "Advanced",
    estimatedProfit: "2-5%",
    timeframe: "1-4 hours",
    icon: Shuffle,
    flow: {
      version: "2.0.0",
      network: "devnet",
      nodes: [
        {
          id: "wallet-1",
          type: "wallet",
          position: { x: 100, y: 150 },
          data: { label: "Trading Wallet", network: "devnet", balance: 10 },
        },
        {
          id: "arbitrage-1",
          type: "arbitrage",
          position: { x: 350, y: 150 },
          data: {
            label: "Arbitrage Scanner",
            path: ["Raydium", "Orca", "Jupiter"],
            minProfitPercent: 2.0,
            maxSlippage: 1.0,
            gasLimit: 500000,
          },
        },
        {
          id: "profit-1",
          type: "profitLoss",
          position: { x: 600, y: 100 },
          data: {
            label: "Profit Control",
            takeProfit: 5,
            stopLoss: 2,
            trailingStop: true,
            timeLimit: 4,
          },
        },
        {
          id: "output-1",
          type: "output",
          position: { x: 850, y: 150 },
          data: { label: "Results", format: "json", destination: "console" },
        },
      ],
      edges: [
        { id: "e1", source: "wallet-1", target: "arbitrage-1" },
        { id: "e2", source: "arbitrage-1", target: "profit-1" },
        { id: "e3", source: "profit-1", target: "output-1" },
      ],
    },
  },
  {
    id: "copy-trading",
    name: "Whale Copy Trading",
    description: "Copy trades from successful whale wallets automatically",
    category: "trading",
    difficulty: "Intermediate",
    estimatedProfit: "5-15%",
    timeframe: "24 hours",
    icon: Copy,
    flow: {
      version: "2.0.0",
      network: "devnet",
      nodes: [
        {
          id: "wallet-1",
          type: "wallet",
          position: { x: 100, y: 150 },
          data: { label: "Your Wallet", network: "devnet", balance: 5 },
        },
        {
          id: "copy-1",
          type: "copyTrade",
          position: { x: 350, y: 150 },
          data: {
            label: "Copy Whale Trades",
            targetWallet: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
            copyPercent: 50,
            maxSlippage: 2.0,
            tokens: ["SOL", "BONK", "SAMO", "MEME"],
          },
        },
        {
          id: "profit-1",
          type: "profitLoss",
          position: { x: 600, y: 100 },
          data: {
            label: "Risk Management",
            takeProfit: 15,
            stopLoss: 5,
            trailingStop: false,
            timeLimit: 24,
          },
        },
        {
          id: "output-1",
          type: "output",
          position: { x: 850, y: 150 },
          data: { label: "Trade Log", format: "json", destination: "database" },
        },
      ],
      edges: [
        { id: "e1", source: "wallet-1", target: "copy-1" },
        { id: "e2", source: "copy-1", target: "profit-1" },
        { id: "e3", source: "profit-1", target: "output-1" },
      ],
    },
  },
  {
    id: "meme-momentum",
    name: "Meme Coin Momentum",
    description: "Ride the momentum of trending meme coins with smart entry/exit",
    category: "trading",
    difficulty: "Intermediate",
    estimatedProfit: "10-50%",
    timeframe: "2-6 hours",
    icon: TrendingUp,
    flow: {
      version: "2.0.0",
      network: "devnet",
      nodes: [
        {
          id: "wallet-1",
          type: "wallet",
          position: { x: 100, y: 150 },
          data: { label: "Meme Wallet", network: "devnet", balance: 3 },
        },
        {
          id: "meme-1",
          type: "memeTrade",
          position: { x: 350, y: 150 },
          data: {
            label: "Meme Scanner",
            tokens: ["BONK", "SAMO", "MEME", "WIF"],
            strategy: "momentum",
            riskLevel: "high",
            maxAllocation: 20,
          },
        },
        {
          id: "timer-1",
          type: "conditionalTimer",
          position: { x: 600, y: 100 },
          data: {
            label: "Exit Timer",
            duration: 6,
            unit: "hours",
            condition: "after",
          },
        },
        {
          id: "profit-1",
          type: "profitLoss",
          position: { x: 600, y: 200 },
          data: {
            label: "Quick Profits",
            takeProfit: 50,
            stopLoss: 10,
            trailingStop: true,
            timeLimit: 6,
          },
        },
        {
          id: "output-1",
          type: "output",
          position: { x: 850, y: 150 },
          data: { label: "Meme Results", format: "json", destination: "console" },
        },
      ],
      edges: [
        { id: "e1", source: "wallet-1", target: "meme-1" },
        { id: "e2", source: "meme-1", target: "timer-1" },
        { id: "e3", source: "meme-1", target: "profit-1" },
        { id: "e4", source: "timer-1", target: "output-1" },
        { id: "e5", source: "profit-1", target: "output-1" },
      ],
    },
  },
  {
    id: "dca-strategy",
    name: "DCA Investment Bot",
    description: "Dollar Cost Average into SOL and top tokens over time",
    category: "investment",
    difficulty: "Beginner",
    estimatedProfit: "8-12%",
    timeframe: "30 days",
    icon: BarChart2,
    flow: {
      version: "2.0.0",
      network: "devnet",
      nodes: [
        {
          id: "wallet-1",
          type: "wallet",
          position: { x: 100, y: 150 },
          data: { label: "DCA Wallet", network: "devnet", balance: 100 },
        },
        {
          id: "timer-1",
          type: "conditionalTimer",
          position: { x: 350, y: 150 },
          data: {
            label: "Weekly Timer",
            duration: 7,
            unit: "days",
            condition: "every",
          },
        },
        {
          id: "transaction-1",
          type: "transaction",
          position: { x: 600, y: 100 },
          data: { label: "Buy SOL", type: "swap", amount: 10, recipient: "SOL" },
        },
        {
          id: "transaction-2",
          type: "transaction",
          position: { x: 600, y: 200 },
          data: { label: "Buy BONK", type: "swap", amount: 5, recipient: "BONK" },
        },
        {
          id: "output-1",
          type: "output",
          position: { x: 850, y: 150 },
          data: { label: "Portfolio", format: "json", destination: "dashboard" },
        },
      ],
      edges: [
        { id: "e1", source: "wallet-1", target: "timer-1" },
        { id: "e2", source: "timer-1", target: "transaction-1" },
        { id: "e3", source: "timer-1", target: "transaction-2" },
        { id: "e4", source: "transaction-1", target: "output-1" },
        { id: "e5", source: "transaction-2", target: "output-1" },
      ],
    },
  },
  {
    id: "liquidity-farming",
    name: "Liquidity Farming Bot",
    description: "Automatically provide liquidity to high-yield pools",
    category: "defi",
    difficulty: "Advanced",
    estimatedProfit: "15-25%",
    timeframe: "7 days",
    icon: Coins,
    flow: {
      version: "2.0.0",
      network: "devnet",
      nodes: [
        {
          id: "wallet-1",
          type: "wallet",
          position: { x: 100, y: 150 },
          data: { label: "LP Wallet", network: "devnet", balance: 20 },
        },
        {
          id: "oracle-1",
          type: "oracleCheck",
          position: { x: 350, y: 150 },
          data: {
            label: "Yield Scanner",
            oracle: "raydium",
            asset: "LP_POOLS",
            condition: "apy > 15",
          },
        },
        {
          id: "transaction-1",
          type: "transaction",
          position: { x: 600, y: 150 },
          data: { label: "Add Liquidity", type: "liquidity_add", amount: 10, recipient: "pool" },
        },
        {
          id: "timer-1",
          type: "conditionalTimer",
          position: { x: 850, y: 100 },
          data: {
            label: "Harvest Timer",
            duration: 24,
            unit: "hours",
            condition: "every",
          },
        },
        {
          id: "transaction-2",
          type: "transaction",
          position: { x: 850, y: 200 },
          data: { label: "Claim Rewards", type: "harvest", amount: 0, recipient: "wallet" },
        },
      ],
      edges: [
        { id: "e1", source: "wallet-1", target: "oracle-1" },
        { id: "e2", source: "oracle-1", target: "transaction-1" },
        { id: "e3", source: "transaction-1", target: "timer-1" },
        { id: "e4", source: "timer-1", target: "transaction-2" },
      ],
    },
  },
]

interface SampleFlowsProps {
  onLoadFlow: (flow: any) => void
  onSimulateFlow: (flow: any) => void
}

export function SampleFlows({ onLoadFlow, onSimulateFlow }: SampleFlowsProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const { toast } = useToast()

  const categories = ["all", "basic", "trading", "investment", "defi"]

  const filteredFlows =
    selectedCategory === "all" ? sampleFlows : sampleFlows.filter((flow) => flow.category === selectedCategory)

  const handleLoadFlow = (flow: SampleFlow) => {
    onLoadFlow(flow.flow)
    toast({
      title: "Flow Loaded",
      description: `${flow.name} has been loaded into the playground`,
    })
  }

  const handleSimulateFlow = (flow: SampleFlow) => {
    onSimulateFlow(flow.flow)
    toast({
      title: "Simulation Started",
      description: `Running simulation for ${flow.name}`,
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-50 text-green-700"
      case "Intermediate":
        return "bg-yellow-50 text-yellow-700"
      case "Advanced":
        return "bg-red-50 text-red-700"
      default:
        return "bg-gray-50 text-gray-700"
    }
  }

  return (
    <Card className="bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>Sample Trading Flows</span>
          <Badge variant="outline">{filteredFlows.length} flows</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Zap className="h-4 w-4" />
          <AlertDescription>
            Load pre-built trading strategies and see them work in simulation. Perfect for learning and getting started
            quickly.
          </AlertDescription>
        </Alert>

        {/* Category Filter */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="investment">Investment</TabsTrigger>
            <TabsTrigger value="defi">DeFi</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFlows.map((flow) => (
                <Card
                  key={flow.id}
                  className="bg-white hover:bg-gray-50 transition-colors border-2 hover:border-blue-200"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                          <flow.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{flow.name}</h3>
                          <Badge variant="outline" className={getDifficultyColor(flow.difficulty)}>
                            {flow.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">{flow.description}</p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">Est. Profit</p>
                        <p className="text-sm font-semibold text-green-600">{flow.estimatedProfit}</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">Timeframe</p>
                        <p className="text-sm font-semibold">{flow.timeframe}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleLoadFlow(flow)} className="flex-1">
                        <Download className="h-4 w-4 mr-1" />
                        Load
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSimulateFlow(flow)}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Simulate
                      </Button>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{flow.flow.nodes.length} nodes</span>
                        <span>{flow.flow.edges.length} connections</span>
                        <span className="capitalize">{flow.category}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
