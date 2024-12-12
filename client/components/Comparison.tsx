import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ComparisonReportProps {
  report: any
}

export function ComparisonReport({ report }: ComparisonReportProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparison Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Height</h3>
          <p>{report.height}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Width</h3>
          <p>{report.width}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Area</h3>
          <p>{report.area}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Building Description</h3>
          <p>{report.description}</p>
        </div>
        {report.discrepancies.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-red-500">Major Discrepancies</h3>
            <ul className="list-disc pl-5">
              {report.discrepancies.map((discrepancy: string, index: number) => (
                <li key={index}>{discrepancy}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

