"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BrainCircuit, CheckCircle, TrendingUp, BarChart2, Zap, ArrowRight, Lightbulb, Shuffle } from "lucide-react"

interface GroqAnalyticsProps {
  analysis: any
  compiledJson: any
}

export function GroqAnalytics({ analysis, compiledJson }: GroqAnalyticsProps) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!analysis) {
    return (
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <BrainCircuit className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-2">No analysis available</p>
            <p className="text-sm text-gray-500 mb-6">
              Build a trading flow and request Groq AI analysis to see insights here
            </p>
            <Button disabled={!compiledJson} className="mx-auto">
              <BrainCircuit className="h-4 w-4 mr-2" />
              Request Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <BrainCircuit className="h-5 w-5 text-purple-600" />
              <span>Groq AI Trading Analysis</span>
            </CardTitle>
            <Badge variant="outline" className="bg-purple-50 text-purple-700">
              Professional Trader
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
              <TabsTrigger value="insights">Market Insights</TabsTrigger>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Flow Complexity</span>
                      <Badge variant="outline">{analysis.flowComplexity}</Badge>
                    </div>
                    <div className="text-2xl font-bold">{analysis.flowComplexity}</div>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Risk Assessment</span>
                      <Badge
                        variant="outline"
                        className={
                          analysis.riskAssessment === "Low"
                            ? "bg-green-50 text-green-700"
                            : analysis.riskAssessment === "Moderate"
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-red-50 text-red-700"
                        }
                      >
                        {analysis.riskAssessment}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold">{analysis.riskAssessment}</div>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Est. Profitability</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        24h
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{analysis.estimatedProfitability}</div>
                  </CardContent>
                </Card>
              </div>

              <Alert className="bg-purple-50 border-purple-200">
                <div className="flex items-start">
                  <BrainCircuit className="h-4 w-4 text-purple-600 mt-0.5 mr-2" />
                  <AlertDescription className="text-purple-800">
                    <p className="font-medium mb-1">Groq AI Trading Analysis</p>
                    <p className="text-sm">
                      This trading flow has been analyzed by Groq AI, acting as a professional Solana trader. The
                      analysis includes risk assessment, profit potential, and optimization suggestions.
                    </p>
                  </AlertDescription>
                </div>
              </Alert>
            </TabsContent>

            <TabsContent value="opportunities" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.tradingOpportunities.map((opportunity: any, index: number) => (
                  <Card key={index} className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {opportunity.type === "Arbitrage" ? (
                            <Shuffle className="h-4 w-4 text-blue-600" />
                          ) : (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          )}
                          <span className="font-medium">{opportunity.type}</span>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            opportunity.risk === "Low"
                              ? "bg-green-50 text-green-700"
                              : opportunity.risk === "Medium"
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-red-50 text-red-700"
                          }
                        >
                          {opportunity.risk} Risk
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        {opportunity.route && (
                          <div>
                            <span className="text-xs text-gray-500 block">Route:</span>
                            <div className="flex items-center space-x-1 text-sm">
                              {opportunity.route.split(" → ").map((step: string, i: number, arr: string[]) => (
                                <div key={i} className="flex items-center">
                                  <span className="font-mono">{step}</span>
                                  {i < arr.length - 1 && <ArrowRight className="h-3 w-3 mx-1 text-gray-400" />}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {opportunity.asset && (
                          <div>
                            <span className="text-xs text-gray-500 block">Asset:</span>
                            <div className="flex items-center space-x-1">
                              <span className="font-mono text-sm">{opportunity.asset}</span>
                              <Badge variant="outline" className="text-xs">
                                {opportunity.direction}
                              </Badge>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-2">
                          <div>
                            <span className="text-xs text-gray-500 block">Est. Profit:</span>
                            <span className="text-lg font-bold text-green-600">{opportunity.estimatedProfit}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-gray-500 block">Time Window:</span>
                            <span className="text-sm font-medium">{opportunity.timeWindow}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <Card className="bg-white">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3 flex items-center">
                    <BarChart2 className="h-4 w-4 mr-2 text-blue-600" />
                    Market Insights
                  </h3>
                  <div className="space-y-3">
                    {analysis.marketInsights.map((insight: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2 p-2 bg-gray-50 rounded-lg">
                        <Zap className="h-4 w-4 text-amber-500 mt-0.5" />
                        <p className="text-sm">{insight}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-4">
              <Card className="bg-white">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3 flex items-center">
                    <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
                    Optimization Suggestions
                  </h3>
                  <div className="space-y-3">
                    {analysis.suggestions.map((suggestion: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2 p-2 bg-gray-50 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <p className="text-sm">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
