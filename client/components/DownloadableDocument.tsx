import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from 'lucide-react'

interface DownloadableDocumentProps {
  report: any
}

export function DownloadableDocument({ report }: DownloadableDocumentProps) {
  const generateDocument = () => {
    const content = `
Building Survey Comparison Report

Generated on: ${new Date().toLocaleString()}

AI Analysis:
Date of Analysis: ${new Date().toLocaleDateString()}
AI Model Used: Advanced Building Recognition v2.0
Image Processing Time: 3.2 seconds

Blockchain Data:
Data Timestamp: ${report.blockchainTimestamp}
Block Number: ${report.blockNumber}
Transaction Hash: ${report.transactionHash}

Comparison Results:

Height:
  AI Analysis: ${report.aiHeight} m
  Blockchain Data: ${report.blockchainHeight} m
  Discrepancy: ${report.height}

Width:
  AI Analysis: ${report.aiWidth} m
  Blockchain Data: ${report.blockchainWidth} m
  Discrepancy: ${report.width}

Area:
  AI Analysis: ${report.aiArea} sq m
  Blockchain Data: ${report.blockchainArea} sq m
  Discrepancy: ${report.area}

Building Description:
${report.description}

Major Discrepancies:
${report.discrepancies.join('\n')}

Overall Discrepancy Percentage: ${report.discrepancyPercentage}%

This report is generated automatically based on AI analysis and blockchain data. 
For official verification, please contact the Municipal Corporation of Delhi.
    `

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'building_survey_comparison_report.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Download Detailed Report</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={generateDocument}>
          <Download className="mr-2 h-4 w-4" />
          Download Full Report
        </Button>
      </CardContent>
    </Card>
  )
}

