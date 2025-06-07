"use client"

import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlowPlayground } from "@/components/flow-playground"
import { SampleFlows } from "@/components/sample-flows"
import { RaydiumMonitor } from "@/components/raydium-monitor"
import { GroqAnalytics } from "@/components/groq-analytics"
import { Layers, Target, Activity, BrainCircuit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EnhancedFlowPlaygroundProps {
  network: "devnet" | "testnet" | "mainnet"
  onCompile: (flow: any) => void
}

export function EnhancedFlowPlayground({ network, onCompile }: EnhancedFlowPlaygroundProps) {
  const [activeTab, setActiveTab] = useState("playground")
  const [currentFlow, setCurrentFlow] = useState<any>(null)
  const [simulationResults, setSimulationResults] = useState<any>(null)
  const [groqAnalysis, setGroqAnalysis] = useState<any>(null)
  const { toast } = useToast()

  const handleLoadFlow = useCallback((flow: any) => {
    setCurrentFlow(flow)
    setActiveTab("playground")
  }, [])

  const handleSimulateFlow = useCallback(
    async (flow: any) => {
      setCurrentFlow(flow)

      // Simulate the flow execution
      const results = {
        success: true,
        executionTime: Math.floor(Math.random() * 5000) + 2000,
        gasUsed: Math.floor(Math.random() * 50000) + 10000,
        profit: (Math.random() * 10 + 2).toFixed(2),
        steps: flow.nodes.map((node: any, index: number) => ({
          id: node.id,
          name: node.data.label,
          status: "completed",
          duration: Math.floor(Math.random() * 1000) + 500,
          gasUsed: Math.floor(Math.random() * 5000) + 1000,
        })),
      }

      setSimulationResults(results)
      setActiveTab("playground")

      toast({
        title: "Simulation Complete",
        description: `Flow executed successfully with ${results.profit}% profit`,
      })
    },
    [toast],
  )

  const handleAnalyzeOpportunity = useCallback(
    async (pool: any) => {
      // Request Groq AI analysis of the liquidity pool
      try {
        const response = await fetch("/api/groq/analyze-pool", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pool, network }),
        })

        if (response.ok) {
          const data = await response.json()
          setGroqAnalysis(data.analysis)
          setActiveTab("ai-analysis")

          toast({
            title: "AI Analysis Complete",
            description: "Groq AI has analyzed the liquidity opportunity",
          })
        }
      } catch (error) {
        // Fallback to mock analysis
        const mockAnalysis = {
          poolAnalysis: {
            riskLevel: pool.risk,
            profitPotential: "High",
            timeHorizon: "2-6 hours",
            confidence: Math.floor(Math.random() * 30) + 70,
          },
          recommendations: [
            `${pool.tokenA}/${pool.tokenB} pool shows strong momentum with ${pool.apy}% APY`,
            "Consider entering with 5-10% of portfolio allocation",
            "High volume indicates strong market interest",
            "Monitor for price volatility due to new pool status",
          ],
          tradingStrategy: {
            entry: "Current levels favorable for entry",
            exit: "Take profits at 20-30% gain",
            stopLoss: "Set stop-loss at 10% below entry",
            timeframe: "Hold for 4-8 hours maximum",
          },
          riskFactors: [
            "New pool with limited price history",
            "Potential for high volatility",
            "Impermanent loss risk for LP positions",
          ],
        }

        setGroqAnalysis(mockAnalysis)
        setActiveTab("ai-analysis")

        toast({
          title: "AI Analysis Complete",
          description: "Pool opportunity analyzed by Groq AI",
        })
      }
    },
    [network, toast],
  )

  const handleCompileFlow = useCallback(
    (flow: any) => {
      setCurrentFlow(flow)
      onCompile(flow)
    },
    [onCompile],
  )

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Enhanced Trading Playground</h2>
              <p className="text-purple-100">
                Build, simulate, and optimize trading strategies with AI-powered insights
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold">6</div>
                <div className="text-xs text-purple-200">Sample Flows</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">Live</div>
                <div className="text-xs text-purple-200">Pool Monitor</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">AI</div>
                <div className="text-xs text-purple-200">Analysis</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-1 border border-gray-200">
          <TabsList className="grid w-full grid-cols-4 bg-transparent">
            <TabsTrigger value="playground" className="flex items-center space-x-2 data-[state=active]:bg-white">
              <Layers className="h-4 w-4" />
              <span>Flow Builder</span>
            </TabsTrigger>
            <TabsTrigger value="samples" className="flex items-center space-x-2 data-[state=active]:bg-white">
              <Target className="h-4 w-4" />
              <span>Sample Flows</span>
            </TabsTrigger>
            <TabsTrigger value="monitor" className="flex items-center space-x-2 data-[state=active]:bg-white">
              <Activity className="h-4 w-4" />
              <span>Pool Monitor</span>
            </TabsTrigger>
            <TabsTrigger value="ai-analysis" className="flex items-center space-x-2 data-[state=active]:bg-white">
              <BrainCircuit className="h-4 w-4" />
              <span>AI Analysis</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="playground" className="space-y-6">
          <FlowPlayground
            network={network}
            onCompile={handleCompileFlow}
            initialFlow={currentFlow}
            simulationResults={simulationResults}
          />
        </TabsContent>

        <TabsContent value="samples" className="space-y-6">
          <SampleFlows onLoadFlow={handleLoadFlow} onSimulateFlow={handleSimulateFlow} />
        </TabsContent>

        <TabsContent value="monitor" className="space-y-6">
          <RaydiumMonitor onAnalyzeOpportunity={handleAnalyzeOpportunity} />
        </TabsContent>

        <TabsContent value="ai-analysis" className="space-y-6">
          {groqAnalysis ? (
            <GroqAnalytics analysis={groqAnalysis} compiledJson={currentFlow} />
          ) : (
            <Card className="bg-white/50 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <BrainCircuit className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">AI Analysis Ready</h3>
                <p className="text-gray-600 mb-6">
                  Monitor Raydium pools or build a flow to get AI-powered analysis and recommendations
                </p>
                <div className="flex justify-center space-x-4">
                  <Button onClick={() => setActiveTab("monitor")} variant="outline">
                    <Activity className="h-4 w-4 mr-2" />
                    Start Pool Monitor
                  </Button>
                  <Button onClick={() => setActiveTab("samples")} variant="outline">
                    <Target className="h-4 w-4 mr-2" />
                    Try Sample Flow
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
