import type { ClimateStation, Alert } from './types'

export const mockClimateStations: ClimateStation[] = [
  {
    id: '1',
    name: 'Estación Norte',
    location: 'Campo Principal',
    latitude: -25.2637,
    longitude: -57.5750,
    altitude: 150,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Estación Sur',
    location: 'Zona de Cultivos',
    latitude: -25.2950,
    longitude: -57.5850,
    altitude: 180,
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    name: 'Estación Este',
    location: 'Sector Invernaderos',
    latitude: -25.2500,
    longitude: -57.5500,
    altitude: 165,
    createdAt: new Date('2024-02-01'),
  },
]

export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'warning',
    message: 'Humedad relativa baja detectada',
    stationId: '1',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '2',
    type: 'critical',
    message: 'Temperatura extrema en invernadero',
    stationId: '2',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
]

export const mockDashboardData = {
  totalStations: 3,
  activeAlerts: 2,
  avgTemperature: 24.5,
  avgHumidity: 68,
  soilMoisture: [
    { zone: 'Zona A', moisture: 65 },
    { zone: 'Zona B', moisture: 72 },
    { zone: 'Zona C', moisture: 58 },
  ],
  cropHealth: [
    { crop: 'Tomate', health: 'Excelente', percentage: 92 },
    { crop: 'Lechuga', health: 'Buena', percentage: 85 },
    { crop: 'Pepino', health: 'Regular', percentage: 72 },
  ],
  greenhouseStatus: [
    { name: 'Invernadero A', status: 'Active', temperature: 25 },
    { name: 'Invernadero B', status: 'Active', temperature: 23 },
  ],
}
