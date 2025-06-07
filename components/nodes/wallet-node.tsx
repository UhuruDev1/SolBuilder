"use client"

import { Handle, Position } from "reactflow"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet } from "lucide-react"

export function WalletNode({ data }: { data: any }) {
  return (
    <Card className="min-w-[200px] bg-white shadow-lg border-2 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="p-1 bg-blue-500 rounded">
            <Wallet className="h-4 w-4 text-white" />
          </div>
          <span className="font-medium text-sm">{data.label}</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Network:</span>
            <Badge variant="outline" className="text-xs">
              {data.network || "devnet"}
            </Badge>
          </div>

          {data.address && (
            <div>
              <span className="text-xs text-gray-600">Address:</span>
              <p className="text-xs font-mono truncate">{data.address}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Balance:</span>
            <span className="text-xs font-semibold">{data.balance || 0} SOL</span>
          </div>
        </div>
      </CardContent>

      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500" />
    </Card>
  )
}
