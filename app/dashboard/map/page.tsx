'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { 
  MapPin, 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  Activity,
  Layers,
  ZoomIn,
  ZoomOut,
  Locate,
  Filter,
  Search,
  MoreVertical,
  ChevronRight,
  Wifi,
  WifiOff,
  AlertTriangle,
  Clock,
  TrendingUp,
  Leaf
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

// Dynamic import for Leaflet to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)
const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
)

// Station data with more details
const stations = [
  {
    id: '1',
    name: 'Estacion Norte',
    location: 'Campo Principal',
    lat: -25.2637,
    lng: -57.5750,
    status: 'online',
    temperature: 24.5,
    humidity: 68,
    windSpeed: 12,
    soilMoisture: 65,
    solarRadiation: 850,
    lastUpdate: '2 min',
    batteryLevel: 92,
    alerts: 0,
    crop: 'Tomate',
    area: '2.5 ha',
  },
  {
    id: '2',
    name: 'Estacion Sur',
    location: 'Zona de Cultivos',
    lat: -25.2950,
    lng: -57.5850,
    status: 'online',
    temperature: 26.2,
    humidity: 62,
    windSpeed: 8,
    soilMoisture: 72,
    solarRadiation: 920,
    lastUpdate: '5 min',
    batteryLevel: 78,
    alerts: 1,
    crop: 'Lechuga',
    area: '1.8 ha',
  },
  {
    id: '3',
    name: 'Estacion Este',
    location: 'Sector Invernaderos',
    lat: -25.2500,
    lng: -57.5500,
    status: 'offline',
    temperature: 23.1,
    humidity: 75,
    windSpeed: 5,
    soilMoisture: 58,
    solarRadiation: 780,
    lastUpdate: '15 min',
    batteryLevel: 45,
    alerts: 2,
    crop: 'Pepino',
    area: '1.2 ha',
  },
  {
    id: '4',
    name: 'Estacion Oeste',
    location: 'Parcela Nueva',
    lat: -25.2700,
    lng: -57.6000,
    status: 'online',
    temperature: 25.8,
    humidity: 70,
    windSpeed: 15,
    soilMoisture: 68,
    solarRadiation: 890,
    lastUpdate: '1 min',
    batteryLevel: 100,
    alerts: 0,
    crop: 'Pimiento',
    area: '0.9 ha',
  },
]

// Irrigation zones
const irrigationZones = [
  { id: 'A', lat: -25.2600, lng: -57.5700, radius: 300, status: 'active', color: '#22c55e' },
  { id: 'B', lat: -25.2900, lng: -57.5800, radius: 250, status: 'scheduled', color: '#3b82f6' },
  { id: 'C', lat: -25.2550, lng: -57.5550, radius: 200, status: 'inactive', color: '#6b7280' },
  { id: 'D', lat: -25.2750, lng: -57.5950, radius: 280, status: 'active', color: '#22c55e' },
]

