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
  Search,
  MoreVertical,
  ChevronRight,
  Wifi,
  WifiOff,
  AlertTriangle,
  Clock,
  TrendingUp,
  Leaf,
  Plus,
  Edit2,
  Trash2,
  X,
  Radio,
  Mountain,
  Save,
  List,
  Grid3X3
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

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

interface Station {
  id: string
  name: string
  location: string
  lat: number
  lng: number
  altitude: number
  status: 'online' | 'offline'
  temperature: number
  humidity: number
  windSpeed: number
  soilMoisture: number
  solarRadiation: number
  lastUpdate: string
  batteryLevel: number
  alerts: number
  crop: string
  area: string
  createdAt: string
}

// Initial station data
const initialStations: Station[] = [
  {
    id: '1',
    name: 'Estacion Norte',
    location: 'Campo Principal',
    lat: -25.2637,
    lng: -57.5750,
    altitude: 120,
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
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Estacion Sur',
    location: 'Zona de Cultivos',
    lat: -25.2950,
    lng: -57.5850,
    altitude: 95,
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
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'Estacion Este',
    location: 'Sector Invernaderos',
    lat: -25.2500,
    lng: -57.5500,
    altitude: 110,
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
    createdAt: '2024-03-10',
  },
  {
    id: '4',
    name: 'Estacion Oeste',
    location: 'Parcela Nueva',
    lat: -25.2700,
    lng: -57.6000,
    altitude: 85,
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
    createdAt: '2024-04-05',
  },
]

// Irrigation zones
const irrigationZones = [
  { id: 'A', lat: -25.2600, lng: -57.5700, radius: 300, status: 'active', color: '#22c55e' },
  { id: 'B', lat: -25.2900, lng: -57.5800, radius: 250, status: 'scheduled', color: '#3b82f6' },
  { id: 'C', lat: -25.2550, lng: -57.5550, radius: 200, status: 'inactive', color: '#6b7280' },
  { id: 'D', lat: -25.2750, lng: -57.5950, radius: 280, status: 'active', color: '#22c55e' },
]

const emptyStation: Omit<Station, 'id' | 'createdAt'> = {
  name: '',
  location: '',
  lat: -25.2700,
  lng: -57.5750,
  altitude: 100,
  status: 'online',
  temperature: 0,
  humidity: 0,
  windSpeed: 0,
  soilMoisture: 0,
  solarRadiation: 0,
  lastUpdate: 'Ahora',
  batteryLevel: 100,
  alerts: 0,
  crop: '',
  area: '',
}

