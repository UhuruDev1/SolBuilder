"use client"

import { Handle, Position } from "reactflow"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy } from "lucide-react"

export function CopyTradeNode({ data }: { data: any }) {
  return (
    <Card className="min-w-[220px] bg-white shadow-lg border-2 border-purple-200">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="p-1 bg-purple-500 rounded">
            <Copy className="h-4 w-4 text-white" />
          </div>
          <span className="font-medium text-sm">{data.label}</span>
        </div>

        <div className="space-y-2">
          <div>
            <span className="text-xs text-gray-600">Target Wallet:</span>
            <p className="text-xs font-mono truncate">{data.targetWallet || "Not set"}</p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Copy %:</span>
            <Badge variant="outline" className="text-xs">
              {data.copyPercent || 100}%
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Max Slippage:</span>
            <span className="text-xs font-semibold">{data.maxSlippage || 1.0}%</span>
          </div>

          <div>
            <span className="text-xs text-gray-600">Tokens:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {(data.tokens || ["SOL"]).map((token: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {token}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-purple-500" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-purple-500" />
    </Card>
  )
}
