"use client"

import { Handle, Position } from "reactflow"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

export function MemeTradeNode({ data }: { data: any }) {
  return (
    <Card className="min-w-[220px] bg-white shadow-lg border-2 border-pink-200">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="p-1 bg-pink-500 rounded">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <span className="font-medium text-sm">{data.label}</span>
        </div>

        <div className="space-y-2">
          <div>
            <span className="text-xs text-gray-600">Tokens:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {(data.tokens || []).map((token: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {token}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Strategy:</span>
            <Badge variant="outline" className="text-xs capitalize">
              {data.strategy || "momentum"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Risk Level:</span>
            <Badge
              variant="outline"
              className={`text-xs ${
                data.riskLevel === "low"
                  ? "bg-green-50 text-green-700"
                  : data.riskLevel === "medium"
                    ? "bg-yellow-50 text-yellow-700"
                    : "bg-red-50 text-red-700"
              }`}
            >
              {data.riskLevel || "medium"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Max Allocation:</span>
            <span className="text-xs font-semibold">{data.maxAllocation || 10}%</span>
          </div>
        </div>
      </CardContent>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-pink-500" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-pink-500" />
    </Card>
  )
}
