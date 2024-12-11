'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Zap } from 'lucide-react'
import type { BlockchainData } from "@/types/drone";
import axios from 'axios'

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    setParticles(Array.from({ length: 20 }, (_, i) => i))
  }, [])

  const generateConclusion = async () => {
    if (!selectedFile) {
      alert('Please select a file before proceeding.');
      return;
    }

    setIsGenerating(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_IMAGE_PROCESS}/process-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response);

      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }
      
      console.log(response.data[0]);
      console.log(response.data[1]);
      setAiResponse(response.data);
    } catch (error) {
      console.error('Error:', error);
      setAiResponse('An error occurred while processing the image.');
    } finally {
      setIsGenerating(false);
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

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
        <h2 className="text-3xl font-bold tracking-tight">Survey Conclusion - Drone {droneId}</h2>
      </motion.div>

      <AnimatePresence>
        <motion.div
          key="ai-analysis"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-4 w-4" />
                AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input type="file" onChange={handleFileChange} className="block mb-4" />
              {!aiResponse ? (
                <Button 
                  onClick={generateConclusion} 
                  disabled={isGenerating}
                  className="relative overflow-hidden group"
                >
                  <span className="relative z-10 flex content-center">
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin " />
                        Processing...
                      </>
                    ) : (
                      'Generate AI Conclusion'
                    )}
                  </span>
                </Button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg bg-muted p-4 relative overflow-hidden"
                >
                  <p className="text-muted-foreground relative z-10">{aiResponse}</p>
                </motion.div>
              )}
            </CardContent>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Submit to Blockchain
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button className='z-10 cursor-pointer' onClick={submitToBlockchain}>
                  Submit Survey Data
                </Button>
              </CardContent>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Blockchain Record
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
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
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

