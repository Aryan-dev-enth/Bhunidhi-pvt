"use client"

import { useState, useEffect } from "react"
import Lottie from "react-lottie"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface EnhancedLoaderProps {
  animationData: any
  messages: string[]
}

export function EnhancedLoader({ animationData, messages }: EnhancedLoaderProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [displayedMessage, setDisplayedMessage] = useState("")

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  }

  useEffect(() => {
    const message = messages[currentMessageIndex]
    let charIndex = 0

    const typingInterval = setInterval(() => {
      if (charIndex <= message.length) {
        setDisplayedMessage(message.slice(0, charIndex))
        charIndex++
      } else {
        clearInterval(typingInterval)
        setTimeout(() => {
          setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length)
        }, 2000) // Wait for 2 seconds before showing the next message
      }
    }, 50) // Adjust typing speed here

    return () => clearInterval(typingInterval)
  }, [currentMessageIndex, messages])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div
            className="relative"
            aria-live="polite"
            aria-busy="true"
          >
            <Lottie options={defaultOptions} height={300} width={300} />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>
          <p 
            className={cn(
              "text-xl font-medium text-center leading-relaxed",
              "animate-pulse transition-opacity duration-1000 ease-in-out"
            )}
          >
            {displayedMessage}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

