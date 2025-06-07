"use client"

import { Handle, Position } from "reactflow"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins } from "lucide-react"

export function TokenNode({ data }: { data: any }) {
  return (
    <Card className="min-w-[200px] bg-white shadow-lg border-2 border-yellow-200">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="p-1 bg-yellow-500 rounded">
            <Coins className="h-4 w-4 text-white" />
          </div>
          <span className="font-medium text-sm">{data.label}</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Amount:</span>
            <span className="text-xs font-semibold">{data.amount || 0}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Decimals:</span>
            <Badge variant="outline" className="text-xs">
              {data.decimals || 9}
            </Badge>
          </div>

          {data.mint && (
            <div>
              <span className="text-xs text-gray-600">Mint:</span>
              <p className="text-xs font-mono truncate">{data.mint}</p>
            </div>
          )}
        </div>
      </CardContent>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-yellow-500" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-yellow-500" />
    </Card>
  )
}
