"use client"

import { useEffect, useState } from "react"

export function Preloader() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        {/* SVG Logo */}
        <div className="mb-8">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            className="mx-auto animate-pulse"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>

            {/* Outer ring */}
            <circle
              cx="60"
              cy="60"
              r="55"
              fill="none"
              stroke="url(#logoGradient)"
              strokeWidth="3"
              className="animate-spin"
              style={{ animationDuration: "3s" }}
            />

            {/* Inner hexagon */}
            <polygon points="60,15 90,35 90,65 60,85 30,65 30,35" fill="url(#logoGradient)" opacity="0.8" />

            {/* Center diamond */}
            <polygon points="60,35 75,50 60,65 45,50" fill="white" className="animate-pulse" />

            {/* Connection nodes */}
            <circle cx="60" cy="25" r="4" fill="white" />
            <circle cx="80" cy="40" r="4" fill="white" />
            <circle cx="80" cy="60" r="4" fill="white" />
            <circle cx="60" cy="75" r="4" fill="white" />
            <circle cx="40" cy="60" r="4" fill="white" />
            <circle cx="40" cy="40" r="4" fill="white" />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Solana AI Builder
        </h1>

        <p className="text-blue-200 mb-8">Initializing your blockchain development environment...</p>

        {/* Progress bar */}
        <div className="w-80 mx-auto">
          <div className="bg-white/20 rounded-full h-2 mb-4">
            <div
              className="bg-gradient-to-r from-purple-400 to-blue-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white text-sm">{progress}% Complete</p>
        </div>
      </div>
    </div>
  )
}
