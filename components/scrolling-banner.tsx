"use client"

import { Rocket, Zap, TrendingUp } from "lucide-react"

export function ScrollingBanner() {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 overflow-hidden">
      <div className="animate-scroll whitespace-nowrap">
        <div className="inline-flex items-center space-x-8 px-4">
          <div className="flex items-center space-x-2">
            <Rocket className="h-4 w-4" />
            <span className="font-semibold">🚀 PUMP.FUN LAUNCH COMING SOON!</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Revolutionary AI-Powered Trading</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Join the Future of DeFi</span>
          </div>
          <div className="flex items-center space-x-2">
            <Rocket className="h-4 w-4" />
            <span className="font-semibold">🚀 PUMP.FUN LAUNCH COMING SOON!</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Revolutionary AI-Powered Trading</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Join the Future of DeFi</span>
          </div>
        </div>
      </div>
    </div>
  )
}
