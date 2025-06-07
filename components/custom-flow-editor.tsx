"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { FlowNodeComponent } from "@/components/flow-node-component"

interface FlowNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: any
}

interface FlowEdge {
  id: string
  source: string
  target: string
}

interface CustomFlowEditorProps {
  nodes: FlowNode[]
  edges: FlowEdge[]
  onUpdateNode: (id: string, data: any) => void
  onDeleteNode: (id: string) => void
  onConnectNodes: (sourceId: string, targetId: string) => void
  onAddNode: (type: string, position: { x: number; y: number }) => void
  isSimulating: boolean
  currentStep: number
}

export function CustomFlowEditor({
  nodes,
  edges,
  onUpdateNode,
  onDeleteNode,
  onConnectNodes,
  onAddNode,
  isSimulating,
  currentStep,
}: CustomFlowEditorProps) {
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [connecting, setConnecting] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleNodeMouseDown = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      e.preventDefault()
      const node = nodes.find((n) => n.id === nodeId)
      if (!node) return

      const rect = e.currentTarget.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      setDraggedNode(nodeId)
    },
    [nodes],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!draggedNode || !canvasRef.current) return

      const canvasRect = canvasRef.current.getBoundingClientRect()
      const newPosition = {
        x: e.clientX - canvasRect.left - dragOffset.x,
        y: e.clientY - canvasRect.top - dragOffset.y,
      }

      onUpdateNode(draggedNode, { position: newPosition })
    },
    [draggedNode, dragOffset, onUpdateNode],
  )

  const handleMouseUp = useCallback(() => {
    setDraggedNode(null)
    setConnecting(null)
  }, [])

  const handleCanvasDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const nodeType = e.dataTransfer.getData("application/reactflow")
      if (!nodeType || !canvasRef.current) return

      const canvasRect = canvasRef.current.getBoundingClientRect()
      const position = {
        x: e.clientX - canvasRect.left,
        y: e.clientY - canvasRect.top,
      }

      onAddNode(nodeType, position)
    },
    [onAddNode],
  )

  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }, [])

  const handleNodeConnect = useCallback(
    (sourceId: string, targetId: string) => {
      if (sourceId !== targetId) {
        onConnectNodes(sourceId, targetId)
      }
      setConnecting(null)
    },
    [onConnectNodes],
  )

  const renderEdges = () => {
    return edges.map((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source)
      const targetNode = nodes.find((n) => n.id === edge.target)

      if (!sourceNode || !targetNode) return null

      const sourceX = sourceNode.position.x + 200 // Node width
      const sourceY = sourceNode.position.y + 50 // Half node height
      const targetX = targetNode.position.x
      const targetY = targetNode.position.y + 50

      return (
        <svg key={edge.id} className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
            </marker>
          </defs>
          <path
            d={`M ${sourceX} ${sourceY} Q ${sourceX + 50} ${sourceY} ${targetX} ${targetY}`}
            stroke="#6b7280"
            strokeWidth="2"
            fill="none"
            markerEnd="url(#arrowhead)"
          />
        </svg>
      )
    })
  }

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 rounded-lg overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDrop={handleCanvasDrop}
      onDragOver={handleCanvasDragOver}
    >
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle, #6b7280 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Edges */}
      {renderEdges()}

      {/* Nodes */}
      {nodes.map((node, index) => (
        <div
          key={node.id}
          className="absolute"
          style={{
            left: node.position.x,
            top: node.position.y,
            zIndex: 10,
          }}
        >
          <FlowNodeComponent
            node={node}
            isActive={index === currentStep && isSimulating}
            isCompleted={index < currentStep && isSimulating}
            onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
            onUpdate={(data) => onUpdateNode(node.id, data)}
            onDelete={() => onDeleteNode(node.id)}
            onConnect={(targetId) => handleNodeConnect(node.id, targetId)}
            connecting={connecting === node.id}
            onStartConnect={() => setConnecting(node.id)}
            availableTargets={nodes.filter((n) => n.id !== node.id)}
          />
        </div>
      ))}

      {/* Empty State */}
      {nodes.length <= 1 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-700 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Drag nodes from the palette to build your wallet flow</span>
            </div>
            <p className="text-xs text-gray-500">Connect nodes to create automated trading strategies</p>
          </div>
        </div>
      )}

      {/* Simulation Indicator */}
      {isSimulating && (
        <div className="absolute top-4 right-4 bg-blue-500 text-white rounded-lg p-2 text-xs font-medium">
          Simulating Step {currentStep + 1}
        </div>
      )}
    </div>
  )
}
