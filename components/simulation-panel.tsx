"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Play, CheckCircle, Clock } from "lucide-react"

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

interface SimulationPanelProps {
  isSimulating: boolean
  currentStep: number
  nodes: FlowNode[]
  edges: FlowEdge[]
}

export function SimulationPanel({ isSimulating, currentStep, nodes, edges }: SimulationPanelProps) {
  const totalSteps = nodes.length
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0

  return (
    <Card className="h-full bg-gradient-to-b from-white to-gray-50 border-2 border-gray-200 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Play className="h-5 w-5 mr-2" />
          Simulation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Simulation Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <Badge
              variant={isSimulating ? "default" : "secondary"}
              className={isSimulating ? "bg-green-500 text-white animate-pulse" : ""}
            >
              {isSimulating ? "Running" : "Stopped"}
            </Badge>
          </div>

          {isSimulating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>
                  {currentStep}/{totalSteps}
                </span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </div>

        {/* Mock Function Toggles */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Mock Functions</h4>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="mock-wallet" className="text-sm">
                Mock Wallet Creation
              </Label>
              <Switch id="mock-wallet" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="mock-funding" className="text-sm">
                Mock Funding
              </Label>
              <Switch id="mock-funding" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="mock-tx" className="text-sm">
                Mock Transactions
              </Label>
              <Switch id="mock-tx" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="mock-oracle" className="text-sm">
                Mock Oracle Data
              </Label>
              <Switch id="mock-oracle" defaultChecked />
            </div>
          </div>
        </div>

        {/* Execution Steps */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Execution Steps</h4>

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {nodes.map((node, index) => (
              <div
                key={node.id}
                className={`flex items-center space-x-2 p-2 rounded-lg text-sm ${
                  index < currentStep
                    ? "bg-green-50 text-green-700"
                    : index === currentStep && isSimulating
                      ? "bg-blue-50 text-blue-700"
                      : "bg-gray-50 text-gray-500"
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : index === currentStep && isSimulating ? (
                  <Clock className="h-4 w-4 text-blue-500 animate-pulse" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                )}
                <span className="flex-1 truncate">{node.data.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Simulation Results */}
        {!isSimulating && currentStep > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Results</h4>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-700">Simulation completed successfully</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
