"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Zap } from "lucide-react"

interface MarketOverviewProps {
  data: {
    solPrice: number
    marketCap: number
    volume24h: number
    topGainers: Array<{ symbol: string; price: number; change: string }>
    topLosers: Array<{ symbol: string; price: number; change: string }>
  }
}

export function MarketOverview({ data }: MarketOverviewProps) {
  return (
    <Card className="bg-white/50 backdrop-blur-sm mb-4">
      <CardContent className="p-3">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          <div className="p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">SOL Price</span>
              <Badge variant="outline" className="text-xs">
                Live
              </Badge>
            </div>
            <div className="text-lg font-bold">${data.solPrice.toFixed(2)}</div>
          </div>

          <div className="p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Market Cap</span>
            </div>
            <div className="text-lg font-bold">${data.marketCap.toFixed(1)}B</div>
          </div>

          <div className="p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">24h Volume</span>
            </div>
            <div className="text-lg font-bold">${data.volume24h.toFixed(1)}B</div>
          </div>

          <div className="p-2">
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-gray-500">Top Gainers</span>
            </div>
            <div className="space-y-1 mt-1">
              {data.topGainers.map((coin, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-xs font-medium">{coin.symbol}</span>
                  <span className="text-xs text-green-600">{coin.change}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2">
            <div className="flex items-center space-x-1">
              <TrendingDown className="h-3 w-3 text-red-500" />
              <span className="text-xs text-gray-500">Top Losers</span>
            </div>
            <div className="space-y-1 mt-1">
              {data.topLosers.map((coin, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-xs font-medium">{coin.symbol}</span>
                  <span className="text-xs text-red-600">{coin.change}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2">
            <div className="flex items-center space-x-1">
              <Zap className="h-3 w-3 text-amber-500" />
              <span className="text-xs text-gray-500">Memecoin Index</span>
            </div>
            <div className="text-lg font-bold text-amber-600">+23.4%</div>
            <div className="text-xs text-gray-500">24h change</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
