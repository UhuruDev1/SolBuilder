"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useMemo } from "react"
import { ConnectionProvider, WalletProvider, useWallet as useSolanaWallet } from "@solana/wallet-adapter-react"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets"
import { clusterApiUrl, Connection, type PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { useToast } from "@/hooks/use-toast"
import QRCode from "qrcode"

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
  refreshBalance: () => Promise<void>
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
  const { connected, publicKey, connect: connectWallet, disconnect: disconnectWallet } = useSolanaWallet()
  const [balance, setBalance] = useState<number>(0)
  const { toast } = useToast()
  const connection = useMemo(() => new Connection(clusterApiUrl(network)), [network])

  // Fetch balance when wallet is connected
  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance(publicKey)
    } else {
      setBalance(0)
    }
  }, [connected, publicKey, network])

  const fetchBalance = async (pubKey: PublicKey) => {
    try {
      const balanceInLamports = await connection.getBalance(pubKey)
      setBalance(balanceInLamports / LAMPORTS_PER_SOL)
    } catch (error) {
      console.error("Failed to fetch balance:", error)
      setBalance(0)
    }
  }

  const refreshBalance = async () => {
    if (connected && publicKey) {
      await fetchBalance(publicKey)
      toast({
        title: "Balance Updated",
        description: "Your wallet balance has been refreshed",
      })
    }
  }

  const createOnSiteWallet = async () => {
    try {
      // Generate a new keypair
      const response = await fetch("/api/wallet/generate", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to generate wallet")
      }

      const { publicKey, privateKey } = await response.json()

      // Generate QR code for the public key
      const qrCode = await QRCode.toDataURL(`solana:${publicKey}?transfer=`)

      // Store private key securely (in this case, just returning it)
      // In a real app, you'd want to encrypt this or use a more secure approach

      return { publicKey, qrCode, privateKey }
    } catch (error) {
      console.error("Error creating wallet:", error)
      toast({
        title: "Wallet Creation Failed",
        description: "Could not create a new wallet",
        variant: "destructive",
      })
      throw error
    }
  }

  const connect = async () => {
    try {
      await connectWallet()
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your wallet",
      })
    } catch (error) {
      console.error("Connection error:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Make sure Phantom is installed.",
        variant: "destructive",
      })
    }
  }

  const disconnect = () => {
    disconnectWallet()
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
        balance,
        connect,
        disconnect,
        createOnSiteWallet,
        network,
        setNetwork: () => {}, // TODO: Implement network switching
        refreshBalance,
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

  // Configure wallet adapters
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
