'use client'

import React, { useState } from 'react'
import { 
  Droplets, 
  Power, 
  Clock, 
  Calendar,
  Timer,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Thermometer,
  Sun,
  Cloud,
  Activity,
  ChevronRight,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  History,
  Target,
  Gauge
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Irrigation zones data
const initialZones = [
  {
    id: 'A',
    name: 'Zona Norte',
    crop: 'Tomate',
    area: '2.5 ha',
    status: 'active',
    isRunning: true,
    soilMoisture: 65,
    targetMoisture: 70,
    lastIrrigation: '2h ago',
    nextIrrigation: '4h',
    duration: 45,
    remainingTime: 28,
    waterUsage: 1250,
    efficiency: 94,
    schedule: '06:00, 18:00',
    valveStatus: 'open',
  },
  {
    id: 'B',
    name: 'Zona Sur',
    crop: 'Lechuga',
    area: '1.8 ha',
    status: 'scheduled',
    isRunning: false,
    soilMoisture: 72,
    targetMoisture: 75,
    lastIrrigation: '5h ago',
    nextIrrigation: '1h',
    duration: 30,
    remainingTime: 0,
    waterUsage: 980,
    efficiency: 91,
    schedule: '07:00, 19:00',
    valveStatus: 'closed',
  },
  {
    id: 'C',
    name: 'Zona Este',
    crop: 'Pepino',
    area: '1.2 ha',
    status: 'warning',
    isRunning: false,
    soilMoisture: 48,
    targetMoisture: 65,
    lastIrrigation: '12h ago',
    nextIrrigation: '30m',
    duration: 60,
    remainingTime: 0,
    waterUsage: 750,
    efficiency: 88,
    schedule: '05:30, 17:30',
    valveStatus: 'closed',
  },
  {
    id: 'D',
    name: 'Zona Oeste',
    crop: 'Pimiento',
    area: '0.9 ha',
    status: 'optimal',
    isRunning: false,
    soilMoisture: 68,
    targetMoisture: 70,
    lastIrrigation: '3h ago',
    nextIrrigation: '5h',
    duration: 35,
    remainingTime: 0,
    waterUsage: 620,
    efficiency: 96,
    schedule: '06:30, 18:30',
    valveStatus: 'closed',
  },
  {
    id: 'E',
    name: 'Invernadero A',
    crop: 'Tomate Cherry',
    area: '0.5 ha',
    status: 'active',
    isRunning: true,
    soilMoisture: 62,
    targetMoisture: 72,
    lastIrrigation: '1h ago',
    nextIrrigation: '3h',
    duration: 25,
    remainingTime: 12,
    waterUsage: 380,
    efficiency: 98,
    schedule: '06:00, 12:00, 18:00',
    valveStatus: 'open',
  },
  {
    id: 'F',
    name: 'Invernadero B',
    crop: 'Albahaca',
    area: '0.3 ha',
    status: 'paused',
    isRunning: false,
    soilMoisture: 58,
    targetMoisture: 60,
    lastIrrigation: '6h ago',
    nextIrrigation: 'Pausado',
    duration: 20,
    remainingTime: 0,
    waterUsage: 220,
    efficiency: 92,
    schedule: 'Manual',
    valveStatus: 'closed',
  },
]

// Schedule presets
const schedulePresets = [
  { id: 1, name: 'Verano Intenso', times: '05:00, 11:00, 17:00', duration: 45 },
  { id: 2, name: 'Otono Moderado', times: '06:00, 18:00', duration: 30 },
  { id: 3, name: 'Invierno Suave', times: '10:00', duration: 20 },
  { id: 4, name: 'Personalizado', times: 'Manual', duration: 0 },
]

export default function IrrigationPage() {
  const [zones, setZones] = useState(initialZones)
  const [autoMode, setAutoMode] = useState(true)
  const [selectedZone, setSelectedZone] = useState<typeof zones[0] | null>(null)
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)

  const toggleZoneRunning = (zoneId: string) => {
    setZones(zones.map(zone => {
      if (zone.id === zoneId) {
        const newIsRunning = !zone.isRunning
        return {
          ...zone,
          isRunning: newIsRunning,
          status: newIsRunning ? 'active' : (zone.soilMoisture < 55 ? 'warning' : 'scheduled'),
          valveStatus: newIsRunning ? 'open' : 'closed',
          remainingTime: newIsRunning ? zone.duration : 0,
        }
      }
      return zone
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-primary/10 text-primary'
      case 'optimal': return 'bg-secondary/10 text-secondary'
      case 'scheduled': return 'bg-accent/10 text-accent'
      case 'warning': return 'bg-destructive/10 text-destructive'
      case 'paused': return 'bg-muted text-muted-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Regando'
      case 'optimal': return 'Optimo'
      case 'scheduled': return 'Programado'
      case 'warning': return 'Necesita Agua'
      case 'paused': return 'Pausado'
      default: return status
    }
  }

  const getMoistureColor = (moisture: number, target: number) => {
    const diff = moisture - target
    if (diff >= -5) return 'bg-primary'
    if (diff >= -15) return 'bg-accent'
    return 'bg-destructive'
  }

  // Stats
  const activeZones = zones.filter(z => z.isRunning).length
  const totalWaterUsage = zones.reduce((acc, z) => acc + z.waterUsage, 0)
  const avgEfficiency = Math.round(zones.reduce((acc, z) => acc + z.efficiency, 0) / zones.length)
  const warningZones = zones.filter(z => z.status === 'warning').length

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden p-3 gap-3">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary/10">
            <Droplets className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Sistema de Riego</h1>
            <p className="text-xs text-muted-foreground">Control y monitoreo de irrigacion</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border">
            <span className="text-xs text-muted-foreground">Modo Auto</span>
            <Switch 
              checked={autoMode} 
              onCheckedChange={setAutoMode}
              className="data-[state=checked]:bg-primary"
            />
          </div>
          <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Calendar className="h-4 w-4 mr-2" />
                Programar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Programar Riego</DialogTitle>
                <DialogDescription>
                  Configura el horario de riego para las zonas seleccionadas.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="zone">Zona</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar zona" />
                    </SelectTrigger>
                    <SelectContent>
                      {zones.map(zone => (
                        <SelectItem key={zone.id} value={zone.id}>
                          {zone.name} - {zone.crop}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="preset">Preset</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar preset" />
                    </SelectTrigger>
                    <SelectContent>
                      {schedulePresets.map(preset => (
                        <SelectItem key={preset.id} value={preset.id.toString()}>
                          {preset.name} ({preset.times})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startTime">Hora Inicio</Label>
                    <Input id="startTime" type="time" defaultValue="06:00" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Duracion (min)</Label>
                    <Input id="duration" type="number" defaultValue="30" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Dias</Label>
                  <div className="flex gap-1">
                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
                      <Button
                        key={day}
                        variant={i < 5 ? 'default' : 'outline'}
                        size="sm"
                        className="w-9 h-9 p-0"
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsScheduleDialogOpen(false)}>
                  Guardar Programa
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button size="sm" className="h-9">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Zona
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3 flex-shrink-0">
        <Card className="p-3 border-border bg-card/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Zonas Activas</p>
              <p className="text-xl font-bold text-foreground">{activeZones}/{zones.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-3 border-border bg-card/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Droplets className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Consumo Hoy</p>
              <p className="text-xl font-bold text-foreground">{(totalWaterUsage / 1000).toFixed(1)}k L</p>
            </div>
          </div>
        </Card>
        <Card className="p-3 border-border bg-card/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Gauge className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Eficiencia</p>
              <p className="text-xl font-bold text-foreground">{avgEfficiency}%</p>
            </div>
          </div>
        </Card>
        <Card className="p-3 border-border bg-card/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Alertas</p>
              <p className="text-xl font-bold text-foreground">{warningZones}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-3 min-h-0 overflow-hidden">
        {/* Zones Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            {zones.map((zone) => (
              <Card
                key={zone.id}
                className={`p-4 border transition-all cursor-pointer ${
                  selectedZone?.id === zone.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                } ${zone.isRunning ? 'ring-2 ring-primary/20' : ''}`}
                onClick={() => setSelectedZone(zone)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      zone.isRunning ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                      <Droplets className={`h-5 w-5 ${
                        zone.isRunning ? 'text-primary animate-pulse' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{zone.name}</h3>
                      <p className="text-xs text-muted-foreground">{zone.crop} - {zone.area}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(zone.status)}`}>
                      {getStatusLabel(zone.status)}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Editar zona
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <History className="h-4 w-4 mr-2" />
                          Ver historial
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="h-4 w-4 mr-2" />
                          Configuracion
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Moisture Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground">Humedad del Suelo</span>
                    <span className="text-xs font-medium text-foreground">
                      {zone.soilMoisture}% / {zone.targetMoisture}%
                    </span>
                  </div>
                  <div className="relative h-2 rounded-full bg-border overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${getMoistureColor(zone.soilMoisture, zone.targetMoisture)}`}
                      style={{ width: `${zone.soilMoisture}%` }}
                    />
                    <div
                      className="absolute top-0 h-full w-0.5 bg-foreground/50"
                      style={{ left: `${zone.targetMoisture}%` }}
                    />
                  </div>
                </div>

                {/* Progress if running */}
                {zone.isRunning && (
                  <div className="mb-3 p-2 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-primary">
                        <Timer className="h-3 w-3" />
                        Regando...
                      </div>
                      <span className="text-xs font-medium text-primary">
                        {zone.remainingTime} min restantes
                      </span>
                    </div>
                    <Progress 
                      value={((zone.duration - zone.remainingTime) / zone.duration) * 100} 
                      className="h-1.5"
                    />
                  </div>
                )}

                {/* Info Row */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Ultimo</p>
                    <p className="text-xs font-medium text-foreground">{zone.lastIrrigation}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Proximo</p>
                    <p className="text-xs font-medium text-foreground">{zone.nextIrrigation}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Duracion</p>
                    <p className="text-xs font-medium text-foreground">{zone.duration} min</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={zone.isRunning ? 'destructive' : 'default'}
                    size="sm"
                    className="flex-1 h-8"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleZoneRunning(zone.id)
                    }}
                  >
                    {zone.isRunning ? (
                      <>
                        <Pause className="h-3.5 w-3.5 mr-1.5" />
                        Detener
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5 mr-1.5" />
                        Iniciar
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <RotateCcw className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Details Panel */}
        {selectedZone && (
          <Card className="w-80 flex-shrink-0 border-border flex flex-col overflow-hidden">
            <div className="p-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${
                  selectedZone.isRunning ? 'bg-primary/10' : 'bg-muted'
                }`}>
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">{selectedZone.name}</h2>
                  <p className="text-xs text-muted-foreground">{selectedZone.crop}</p>
                </div>
              </div>
              <Button
                variant={selectedZone.isRunning ? 'destructive' : 'default'}
                size="sm"
                onClick={() => toggleZoneRunning(selectedZone.id)}
              >
                <Power className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {/* Current Status */}
              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <h4 className="text-xs font-semibold text-foreground mb-2">Estado Actual</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Humedad Suelo</p>
                    <p className="text-lg font-bold text-foreground">{selectedZone.soilMoisture}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Objetivo</p>
                    <p className="text-lg font-bold text-primary">{selectedZone.targetMoisture}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Valvula</p>
                    <p className={`text-sm font-medium ${
                      selectedZone.valveStatus === 'open' ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {selectedZone.valveStatus === 'open' ? 'Abierta' : 'Cerrada'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Eficiencia</p>
                    <p className="text-sm font-medium text-foreground">{selectedZone.efficiency}%</p>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-foreground">Programacion</h4>
                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                    <Edit2 className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{selectedZone.schedule}</span>
                </div>
                <div className="flex items-center gap-2 text-sm mt-1">
                  <Timer className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{selectedZone.duration} minutos por sesion</span>
                </div>
              </div>

              {/* Water Usage */}
              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <h4 className="text-xs font-semibold text-foreground mb-2">Consumo de Agua</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-secondary">{selectedZone.waterUsage} L</p>
                    <p className="text-xs text-muted-foreground">Hoy</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <TrendingDown className="h-4 w-4" />
                    -8% vs ayer
                  </div>
                </div>
              </div>

              {/* Weather Conditions */}
              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <h4 className="text-xs font-semibold text-foreground mb-2">Condiciones</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center p-2 rounded-lg bg-background">
                    <Thermometer className="h-4 w-4 text-destructive mb-1" />
                    <span className="text-xs font-medium text-foreground">24°C</span>
                    <span className="text-[10px] text-muted-foreground">Temp</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-lg bg-background">
                    <Sun className="h-4 w-4 text-yellow-500 mb-1" />
                    <span className="text-xs font-medium text-foreground">850</span>
                    <span className="text-[10px] text-muted-foreground">W/m2</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-lg bg-background">
                    <Cloud className="h-4 w-4 text-muted-foreground mb-1" />
                    <span className="text-xs font-medium text-foreground">0%</span>
                    <span className="text-[10px] text-muted-foreground">Lluvia</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-between h-9 text-xs">
                  <span className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Ver historial completo
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between h-9 text-xs">
                  <span className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Configuracion avanzada
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
