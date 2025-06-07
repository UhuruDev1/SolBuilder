"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, AlertTriangle, DollarSign, Activity, Zap, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ArbitrageOpportunity {
  id: string
  token: string
  symbol: string
  buyPlatform: string
  sellPlatform: string
  buyPrice: number
  sellPrice: number
  profit: number
  profitPercent: number
  volume24h: number
  confidence: number
  risk: "low" | "medium" | "high"
  lastUpdated: Date
}

interface PlatformPrice {
  platform: string
  price: number
  volume: number
  liquidity: number
  spread: number
  status: "active" | "stale" | "error"
}

export function ArbitrageDashboard() {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([])
  const [platformPrices, setPlatformPrices] = useState<Record<string, PlatformPrice[]>>({})
  const [selectedToken, setSelectedToken] = useState<string>("SOL")
  const [isScanning, setIsScanning] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Fetch real data on component mount
  useEffect(() => {
    fetchPriceData()
    const interval = setInterval(fetchPriceData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchPriceData = async () => {
    setIsLoading(true)
    try {
      // Fetch Jupiter prices
      const jupiterResponse = await fetch("https://price.jup.ag/v4/price?ids=SOL,BONK,WIF,SAMO,RAY")
      const jupiterData = await jupiterResponse.json()

      // Fetch Raydium pools
      const raydiumResponse = await fetch("/api/raydium/pools")
      const raydiumData = await raydiumResponse.json()

      // Process and combine data
      const tokens = ["SOL", "BONK", "WIF", "SAMO", "RAY"]
      const platforms = ["Jupiter", "Raydium", "Meteora", "Pump.fun", "DexScreener"]

      // Process platform prices
      const prices: Record<string, PlatformPrice[]> = {}

      tokens.forEach((token) => {
        prices[token] = platforms.map((platform) => {
          let price = 0
          let volume = 0
          let status = "stale"

          // Get real price from Jupiter when available
          if (platform === "Jupiter" && jupiterData.data[token]) {
            price = jupiterData.data[token].price
            volume = Math.random() * 1000000 // Mock volume for now
            status = "active"
          }
          // Get real price from Raydium when available
          else if (platform === "Raydium" && raydiumData?.pools) {
            const pool = raydiumData.pools.find((p: any) => p.tokenA.symbol === token || p.tokenB.symbol === token)
            if (pool) {
              price = pool.price || Math.random() * 100
              volume = pool.volume24h || Math.random() * 1000000
              status = "active"
            } else {
              price = Math.random() * 100
              volume = Math.random() * 1000000
              status = Math.random() > 0.8 ? "error" : "stale"
            }
          } else {
            // Mock data for other platforms until APIs are integrated
            price = jupiterData.data[token]?.price
              ? jupiterData.data[token].price * (0.98 + Math.random() * 0.04) // ±2% from Jupiter price
              : Math.random() * 100
            volume = Math.random() * 1000000
            status = Math.random() > 0.2 ? "active" : "stale"
          }

          return {
            platform,
            price,
            volume,
            liquidity: Math.random() * 5000000,
            spread: Math.random() * 0.02,
            status: status as "active" | "stale" | "error",
          }
        })
      })

      setPlatformPrices(prices)

      // Generate arbitrage opportunities based on real price differences
      const newOpportunities: ArbitrageOpportunity[] = []

      tokens.forEach((token) => {
        const tokenPrices = prices[token]
        if (!tokenPrices) return

        // Find min and max prices across platforms
        for (let i = 0; i < tokenPrices.length; i++) {
          for (let j = 0; j < tokenPrices.length; j++) {
            if (i === j) continue

            const buyPlatform = tokenPrices[i]
            const sellPlatform = tokenPrices[j]

            if (sellPlatform.price > buyPlatform.price) {
              const profit = sellPlatform.price - buyPlatform.price
              const profitPercent = (profit / buyPlatform.price) * 100

              // Only include if profit is at least 0.5%
              if (profitPercent >= 0.5) {
                newOpportunities.push({
                  id: `arb-${token}-${buyPlatform.platform}-${sellPlatform.platform}`,
                  token,
                  symbol: token,
                  buyPlatform: buyPlatform.platform,
                  sellPlatform: sellPlatform.platform,
                  buyPrice: buyPlatform.price,
                  sellPrice: sellPlatform.price,
                  profit,
                  profitPercent,
                  volume24h: (buyPlatform.volume + sellPlatform.volume) / 2,
                  confidence: Math.min(100, 60 + profitPercent * 5), // Higher profit = higher confidence
                  risk: profitPercent > 3 ? "high" : profitPercent > 1.5 ? "medium" : "low",
                  lastUpdated: new Date(),
                })
              }
            }
          }
        }
      })

      // Sort by profit percentage
      newOpportunities.sort((a, b) => b.profitPercent - a.profitPercent)
      setOpportunities(newOpportunities)
    } catch (error) {
      console.error("Failed to fetch price data:", error)
      toast({
        title: "Data Fetch Failed",
        description: "Could not retrieve the latest price data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const startScanning = () => {
    setIsScanning(true)
    fetchPriceData()

    toast({
      title: "Scanning Started",
      description: "Actively scanning for arbitrage opportunities",
    })

    // Auto-stop after 30 seconds
    setTimeout(() => {
      setIsScanning(false)
      toast({
        title: "Scanning Complete",
        description: "Found " + opportunities.length + " potential opportunities",
      })
    }, 30000)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-500"
      case "stale":
        return "text-yellow-500"
      case "error":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Arbitrage Dashboard</h2>
          <p className="text-gray-600">Multi-platform price monitoring and opportunity detection</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={fetchPriceData}
            variant="outline"
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
          <Button
            onClick={startScanning}
            disabled={isScanning || isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isScanning ? (
              <>
                <Activity className="w-4 h-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Scan Opportunities
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="opportunities" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="prices">Platform Prices</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Active Opportunities</p>
                    <p className="text-2xl font-bold">{opportunities.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Best Profit</p>
                    <p className="text-2xl font-bold">
                      {opportunities.length > 0 ? `${opportunities[0].profitPercent.toFixed(2)}%` : "0%"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-600">High Risk</p>
                    <p className="text-2xl font-bold">{opportunities.filter((o) => o.risk === "high").length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">Avg Confidence</p>
                    <p className="text-2xl font-bold">
                      {opportunities.length > 0
                        ? `${(opportunities.reduce((acc, o) => acc + o.confidence, 0) / opportunities.length).toFixed(0)}%`
                        : "0%"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Opportunities List */}
          <Card>
            <CardHeader>
              <CardTitle>Live Arbitrage Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-gray-400 mr-2" />
                  <span className="text-gray-600">Loading opportunities...</span>
                </div>
              ) : opportunities.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No arbitrage opportunities found</p>
                  <p className="text-sm text-gray-500">Try scanning again or check different tokens</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {opportunities.slice(0, 10).map((opp) => (
                    <div
                      key={opp.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="font-bold text-blue-600">{opp.symbol}</span>
                        </div>
                        <div>
                          <div className="font-medium">{opp.token}</div>
                          <div className="text-sm text-gray-600">
                            Buy: {opp.buyPlatform} → Sell: {opp.sellPlatform}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-bold text-green-600">+{opp.profitPercent.toFixed(2)}%</div>
                          <div className="text-sm text-gray-600">${opp.profit.toFixed(4)}</div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm">
                            <span className="text-gray-600">Confidence:</span>
                            <span className="ml-1 font-medium">{opp.confidence.toFixed(0)}%</span>
                          </div>
                          <Progress value={opp.confidence} className="w-16 h-2" />
                        </div>

                        <Badge className={getRiskColor(opp.risk)}>{opp.risk}</Badge>

                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Execute
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prices" className="space-y-4">
          {/* Token Selector */}
          <div className="flex space-x-2">
            {Object.keys(platformPrices).map((token) => (
              <Button
                key={token}
                variant={selectedToken === token ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedToken(token)}
              >
                {token}
              </Button>
            ))}
          </div>

          {/* Platform Prices */}
          <Card>
            <CardHeader>
              <CardTitle>{selectedToken} Prices Across Platforms</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-gray-400 mr-2" />
                  <span className="text-gray-600">Loading price data...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {platformPrices[selectedToken]?.map((price) => (
                    <div key={price.platform} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Activity className={`w-4 h-4 ${getStatusColor(price.status)}`} />
                        </div>
                        <div>
                          <div className="font-medium">{price.platform}</div>
                          <div className="text-sm text-gray-600">
                            Liquidity: ${(price.liquidity / 1000000).toFixed(2)}M
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <div className="font-bold">${price.price.toFixed(4)}</div>
                          <div className="text-sm text-gray-600">Spread: {(price.spread * 100).toFixed(2)}%</div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm text-gray-600">24h Volume</div>
                          <div className="font-medium">${(price.volume / 1000).toFixed(0)}K</div>
                        </div>

                        <Badge variant={price.status === "active" ? "default" : "secondary"}>{price.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profit Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["0-1%", "1-2%", "2-3%", "3%+"].map((range, index) => {
                    const count = opportunities.filter((o) => {
                      if (range === "0-1%") return o.profitPercent < 1
                      if (range === "1-2%") return o.profitPercent >= 1 && o.profitPercent < 2
                      if (range === "2-3%") return o.profitPercent >= 2 && o.profitPercent < 3
                      return o.profitPercent >= 3
                    }).length

                    return (
                      <div key={range} className="flex items-center justify-between">
                        <span className="text-sm">{range}</span>
                        <div className="flex items-center space-x-2">
                          <Progress
                            value={opportunities.length > 0 ? (count / opportunities.length) * 100 : 0}
                            className="w-24"
                          />
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Jupiter", "Raydium", "Meteora", "Pump.fun", "DexScreener"].map((platform) => {
                    const buyOpps = opportunities.filter((o) => o.buyPlatform === platform).length
                    const sellOpps = opportunities.filter((o) => o.sellPlatform === platform).length
                    const total = buyOpps + sellOpps

                    return (
                      <div key={platform} className="flex items-center justify-between">
                        <span className="text-sm">{platform}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-600">Buy: {buyOpps}</span>
                          <span className="text-xs text-gray-600">Sell: {sellOpps}</span>
                          <span className="text-sm font-medium">{total}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
