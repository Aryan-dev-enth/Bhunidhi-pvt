import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BlockchainRecordProps {
  data: any
}

export function BlockchainRecord({ data }: BlockchainRecordProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Blockchain Record</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-muted-foreground flex flex-wrap justify-between items-center">
        {/* Property Information */}
        <div className="w-full md:w-1/2 pr-4">
          <div>
            <span className="font-medium">Property ID: </span>
            <span>{data.propertyId}</span>
          </div>
          <div>
            <span className="font-medium">Metadata Hash: </span>
            <span className="font-mono">{data.metadataHash}</span>
          </div>
          <div>
            <span className="font-medium">Regional Area ID: </span>
            <span>{data.regionalAreaId}</span>
          </div>
          <div>
            <span className="font-medium">Coordinates: </span>
            <span>{data.latitude}, {data.longitude}</span>
          </div>
          <div>
            <span className="font-medium">Number of Floors: </span>
            <span>{data.numberOfFloors}</span>
          </div>
          <div>
            <span className="font-medium">Total Area: </span>
            <span>{data.totalArea} sq m</span>
          </div>
          <div>
            <span className="font-medium">Dimensions: </span>
            <span>{data.height}m x {data.width}m</span>
          </div>
        </div>

        {/* Placeholder Image */}
        <div className="w-full md:w-1/3 flex justify-center mb-4 md:mb-0">
          <img 
            src={data.imageUrl || "/placeholder.png"} 
            alt="Property Image" 
            className="w-full h-auto max-w-xs rounded-lg shadow-md"
          />
        </div>
      </CardContent>
    </Card>
  )
}
