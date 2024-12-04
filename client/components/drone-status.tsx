interface DroneStatusProps {
    busy: number
    available: number
  }
  
  export function DroneStatus({ busy, available }: DroneStatusProps) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <span>{busy} Busy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span>{available} Available</span>
        </div>
      </div>
    )
  }
  
  