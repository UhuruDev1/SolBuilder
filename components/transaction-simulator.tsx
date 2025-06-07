"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Play, Pause, RotateCcw, CheckCircle, XCircle, Clock, Zap, Activity } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TransactionSimulatorProps {
  compiledJson: any
  network: "devnet" | "testnet" | "mainnet"
}

interface SimulationStep {
  id: string
  name: string
  status: "pending" | "running" | "completed" | "failed"
  duration: number
  details: string
  gasUsed?: number
}

export function TransactionSimulator({ compiledJson, network }: TransactionSimulatorProps) {
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationProgress, setSimulationProgress] = useState(0)
  const [simulationSteps, setSimulationSteps] = useState<SimulationStep[]>([])
  const [simulationResult, setSimulationResult] = useState<any>(null)
  const { toast } = useToast()

  const generateSimulationSteps = (program: any): SimulationStep[] => {
    if (!program?.nodes) return []

    const steps: SimulationStep[] = [
      {
        id: "init",
        name: "Initialize Simulation",
        status: "pending",
        duration: 500,
        details: "Setting up simulation environment",
      },
    ]

    program.nodes.forEach((node: any, index: number) => {
      switch (node.type) {
        case "wallet":
          steps.push({
            id: `wallet-${index}`,
            name: "Connect Wallet",
            status: "pending",
            duration: 1000,
            details: `Connecting to wallet: ${node.data.address || "Generated"}`,
            gasUsed: 0,
          })
          break
        case "transaction":
          steps.push({
            id: `tx-${index}`,
            name: "Create Transaction",
            status: "pending",
            duration: 1500,
            details: `${node.data.type || "transfer"} transaction`,
            gasUsed: Math.floor(Math.random() * 5000) + 2000,
          })
          break
        case "token":
          steps.push({
            id: `token-${index}`,
            name: "Token Transfer",
            status: "pending",
            duration: 2000,
            details: `Transfer ${node.data.amount || 0} tokens`,
            gasUsed: Math.floor(Math.random() * 3000) + 1500,
          })
          break
        case "conditional":
          steps.push({
            id: `condition-${index}`,
            name: "Evaluate Condition",
            status: "pending",
            duration: 800,
            details: `Check: ${node.data.condition || "condition"}`,
            gasUsed: Math.floor(Math.random() * 1000) + 500,
          })
          break
      }
    })

    steps.push({
      id: "finalize",
      name: "Finalize Simulation",
      status: "pending",
      duration: 1000,
      details: "Completing simulation and generating results",
    })

    return steps
  }

  const runSimulation = async () => {
    if (!compiledJson) {
      toast({
        title: "No Program",
        description: "Please compile a program first",
        variant: "destructive",
      })
      return
    }

    setIsSimulating(true)
    setSimulationProgress(0)
    setSimulationResult(null)

    const steps = generateSimulationSteps(compiledJson)
    setSimulationSteps(steps)

    let totalGasUsed = 0
    let completedSteps = 0

    try {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i]

        // Update step to running
        setSimulationSteps((prev) => prev.map((s) => (s.id === step.id ? { ...s, status: "running" } : s)))

        // Simulate step execution
        await new Promise((resolve) => setTimeout(resolve, step.duration))

        // Random chance of failure for demonstration
        const shouldFail = Math.random() < 0.1 && step.id !== "init" && step.id !== "finalize"

        if (shouldFail) {
          setSimulationSteps((prev) => prev.map((s) => (s.id === step.id ? { ...s, status: "failed" } : s)))
          throw new Error(`Step failed: ${step.name}`)
        }

        // Update step to completed
        setSimulationSteps((prev) => prev.map((s) => (s.id === step.id ? { ...s, status: "completed" } : s)))

        if (step.gasUsed) {
          totalGasUsed += step.gasUsed
        }

        completedSteps++
        setSimulationProgress((completedSteps / steps.length) * 100)
      }

      // Generate final result
      const result = {
        success: true,
        totalGasUsed,
        executionTime: steps.reduce((acc, step) => acc + step.duration, 0),
        stepsCompleted: completedSteps,
        totalSteps: steps.length,
        networkFee: totalGasUsed * 0.000005, // Mock fee calculation
        timestamp: new Date().toISOString(),
      }

      setSimulationResult(result)
      toast({
        title: "Simulation Complete",
        description: "Transaction simulation completed successfully",
      })
    } catch (error) {
      const result = {
        success: false,
        error: error instanceof Error ? error.message : "Simulation failed",
        totalGasUsed,
        executionTime: steps.reduce((acc, step) => acc + step.duration, 0),
        stepsCompleted: completedSteps,
        totalSteps: steps.length,
        timestamp: new Date().toISOString(),
      }

      setSimulationResult(result)
      toast({
        title: "Simulation Failed",
        description: result.error,
        variant: "destructive",
      })
    } finally {
      setIsSimulating(false)
    }
  }

  const resetSimulation = () => {
    setSimulationSteps([])
    setSimulationProgress(0)
    setSimulationResult(null)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Simulation Controls */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Simulation Control</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline">{network}</Badge>
            <Badge variant={compiledJson ? "default" : "secondary"}>
              {compiledJson ? "Program Loaded" : "No Program"}
            </Badge>
          </div>

          {compiledJson && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Nodes:</span>
                <span>{compiledJson.nodes?.length || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Edges:</span>
                <span>{compiledJson.edges?.length || 0}</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Button onClick={runSimulation} disabled={isSimulating || !compiledJson} className="w-full">
              {isSimulating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isSimulating ? "Simulating..." : "Run Simulation"}
            </Button>

            <Button onClick={resetSimulation} variant="outline" className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {isSimulating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(simulationProgress)}%</span>
              </div>
              <Progress value={simulationProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Simulation Steps */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Execution Steps</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {simulationSteps.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No simulation running</p>
              <p className="text-sm">Start a simulation to see execution steps</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {simulationSteps.map((step, index) => (
                <div key={step.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                  <div className="flex-shrink-0 mt-0.5">
                    {step.status === "completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {step.status === "failed" && <XCircle className="h-4 w-4 text-red-500" />}
                    {step.status === "running" && <Zap className="h-4 w-4 text-blue-500 animate-pulse" />}
                    {step.status === "pending" && <Clock className="h-4 w-4 text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{step.name}</p>
                      {step.gasUsed && (
                        <Badge variant="outline" className="text-xs">
                          {step.gasUsed.toLocaleString()} gas
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{step.details}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!simulationResult ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No results yet</p>
              <p className="text-sm">Run a simulation to see results</p>
            </div>
          ) : (
            <Tabs defaultValue="summary" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  {simulationResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className={`font-medium ${simulationResult.success ? "text-green-700" : "text-red-700"}`}>
                    {simulationResult.success ? "Simulation Successful" : "Simulation Failed"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">Total Gas</p>
                    <p className="text-lg font-semibold">{simulationResult.totalGasUsed?.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">Network Fee</p>
                    <p className="text-lg font-semibold">{simulationResult.networkFee?.toFixed(6)} SOL</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">Execution Time</p>
                    <p className="text-lg font-semibold">{simulationResult.executionTime}ms</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">Steps</p>
                    <p className="text-lg font-semibold">
                      {simulationResult.stepsCompleted}/{simulationResult.totalSteps}
                    </p>
                  </div>
                </div>

                {!simulationResult.success && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>{simulationResult.error}</AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium mb-1">Timestamp</p>
                    <p className="text-xs font-mono">{simulationResult.timestamp}</p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium mb-1">Network</p>
                    <p className="text-xs">{network.toUpperCase()}</p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium mb-1">Program Version</p>
                    <p className="text-xs">{compiledJson?.version || "Unknown"}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
