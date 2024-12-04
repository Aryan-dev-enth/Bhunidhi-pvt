import { Navbar } from "@/components/Navbar"
import { SurveyConclusion } from "@/components/survey-conclusion"

export default function ConcludeSurveyPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="mx-auto max-w-7xl p-4">
        <div className="rounded-xl border bg-card text-card-foreground p-6 shadow-sm">
          <Navbar />
          <SurveyConclusion droneId={params.id} />
        </div>
      </div>
    </div>
  )
}