export default function MapPage() {
  const [selectedStation, setSelectedStation] = useState<typeof stations[0] | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showZones, setShowZones] = useState(true)
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline'>('all')

  useEffect(() => {
    setMapReady(true)
  }, [])

  const filteredStations = stations.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          station.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || station.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const onlineCount = stations.filter(s => s.status === 'online').length
  const offlineCount = stations.filter(s => s.status === 'offline').length
  const alertsCount = stations.reduce((acc, s) => acc + s.alerts, 0)

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Mapa de Estaciones</h1>
              <p className="text-xs text-muted-foreground">Monitoreo en tiempo real de sensores</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {onlineCount} Online
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
            {offlineCount} Offline
          </div>
          {alertsCount > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
              <AlertTriangle className="h-3 w-3" />
              {alertsCount} Alertas
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Station List */}
        <div className="w-80 border-r border-border flex flex-col bg-card/50 flex-shrink-0">
          {/* Search and Filter */}
          <div className="p-3 border-b border-border space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar estacion..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-background border-border"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
                className="h-7 text-xs flex-1"
              >
                Todas
              </Button>
              <Button
                variant={filterStatus === 'online' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('online')}
                className="h-7 text-xs flex-1"
              >
                Online
              </Button>
              <Button
                variant={filterStatus === 'offline' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('offline')}
                className="h-7 text-xs flex-1"
              >
                Offline
              </Button>
            </div>
          </div>

          {/* Station List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredStations.map((station) => (
              <Card
                key={station.id}
                className={`p-3 cursor-pointer transition-all border ${
                  selectedStation?.id === station.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-card'
                }`}
                onClick={() => setSelectedStation(station)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${
                      station.status === 'online' ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      {station.status === 'online' ? (
                        <Wifi className="h-4 w-4 text-primary" />
                      ) : (
                        <WifiOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{station.name}</h3>
                      <p className="text-xs text-muted-foreground">{station.location}</p>
                    </div>
                  </div>
                  {station.alerts > 0 && (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs">
                      {station.alerts}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Thermometer className="h-3 w-3 text-destructive" />
                    <span className="font-medium text-foreground">{station.temperature}°C</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Droplets className="h-3 w-3 text-secondary" />
                    <span className="font-medium text-foreground">{station.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Wind className="h-3 w-3 text-accent" />
                    <span className="font-medium text-foreground">{station.windSpeed} km/h</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Leaf className="h-3 w-3 text-primary" />
                    {station.crop} - {station.area}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {station.lastUpdate}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          {mapReady && (
            <>
              <MapContainer
                center={[-25.2700, -57.5750]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Irrigation Zones */}
                {showZones && irrigationZones.map((zone) => (
                  <Circle
                    key={zone.id}
                    center={[zone.lat, zone.lng]}
                    radius={zone.radius}
                    pathOptions={{
                      color: zone.color,
                      fillColor: zone.color,
                      fillOpacity: 0.2,
                      weight: 2,
                    }}
                  />
                ))}

                {/* Station Markers */}
                {filteredStations.map((station) => (
                  <Marker
                    key={station.id}
                    position={[station.lat, station.lng]}
                    eventHandlers={{
                      click: () => setSelectedStation(station),
                    }}
                  >
                    <Popup>
                      <div className="p-1 min-w-[200px]">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${
                            station.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                          <span className="font-semibold text-sm">{station.name}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>Temp: {station.temperature}°C</div>
                          <div>Humedad: {station.humidity}%</div>
                          <div>Viento: {station.windSpeed} km/h</div>
                          <div>Suelo: {station.soilMoisture}%</div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>

              {/* Map Controls */}
              <div className="absolute top-3 right-3 flex flex-col gap-2 z-[1000]">
                <Card className="p-1 shadow-lg">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Locate className="h-4 w-4" />
                  </Button>
                </Card>
                <Card className="p-1 shadow-lg">
                  <Button 
                    variant={showZones ? 'default' : 'ghost'} 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setShowZones(!showZones)}
                  >
                    <Layers className="h-4 w-4" />
                  </Button>
                </Card>
              </div>

              {/* Legend */}
              <Card className="absolute bottom-3 left-3 p-3 shadow-lg z-[1000] bg-card/95 backdrop-blur">
                <h4 className="text-xs font-semibold text-foreground mb-2">Leyenda</h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-muted-foreground">Zona Activa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-muted-foreground">Programada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500" />
                    <span className="text-muted-foreground">Inactiva</span>
                  </div>
                </div>
              </Card>
            </>
          )}

          {/* Leaflet CSS */}
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
            integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
            crossOrigin=""
          />
        </div>

        {/* Details Panel */}
        {selectedStation && (
          <div className="w-80 border-l border-border bg-card/50 flex flex-col flex-shrink-0">
            <div className="p-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${
                  selectedStation.status === 'online' ? 'bg-primary/10' : 'bg-muted'
                }`}>
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">{selectedStation.name}</h2>
                  <p className="text-xs text-muted-foreground">{selectedStation.location}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Ver historial</DropdownMenuItem>
                  <DropdownMenuItem>Configurar alertas</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Editar estacion</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {/* Status */}
              <Card className="p-3 border-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-muted-foreground">Estado</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    selectedStation.status === 'online' 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {selectedStation.status === 'online' ? 'En linea' : 'Desconectado'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Bateria</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            selectedStation.batteryLevel > 50 ? 'bg-primary' :
                            selectedStation.batteryLevel > 20 ? 'bg-accent' : 'bg-destructive'
                          }`}
                          style={{ width: `${selectedStation.batteryLevel}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-foreground">{selectedStation.batteryLevel}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Ultima actualizacion</p>
                    <p className="text-sm font-medium text-foreground mt-1">Hace {selectedStation.lastUpdate}</p>
                  </div>
                </div>
              </Card>

              {/* Sensors */}
              <Card className="p-3 border-border">
                <h3 className="text-xs font-semibold text-foreground mb-3">Sensores</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-destructive/10">
                        <Thermometer className="h-4 w-4 text-destructive" />
                      </div>
                      <span className="text-sm text-muted-foreground">Temperatura</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{selectedStation.temperature}°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-secondary/10">
                        <Droplets className="h-4 w-4 text-secondary" />
                      </div>
                      <span className="text-sm text-muted-foreground">Humedad</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{selectedStation.humidity}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-accent/10">
                        <Wind className="h-4 w-4 text-accent" />
                      </div>
                      <span className="text-sm text-muted-foreground">Viento</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{selectedStation.windSpeed} km/h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <Droplets className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">Humedad Suelo</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{selectedStation.soilMoisture}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-yellow-500/10">
                        <Sun className="h-4 w-4 text-yellow-500" />
                      </div>
                      <span className="text-sm text-muted-foreground">Radiacion Solar</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{selectedStation.solarRadiation} W/m2</span>
                  </div>
                </div>
              </Card>

              {/* Crop Info */}
              <Card className="p-3 border-border">
                <h3 className="text-xs font-semibold text-foreground mb-3">Cultivo</h3>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Leaf className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{selectedStation.crop}</p>
                    <p className="text-xs text-muted-foreground">Area: {selectedStation.area}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="h-9 text-xs">
                  <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                  Ver graficos
                </Button>
                <Button variant="default" size="sm" className="h-9 text-xs">
                  <Droplets className="h-3.5 w-3.5 mr-1.5" />
                  Activar riego
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
