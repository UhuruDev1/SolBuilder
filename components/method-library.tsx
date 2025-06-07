"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Code, Wallet, ArrowRightLeft, Coins, Settings, Database, Network, Zap } from "lucide-react"

interface MethodLibraryProps {
  network: "devnet" | "testnet" | "mainnet"
}

interface Method {
  name: string
  category: string
  description: string
  parameters: string[]
  returns: string
  example: string
  gasEstimate: number
}

const solanaCoreMethods: Method[] = [
  {
    name: "getAccountInfo",
    category: "Account",
    description: "Get account information for a given public key",
    parameters: ["publicKey: PublicKey", "commitment?: Commitment"],
    returns: "Promise<AccountInfo<Buffer> | null>",
    example: "await connection.getAccountInfo(publicKey)",
    gasEstimate: 0,
  },
  {
    name: "getBalance",
    category: "Account",
    description: "Get the balance of an account in lamports",
    parameters: ["publicKey: PublicKey", "commitment?: Commitment"],
    returns: "Promise<number>",
    example: "await connection.getBalance(publicKey)",
    gasEstimate: 0,
  },
  {
    name: "sendTransaction",
    category: "Transaction",
    description: "Send a signed transaction to the network",
    parameters: ["transaction: Transaction", "signers: Signer[]"],
    returns: "Promise<TransactionSignature>",
    example: "await connection.sendTransaction(transaction, [payer])",
    gasEstimate: 5000,
  },
  {
    name: "confirmTransaction",
    category: "Transaction",
    description: "Confirm a transaction by signature",
    parameters: ["signature: TransactionSignature", "commitment?: Commitment"],
    returns: "Promise<RpcResponseAndContext<SignatureResult>>",
    example: "await connection.confirmTransaction(signature)",
    gasEstimate: 0,
  },
  {
    name: "requestAirdrop",
    category: "Utility",
    description: "Request an airdrop of lamports (devnet/testnet only)",
    parameters: ["publicKey: PublicKey", "lamports: number"],
    returns: "Promise<TransactionSignature>",
    example: "await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL)",
    gasEstimate: 0,
  },
  {
    name: "getTokenAccountsByOwner",
    category: "Token",
    description: "Get all token accounts owned by a specific address",
    parameters: ["ownerAddress: PublicKey", "filter: TokenAccountsFilter"],
    returns: "Promise<RpcResponseAndContext<GetProgramAccountsResponse>>",
    example: "await connection.getTokenAccountsByOwner(owner, { programId: TOKEN_PROGRAM_ID })",
    gasEstimate: 0,
  },
]

const raydiumMethods: Method[] = [
  {
    name: "getPoolInfo",
    category: "Pool",
    description: "Get information about a liquidity pool",
    parameters: ["poolId: PublicKey"],
    returns: "Promise<PoolInfo>",
    example: "await raydium.getPoolInfo(poolId)",
    gasEstimate: 0,
  },
  {
    name: "swap",
    category: "Trading",
    description: "Execute a token swap through Raydium",
    parameters: ["swapParams: SwapParams"],
    returns: "Promise<TransactionSignature>",
    example: "await raydium.swap({ tokenIn, tokenOut, amountIn, slippage })",
    gasEstimate: 15000,
  },
  {
    name: "addLiquidity",
    category: "Liquidity",
    description: "Add liquidity to a pool",
    parameters: ["poolId: PublicKey", "tokenAAmount: number", "tokenBAmount: number"],
    returns: "Promise<TransactionSignature>",
    example: "await raydium.addLiquidity(poolId, amountA, amountB)",
    gasEstimate: 25000,
  },
  {
    name: "removeLiquidity",
    category: "Liquidity",
    description: "Remove liquidity from a pool",
    parameters: ["poolId: PublicKey", "lpTokenAmount: number"],
    returns: "Promise<TransactionSignature>",
    example: "await raydium.removeLiquidity(poolId, lpAmount)",
    gasEstimate: 20000,
  },
  {
    name: "getPrice",
    category: "Price",
    description: "Get current price for a token pair",
    parameters: ["tokenA: PublicKey", "tokenB: PublicKey"],
    returns: "Promise<number>",
    example: "await raydium.getPrice(tokenA, tokenB)",
    gasEstimate: 0,
  },
]

const splTokenMethods: Method[] = [
  {
    name: "createMint",
    category: "Token",
    description: "Create a new SPL token mint",
    parameters: [
      "connection: Connection",
      "payer: Signer",
      "mintAuthority: PublicKey",
      "freezeAuthority: PublicKey",
      "decimals: number",
    ],
    returns: "Promise<PublicKey>",
    example: "await createMint(connection, payer, mintAuthority, null, 9)",
    gasEstimate: 10000,
  },
  {
    name: "createAccount",
    category: "Token",
    description: "Create a new token account",
    parameters: ["connection: Connection", "payer: Signer", "mint: PublicKey", "owner: PublicKey"],
    returns: "Promise<PublicKey>",
    example: "await createAccount(connection, payer, mint, owner)",
    gasEstimate: 8000,
  },
  {
    name: "mintTo",
    category: "Token",
    description: "Mint tokens to an account",
    parameters: [
      "connection: Connection",
      "payer: Signer",
      "mint: PublicKey",
      "destination: PublicKey",
      "authority: Signer",
      "amount: number",
    ],
    returns: "Promise<TransactionSignature>",
    example: "await mintTo(connection, payer, mint, tokenAccount, mintAuthority, amount)",
    gasEstimate: 7000,
  },
  {
    name: "transfer",
    category: "Token",
    description: "Transfer tokens between accounts",
    parameters: [
      "connection: Connection",
      "payer: Signer",
      "source: PublicKey",
      "destination: PublicKey",
      "owner: Signer",
      "amount: number",
    ],
    returns: "Promise<TransactionSignature>",
    example: "await transfer(connection, payer, source, destination, owner, amount)",
    gasEstimate: 6000,
  },
]

