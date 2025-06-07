"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { QRCodeDisplay } from "@/components/qr-code-display"
import { useWallet } from "@/components/wallet-connection-provider"
import { Wallet, Plus, QrCode, Copy, Shield, Zap, RefreshCw, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Connection, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js"
import type { WalletAdapterNetwork } from "@solana/wallet-adapter-base"

interface WalletManagerProps {
  network: "devnet" | "testnet" | "mainnet"
}

interface OnSiteWallet {
  id: string
  publicKey: string
  privateKey?: string
  balance: number
  qrCode: string
  created: string
}

export function WalletManager({ network }: WalletManagerProps) {
  const { connected, publicKey, balance, connect, disconnect, createOnSiteWallet, refreshBalance } = useWallet()
  const [onSiteWallets, setOnSiteWallets] = useState<OnSiteWallet[]>([])
  const [isCreatingWallet, setIsCreatingWallet] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<OnSiteWallet | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  // Load saved wallets from localStorage on component mount
  useEffect(() => {
    const savedWallets = localStorage.getItem("onSiteWallets")
    if (savedWallets) {
      try {
        setOnSiteWallets(JSON.parse(savedWallets))
      } catch (e) {
        console.error("Failed to parse saved wallets", e)
      }
    }
  }, [])

  // Save wallets to localStorage when they change
  useEffect(() => {
    if (onSiteWallets.length > 0) {
      localStorage.setItem("onSiteWallets", JSON.stringify(onSiteWallets))
    }
  }, [onSiteWallets])

  const handleCreateOnSiteWallet = async () => {
    setIsCreatingWallet(true)
    try {
      const { publicKey, qrCode, privateKey } = await createOnSiteWallet()

      const newWallet: OnSiteWallet = {
        id: `wallet-${Date.now()}`,
        publicKey,
        privateKey,
        balance: 0,
        qrCode,
        created: new Date().toISOString(),
      }

      setOnSiteWallets((prev) => [...prev, newWallet])
      setSelectedWallet(newWallet)

      toast({
        title: "On-Site Wallet Created",
        description: "Your secure on-site wallet has been created successfully",
      })
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create on-site wallet",
        variant: "destructive",
      })
    } finally {
      setIsCreatingWallet(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: `${label} copied to clipboard`,
    })
  }

  const requestAirdrop = async (walletId: string) => {
    if (network === "mainnet") {
      toast({
        title: "Airdrop Unavailable",
        description: "Airdrops are not available on mainnet",
        variant: "destructive",
      })
      return
    }

    const wallet = onSiteWallets.find((w) => w.id === walletId)
    if (!wallet) return

    try {
      const connection = new Connection(clusterApiUrl(network as WalletAdapterNetwork))
      const publicKey = new PublicKey(wallet.publicKey)

      toast({
        title: "Requesting Airdrop",
        description: "Requesting SOL from faucet...",
      })

      const signature = await connection.requestAirdrop(publicKey, 2 * LAMPORTS_PER_SOL)
      await connection.confirmTransaction(signature)

      // Update the wallet balance
      const balance = await connection.getBalance(publicKey)

      setOnSiteWallets((prev) =>
        prev.map((w) => (w.id === walletId ? { ...w, balance: balance / LAMPORTS_PER_SOL } : w)),
      )

      if (selectedWallet?.id === walletId) {
        setSelectedWallet({
          ...selectedWallet,
          balance: balance / LAMPORTS_PER_SOL,
        })
      }

      toast({
        title: "Airdrop Successful",
        description: "Received 2 SOL from faucet",
      })
    } catch (error) {
      console.error("Airdrop failed:", error)
      toast({
        title: "Airdrop Failed",
        description: "Failed to request SOL from faucet",
        variant: "destructive",
      })
    }
  }

  const handleRefreshBalance = async () => {
    setIsRefreshing(true)
    try {
      await refreshBalance()
    } finally {
      setIsRefreshing(false)
    }
  }

  const refreshOnSiteWalletBalance = async (walletId: string) => {
    const wallet = onSiteWallets.find((w) => w.id === walletId)
    if (!wallet) return

    try {
      const connection = new Connection(clusterApiUrl(network as WalletAdapterNetwork))
      const publicKey = new PublicKey(wallet.publicKey)
      const balance = await connection.getBalance(publicKey)

      setOnSiteWallets((prev) =>
        prev.map((w) => (w.id === walletId ? { ...w, balance: balance / LAMPORTS_PER_SOL } : w)),
      )

      if (selectedWallet?.id === walletId) {
        setSelectedWallet({
          ...selectedWallet,
          balance: balance / LAMPORTS_PER_SOL,
        })
      }

      toast({
        title: "Balance Updated",
        description: "Wallet balance has been refreshed",
      })
    } catch (error) {
      console.error("Failed to refresh balance:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Connected Wallet Section */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="h-5 w-5" />
            <span>Primary Wallet Connection</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!connected ? (
            <div className="text-center py-8">
              <Wallet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">Connect your primary wallet to get started</p>
              <Button onClick={connect} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Connected
                </Badge>
                <Badge variant="secondary">{network.toUpperCase()}</Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Public Key</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input value={publicKey || ""} readOnly className="font-mono text-sm" />
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(publicKey || "", "Public key")}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Balance</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                      <span className="text-2xl font-bold">{balance.toFixed(4)}</span>
                      <span className="text-sm text-gray-600 ml-2">SOL</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={handleRefreshBalance} disabled={isRefreshing}>
                      <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={disconnect} className="flex-1">
                  Disconnect
                </Button>
                <Button variant="outline" className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* On-Site Wallets Section */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>On-Site Wallets</span>
            </CardTitle>
            <Button
              onClick={handleCreateOnSiteWallet}
              disabled={isCreatingWallet}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white"
            >
              {isCreatingWallet ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Create Wallet
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              On-site wallets are created and managed securely within the platform. Use these for testing without
              risking your primary wallet funds.
            </AlertDescription>
          </Alert>

          {onSiteWallets.length === 0 ? (
            <div className="text-center py-8">
              <QrCode className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">No on-site wallets created yet</p>
              <p className="text-sm text-gray-500">Create secure wallets for testing and development</p>
            </div>
          ) : (
            <Tabs defaultValue="list" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list">Wallet List</TabsTrigger>
                <TabsTrigger value="details">Wallet Details</TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="space-y-3">
                {onSiteWallets.map((wallet) => (
                  <Card key={wallet.id} className="bg-white border hover:bg-gray-50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <QrCode className="h-4 w-4 text-blue-500" />
                            <span className="font-medium text-sm">
                              {wallet.publicKey.substring(0, 8)}...
                              {wallet.publicKey.substring(wallet.publicKey.length - 8)}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {wallet.balance.toFixed(2)} SOL
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500">
                            Created: {new Date(wallet.created).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setSelectedWallet(wallet)}>
                            <QrCode className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => requestAirdrop(wallet.id)}
                            disabled={network === "mainnet"}
                          >
                            <Zap className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="details">
                {selectedWallet ? (
                  <div className="space-y-4">
                    <Card className="bg-white">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Wallet Info */}
                          <div className="space-y-4">
                            <h3 className="font-medium">Wallet Information</h3>

                            <div>
                              <Label className="text-sm font-medium">Public Key</Label>
                              <div className="flex items-center space-x-2 mt-1">
                                <Input value={selectedWallet.publicKey} readOnly className="font-mono text-sm" />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => copyToClipboard(selectedWallet.publicKey, "Public key")}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div>
                              <Label className="text-sm font-medium">Balance</Label>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                                  <span className="text-xl font-bold">{selectedWallet.balance.toFixed(4)}</span>
                                  <span className="text-sm text-gray-600 ml-2">SOL</span>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => refreshOnSiteWalletBalance(selectedWallet.id)}
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => requestAirdrop(selectedWallet.id)}
                                disabled={network === "mainnet"}
                              >
                                <Zap className="h-4 w-4 mr-2" />
                                Request Airdrop
                              </Button>
                              <Button variant="outline" className="flex-1">
                                <Send className="h-4 w-4 mr-2" />
                                Send
                              </Button>
                            </div>
                          </div>

                          {/* QR Code */}
                          <div className="space-y-4">
                            <h3 className="font-medium">Funding QR Code</h3>
                            <QRCodeDisplay qrCode={selectedWallet.qrCode} publicKey={selectedWallet.publicKey} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <QrCode className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Select a wallet to view details</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
