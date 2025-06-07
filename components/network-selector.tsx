"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Network } from "lucide-react"

interface NetworkSelectorProps {
  selectedNetwork: "devnet" | "testnet" | "mainnet"
  onNetworkChange: (network: "devnet" | "testnet" | "mainnet") => void
}

export function NetworkSelector({ selectedNetwork, onNetworkChange }: NetworkSelectorProps) {
  const networks = [
    { value: "devnet", label: "Devnet", color: "bg-green-500", description: "Development" },
    { value: "testnet", label: "Testnet", color: "bg-yellow-500", description: "Testing" },
    { value: "mainnet", label: "Mainnet", color: "bg-red-500", description: "Production" },
  ]

  return (
    <div className="flex items-center space-x-2">
      <Network className="h-4 w-4 text-gray-600" />
      <Select value={selectedNetwork} onValueChange={onNetworkChange}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {networks.map((network) => (
            <SelectItem key={network.value} value={network.value}>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${network.color}`} />
                <div>
                  <span className="font-medium">{network.label}</span>
                  <span className="text-xs text-gray-500 ml-1">({network.description})</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