export function MethodLibrary({ network }: MethodLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const allMethods = [...solanaCoreMethods, ...raydiumMethods, ...splTokenMethods]

  const categories = ["all", ...Array.from(new Set(allMethods.map((m) => m.category)))]

  const filteredMethods = allMethods.filter((method) => {
    const matchesSearch =
      method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      method.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || method.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Account":
        return Wallet
      case "Transaction":
        return ArrowRightLeft
      case "Token":
        return Coins
      case "Pool":
      case "Liquidity":
        return Database
      case "Trading":
      case "Price":
        return Network
      case "Utility":
        return Settings
      default:
        return Code
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="h-5 w-5" />
            <span>Method Library</span>
            <Badge variant="outline">{filteredMethods.length} methods</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search methods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="outline">{network}</Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Method Categories */}
      <Tabs defaultValue="solana" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="solana">Solana Core</TabsTrigger>
          <TabsTrigger value="raydium">Raydium SDK</TabsTrigger>
          <TabsTrigger value="spl">SPL Token</TabsTrigger>
        </TabsList>

        <TabsContent value="solana" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {solanaCoreMethods
              .filter((method) => {
                const matchesSearch =
                  method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  method.description.toLowerCase().includes(searchTerm.toLowerCase())
                const matchesCategory = selectedCategory === "all" || method.category === selectedCategory
                return matchesSearch && matchesCategory
              })
              .map((method, index) => {
                const IconComponent = getCategoryIcon(method.category)
                return (
                  <Card key={index} className="bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-4 w-4 text-blue-600" />
                          <span className="font-mono text-sm font-semibold">{method.name}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {method.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600">{method.description}</p>

                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">Parameters:</p>
                          <div className="space-y-1">
                            {method.parameters.map((param, idx) => (
                              <code key={idx} className="block text-xs bg-gray-100 px-2 py-1 rounded">
                                {param}
                              </code>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">Returns:</p>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded block">{method.returns}</code>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">Example:</p>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded block">{method.example}</code>
                        </div>

                        {method.gasEstimate > 0 && (
                          <div className="flex items-center justify-between pt-2 border-t">
                            <span className="text-xs text-gray-600">Est. Gas:</span>
                            <Badge variant="outline" className="text-xs">
                              <Zap className="h-3 w-3 mr-1" />
                              {method.gasEstimate.toLocaleString()}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </TabsContent>

        <TabsContent value="raydium" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {raydiumMethods
              .filter((method) => {
                const matchesSearch =
                  method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  method.description.toLowerCase().includes(searchTerm.toLowerCase())
                const matchesCategory = selectedCategory === "all" || method.category === selectedCategory
                return matchesSearch && matchesCategory
              })
              .map((method, index) => {
                const IconComponent = getCategoryIcon(method.category)
                return (
                  <Card key={index} className="bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-4 w-4 text-purple-600" />
                          <span className="font-mono text-sm font-semibold">{method.name}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {method.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600">{method.description}</p>

                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">Parameters:</p>
                          <div className="space-y-1">
                            {method.parameters.map((param, idx) => (
                              <code key={idx} className="block text-xs bg-gray-100 px-2 py-1 rounded">
                                {param}
                              </code>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">Returns:</p>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded block">{method.returns}</code>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">Example:</p>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded block">{method.example}</code>
                        </div>

                        {method.gasEstimate > 0 && (
                          <div className="flex items-center justify-between pt-2 border-t">
                            <span className="text-xs text-gray-600">Est. Gas:</span>
                            <Badge variant="outline" className="text-xs">
                              <Zap className="h-3 w-3 mr-1" />
                              {method.gasEstimate.toLocaleString()}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </TabsContent>

        <TabsContent value="spl" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {splTokenMethods
              .filter((method) => {
                const matchesSearch =
                  method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  method.description.toLowerCase().includes(searchTerm.toLowerCase())
                const matchesCategory = selectedCategory === "all" || method.category === selectedCategory
                return matchesSearch && matchesCategory
              })
              .map((method, index) => {
                const IconComponent = getCategoryIcon(method.category)
                return (
                  <Card key={index} className="bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-4 w-4 text-green-600" />
                          <span className="font-mono text-sm font-semibold">{method.name}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {method.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600">{method.description}</p>

                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">Parameters:</p>
                          <div className="space-y-1">
                            {method.parameters.map((param, idx) => (
                              <code key={idx} className="block text-xs bg-gray-100 px-2 py-1 rounded">
                                {param}
                              </code>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">Returns:</p>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded block">{method.returns}</code>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">Example:</p>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded block">{method.example}</code>
                        </div>

                        {method.gasEstimate > 0 && (
                          <div className="flex items-center justify-between pt-2 border-t">
                            <span className="text-xs text-gray-600">Est. Gas:</span>
                            <Badge variant="outline" className="text-xs">
                              <Zap className="h-3 w-3 mr-1" />
                              {method.gasEstimate.toLocaleString()}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
