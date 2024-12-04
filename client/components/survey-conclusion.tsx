'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Loader2, Zap } from 'lucide-react'
import type { BlockchainData } from "@/types/drone"

interface SurveyConclusionProps {
  droneId: string
}

const Particle = ({ index }: { index: number }) => (
  <motion.div
    className="absolute w-1 h-1 bg-primary rounded-full"
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      delay: index * 0.1,
    }}
  />
)

export function SurveyConclusion({ droneId }: SurveyConclusionProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiResponse, setAiResponse] = useState<string>('')
  const [blockchainData, setBlockchainData] = useState<BlockchainData | null>(null)
  const [particles, setParticles] = useState<number[]>([])

  useEffect(() => {
    setParticles(Array.from({ length: 20 }, (_, i) => i))
  }, [])

  const generateConclusion = async () => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setAiResponse("Based on the survey data, the land appears to be suitable for agricultural purposes. The soil composition shows good fertility levels, and the terrain has proper drainage. No significant obstacles or hazards were detected. Recommended for cultivation of wheat and rice crops.")
    setIsGenerating(false)
  }

  const submitToBlockchain = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    setBlockchainData({
      transactionHash: '0x123...abc',
      timestamp: Date.now(),
      surveyData: {
        location: 'Sonipat',
        findings: aiResponse,
        imageHashes: [
          'Qm...123',
          'Qm...456'
        ]
      }
    })
  }

  return (
    <div className="space-y-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        {particles.map((_, index) => (
          <Particle key={index} index={index} />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between relative z-10"
      >
        <h2 className="text-xl font-semibold">Survey Conclusion - Drone {droneId}</h2>
      </motion.div>

      <AnimatePresence>
        <motion.div
          key="ai-analysis"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 bg-gradient-to-br from-secondary to-background border-primary/20 shadow-lg relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <h3 className="text-lg font-medium flex items-center">
                <Zap className="mr-2 text-primary" />
                AI Analysis
              </h3>
              {!aiResponse ? (
                <Button 
                  onClick={generateConclusion} 
                  disabled={isGenerating}
                  className="bg-primary hover:bg-primary/90 relative overflow-hidden group"
                >
                  <span className="relative z-10">
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate AI Conclusion'
                    )}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg bg-muted p-4 relative overflow-hidden"
                >
                  <p className="text-muted-foreground relative z-10">{aiResponse}</p>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 animate-pulse" />
                </motion.div>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 animate-pulse" />
          </Card>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {aiResponse && !blockchainData && (
          <motion.div
            key="blockchain-submit"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6 bg-gradient-to-br from-secondary to-background border-primary/20 shadow-lg relative overflow-hidden">
              <div className="space-y-4 relative z-10">
                <h3 className="text-lg font-medium flex items-center">
                  <svg className="mr-2 h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Submit to Blockchain
                </h3>
                <Button 
                  onClick={submitToBlockchain}
                  className="bg-primary hover:bg-primary/90 relative overflow-hidden group"
                >
                  <span className="relative z-10">Submit Survey Data</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 animate-pulse" />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {blockchainData && (
          <motion.div
            key="blockchain-record"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-6 bg-gradient-to-br from-secondary to-background border-primary/20 shadow-lg relative overflow-hidden">
              <div className="space-y-4 relative z-10">
                <h3 className="text-lg font-medium flex items-center">
                  <svg className="mr-2 h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Blockchain Record
                </h3>
                <div className="space-y-2 text-muted-foreground">
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                    <span className="font-medium">Transaction Hash: </span>
                    <span className="font-mono">{blockchainData.transactionHash}</span>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                    <span className="font-medium">Timestamp: </span>
                    <span>{new Date(blockchainData.timestamp).toLocaleString()}</span>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                    <span className="font-medium">Location: </span>
                    <span>{blockchainData.surveyData.location}</span>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                    <span className="font-medium">Image Hashes: </span>
                    <div className="font-mono text-sm">
                      {blockchainData.surveyData.imageHashes.map((hash, index) => (
                        <div key={index}>{hash}</div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 animate-pulse" />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

