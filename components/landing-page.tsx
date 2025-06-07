"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollingBanner } from "@/components/scrolling-banner"
import {
  Zap,
  Code,
  Wallet,
  BarChart2,
  Users,
  Shield,
  ArrowRight,
  Play,
  Github,
  Twitter,
  MessageCircle,
} from "lucide-react"

interface LandingPageProps {
  onEnterApp: () => void
}

export function LandingPage({ onEnterApp }: LandingPageProps) {
  const [isHovered, setIsHovered] = useState(false)

  const features = [
    {
      icon: Code,
      title: "Visual Flow Builder",
      description: "Create complex blockchain flows with drag-and-drop simplicity",
    },
    {
      icon: Wallet,
      title: "Wallet Management",
      description: "Secure on-site wallet creation with QR code funding",
    },
    {
      icon: BarChart2,
      title: "AI-Powered Analysis",
      description: "Groq AI optimization for trading strategies and contracts",
    },
    {
      icon: Shield,
      title: "Secure & Safe",
      description: "Test without risking your primary wallet funds",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Scrolling Banner */}
      <ScrollingBanner />

      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <Zap className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold">Solana AI Builder</span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="hover:text-purple-300 transition-colors">
              Features
            </a>
            <a href="#community" className="hover:text-purple-300 transition-colors">
              Community
            </a>
            <a href="#docs" className="hover:text-purple-300 transition-colors">
              Docs
            </a>
            <Button
              variant="outline"
              className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white transition-all duration-300"
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30">
            🚀 Now with Pump.fun Integration
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Build the Future of
            <br />
            Blockchain Apps
          </h1>

          <p className="text-xl md:text-2xl text-blue-200 mb-8 max-w-3xl mx-auto">
            Create sophisticated wallet flows, trading strategies, and smart contracts with our visual programming
            interface powered by AI
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 text-lg"
              onClick={onEnterApp}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Play className="mr-2 h-5 w-5" />
              Launch Builder
              <ArrowRight className={`ml-2 h-5 w-5 transition-transform ${isHovered ? "translate-x-1" : ""}`} />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white px-8 py-4 text-lg transition-all duration-300"
            >
              <Github className="mr-2 h-5 w-5" />
              View on GitHub
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Everything you need to build, test, and deploy blockchain applications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg w-fit mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-blue-200">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Connect with developers, share strategies, and get support
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Forum</h3>
              <p className="text-blue-200 mb-4">Discuss strategies and get help from the community</p>
              <Button
                variant="outline"
                className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white transition-all duration-300"
              >
                Join Forum
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Live Chat</h3>
              <p className="text-blue-200 mb-4">Real-time support and community interaction</p>
              <Button
                variant="outline"
                className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white transition-all duration-300"
              >
                Open Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Twitter className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Social</h3>
              <p className="text-blue-200 mb-4">Follow us for updates and announcements</p>
              <Button
                variant="outline"
                className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white transition-all duration-300"
              >
                Follow Us
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-white/20">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <Zap className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold">Solana AI Builder</span>
          </div>

          <div className="flex items-center space-x-6">
            <a href="#" className="text-blue-200 hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors">
              Support
            </a>
          </div>
        </div>

        <div className="text-center mt-8 pt-8 border-t border-white/10">
          <p className="text-blue-300">© 2024 Solana AI Builder. Built for the future of blockchain development.</p>
        </div>
      </footer>
    </div>
  )
}
