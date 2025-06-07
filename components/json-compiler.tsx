"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Code, Play, Download, Upload, CheckCircle, XCircle, FileCode, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface JsonCompilerProps {
  compiledJson: any
  network: "devnet" | "testnet" | "mainnet"
}

export function JsonCompiler({ compiledJson, network }: JsonCompilerProps) {
  const [jsonInput, setJsonInput] = useState("")
  const [compilationResult, setCompilationResult] = useState<any>(null)
  const [isCompiling, setIsCompiling] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const { toast } = useToast()

  const validateJson = (jsonString: string) => {
    const errors: string[] = []

    try {
      const parsed = JSON.parse(jsonString)

      // Basic validation
      if (!parsed.version) errors.push("Missing version field")
      if (!parsed.network) errors.push("Missing network field")
      if (!parsed.nodes || !Array.isArray(parsed.nodes)) errors.push("Missing or invalid nodes array")
      if (!parsed.edges || !Array.isArray(parsed.edges)) errors.push("Missing or invalid edges array")

      // Node validation
      parsed.nodes?.forEach((node: any, index: number) => {
        if (!node.id) errors.push(`Node ${index}: Missing id`)
        if (!node.type) errors.push(`Node ${index}: Missing type`)
        if (!node.data) errors.push(`Node ${index}: Missing data`)
      })

      // Edge validation
      parsed.edges?.forEach((edge: any, index: number) => {
        if (!edge.source) errors.push(`Edge ${index}: Missing source`)
        if (!edge.target) errors.push(`Edge ${index}: Missing target`)
      })
    } catch (e) {
      errors.push("Invalid JSON format")
    }

    return errors
  }

  const compileProgram = async () => {
    setIsCompiling(true)
    setValidationErrors([])

    try {
      const jsonToCompile = jsonInput || JSON.stringify(compiledJson, null, 2)
      const errors = validateJson(jsonToCompile)

      if (errors.length > 0) {
        setValidationErrors(errors)
        return
      }

      // Simulate compilation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const parsed = JSON.parse(jsonToCompile)
      const result = {
        success: true,
        program: parsed,
        bytecode: generateMockBytecode(parsed),
        instructions: generateInstructions(parsed),
        estimatedGas: Math.floor(Math.random() * 10000) + 5000,
        compiledAt: new Date().toISOString(),
      }

      setCompilationResult(result)
      toast({
        title: "Compilation Successful",
        description: "Program compiled successfully",
      })
    } catch (error) {
      setCompilationResult({
        success: false,
        error: "Compilation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      })
      toast({
        title: "Compilation Failed",
        description: "Check your JSON format and try again",
        variant: "destructive",
      })
    } finally {
      setIsCompiling(false)
    }
  }

  const generateMockBytecode = (program: any) => {
    const instructions = []
    for (const node of program.nodes || []) {
      switch (node.type) {
        case "wallet":
          instructions.push("INIT_WALLET")
          break
        case "transaction":
          instructions.push("CREATE_TRANSACTION")
          instructions.push("SET_RECIPIENT")
          instructions.push("SET_AMOUNT")
          break
        case "token":
          instructions.push("TOKEN_TRANSFER")
          break
        case "conditional":
          instructions.push("CONDITIONAL_BRANCH")
          break
      }
    }
    return instructions.join("\n")
  }

  const generateInstructions = (program: any) => {
    return (
      program.nodes?.map((node: any, index: number) => ({
        index,
        type: node.type,
        operation: getOperationForNode(node),
        data: node.data,
      })) || []
    )
  }

  const getOperationForNode = (node: any) => {
    switch (node.type) {
      case "wallet":
        return "Initialize wallet connection"
      case "transaction":
        return "Create and sign transaction"
      case "token":
        return "Transfer SPL tokens"
      case "conditional":
        return "Execute conditional logic"
      default:
        return "Unknown operation"
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* JSON Input */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="h-5 w-5" />
            <span>JSON Program Editor</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline">{network}</Badge>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <Upload className="h-4 w-4 mr-1" />
                Load
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          </div>

          <Textarea
            placeholder="Paste your JSON program here or use the compiled output from the playground..."
            value={jsonInput || (compiledJson ? JSON.stringify(compiledJson, null, 2) : "")}
            onChange={(e) => setJsonInput(e.target.value)}
            className="font-mono text-sm min-h-[400px]"
          />

          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">Validation Errors:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="text-sm">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={compileProgram} disabled={isCompiling} className="w-full">
            {isCompiling ? <Zap className="h-4 w-4 mr-2 animate-pulse" /> : <Play className="h-4 w-4 mr-2" />}
            Compile Program
          </Button>
        </CardContent>
      </Card>

      {/* Compilation Results */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileCode className="h-5 w-5" />
            <span>Compilation Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!compilationResult ? (
            <div className="text-center py-8 text-gray-500">
              <FileCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No compilation results yet</p>
              <p className="text-sm">Compile a program to see the results</p>
            </div>
          ) : (
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="bytecode">Bytecode</TabsTrigger>
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="flex items-center space-x-2">
                  {compilationResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className={`font-medium ${compilationResult.success ? "text-green-700" : "text-red-700"}`}>
                    {compilationResult.success ? "Compilation Successful" : "Compilation Failed"}
                  </span>
                </div>

                {compilationResult.success ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Estimated Gas</p>
                        <p className="text-lg font-semibold">{compilationResult.estimatedGas?.toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Instructions</p>
                        <p className="text-lg font-semibold">{compilationResult.instructions?.length || 0}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Compiled At</p>
                      <p className="text-sm font-mono">{compilationResult.compiledAt}</p>
                    </div>
                  </div>
                ) : (
                  <Alert variant="destructive">
                    <AlertDescription>
                      <p className="font-medium">{compilationResult.error}</p>
                      {compilationResult.details && <p className="text-sm mt-1">{compilationResult.details}</p>}
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="bytecode">
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm font-mono whitespace-pre-wrap">
                    {compilationResult.bytecode || "No bytecode generated"}
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="instructions">
                <div className="space-y-2">
                  {compilationResult.instructions?.map((instruction: any, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">Step {instruction.index + 1}</span>
                        <Badge variant="secondary">{instruction.type}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{instruction.operation}</p>
                    </div>
                  )) || <p className="text-gray-500">No instructions generated</p>}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
