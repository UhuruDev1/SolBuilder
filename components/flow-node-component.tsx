"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Wallet, DollarSign, Send, Hash, Clock, Database, ArrowRight, X, Link, CheckCircle, Zap } from "lucide-react"

interface FlowNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: any
}

interface FlowNodeComponentProps {
  node: FlowNode
  isActive: boolean
  isCompleted: boolean
  onMouseDown: (e: React.MouseEvent) => void
  onUpdate: (data: any) => void
  onDelete: () => void
  onConnect: (targetId: string) => void
  connecting: boolean
  onStartConnect: () => void
  availableTargets: FlowNode[]
}

const nodeIcons = {
  wallet: Wallet,
  funding: DollarSign,
  transaction: Send,
  inputValue: Hash,
  conditionalTimer: Clock,
  oracleCheck: Database,
  output: ArrowRight,
}

const nodeColors = {
  wallet: "border-blue-200 bg-blue-50",
  funding: "border-green-200 bg-green-50",
  transaction: "border-purple-200 bg-purple-50",
  inputValue: "border-orange-200 bg-orange-50",
  conditionalTimer: "border-red-200 bg-red-50",
  oracleCheck: "border-indigo-200 bg-indigo-50",
  output: "border-gray-200 bg-gray-50",
}

const iconColors = {
  wallet: "bg-blue-500",
  funding: "bg-green-500",
  transaction: "bg-purple-500",
  inputValue: "bg-orange-500",
  conditionalTimer: "bg-red-500",
  oracleCheck: "bg-indigo-500",
  output: "bg-gray-500",
}

export function FlowNodeComponent({
  node,
  isActive,
  isCompleted,
  onMouseDown,
  onUpdate,
  onDelete,
  onConnect,
  connecting,
  onStartConnect,
  availableTargets,
}: FlowNodeComponentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showConnections, setShowConnections] = useState(false)

  const IconComponent = nodeIcons[node.type as keyof typeof nodeIcons] || Wallet
  const nodeColor = nodeColors[node.type as keyof typeof nodeColors] || "border-gray-200 bg-gray-50"
  const iconColor = iconColors[node.type as keyof typeof iconColors] || "bg-gray-500"

  const handleFieldUpdate = (field: string, value: any) => {
    onUpdate({ [field]: value })
  }

  const renderNodeContent = () => {
    switch (node.type) {
      case "wallet":
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Network:</span>
              <Badge variant="outline" className="text-xs">
                {node.data.network || "devnet"}
              </Badge>
            </div>
            {isEditing ? (
              <div>
                <span className="text-xs text-gray-600 block mb-1">Address:</span>
                <Input
                  placeholder="Auto-generated"
                  value={node.data.address || ""}
                  onChange={(e) => handleFieldUpdate("address", e.target.value)}
                  className="text-xs h-7"
                />
              </div>
            ) : (
              <div>
                <span className="text-xs text-gray-600 block mb-1">Address:</span>
                <div className="text-xs bg-gray-100 p-1 rounded truncate">{node.data.address || "Auto-generated"}</div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Balance:</span>
              <span className="text-xs font-semibold">{node.data.balance || 0} SOL</span>
            </div>
          </div>
        )

      case "funding":
        return (
          <div className="space-y-2">
            <div>
              <span className="text-xs text-gray-600 block mb-1">Amount:</span>
              <div className="flex items-center space-x-1">
                {isEditing ? (
                  <Input
                    type="number"
                    value={node.data.amount || 1}
                    onChange={(e) => handleFieldUpdate("amount", Number.parseFloat(e.target.value))}
                    className="text-xs h-7 flex-1"
                  />
                ) : (
                  <div className="text-xs bg-gray-100 p-1 rounded flex-1">{node.data.amount || 1}</div>
                )}
                <Badge variant="outline" className="text-xs">
                  {node.data.currency || "SOL"}
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Source:</span>
              <Badge variant="outline" className="text-xs capitalize">
                {node.data.source || "faucet"}
              </Badge>
            </div>
          </div>
        )

      case "transaction":
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Type:</span>
              <Badge variant="outline" className="text-xs">
                {node.data.type || "transfer"}
              </Badge>
            </div>
            <div>
              <span className="text-xs text-gray-600 block mb-1">Amount:</span>
              {isEditing ? (
                <Input
                  type="number"
                  value={node.data.amount || 0}
                  onChange={(e) => handleFieldUpdate("amount", Number.parseFloat(e.target.value))}
                  className="text-xs h-7"
                  placeholder="0.0"
                />
              ) : (
                <div className="text-xs bg-gray-100 p-1 rounded">{node.data.amount || 0}</div>
              )}
            </div>
            <div>
              <span className="text-xs text-gray-600 block mb-1">Recipient:</span>
              {isEditing ? (
                <Input
                  value={node.data.recipient || ""}
                  onChange={(e) => handleFieldUpdate("recipient", e.target.value)}
                  className="text-xs h-7"
                  placeholder="Wallet address"
                />
              ) : (
                <div className="text-xs bg-gray-100 p-1 rounded truncate">{node.data.recipient || "Not set"}</div>
              )}
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-2">
            <div className="text-xs text-gray-600">Configure this node by clicking edit</div>
          </div>
        )
    }
  }

  return (
    <Card
      className={`min-w-[200px] shadow-lg border-2 cursor-move transition-all duration-200 ${nodeColor} ${
        isActive ? "ring-2 ring-blue-400 ring-opacity-75" : ""
      } ${isCompleted ? "ring-2 ring-green-400 ring-opacity-75" : ""}`}
      onMouseDown={onMouseDown}
    >
      <CardContent className="p-4">
        {/* Node Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 rounded ${iconColor} relative`}>
              <IconComponent className="h-4 w-4 text-white" />
              {isActive && <Zap className="absolute -top-1 -right-1 h-3 w-3 text-yellow-400 animate-pulse" />}
              {isCompleted && <CheckCircle className="absolute -top-1 -right-1 h-3 w-3 text-green-400" />}
            </div>
            <span className="font-medium text-sm">{node.data.label}</span>
          </div>

          {/* Node Actions */}
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation()
                setIsEditing(!isEditing)
              }}
            >
              <Hash className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation()
                setShowConnections(!showConnections)
                onStartConnect()
              }}
            >
              <Link className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Node Content */}
        {renderNodeContent()}

        {/* Connection Panel */}
        {showConnections && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-600 mb-2">Connect to:</div>
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {availableTargets.map((target) => (
                <Button
                  key={target.id}
                  size="sm"
                  variant="outline"
                  className="w-full text-xs h-6"
                  onClick={(e) => {
                    e.stopPropagation()
                    onConnect(target.id)
                    setShowConnections(false)
                  }}
                >
                  {target.data.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
