import { DroneCard } from "./drone-card"
// import type { DroneStatus } from "@/types/drone"

// const drones: DroneStatus[] = [
//   {
//     id: 1,
//     status: 'Busy',
//     batteryLevel: 75,
//     currentSurvey: {
//       location: 'Sonipat',
//       region: 'Haryana',
//       progress: 45
//     }
//   },
//   {
//     id: 2,
//     status: 'Available',
//     batteryLevel: 90
//   },
//   {
//     id: 3,
//     status: 'Available',
//     batteryLevel: 85
//   },
//   {
//     id: 4,
//     status: 'Busy',
//     batteryLevel: 60,
//     currentSurvey: {
//       location: 'Delhi',
//       region: 'NCR',
//       progress: 80
//     }
//   },
//   {
//     id: 5,
//     status: 'Busy',
//     batteryLevel: 30,
//     currentSurvey: {
//       location: 'Noida',
//       region: 'UP',
//       progress: 95
//     }
//   }
// ]

export function DroneList({drones}: any) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {drones.map((drone:any) => (
          <DroneCard key={drone.id} drone={drone} />
        ))}
      </div>
    </div>
  )
}

