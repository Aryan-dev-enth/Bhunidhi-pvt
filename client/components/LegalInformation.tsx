import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function LegalInformation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Legal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Terms and Conditions</h3>
          <p>This report is based on AI analysis and blockchain data. The information provided is for informational purposes only and should not be considered as legal advice. Please consult with a legal professional for any legal matters.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Data Accuracy</h3>
          <p>While we strive for accuracy, the data presented in this report is tentative and subject to verification. Minor discrepancies between AI analysis and blockchain data may be present and are not necessarily indicative of errors.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Disclaimer</h3>
          <p>The use of this report is subject to our full terms and conditions, which can be found on our website. By using this report, you agree to these terms and conditions.</p>
        </div>
      </CardContent>
    </Card>
  )
}

