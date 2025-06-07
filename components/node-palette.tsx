"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Wallet, DollarSign, Send, Hash, Clock, Database, ArrowRight, Zap } from "lucide-react"

const nodeCategories = [
  {
    id: "wallet",
    title: "Wallet",
    nodes: [
      { type: "wallet", label: "Wallet", icon: Wallet, color: "bg-blue-500", description: "Connect or create wallet" },
      {
        type: "funding",
        label: "Funding",
        icon: DollarSign,
        color: "bg-green-500",
        description: "Fund wallet with SOL",
      },
    ],
  },
  {
    id: "transaction",
    title: "Transaction",
    nodes: [
      {
        type: "transaction",
        label: "Transaction",
        icon: Send,
        color: "bg-purple-500",
        description: "Execute transaction",
      },
      { type: "output", label: "Output", icon: ArrowRight, color: "bg-gray-500", description: "Flow output" },
    ],
  },
  {
    id: "logic",
    title: "Logic",
    nodes: [
      { type: "inputValue", label: "Input Value", icon: Hash, color: "bg-orange-500", description: "User input field" },
      {
        type: "conditionalTimer",
        label: "Timer",
        icon: Clock,
        color: "bg-red-500",
        description: "Time-based condition",
      },
      { type: "oracleCheck", label: "Oracle", icon: Database, color: "bg-indigo-500", description: "Price feed check" },
    ],
  },
]

interface NodePaletteProps {
  onAddNode: (type: string, position: { x: number; y: number }) => void
}

export function NodePalette({ onAddNode }: NodePaletteProps) {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  const handleNodeClick = (nodeType: string) => {
    // Add node at a random position when clicked
    const position = {
      x: Math.random() * 300 + 100,
      y: Math.random() * 200 + 100,
    }
    onAddNode(nodeType, position)
  }

  return (
    <Card className="h-full bg-gradient-to-b from-white to-gray-50 border-2 border-gray-200 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Zap className="h-5 w-5 mr-2" />
          Node Palette
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="wallet" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="transaction">TX</TabsTrigger>
            <TabsTrigger value="logic">Logic</TabsTrigger>
          </TabsList>

          {nodeCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 mb-2">{category.title}</h4>
              <div className="space-y-2">
                {category.nodes.map((node) => (
                  <div
                    key={node.type}
                    className="group flex flex-col p-3 rounded-lg border-2 border-gray-200 cursor-grab hover:border-green-400 hover:bg-green-50 hover:shadow-md transition-all duration-200 active:cursor-grabbing active:scale-95"
                    draggable
                    onDragStart={(event) => onDragStart(event, node.type)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`p-1.5 rounded ${node.color} group-hover:scale-110 group-hover:shadow-lg transition-all duration-200`}
                        >
                          <node.icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-medium">{node.label}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleNodeClick(node.type)}
                      >
                        <Zap className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 ml-7">{node.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
