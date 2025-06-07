"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, TrendingUp, Droplets, Clock, Zap, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LiquidityPool {
  id: string
  tokenA: string
  tokenB: string
  tvl: number
  apy: number
  volume24h: number
  createdAt: string
  isNew: boolean
  risk: "Low" | "Medium" | "High"
  opportunity: string
}

interface RaydiumMonitorProps {
  onAnalyzeOpportunity: (pool: LiquidityPool) => void
}

export function RaydiumMonitor({ onAnalyzeOpportunity }: RaydiumMonitorProps) {
  const [pools, setPools] = useState<LiquidityPool[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [opportunities, setOpportunities] = useState<any[]>([])
  const { toast } = useToast()

  // Mock data for demonstration
  const mockPools: LiquidityPool[] = [
    {
      id: "pool-1",
      tokenA: "SOL",
      tokenB: "BONK",
      tvl: 2500000,
      apy: 45.2,
      volume24h: 890000,
      createdAt: "2 minutes ago",
      isNew: true,
      risk: "Medium",
      opportunity: "High volume, new pool with strong momentum",
    },
    {
      id: "pool-2",
      tokenA: "SAMO",
      tokenB: "USDC",
      tvl: 1200000,
      apy: 32.8,
      volume24h: 450000,
      createdAt: "15 minutes ago",
      isNew: true,
      risk: "Low",
      opportunity: "Stable pair with consistent returns",
    },
    {
      id: "pool-3",
      tokenA: "WIF",
      tokenB: "SOL",
      tvl: 850000,
      apy: 78.5,
      volume24h: 1200000,
      createdAt: "5 minutes ago",
      isNew: true,
      risk: "High",
      opportunity: "Meme coin with explosive growth potential",
    },
    {
      id: "pool-4",
      tokenA: "RAY",
      tokenB: "USDC",
      tvl: 5600000,
      apy: 18.3,
      volume24h: 2100000,
      createdAt: "1 hour ago",
      isNew: false,
      risk: "Low",
      opportunity: "Established pool with steady yields",
    },
  ]

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        // Simulate new pool discovery
        const newPool = generateRandomPool()
        setPools((prev) => [newPool, ...prev.slice(0, 9)]) // Keep last 10 pools
        setLastUpdate(new Date())

        // Generate AI opportunities
        generateOpportunities(newPool)
      }, 15000) // Update every 15 seconds

      return () => clearInterval(interval)
    }
  }, [isMonitoring])

  const generateRandomPool = (): LiquidityPool => {
    const tokens = ["SOL", "BONK", "SAMO", "WIF", "MEME", "USDC", "RAY", "SRM"]
    const tokenA = tokens[Math.floor(Math.random() * tokens.length)]
    let tokenB = tokens[Math.floor(Math.random() * tokens.length)]
    while (tokenB === tokenA) {
      tokenB = tokens[Math.floor(Math.random() * tokens.length)]
    }

    const tvl = Math.floor(Math.random() * 5000000) + 100000
    const apy = Math.floor(Math.random() * 80) + 10
    const volume24h = Math.floor(Math.random() * 2000000) + 50000

    return {
      id: `pool-${Date.now()}`,
      tokenA,
      tokenB,
      tvl,
      apy,
      volume24h,
      createdAt: "Just now",
      isNew: true,
      risk: apy > 50 ? "High" : apy > 25 ? "Medium" : "Low",
      opportunity: generateOpportunityText(apy, volume24h, tvl),
    }
  }

  const generateOpportunityText = (apy: number, volume: number, tvl: number): string => {
    if (apy > 60) return "Extremely high APY - potential for quick gains but high risk"
    if (apy > 40) return "High yield opportunity with good volume"
    if (volume > 1000000) return "High volume pool with strong trading activity"
    if (tvl > 2000000) return "Large TVL pool with stable liquidity"
    return "Moderate opportunity with balanced risk/reward"
  }

  const generateOpportunities = async (pool: LiquidityPool) => {
    // Simulate Groq AI analysis
    const newOpportunity = {
      id: Date.now(),
      type: "Liquidity Arbitrage",
      pool: `${pool.tokenA}/${pool.tokenB}`,
      confidence: Math.floor(Math.random() * 40) + 60,
      estimatedProfit: `${(Math.random() * 5 + 1).toFixed(1)}%`,
      timeWindow: `${Math.floor(Math.random() * 4) + 1}-${Math.floor(Math.random() * 4) + 5} hours`,
      analysis: `New ${pool.tokenA}/${pool.tokenB} pool detected with ${pool.apy}% APY. ${pool.opportunity}`,
      action: pool.apy > 40 ? "Consider immediate entry" : "Monitor for better entry point",
    }

    setOpportunities((prev) => [newOpportunity, ...prev.slice(0, 4)])

    if (pool.apy > 50) {
      toast({
        title: "High Yield Opportunity Detected!",
        description: `${pool.tokenA}/${pool.tokenB} pool with ${pool.apy}% APY`,
      })
    }
  }

  const startMonitoring = async () => {
    setIsMonitoring(true)
    setPools(mockPools)
    setLastUpdate(new Date())

    // Generate initial opportunities
    mockPools.slice(0, 2).forEach((pool) => generateOpportunities(pool))

    toast({
      title: "Raydium Monitoring Started",
      description: "Now scanning for new liquidity pools and opportunities",
    })
  }

  const stopMonitoring = () => {
    setIsMonitoring(false)
    toast({
      title: "Monitoring Stopped",
      description: "Raydium pool monitoring has been paused",
    })
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-50 text-green-700"
      case "Medium":
        return "bg-yellow-50 text-yellow-700"
      case "High":
        return "bg-red-50 text-red-700"
      default:
        return "bg-gray-50 text-gray-700"
    }
  }

  return (
    <Card className="bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            <span>Raydium Pool Monitor</span>
            {isMonitoring && (
              <Badge variant="outline" className="bg-green-50 text-green-700 animate-pulse">
                Live
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {lastUpdate && (
              <span className="text-xs text-gray-500">Last update: {lastUpdate.toLocaleTimeString()}</span>
            )}
            <Button
              size="sm"
              onClick={isMonitoring ? stopMonitoring : startMonitoring}
              className={isMonitoring ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
            >
              {isMonitoring ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                  Stop
                </>
              ) : (
                <>
                  <Activity className="h-4 w-4 mr-1" />
                  Start
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pools" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pools">New Pools</TabsTrigger>
            <TabsTrigger value="opportunities">AI Opportunities</TabsTrigger>
          </TabsList>

          <TabsContent value="pools" className="space-y-4">
            {!isMonitoring ? (
              <Alert>
                <Activity className="h-4 w-4" />
                <AlertDescription>
                  Start monitoring to discover new Raydium liquidity pools in real-time. Groq AI will analyze each pool
                  for trading opportunities.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                {pools.map((pool) => (
                  <Card key={pool.id} className="bg-white border hover:bg-gray-50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <span className="font-semibold">{pool.tokenA}</span>
                            <span className="text-gray-400">/</span>
                            <span className="font-semibold">{pool.tokenB}</span>
                          </div>
                          {pool.isNew && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                              New
                            </Badge>
                          )}
                          <Badge variant="outline" className={`text-xs ${getRiskColor(pool.risk)}`}>
                            {pool.risk} Risk
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-500">{pool.createdAt}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-600">APY</p>
                          <p className="text-sm font-bold text-green-600">{pool.apy}%</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-600">TVL</p>
                          <p className="text-sm font-bold">${(pool.tvl / 1000000).toFixed(1)}M</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-600">24h Volume</p>
                          <p className="text-sm font-bold">${(pool.volume24h / 1000).toFixed(0)}K</p>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 mb-3">{pool.opportunity}</p>

                      <Button
                        size="sm"
                        onClick={() => onAnalyzeOpportunity(pool)}
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                      >
                        <Zap className="h-4 w-4 mr-1" />
                        Analyze with Groq AI
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-4">
            {opportunities.length === 0 ? (
              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  AI-powered opportunities will appear here when new pools are detected. Start monitoring to see Groq AI
                  analysis.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                {opportunities.map((opportunity) => (
                  <Card key={opportunity.id} className="bg-white border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="font-semibold">{opportunity.type}</span>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700">
                            {opportunity.confidence}% confidence
                          </Badge>
                        </div>
                        <span className="text-sm font-semibold text-green-600">{opportunity.estimatedProfit}</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Pool:</span>
                          <span className="font-medium">{opportunity.pool}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Time Window:</span>
                          <span className="font-medium">{opportunity.timeWindow}</span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 mt-3 mb-3">{opportunity.analysis}</p>

                      <div className="flex items-center space-x-2">
                        {opportunity.action.includes("immediate") ? (
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        )}
                        <span className="text-sm font-medium">{opportunity.action}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
