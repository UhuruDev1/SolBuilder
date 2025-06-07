"use client"

import { useState, useEffect } from "react"
import { LandingPage } from "@/components/landing-page"
import { MainApp } from "@/components/main-app"
import { Preloader } from "@/components/preloader"

export default function SolanaAIBuilder() {
  const [isLoading, setIsLoading] = useState(true)
  const [showLanding, setShowLanding] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <Preloader />
  }

  if (showLanding) {
    return <LandingPage onEnterApp={() => setShowLanding(false)} />
  }

  return <MainApp />
}
