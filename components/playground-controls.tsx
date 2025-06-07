"use client"

import { Button } from "@/components/ui/button"
import { Play, Pause, Square, Zap, Save, Upload } from "lucide-react"

interface PlaygroundControlsProps {
  isSimulating: boolean
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
  onStop: () => void
  onCompile: () => void
}

export function PlaygroundControls({
  isSimulating,
  isPlaying,
  onPlay,
  onPause,
  onStop,
  onCompile,
}: PlaygroundControlsProps) {
  return (
    <div className="flex items-center space-x-2">
      {/* Simulation Controls */}
      <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
        {!isSimulating ? (
          <Button size="sm" variant="ghost" onClick={onPlay} className="h-8 w-8 p-0">
            <Play className="h-4 w-4" />
          </Button>
        ) : isPlaying ? (
          <Button size="sm" variant="ghost" onClick={onPause} className="h-8 w-8 p-0">
            <Pause className="h-4 w-4" />
          </Button>
        ) : (
          <Button size="sm" variant="ghost" onClick={onPlay} className="h-8 w-8 p-0">
            <Play className="h-4 w-4" />
          </Button>
        )}

        <Button size="sm" variant="ghost" onClick={onStop} disabled={!isSimulating} className="h-8 w-8 p-0">
          <Square className="h-4 w-4" />
        </Button>
      </div>

      {/* File Operations */}
      <div className="flex items-center space-x-1">
        <Button size="sm" variant="outline">
          <Upload className="h-4 w-4 mr-1" />
          Load
        </Button>
        <Button size="sm" variant="outline">
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
      </div>

      {/* Compile */}
      <Button size="sm" onClick={onCompile} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
        <Zap className="h-4 w-4 mr-1" />
        Compile
      </Button>
    </div>
  )
}
