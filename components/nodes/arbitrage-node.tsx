"use client"

import { Handle, Position } from "reactflow"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shuffle } from "lucide-react"

export function ArbitrageNode({ data }: { data: any }) {
  return (
    <Card className="min-w-[220px] bg-white shadow-lg border-2 border-red-200">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="p-1 bg-red-500 rounded">
            <Shuffle className="h-4 w-4 text-white" />
          </div>
          <span className="font-medium text-sm">{data.label}</span>
        </div>

        <div className="space-y-2">
          <div>
            <span className="text-xs text-gray-600">Path:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {(data.path || []).map((exchange: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {exchange}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Min Profit:</span>
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
              {data.minProfitPercent || 1.5}%
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Max Slippage:</span>
            <span className="text-xs font-semibold">{data.maxSlippage || 1.0}%</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Gas Limit:</span>
            <span className="text-xs font-semibold">{data.gasLimit?.toLocaleString() || "500,000"}</span>
          </div>
        </div>
      </CardContent>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-red-500" />
      <Handle
        type="source"
        position={Position.Right}
        id="success"
        className="w-3 h-3 bg-green-500"
        style={{ top: "30%" }}
      />
      <Handle type="source" position={Position.Right} id="fail" className="w-3 h-3 bg-red-500" style={{ top: "70%" }} />
    </Card>
  )
}
