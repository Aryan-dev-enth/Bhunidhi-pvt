'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { AIAnalysis } from './AIAnalysis'
import { BlockchainRecord } from './BlockchainRecord'
import { ComparisonReport } from './Comparison'
import { LegalInformation } from './LegalInformation'
import { generateProperties, compareData } from '@/lib/dataProcessing'

interface SurveyConclusionProps {
  droneId: string
}

export function SurveyConclusion({ droneId }: SurveyConclusionProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiResponse, setAiResponse] = useState<string>('')
  const [blockchainData, setBlockchainData] = useState<any | null>(null)
  const [comparisonReport, setComparisonReport] = useState<any | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoadingBlockchain, setIsLoadingBlockchain] = useState(false)

  const generateConclusion = async () => {
    if (!selectedFile) {
      alert('Please select a file before proceeding.')
      return
    }

    setIsGenerating(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await axios.post(`${process.env.NEXT_PUBLIC_IMAGE_PROCESS}/process-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.status !== 200) {
        throw new Error('Network response was not ok')
      }
      
      setAiResponse(response.data)
    } catch (error) {
      console.error('Error:', error)
      setAiResponse('An error occurred while processing the image.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
    }
  }

  const submitToBlockchain = async () => {
    setIsLoadingBlockchain(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
    
      const data = await fetchBlockchainData()
      setBlockchainData(data.data)
      console.log(data.data)
      const aiProperties = await generateProperties(aiResponse)
      const report = await compareData(data.data, aiProperties)
      setComparisonReport(report)
    } catch (error) {
      console.error('Error submitting to blockchain:', error)
    } finally {
      setIsLoadingBlockchain(false)
    }
  }

  const fetchBlockchainData = async (): Promise<any> => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BLOCKCHAIN}/permit/9819`)
    
    if (!response) {
      throw new Error('Failed to fetch blockchain data')
    }
    console.log(response)
    return response
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Survey Conclusion - Drone {droneId}</h2>

      <AIAnalysis
        selectedFile={selectedFile}
        handleFileChange={handleFileChange}
        generateConclusion={generateConclusion}
        isGenerating={isGenerating}
        aiResponse={aiResponse}
      />

      {aiResponse && !blockchainData && !isLoadingBlockchain && (
        <Card>
          <CardHeader>
            <CardTitle>Submit to Blockchain</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={submitToBlockchain}
              disabled={isLoadingBlockchain}
            >
              {isLoadingBlockchain ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Survey Data'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoadingBlockchain && (
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Submitting to Blockchain...</span>
          </CardContent>
        </Card>
      )}

      {blockchainData && <BlockchainRecord data={blockchainData} />}
      {comparisonReport && <ComparisonReport report={comparisonReport} />}
      <LegalInformation />
      <Button onClick={()=>{
        window.print();

      }}>
        Save Final Report
      </Button>
    </div>
  )
}

