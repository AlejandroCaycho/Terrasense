export interface ClimateStation {
  id: string
  name: string
  location: string
  latitude: number
  longitude: number
  altitude: number
  createdAt: Date
}

export interface User {
  id: string
  email: string
  name: string
}

export interface Alert {
  id: string
  type: 'warning' | 'critical' | 'info'
  message: string
  stationId: string
  createdAt: Date
}
