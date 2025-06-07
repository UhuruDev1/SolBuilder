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
  const [zoom, setZoom] = useState(1)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleNodeMouseDown = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      e.preventDefault()
      e.stopPropagation()

      const node = nodes.find((n) => n.id === nodeId)
      if (!node) return

      const rect = (e.target as HTMLElement).closest(".flow-node")?.getBoundingClientRect()
      if (!rect) return

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
      if (isPanning) {
        const deltaX = e.clientX - panStart.x
        const deltaY = e.clientY - panStart.y
        setPanOffset((prev) => ({
          x: prev.x + deltaX,
          y: prev.y + deltaY,
        }))
        setPanStart({ x: e.clientX, y: e.clientY })
        return
      }

      if (!draggedNode || !canvasRef.current) return

      const canvasRect = canvasRef.current.getBoundingClientRect()
      const newPosition = {
        x: (e.clientX - canvasRect.left - panOffset.x) / zoom - dragOffset.x,
        y: (e.clientY - canvasRect.top - panOffset.y) / zoom - dragOffset.y,
      }

      // Constrain to canvas bounds
      const constrainedPosition = {
        x: Math.max(0, Math.min(newPosition.x, 1200)),
        y: Math.max(0, Math.min(newPosition.y, 800)),
      }

      onUpdateNode(draggedNode, { position: constrainedPosition })
    },
    [draggedNode, dragOffset, onUpdateNode, zoom, panOffset, isPanning, panStart],
  )

  const handleMouseUp = useCallback(() => {
    setDraggedNode(null)
    setConnecting(null)
    setIsPanning(false)
  }, [])

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0 && (e.ctrlKey || e.metaKey)) {
      // Ctrl/Cmd + click for panning
      setIsPanning(true)
      setPanStart({ x: e.clientX, y: e.clientY })
      e.preventDefault()
    }
  }, [])

  const handleCanvasDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const nodeType = e.dataTransfer.getData("application/reactflow")
      if (!nodeType || !canvasRef.current) return

      const canvasRect = canvasRef.current.getBoundingClientRect()
      const position = {
        x: (e.clientX - canvasRect.left - panOffset.x) / zoom,
        y: (e.clientY - canvasRect.top - panOffset.y) / zoom,
      }

      onAddNode(nodeType, position)
    },
    [onAddNode, zoom, panOffset],
  )

  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom((prev) => Math.max(0.1, Math.min(3, prev * delta)))
  }, [])

  const renderEdges = () => {
    return edges.map((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source)
      const targetNode = nodes.find((n) => n.id === edge.target)

      if (!sourceNode || !targetNode) return null

      const sourceX = sourceNode.position.x + 100 // Half node width
      const sourceY = sourceNode.position.y + 50 // Half node height
      const targetX = targetNode.position.x + 100
      const targetY = targetNode.position.y + 50

      const midX = (sourceX + targetX) / 2
      const midY = (sourceY + targetY) / 2

      return (
        <svg key={edge.id} className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          <defs>
            <marker id={`arrowhead-${edge.id}`} markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
            </marker>
          </defs>
          <path
            d={`M ${sourceX} ${sourceY} Q ${midX} ${sourceY} ${targetX} ${targetY}`}
            stroke="#6b7280"
            strokeWidth="2"
            fill="none"
            markerEnd={`url(#arrowhead-${edge.id})`}
          />
        </svg>
      )
    })
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 rounded-lg overflow-hidden">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
        <button
          onClick={() => setZoom((prev) => Math.min(3, prev * 1.2))}
          className="bg-white/90 hover:bg-white border border-gray-300 rounded p-2 text-sm font-medium shadow-sm"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={() => setZoom((prev) => Math.max(0.1, prev * 0.8))}
          className="bg-white/90 hover:bg-white border border-gray-300 rounded p-2 text-sm font-medium shadow-sm"
        >
          -
        </button>
        <button
          onClick={() => {
            setZoom(1)
            setPanOffset({ x: 0, y: 0 })
          }}
          className="bg-white/90 hover:bg-white border border-gray-300 rounded p-1 text-xs font-medium shadow-sm"
          title="Reset View"
        >
          Reset
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-600 shadow-sm">
        <div>• Drag nodes to move them</div>
        <div>• Ctrl+drag to pan canvas</div>
        <div>• Mouse wheel to zoom</div>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="relative w-full h-full cursor-grab active:cursor-grabbing"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={handleCanvasMouseDown}
        onDrop={handleCanvasDrop}
        onDragOver={handleCanvasDragOver}
        onWheel={handleWheel}
        style={{
          transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          transformOrigin: "0 0",
        }}
      >
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle, #6b7280 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
            backgroundPosition: `${panOffset.x}px ${panOffset.y}px`,
          }}
        />

        {/* Edges */}
        {renderEdges()}

        {/* Nodes */}
        {nodes.map((node, index) => (
          <div
            key={node.id}
            className="absolute flow-node"
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
              onConnect={(targetId) => onConnectNodes(node.id, targetId)}
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
                <span className="font-medium">Drag nodes from the palette to build your flow</span>
              </div>
              <p className="text-xs text-gray-500">Connect nodes to create automated trading strategies</p>
            </div>
          </div>
        )}

        {/* Simulation Indicator */}
        {isSimulating && (
          <div className="absolute top-4 left-4 bg-blue-500 text-white rounded-lg p-2 text-xs font-medium">
            Simulating Step {currentStep + 1}
          </div>
        )}
      </div>
    </div>
  )
}
