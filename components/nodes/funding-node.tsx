"use client"

import { Handle, Position } from "reactflow"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign } from "lucide-react"

export function FundingNode({ data }: { data: any }) {
  return (
    <Card className="min-w-[200px] bg-white shadow-lg border-2 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="p-1 bg-blue-500 rounded">
            <DollarSign className="h-4 w-4 text-white" />
          </div>
          <span className="font-medium text-sm">{data.label}</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Amount:</span>
            <div className="flex items-center">
              <span className="text-sm font-semibold">{data.amount || 5}</span>
              <Badge variant="outline" className="ml-1 text-xs">
                {data.currency || "SOL"}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Source:</span>
            <Badge variant="outline" className="text-xs capitalize">
              {data.source || "faucet"}
            </Badge>
          </div>
        </div>
      </CardContent>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500" />
    </Card>
  )
}
