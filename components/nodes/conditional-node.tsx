"use client"

import { Handle, Position } from "reactflow"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRightLeft } from "lucide-react"

export function ConditionalNode({ data }: { data: any }) {
  return (
    <Card className="min-w-[200px] bg-white shadow-lg border-2 border-purple-200">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="p-1 bg-purple-500 rounded">
            <ArrowRightLeft className="h-4 w-4 text-white" />
          </div>
          <span className="font-medium text-sm">{data.label}</span>
        </div>

        <div className="space-y-2">
          <div>
            <span className="text-xs text-gray-600">Condition:</span>
            <p className="text-xs font-mono bg-gray-50 p-1 rounded">{data.condition || "balance > 0"}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-xs text-gray-600">True:</span>
              <p className="text-xs truncate">{data.trueAction || "continue"}</p>
            </div>
            <div>
              <span className="text-xs text-gray-600">False:</span>
              <p className="text-xs truncate">{data.falseAction || "stop"}</p>
            </div>
          </div>
        </div>
      </CardContent>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-purple-500" />
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        className="w-3 h-3 bg-green-500"
        style={{ top: "30%" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        className="w-3 h-3 bg-red-500"
        style={{ top: "70%" }}
      />
    </Card>
  )
}
