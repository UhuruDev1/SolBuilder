"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollingBanner } from "@/components/scrolling-banner"
import { EnhancedFlowPlayground } from "@/components/enhanced-flow-playground"
import { WalletManager } from "@/components/wallet-manager"
import { JsonContractEditor } from "@/components/json-contract-editor"
import { CommunityHub } from "@/components/community-hub"
import { NetworkSelector } from "@/components/network-selector"
import { WalletConnectionProvider } from "@/components/wallet-connection-provider"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { useWallet } from "@solana/wallet-adapter-react"
import { Layers, Wallet, Code, Users, Settings, Menu, X, Zap, BrainCircuit } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function MainApp() {
  const [activeTab, setActiveTab] = useState("playground")
  const [selectedNetwork, setSelectedNetwork] = useState<WalletAdapterNetwork>(WalletAdapterNetwork.Devnet)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [compiledFlow, setCompiledFlow] = useState<any>(null)

  return (
    <WalletConnectionProvider network={selectedNetwork}>
      <MainAppContent
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedNetwork={selectedNetwork}
        setSelectedNetwork={setSelectedNetwork}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        compiledFlow={compiledFlow}
        setCompiledFlow={setCompiledFlow}
      />
    </WalletConnectionProvider>
  )
}

function MainAppContent({
  activeTab,
  setActiveTab,
  selectedNetwork,
  setSelectedNetwork,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  compiledFlow,
  setCompiledFlow,
}: {
  activeTab: string
  setActiveTab: (tab: string) => void
  selectedNetwork: WalletAdapterNetwork
  setSelectedNetwork: (network: WalletAdapterNetwork) => void
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
  compiledFlow: any
  setCompiledFlow: (flow: any) => void
}) {
  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()

  const handleWalletClick = () => {
    if (connected) {
      // If already connected, show wallet info
      toast({
        title: "Wallet Connected",
        description: `Connected to ${publicKey?.toString().slice(0, 4)}...${publicKey?.toString().slice(-4)}`,
      })
    } else {
      // If not connected, open wallet modal
      setVisible(true)
    }
  }

  const networkMapping = {
    [WalletAdapterNetwork.Devnet]: "devnet" as const,
    [WalletAdapterNetwork.Testnet]: "testnet" as const,
    [WalletAdapterNetwork.Mainnet]: "mainnet" as const,
  }

  const reverseNetworkMapping = {
    devnet: WalletAdapterNetwork.Devnet,
    testnet: WalletAdapterNetwork.Testnet,
    mainnet: WalletAdapterNetwork.Mainnet,
  }

  const handleNetworkChange = (network: "devnet" | "testnet" | "mainnet") => {
    setSelectedNetwork(reverseNetworkMapping[network])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Scrolling Banner */}
      <ScrollingBanner />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Solana AI Builder
                </h1>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    Pro
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                    {selectedNetwork.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <NetworkSelector
                selectedNetwork={networkMapping[selectedNetwork]}
                onNetworkChange={handleNetworkChange}
              />
              <Button variant="outline" size="sm">
                <BrainCircuit className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleWalletClick}
                className={connected ? "border-green-400 text-green-700" : ""}
              >
                <Wallet className="h-4 w-4 mr-2" />
                {connected
                  ? `${publicKey?.toString().slice(0, 4)}...${publicKey?.toString().slice(-4)}`
                  : "Connect Wallet"}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
              <div className="space-y-3">
                <NetworkSelector
                  selectedNetwork={networkMapping[selectedNetwork]}
                  onNetworkChange={handleNetworkChange}
                />
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <BrainCircuit className="h-4 w-4 mr-2" />
                    AI Assistant
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={handleWalletClick}>
                    <Wallet className="h-4 w-4 mr-2" />
                    {connected ? "Connected" : "Connect"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-1 border border-gray-200">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-transparent">
              <TabsTrigger value="playground" className="flex items-center space-x-2 data-[state=active]:bg-white">
                <Layers className="h-4 w-4" />
                <span className="hidden sm:inline">Flow Playground</span>
                <span className="sm:hidden">Flow</span>
              </TabsTrigger>
              <TabsTrigger value="wallets" className="flex items-center space-x-2 data-[state=active]:bg-white">
                <Wallet className="h-4 w-4" />
                <span className="hidden sm:inline">Wallets</span>
                <span className="sm:hidden">Wallet</span>
              </TabsTrigger>
              <TabsTrigger value="contracts" className="flex items-center space-x-2 data-[state=active]:bg-white">
                <Code className="h-4 w-4" />
                <span className="hidden sm:inline">JSON Contracts</span>
                <span className="sm:hidden">Code</span>
              </TabsTrigger>
              <TabsTrigger value="community" className="flex items-center space-x-2 data-[state=active]:bg-white">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Community</span>
                <span className="sm:hidden">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2 data-[state=active]:bg-white">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
                <span className="sm:hidden">More</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <TabsContent value="playground" className="space-y-6">
            <EnhancedFlowPlayground network={networkMapping[selectedNetwork]} onCompile={setCompiledFlow} />
          </TabsContent>

          <TabsContent value="wallets" className="space-y-6">
            <WalletManager network={networkMapping[selectedNetwork]} />
          </TabsContent>

          <TabsContent value="contracts" className="space-y-6">
            <JsonContractEditor network={networkMapping[selectedNetwork]} compiledFlow={compiledFlow} />
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <CommunityHub />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="text-center py-12">
              <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Settings panel coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
