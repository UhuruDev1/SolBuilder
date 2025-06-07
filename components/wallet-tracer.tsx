"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Search, Brain, TrendingUp, AlertTriangle, Users, Zap, Network, Bot, Wallet } from "lucide-react"

interface WalletPattern {
  id: string
  type: "mev_bot" | "whale_trader" | "copy_trader" | "sandwich_bot" | "arbitrage_bot" | "normal_user"
  confidence: number
  description: string
  indicators: string[]
  riskLevel: "low" | "medium" | "high"
  profitability: number
}

interface Transaction {
  id: string
  hash: string
  timestamp: Date
  type: string
  amount: number
  token: string
  platform: string
  gasUsed: number
  success: boolean
  anomalyScore: number
}

interface WalletConnection {
  address: string
  relationship: string
  strength: number
  transactionCount: number
  totalValue: number
}

export function WalletTracer() {
  const [walletAddress, setWalletAddress] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [patterns, setPatterns] = useState<WalletPattern[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [connections, setConnections] = useState<WalletConnection[]>([])
  const [bubbleMapData, setBubbleMapData] = useState<any>(null)

  const analyzeWallet = async () => {
    if (!walletAddress) return

    setIsAnalyzing(true)

    // Simulate AI analysis
    setTimeout(() => {
      // Generate mock patterns
      const mockPatterns: WalletPattern[] = [
        {
          id: "pattern-1",
          type: "mev_bot",
          confidence: 87,
          description: "High-frequency MEV extraction pattern detected",
          indicators: ["Consistent sandwich attacks", "Sub-second transaction timing", "High gas fees"],
          riskLevel: "high",
          profitability: 15.7,
        },
        {
          id: "pattern-2",
          type: "arbitrage_bot",
          confidence: 73,
          description: "Cross-DEX arbitrage trading pattern",
          indicators: ["Multi-platform trades", "Price differential exploitation", "Automated execution"],
          riskLevel: "medium",
          profitability: 8.3,
        },
        {
          id: "pattern-3",
          type: "whale_trader",
          confidence: 91,
          description: "Large volume institutional trading behavior",
          indicators: ["High transaction values", "Market impact trades", "Strategic timing"],
          riskLevel: "low",
          profitability: 23.1,
        },
      ]

      // Generate mock transactions
      const mockTransactions: Transaction[] = Array.from({ length: 50 }, (_, i) => ({
        id: `tx-${i}`,
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        type: ["swap", "transfer", "mint", "burn"][Math.floor(Math.random() * 4)],
        amount: Math.random() * 1000,
        token: ["SOL", "USDC", "RAY", "ORCA"][Math.floor(Math.random() * 4)],
        platform: ["Raydium", "Jupiter", "Orca", "Meteora"][Math.floor(Math.random() * 4)],
        gasUsed: Math.random() * 100000,
        success: Math.random() > 0.1,
        anomalyScore: Math.random() * 100,
      }))

      // Generate mock connections
      const mockConnections: WalletConnection[] = Array.from({ length: 20 }, (_, i) => ({
        address: `${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 8)}`,
        relationship: ["Direct Transfer", "Shared Liquidity", "Copy Trading", "MEV Victim"][
          Math.floor(Math.random() * 4)
        ],
        strength: Math.random() * 100,
        transactionCount: Math.floor(Math.random() * 100),
        totalValue: Math.random() * 100000,
      }))

      setPatterns(mockPatterns)
      setTransactions(mockTransactions)
      setConnections(mockConnections)
      setBubbleMapData({
        nodes: mockConnections.map((conn, i) => ({
          id: i,
          address: conn.address,
          size: conn.strength,
          color: getConnectionColor(conn.relationship),
        })),
        links: mockConnections.slice(0, 10).map((_, i) => ({
          source: 0,
          target: i + 1,
          strength: Math.random(),
        })),
      })

      setIsAnalyzing(false)
    }, 3000)
  }

  const getPatternIcon = (type: string) => {
    switch (type) {
      case "mev_bot":
        return <Bot className="w-4 h-4" />
      case "whale_trader":
        return <TrendingUp className="w-4 h-4" />
      case "copy_trader":
        return <Users className="w-4 h-4" />
      case "sandwich_bot":
        return <Zap className="w-4 h-4" />
      case "arbitrage_bot":
        return <Network className="w-4 h-4" />
      default:
        return <Wallet className="w-4 h-4" />
    }
  }

  const getPatternColor = (type: string) => {
    switch (type) {
      case "mev_bot":
        return "bg-red-100 text-red-800"
      case "whale_trader":
        return "bg-blue-100 text-blue-800"
      case "copy_trader":
        return "bg-green-100 text-green-800"
      case "sandwich_bot":
        return "bg-orange-100 text-orange-800"
      case "arbitrage_bot":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "high":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getConnectionColor = (relationship: string) => {
    switch (relationship) {
      case "Direct Transfer":
        return "#3b82f6"
      case "Shared Liquidity":
        return "#10b981"
      case "Copy Trading":
        return "#f59e0b"
      case "MEV Victim":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Wallet Anomaly Tracer</h2>
          <p className="text-gray-600">Advanced pattern detection and transaction analysis</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <Input
              placeholder="Enter wallet address to analyze..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={analyzeWallet}
              disabled={isAnalyzing || !walletAddress}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isAnalyzing ? (
                <>
                  <Brain className="w-4 h-4 mr-2 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze Wallet
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {patterns.length > 0 && (
        <Tabs defaultValue="patterns" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="patterns">AI Patterns</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="connections">Network</TabsTrigger>
            <TabsTrigger value="bubblemap">Bubble Map</TabsTrigger>
          </TabsList>

          <TabsContent value="patterns" className="space-y-4">
            {/* Pattern Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-600">Patterns Detected</p>
                      <p className="text-2xl font-bold">{patterns.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-600">High Risk Patterns</p>
                      <p className="text-2xl font-bold">{patterns.filter((p) => p.riskLevel === "high").length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600">Avg Profitability</p>
                      <p className="text-2xl font-bold">
                        {(patterns.reduce((acc, p) => acc + p.profitability, 0) / patterns.length).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detected Patterns */}
            <Card>
              <CardHeader>
                <CardTitle>Detected Behavioral Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patterns.map((pattern) => (
                    <div key={pattern.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getPatternIcon(pattern.type)}
                          <div>
                            <h3 className="font-medium">{pattern.description}</h3>
                            <Badge className={getPatternColor(pattern.type)}>
                              {pattern.type.replace("_", " ").toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Confidence:</span>
                            <span className="font-bold">{pattern.confidence}%</span>
                          </div>
                          <Progress value={pattern.confidence} className="w-24 h-2 mt-1" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Risk Level:</span>
                          <span className={`ml-2 font-medium ${getRiskColor(pattern.riskLevel)}`}>
                            {pattern.riskLevel.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Profitability:</span>
                          <span className="ml-2 font-medium text-green-600">+{pattern.profitability}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Indicators:</span>
                          <span className="ml-2 font-medium">{pattern.indicators.length} detected</span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Key Indicators:</p>
                        <div className="flex flex-wrap gap-2">
                          {pattern.indicators.map((indicator, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {indicator}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.slice(0, 20).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${tx.success ? "bg-green-500" : "bg-red-500"}`} />
                        <div>
                          <div className="font-mono text-sm">{tx.hash.slice(0, 16)}...</div>
                          <div className="text-xs text-gray-600">
                            {tx.type} • {tx.platform} • {tx.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-medium">
                            {tx.amount.toFixed(4)} {tx.token}
                          </div>
                          <div className="text-xs text-gray-600">Gas: {tx.gasUsed.toFixed(0)}</div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs text-gray-600">Anomaly Score</div>
                          <div
                            className={`font-bold ${tx.anomalyScore > 70 ? "text-red-600" : tx.anomalyScore > 40 ? "text-yellow-600" : "text-green-600"}`}
                          >
                            {tx.anomalyScore.toFixed(0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="connections" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Wallet Network Connections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {connections.slice(0, 15).map((conn, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: getConnectionColor(conn.relationship) }}
                        />
                        <div>
                          <div className="font-mono text-sm">{conn.address}</div>
                          <div className="text-xs text-gray-600">{conn.relationship}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">{conn.transactionCount} txs</div>
                          <div className="text-xs text-gray-600">${conn.totalValue.toFixed(0)}</div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs text-gray-600">Strength</div>
                          <Progress value={conn.strength} className="w-16 h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bubblemap" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Interactive Bubble Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <Network className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">Interactive Network Visualization</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Bubble map showing wallet connections and transaction flows
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        <span>Direct Transfers</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span>Shared Liquidity</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <span>Copy Trading</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <span>MEV Victims</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
