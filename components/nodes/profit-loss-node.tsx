"use client"

import { Handle, Position } from "reactflow"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Percent } from "lucide-react"

export function ProfitLossNode({ data }: { data: any }) {
  return (
    <Card className="min-w-[220px] bg-white shadow-lg border-2 border-orange-200">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="p-1 bg-orange-500 rounded">
            <Percent className="h-4 w-4 text-white" />
          </div>
          <span className="font-medium text-sm">{data.label}</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Take Profit:</span>
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
              +{data.takeProfit || 15}%
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Stop Loss:</span>
            <Badge variant="outline" className="text-xs bg-red-50 text-red-700">
              -{data.stopLoss || 7}%
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Trailing Stop:</span>
            <span className="text-xs font-semibold">{data.trailingStop ? "Yes" : "No"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Time Limit:</span>
            <span className="text-xs font-semibold">{data.timeLimit || 24} hours</span>
          </div>
        </div>
      </CardContent>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-orange-500" />
      <Handle
        type="source"
        position={Position.Right}
        id="profit"
        className="w-3 h-3 bg-green-500"
        style={{ top: "30%" }}
      />
      <Handle type="source" position={Position.Right} id="loss" className="w-3 h-3 bg-red-500" style={{ top: "70%" }} />
    </Card>
  )
}
