"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GroqAssistant } from "@/components/groq-assistant"
import { Code, Play, Save, Upload, Download, CheckCircle, XCircle, BrainCircuit, Zap, FileCode } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface JsonContractEditorProps {
  network: "devnet" | "testnet" | "mainnet"
  compiledFlow: any
}

export function JsonContractEditor({ network, compiledFlow }: JsonContractEditorProps) {
  const [jsonCode, setJsonCode] = useState("")
  const [validationResult, setValidationResult] = useState<any>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [showGroqAssistant, setShowGroqAssistant] = useState(false)
  const { toast } = useToast()

  const validateContract = async () => {
    setIsValidating(true)
    try {
      // Simulate validation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const parsed = JSON.parse(jsonCode || "{}")
      const errors = []
      const warnings = []

      // Basic validation
      if (!parsed.version) errors.push("Missing version field")
      if (!parsed.contract_type) warnings.push("Contract type not specified")
      if (!parsed.functions || !Array.isArray(parsed.functions)) {
        errors.push("Missing or invalid functions array")
      }

      const result = {
        valid: errors.length === 0,
        errors,
        warnings,
        gasEstimate: Math.floor(Math.random() * 50000) + 10000,
        complexity: errors.length > 0 ? "Invalid" : warnings.length > 2 ? "High" : "Medium",
      }

      setValidationResult(result)

      if (result.valid) {
        toast({
          title: "Contract Valid",
          description: "Your JSON contract passed validation",
        })
      } else {
        toast({
          title: "Validation Failed",
          description: `Found ${errors.length} errors`,
          variant: "destructive",
        })
      }
    } catch (error) {
      setValidationResult({
        valid: false,
        errors: ["Invalid JSON format"],
        warnings: [],
        gasEstimate: 0,
        complexity: "Invalid",
      })

      toast({
        title: "Validation Error",
        description: "Invalid JSON format",
        variant: "destructive",
      })
    } finally {
      setIsValidating(false)
    }
  }

  const generateFromFlow = () => {
    if (!compiledFlow) {
      toast({
        title: "No Flow Available",
        description: "Please compile a flow first",
        variant: "destructive",
      })
      return
    }

    const contract = {
      version: "1.0.0",
      contract_type: "wallet_flow",
      network,
      description: "Auto-generated from flow playground",
      functions: compiledFlow.nodes.map((node: any, index: number) => ({
        id: `function_${index}`,
        name: node.data.label.toLowerCase().replace(/\s+/g, "_"),
        type: node.type,
        parameters: getNodeParameters(node),
        execution_order: index,
        conditions: getNodeConditions(node),
      })),
      metadata: {
        generated_at: new Date().toISOString(),
        source: "flow_playground",
        node_count: compiledFlow.nodes.length,
      },
    }

    setJsonCode(JSON.stringify(contract, null, 2))

    toast({
      title: "Contract Generated",
      description: "JSON contract generated from your flow",
    })
  }

  const getNodeParameters = (node: any) => {
    switch (node.type) {
      case "wallet":
        return { network: node.data.network, address: node.data.address }
      case "transaction":
        return { amount: node.data.amount, recipient: node.data.recipient }
      case "inputValue":
        return { type: node.data.valueType, default: node.data.defaultValue }
      default:
        return {}
    }
  }

  const getNodeConditions = (node: any) => {
    switch (node.type) {
      case "conditionalTimer":
        return { duration: node.data.duration, unit: node.data.unit }
      case "oracleCheck":
        return { oracle: node.data.oracle, condition: node.data.condition }
      default:
        return null
    }
  }

  const sampleContract = `{
  "version": "1.0.0",
  "contract_type": "wallet_flow",
  "network": "${network}",
  "description": "Sample wallet automation contract",
  "functions": [
    {
      "id": "wallet_init",
      "name": "initialize_wallet",
      "type": "wallet",
      "parameters": {
        "network": "${network}",
        "auto_fund": true
      },
      "execution_order": 0
    },
    {
      "id": "conditional_send",
      "name": "conditional_transfer",
      "type": "transaction",
      "parameters": {
        "amount": 0.1,
        "recipient": "target_wallet_address"
      },
      "conditions": {
        "min_balance": 1.0,
        "time_delay": 60
      },
      "execution_order": 1
    }
  ],
  "metadata": {
    "created_at": "${new Date().toISOString()}",
    "author": "solana_ai_builder"
  }
}`

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Code Editor */}
      <div className="xl:col-span-2">
        <Card className="h-full bg-white/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Code className="h-5 w-5" />
                <span>JSON Contract Editor</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{network}</Badge>
                <Button size="sm" variant="outline" onClick={() => setShowGroqAssistant(true)}>
                  <BrainCircuit className="h-4 w-4 mr-1" />
                  AI Assistant
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" onClick={generateFromFlow}>
                <Zap className="h-4 w-4 mr-1" />
                Generate from Flow
              </Button>
              <Button size="sm" variant="outline" onClick={() => setJsonCode(sampleContract)}>
                <FileCode className="h-4 w-4 mr-1" />
                Load Sample
              </Button>
              <Button size="sm" variant="outline">
                <Upload className="h-4 w-4 mr-1" />
                Import
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>

            <Textarea
              placeholder="Enter your JSON contract here or generate from flow..."
              value={jsonCode}
              onChange={(e) => setJsonCode(e.target.value)}
              className="font-mono text-sm min-h-[500px] resize-none"
            />

            <div className="flex items-center space-x-2">
              <Button onClick={validateContract} disabled={isValidating}>
                {isValidating ? <Zap className="h-4 w-4 mr-2 animate-pulse" /> : <Play className="h-4 w-4 mr-2" />}
                Validate Contract
              </Button>
              <Button variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Validation Results */}
      <div className="xl:col-span-1">
        <Card className="h-full bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Validation Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!validationResult ? (
              <div className="text-center py-8">
                <FileCode className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-2">No validation results</p>
                <p className="text-sm text-gray-500">Validate your contract to see results</p>
              </div>
            ) : (
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="flex items-center space-x-2">
                    {validationResult.valid ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className={`font-medium ${validationResult.valid ? "text-green-700" : "text-red-700"}`}>
                      {validationResult.valid ? "Valid Contract" : "Invalid Contract"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">Complexity</p>
                      <p className="text-sm font-semibold">{validationResult.complexity}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">Gas Estimate</p>
                      <p className="text-sm font-semibold">{validationResult.gasEstimate?.toLocaleString()}</p>
                    </div>
                  </div>

                  {validationResult.errors.length > 0 && (
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>
                        <p className="font-medium mb-1">Errors Found:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {validationResult.errors.map((error: string, index: number) => (
                            <li key={index} className="text-sm">
                              {error}
                            </li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  {validationResult.warnings.length > 0 && (
                    <Alert>
                      <AlertDescription>
                        <p className="font-medium mb-1">Warnings:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {validationResult.warnings.map((warning: string, index: number) => (
                            <li key={index} className="text-sm">
                              {warning}
                            </li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium mb-1">Validation Time</p>
                      <p className="text-xs text-gray-600">{new Date().toLocaleString()}</p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium mb-1">Network</p>
                      <p className="text-xs text-gray-600">{network.toUpperCase()}</p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium mb-1">Contract Size</p>
                      <p className="text-xs text-gray-600">{jsonCode.length} characters</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Groq Assistant Modal */}
      {showGroqAssistant && (
        <GroqAssistant
          isOpen={showGroqAssistant}
          onClose={() => setShowGroqAssistant(false)}
          currentCode={jsonCode}
          onCodeUpdate={setJsonCode}
        />
      )}
    </div>
  )
}
