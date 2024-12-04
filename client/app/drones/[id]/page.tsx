import { Navbar } from "@/components/Navbar";
import { DroneFeed } from "@/components/drone-feed";

export default async function DronePage({ params }: { params: { id: string } }) {
  const { id } = await params; 

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="mx-auto max-w-7xl p-4">
        <div className="rounded-xl border bg-card text-card-foreground p-6 shadow-sm">
          <Navbar />
          <DroneFeed droneId={id} />
        </div>
      </div>
    </div>
  );
}
