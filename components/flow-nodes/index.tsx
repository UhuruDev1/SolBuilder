"use client"

import type React from "react"

import { Handle, Position } from "reactflow"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Wallet, DollarSign, Send, Hash, Clock, Database, ArrowRight } from "lucide-react"

// Base node wrapper component
function BaseNode({
  children,
  borderColor = "border-gray-200",
  hasInput = true,
  hasOutput = true,
  outputHandles = 1,
}: {
  children: React.ReactNode
  borderColor?: string
  hasInput?: boolean
  hasOutput?: boolean
  outputHandles?: number
}) {
  return (
    <Card className={`min-w-[200px] bg-white shadow-lg border-2 ${borderColor}`}>
      <CardContent className="p-4">{children}</CardContent>

      {hasInput && (
        <Handle type="target" position={Position.Left} className="w-3 h-3 bg-gray-500 border-2 border-white" />
      )}

      {hasOutput && outputHandles === 1 && (
        <Handle type="source" position={Position.Right} className="w-3 h-3 bg-gray-500 border-2 border-white" />
      )}

      {hasOutput && outputHandles > 1 && (
        <>
          <Handle
            type="source"
            position={Position.Right}
            id="success"
            className="w-3 h-3 bg-green-500 border-2 border-white"
            style={{ top: "30%" }}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="failure"
            className="w-3 h-3 bg-red-500 border-2 border-white"
            style={{ top: "70%" }}
          />
        </>
      )}
    </Card>
  )
}

export function WalletNode({ data }: { data: any }) {
  return (
    <BaseNode borderColor="border-blue-200" hasInput={false}>
      <div className="flex items-center space-x-2 mb-3">
        <div className="p-1.5 bg-blue-500 rounded">
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

        <div>
          <span className="text-xs text-gray-600 block mb-1">Address:</span>
          <Input placeholder="Auto-generated" value={data.address || ""} className="text-xs h-7" readOnly />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Balance:</span>
          <span className="text-xs font-semibold">{data.balance || 0} SOL</span>
        </div>
      </div>
    </BaseNode>
  )
}

export function FundingNode({ data }: { data: any }) {
  return (
    <BaseNode borderColor="border-green-200">
      <div className="flex items-center space-x-2 mb-3">
        <div className="p-1.5 bg-green-500 rounded">
          <DollarSign className="h-4 w-4 text-white" />
        </div>
        <span className="font-medium text-sm">{data.label}</span>
      </div>

      <div className="space-y-2">
        <div>
          <span className="text-xs text-gray-600 block mb-1">Amount:</span>
          <div className="flex items-center space-x-1">
            <Input type="number" value={data.amount || 1} className="text-xs h-7 flex-1" readOnly />
            <Badge variant="outline" className="text-xs">
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
    </BaseNode>
  )
}

export function TransactionNode({ data }: { data: any }) {
  return (
    <BaseNode borderColor="border-purple-200" outputHandles={2}>
      <div className="flex items-center space-x-2 mb-3">
        <div className="p-1.5 bg-purple-500 rounded">
          <Send className="h-4 w-4 text-white" />
        </div>
        <span className="font-medium text-sm">{data.label}</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Type:</span>
          <Badge variant="outline" className="text-xs">
            {data.type || "transfer"}
          </Badge>
        </div>

        <div>
          <span className="text-xs text-gray-600 block mb-1">Amount:</span>
          <Input type="number" value={data.amount || 0} className="text-xs h-7" placeholder="0.0" readOnly />
        </div>

        <div>
          <span className="text-xs text-gray-600 block mb-1">Recipient:</span>
          <Input value={data.recipient || ""} className="text-xs h-7" placeholder="Wallet address" readOnly />
        </div>
      </div>
    </BaseNode>
  )
}

export function InputValueNode({ data }: { data: any }) {
  return (
    <BaseNode borderColor="border-orange-200" hasInput={false}>
      <div className="flex items-center space-x-2 mb-3">
        <div className="p-1.5 bg-orange-500 rounded">
          <Hash className="h-4 w-4 text-white" />
        </div>
        <span className="font-medium text-sm">{data.label}</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Type:</span>
          <Badge variant="outline" className="text-xs">
            {data.valueType || "number"}
          </Badge>
        </div>

        <div>
          <span className="text-xs text-gray-600 block mb-1">Default Value:</span>
          <Input value={data.defaultValue || ""} className="text-xs h-7" placeholder="Enter default value" readOnly />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Validation:</span>
          <Badge variant="outline" className="text-xs">
            {data.validation || "none"}
          </Badge>
        </div>
      </div>
    </BaseNode>
  )
}

export function ConditionalTimerNode({ data }: { data: any }) {
  return (
    <BaseNode borderColor="border-red-200" outputHandles={2}>
      <div className="flex items-center space-x-2 mb-3">
        <div className="p-1.5 bg-red-500 rounded">
          <Clock className="h-4 w-4 text-white" />
        </div>
        <span className="font-medium text-sm">{data.label}</span>
      </div>

      <div className="space-y-2">
        <div>
          <span className="text-xs text-gray-600 block mb-1">Duration:</span>
          <div className="flex items-center space-x-1">
            <Input type="number" value={data.duration || 60} className="text-xs h-7 flex-1" readOnly />
            <Badge variant="outline" className="text-xs">
              {data.unit || "seconds"}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Condition:</span>
          <Badge variant="outline" className="text-xs">
            {data.condition || "after"}
          </Badge>
        </div>
      </div>
    </BaseNode>
  )
}

export function OracleCheckNode({ data }: { data: any }) {
  return (
    <BaseNode borderColor="border-indigo-200" outputHandles={2}>
      <div className="flex items-center space-x-2 mb-3">
        <div className="p-1.5 bg-indigo-500 rounded">
          <Database className="h-4 w-4 text-white" />
        </div>
        <span className="font-medium text-sm">{data.label}</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Oracle:</span>
          <Badge variant="outline" className="text-xs">
            {data.oracle || "pyth"}
          </Badge>
        </div>

        <div>
          <span className="text-xs text-gray-600 block mb-1">Asset:</span>
          <Input value={data.asset || "SOL/USD"} className="text-xs h-7" placeholder="SOL/USD" readOnly />
        </div>

        <div>
          <span className="text-xs text-gray-600 block mb-1">Condition:</span>
          <Input value={data.condition || "price > 100"} className="text-xs h-7" placeholder="price > 100" readOnly />
        </div>
      </div>
    </BaseNode>
  )
}

export function OutputNode({ data }: { data: any }) {
  return (
    <BaseNode borderColor="border-gray-200" hasOutput={false}>
      <div className="flex items-center space-x-2 mb-3">
        <div className="p-1.5 bg-gray-500 rounded">
          <ArrowRight className="h-4 w-4 text-white" />
        </div>
        <span className="font-medium text-sm">{data.label}</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Format:</span>
          <Badge variant="outline" className="text-xs">
            {data.format || "json"}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Destination:</span>
          <Badge variant="outline" className="text-xs">
            {data.destination || "console"}
          </Badge>
        </div>
      </div>
    </BaseNode>
  )
}
