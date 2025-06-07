"use client"

import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FlowPlayground } from "@/components/flow-playground"
import { RaydiumMonitor } from "@/components/raydium-monitor"
import { ArbitrageDashboard } from "@/components/arbitrage-dashboard"
import { WalletTracer } from "@/components/wallet-tracer"
import { SampleFlows } from "@/components/sample-flows"
import { GroqAnalytics } from "@/components/groq-analytics"
import { Layers, Activity, ArrowUpDown, Brain, Zap, TrendingUp } from "lucide-react"

interface EnhancedFlowPlaygroundProps {
  network: "devnet" | "testnet" | "mainnet"
  onCompile: (flow: any) => void
}

export function EnhancedFlowPlayground({ network, onCompile }: EnhancedFlowPlaygroundProps) {
  const [activeTab, setActiveTab] = useState("playground")
  const [compiledFlow, setCompiledFlow] = useState<any>(null)

  const handleCompile = useCallback(
    (flow: any) => {
      setCompiledFlow(flow)
      onCompile(flow)
    },
    [onCompile],
  )

  const handleAnalyzeOpportunity = useCallback((pool: any) => {
    // Switch to analytics tab when analyzing opportunities
    setActiveTab("analytics")
  }, [])

  return (
    <div className="space-y-6">
      {/* Enhanced Tab Navigation */}
      <Card className="bg-white/50 backdrop-blur-sm border-2 border-gray-200">
        <CardContent className="p-1">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 bg-transparent">
              <TabsTrigger
                value="playground"
                className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-md"
              >
                <Layers className="h-4 w-4" />
                <span className="hidden sm:inline">Flow Builder</span>
                <span className="sm:hidden">Flow</span>
              </TabsTrigger>

              <TabsTrigger
                value="monitor"
                className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-md"
              >
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Pool Monitor</span>
                <span className="sm:hidden">Monitor</span>
              </TabsTrigger>

              <TabsTrigger
                value="arbitrage"
                className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-md"
              >
                <ArrowUpDown className="h-4 w-4" />
                <span className="hidden sm:inline">Arbitrage</span>
                <span className="sm:hidden">Arb</span>
              </TabsTrigger>

              <TabsTrigger
                value="tracer"
                className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-md"
              >
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">Wallet Tracer</span>
                <span className="sm:hidden">Tracer</span>
              </TabsTrigger>

              <TabsTrigger
                value="samples"
                className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-md"
              >
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">Templates</span>
                <span className="sm:hidden">Templates</span>
              </TabsTrigger>

              <TabsTrigger
                value="analytics"
                className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-md"
              >
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
                <span className="sm:hidden">AI</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <div className="mt-6">
              <TabsContent value="playground" className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">Visual Flow Builder</h2>
                    <p className="text-gray-600">Drag and drop nodes to create Solana programs</p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {network.toUpperCase()}
                  </Badge>
                </div>
                <FlowPlayground network={network} onCompile={handleCompile} compiledFlow={compiledFlow} />
              </TabsContent>

              <TabsContent value="monitor" className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">Raydium Pool Monitor</h2>
                    <p className="text-gray-600">Real-time monitoring of new liquidity pools</p>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Live Data
                  </Badge>
                </div>
                <RaydiumMonitor onAnalyzeOpportunity={handleAnalyzeOpportunity} />
              </TabsContent>

              <TabsContent value="arbitrage" className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">Multi-Platform Arbitrage</h2>
                    <p className="text-gray-600">Scan Jupiter, Meteora, Pump.fun, Raydium & DexScreener</p>
                  </div>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700">
                    5 Platforms
                  </Badge>
                </div>
                <ArbitrageDashboard />
              </TabsContent>

              <TabsContent value="tracer" className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">AI Wallet Anomaly Tracer</h2>
                    <p className="text-gray-600">Analyze wallet patterns and create transaction bubble maps</p>
                  </div>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700">
                    AI Powered
                  </Badge>
                </div>
                <WalletTracer />
              </TabsContent>

              <TabsContent value="samples" className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">Sample Flows & Templates</h2>
                    <p className="text-gray-600">Pre-built trading strategies and flow templates</p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    6 Templates
                  </Badge>
                </div>
                <SampleFlows onLoadFlow={handleCompile} />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">Groq AI Analytics</h2>
                    <p className="text-gray-600">Advanced AI analysis and insights</p>
                  </div>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700">
                    Groq AI
                  </Badge>
                </div>
                <GroqAnalytics />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