export default function StationsMapPage() {
  const [stations, setStations] = useState<Station[]>(initialStations)
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showZones, setShowZones] = useState(true)
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline'>('all')
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')
  
  // CRUD state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingStation, setEditingStation] = useState<Station | null>(null)
  const [formData, setFormData] = useState(emptyStation)

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

  // CRUD handlers
  const handleCreate = () => {
    const newStation: Station = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    }
    setStations([...stations, newStation])
    setIsCreateDialogOpen(false)
    setFormData(emptyStation)
  }

  const handleEdit = () => {
    if (!editingStation) return
    setStations(stations.map(s => 
      s.id === editingStation.id ? { ...editingStation, ...formData } : s
    ))
    setIsEditDialogOpen(false)
    setEditingStation(null)
    setFormData(emptyStation)
    if (selectedStation?.id === editingStation.id) {
      setSelectedStation({ ...editingStation, ...formData })
    }
  }

  const handleDelete = () => {
    if (!editingStation) return
    setStations(stations.filter(s => s.id !== editingStation.id))
    setIsDeleteDialogOpen(false)
    if (selectedStation?.id === editingStation.id) {
      setSelectedStation(null)
    }
    setEditingStation(null)
  }

  const openEditDialog = (station: Station) => {
    setEditingStation(station)
    setFormData({
      name: station.name,
      location: station.location,
      lat: station.lat,
      lng: station.lng,
      altitude: station.altitude,
      status: station.status,
      temperature: station.temperature,
      humidity: station.humidity,
      windSpeed: station.windSpeed,
      soilMoisture: station.soilMoisture,
      solarRadiation: station.solarRadiation,
      lastUpdate: station.lastUpdate,
      batteryLevel: station.batteryLevel,
      alerts: station.alerts,
      crop: station.crop,
      area: station.area,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (station: Station) => {
    setEditingStation(station)
    setIsDeleteDialogOpen(true)
  }

  const StationForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs font-medium">Nombre</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nombre de la estacion"
            className="h-9"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location" className="text-xs font-medium">Ubicacion</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Ubicacion"
            className="h-9"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lat" className="text-xs font-medium">Latitud</Label>
          <Input
            id="lat"
            type="number"
            step="0.0001"
            value={formData.lat}
            onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
            className="h-9"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lng" className="text-xs font-medium">Longitud</Label>
          <Input
            id="lng"
            type="number"
            step="0.0001"
            value={formData.lng}
            onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
            className="h-9"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="altitude" className="text-xs font-medium">Altitud (m)</Label>
          <Input
            id="altitude"
            type="number"
            value={formData.altitude}
            onChange={(e) => setFormData({ ...formData, altitude: parseInt(e.target.value) })}
            className="h-9"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="crop" className="text-xs font-medium">Cultivo</Label>
          <Input
            id="crop"
            value={formData.crop}
            onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
            placeholder="Tipo de cultivo"
            className="h-9"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="area" className="text-xs font-medium">Area</Label>
          <Input
            id="area"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            placeholder="Ej: 2.5 ha"
            className="h-9"
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border flex-shrink-0">
        <div>
          <h1 className="text-sm font-semibold text-foreground">Estaciones</h1>
          <p className="text-xs text-muted-foreground">Gestion y monitoreo de sensores</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center border border-border rounded-lg p-0.5 bg-muted/50">
            <Button
              variant={viewMode === 'map' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('map')}
              className="h-7 px-2.5 text-xs"
            >
              <MapPin className="h-3.5 w-3.5 mr-1" />
              Mapa
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-7 px-2.5 text-xs"
            >
              <Grid3X3 className="h-3.5 w-3.5 mr-1" />
              Grid
            </Button>
          </div>
          
          {/* Status badges */}
          <div className="hidden sm:flex items-center gap-2">
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
                {alertsCount}
              </div>
            )}
          </div>
          
          {/* Add Station Button */}
          <Button 
            size="sm" 
            className="h-8 text-xs"
            onClick={() => {
              setFormData(emptyStation)
              setIsCreateDialogOpen(true)
            }}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Nueva Estacion
          </Button>
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
                Todas ({stations.length})
              </Button>
              <Button
                variant={filterStatus === 'online' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('online')}
                className="h-7 text-xs flex-1"
              >
                Online ({onlineCount})
              </Button>
              <Button
                variant={filterStatus === 'offline' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('offline')}
                className="h-7 text-xs flex-1"
              >
                Offline ({offlineCount})
              </Button>
            </div>
          </div>

          {/* Station List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredStations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Radio className="h-10 w-10 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">No se encontraron estaciones</p>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => {
                    setSearchQuery('')
                    setFilterStatus('all')
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            ) : (
              filteredStations.map((station) => (
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
                    <div className="flex items-center gap-1">
                      {station.alerts > 0 && (
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs">
                          {station.alerts}
                        </span>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreVertical className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            openEditDialog(station)
                          }}>
                            <Edit2 className="h-3.5 w-3.5 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              openDeleteDialog(station)
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
                      <Mountain className="h-3 w-3 text-accent" />
                      <span className="font-medium text-foreground">{station.altitude}m</span>
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
              ))
            )}
          </div>
        </div>

        {/* Main Content Area */}
        {viewMode === 'map' ? (
          /* Map View */
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
                            <div>Altitud: {station.altitude}m</div>
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
        ) : (
          /* Grid View */
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredStations.map((station) => (
                <Card
                  key={station.id}
                  className={`p-4 cursor-pointer transition-all border hover:shadow-md ${
                    selectedStation?.id === station.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedStation(station)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${
                        station.status === 'online' ? 'bg-primary/10' : 'bg-muted'
                      }`}>
                        <Radio className={`h-5 w-5 ${
                          station.status === 'online' ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{station.name}</h3>
                        <p className="text-xs text-muted-foreground">{station.location}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          openEditDialog(station)
                        }}>
                          <Edit2 className="h-3.5 w-3.5 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            openDeleteDialog(station)
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      station.status === 'online' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {station.status === 'online' ? 'En linea' : 'Desconectado'}
                    </span>
                    {station.alerts > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                        {station.alerts} alertas
                      </span>
                    )}
                  </div>

                  {/* Sensors Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <Thermometer className="h-4 w-4 text-destructive" />
                      <div>
                        <p className="text-xs text-muted-foreground">Temp</p>
                        <p className="text-sm font-semibold text-foreground">{station.temperature}°C</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <Droplets className="h-4 w-4 text-secondary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Humedad</p>
                        <p className="text-sm font-semibold text-foreground">{station.humidity}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <Wind className="h-4 w-4 text-accent" />
                      <div>
                        <p className="text-xs text-muted-foreground">Viento</p>
                        <p className="text-sm font-semibold text-foreground">{station.windSpeed} km/h</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <Mountain className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Altitud</p>
                        <p className="text-sm font-semibold text-foreground">{station.altitude}m</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Leaf className="h-3 w-3 text-primary" />
                      {station.crop} - {station.area}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Hace {station.lastUpdate}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

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
              <div className="flex items-center gap-1">
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
                    <DropdownMenuItem onClick={() => openEditDialog(selectedStation)}>
                      <Edit2 className="h-3.5 w-3.5 mr-2" />
                      Editar estacion
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={() => openDeleteDialog(selectedStation)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setSelectedStation(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
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

              {/* Location Info */}
              <Card className="p-3 border-border">
                <h3 className="text-xs font-semibold text-foreground mb-3">Ubicacion</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-[10px] text-muted-foreground">Latitud</p>
                    <p className="text-xs font-medium text-foreground">{selectedStation.lat.toFixed(4)}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-[10px] text-muted-foreground">Longitud</p>
                    <p className="text-xs font-medium text-foreground">{selectedStation.lng.toFixed(4)}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-[10px] text-muted-foreground">Altitud</p>
                    <p className="text-xs font-medium text-foreground">{selectedStation.altitude}m</p>
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

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Plus className="h-4 w-4 text-primary" />
              </div>
              Nueva Estacion
            </DialogTitle>
            <DialogDescription>
              Agrega una nueva estacion de monitoreo al sistema.
            </DialogDescription>
          </DialogHeader>
          <StationForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={!formData.name || !formData.location}>
              <Save className="h-4 w-4 mr-2" />
              Crear Estacion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Edit2 className="h-4 w-4 text-primary" />
              </div>
              Editar Estacion
            </DialogTitle>
            <DialogDescription>
              Modifica los datos de la estacion {editingStation?.name}.
            </DialogDescription>
          </DialogHeader>
          <StationForm isEdit />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEdit}>
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Estacion</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estas seguro de que deseas eliminar la estacion <strong>{editingStation?.name}</strong>? 
              Esta accion no se puede deshacer y se perderan todos los datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
