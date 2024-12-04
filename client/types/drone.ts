export interface DroneStatus {
    id: number
    status: 'Busy' | 'Available'
    batteryLevel: number
    currentSurvey?: {
      location: string
      region: string
      progress: number
    }
  }
  
  export interface SurveyData {
    frontView: string
    topView: string
    telemetry: {
      altitude: number
      speed: number
      battery: number
      signal: number
    }
    coordinates: {
      lat: number
      lng: number
    }
  }
  
  export interface BlockchainData {
    transactionHash: string
    timestamp: number
    surveyData: {
      location: string
      findings: string
      imageHashes: string[]
    }
  }
  
  