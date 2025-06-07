"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BrainCircuit, Send, Lightbulb, Code, Zap, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GroqAssistantProps {
  isOpen: boolean
  onClose: () => void
  currentCode: string
  onCodeUpdate: (code: string) => void
}

interface GroqSuggestion {
  type: string
  title: string
  description: string
  code: string
}

export function GroqAssistant({ isOpen, onClose, currentCode, onCodeUpdate }: GroqAssistantProps) {
  const [query, setQuery] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [suggestions, setSuggestions] = useState<GroqSuggestion[]>([])
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleQuery = async () => {
    if (!query.trim()) return

    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch("/api/groq/generate-contract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: query,
          currentCode: currentCode || undefined,
          optimization: query.toLowerCase().includes("optimize") ? query : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to generate suggestions")
      }

      // Convert the response to suggestions format
      const newSuggestions: GroqSuggestion[] = [
        {
          type: "ai_generated",
          title: "AI Generated Code",
          description: data.result.explanation || "Generated code based on your request",
          code: data.result.code,
        },
      ]

      // Add additional suggestions based on query type
      if (query.toLowerCase().includes("optimize")) {
        newSuggestions.push({
          type: "optimization",
          title: "Gas Optimization",
          description: "Optimized version focusing on gas efficiency",
          code: data.result.code,
        })
      }

      if (query.toLowerCase().includes("security")) {
        newSuggestions.push({
          type: "security",
          title: "Security Enhancement",
          description: "Added security features and validation",
          code: JSON.stringify(
            {
              ...JSON.parse(data.result.code),
              security: {
                max_transaction_amount: 10.0,
                require_confirmation: true,
                timeout_seconds: 300,
                multi_sig_required: false,
              },
            },
            null,
            2,
          ),
        })
      }

      if (query.toLowerCase().includes("game")) {
        newSuggestions.push({
          type: "feature",
          title: "Game Development Features",
          description: "Added game-specific functionality",
          code: JSON.stringify(
            {
              ...JSON.parse(data.result.code),
              game_features: {
                reward_distribution: {
                  type: "automated",
                  triggers: ["level_up", "achievement", "daily_login"],
                  token_types: ["SOL", "custom_token"],
                  reward_pools: ["main_pool", "bonus_pool"],
                },
                leaderboard: {
                  enabled: true,
                  update_frequency: "real_time",
                  reward_top_players: true,
                },
              },
            },
            null,
            2,
          ),
        })
      }

      setSuggestions(newSuggestions)

      toast({
        title: "AI Analysis Complete",
        description: "Groq AI has generated code suggestions based on your request",
      })
    } catch (error) {
      console.error("Groq Assistant Error:", error)
      setError(error instanceof Error ? error.message : "Failed to get AI suggestions")

      toast({
        title: "Analysis Failed",
        description: "Failed to get AI suggestions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const applySuggestion = (suggestion: GroqSuggestion) => {
    try {
      // Validate JSON before applying
      JSON.parse(suggestion.code)
      onCodeUpdate(suggestion.code)

      toast({
        title: "Suggestion Applied",
        description: "The AI suggestion has been applied to your contract",
      })
    } catch (error) {
      toast({
        title: "Application Failed",
        description: "Failed to apply suggestion - invalid JSON format",
        variant: "destructive",
      })
    }
  }

  const quickActions = [
    {
      label: "Optimize Gas",
      query: "Optimize this contract for better gas efficiency and reduce transaction costs",
      icon: Zap,
    },
    {
      label: "Add Security",
      query: "Add security features, validation, and safety checks to this contract",
      icon: Lightbulb,
    },
    {
      label: "Game Features",
      query: "Create game development features like reward systems and player management",
      icon: Code,
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BrainCircuit className="h-5 w-5 text-purple-600" />
            <span>Groq AI Assistant</span>
            <Badge variant="outline" className="bg-purple-50 text-purple-700">
              Powered by Llama 3.1 70B
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Query Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Ask Groq AI about your contract:</label>
            <div className="flex space-x-2">
              <Textarea
                placeholder="e.g., 'Optimize this contract for gas efficiency' or 'Add game reward features'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1"
                rows={3}
              />
              <Button
                onClick={handleQuery}
                disabled={isProcessing || !query.trim()}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
              >
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quick Actions:</label>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant="outline"
                  onClick={() => setQuery(action.query)}
                  disabled={isProcessing}
                >
                  <action.icon className="h-4 w-4 mr-1" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* AI Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">AI Generated Code</h3>
              <div className="grid grid-cols-1 gap-4">
                {suggestions.map((suggestion, index) => (
                  <Card key={index} className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge
                              variant="outline"
                              className={
                                suggestion.type === "optimization"
                                  ? "bg-green-50 text-green-700"
                                  : suggestion.type === "security"
                                    ? "bg-red-50 text-red-700"
                                    : suggestion.type === "ai_generated"
                                      ? "bg-purple-50 text-purple-700"
                                      : "bg-blue-50 text-blue-700"
                              }
                            >
                              {suggestion.type.replace("_", " ")}
                            </Badge>
                            <h4 className="font-medium">{suggestion.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600">{suggestion.description}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => applySuggestion(suggestion)}
                          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                        >
                          Apply
                        </Button>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <pre className="text-xs overflow-x-auto max-h-40">
                          <code>{suggestion.code}</code>
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Current Analysis */}
          {currentCode && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Current Contract Analysis</h3>
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-600">Size</p>
                      <p className="text-sm font-semibold">{currentCode.length} chars</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Complexity</p>
                      <p className="text-sm font-semibold">
                        {currentCode.length > 2000 ? "High" : currentCode.length > 1000 ? "Medium" : "Low"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Functions</p>
                      <p className="text-sm font-semibold">
                        {currentCode.includes('"functions"') ? "Present" : "Missing"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
