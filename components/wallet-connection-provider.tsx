"use client"

import type React from "react"
import { createContext, useContext, useMemo } from "react"
import { ConnectionProvider, WalletProvider, useWallet as useSolanaWallet } from "@solana/wallet-adapter-react"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets"
import { clusterApiUrl } from "@solana/web3.js"
import { useToast } from "@/hooks/use-toast"

// Import wallet adapter CSS
import "@solana/wallet-adapter-react-ui/styles.css"

interface WalletContextType {
  connected: boolean
  publicKey: string | null
  balance: number
  connect: () => Promise<void>
  disconnect: () => void
  createOnSiteWallet: () => Promise<{ publicKey: string; qrCode: string }>
  network: WalletAdapterNetwork
  setNetwork: (network: WalletAdapterNetwork) => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

interface WalletConnectionProviderProps {
  children: React.ReactNode
  network?: WalletAdapterNetwork
}

function WalletConnectionProviderInner({
  children,
  network = WalletAdapterNetwork.Devnet,
}: WalletConnectionProviderProps) {
  const { connected, publicKey, connect, disconnect } = useSolanaWallet()
  const { toast } = useToast()

  const createOnSiteWallet = async () => {
    const publicKey = generateMockPublicKey()
    const qrCode = `data:image/svg+xml;base64,${btoa(generateQRCodeSVG(publicKey))}`
    return { publicKey, qrCode }
  }

  const generateMockPublicKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    for (let i = 0; i < 44; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const generateQRCodeSVG = (data: string) => {
    return `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="white"/>
      <text x="100" y="100" textAnchor="middle" fontSize="12" fill="black">QR Code for: ${data.substring(0, 8)}...</text>
    </svg>`
  }

  const handleConnect = async () => {
    try {
      await connect()
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your wallet",
      })
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet",
        variant: "destructive",
      })
    }
  }

  const handleDisconnect = () => {
    disconnect()
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  return (
    <WalletContext.Provider
      value={{
        connected,
        publicKey: publicKey?.toString() || null,
        balance: 0, // TODO: Implement real balance fetching
        connect: handleConnect,
        disconnect: handleDisconnect,
        createOnSiteWallet,
        network,
        setNetwork: () => {}, // TODO: Implement network switching
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function WalletConnectionProvider({
  children,
  network = WalletAdapterNetwork.Devnet,
}: WalletConnectionProviderProps) {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  // Only include currently supported wallet adapters
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    [network],
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletConnectionProviderInner network={network}>{children}</WalletConnectionProviderInner>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletConnectionProvider")
  }
  return context
}
