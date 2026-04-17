'use client'

import React, { useState } from 'react'
import { 
  Droplets, 
  Power, 
  Clock, 
  Calendar,
  Timer,
  TrendingDown,
  AlertTriangle,
  Settings,
  Play,
  Pause,
  RotateCcw,
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
  Gauge,
  Zap
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
    lastIrrigation: '2h',
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
    lastIrrigation: '5h',
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
    lastIrrigation: '12h',
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
    lastIrrigation: '3h',
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
    lastIrrigation: '1h',
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
    lastIrrigation: '6h',
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
    <div className="h-full flex flex-col bg-background overflow-hidden p-3 gap-2">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-secondary/10">
            <Droplets className="h-4 w-4 text-secondary" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">Sistema de Riego</h1>
            <p className="text-xs text-muted-foreground">Control y monitoreo</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-card border border-border">
            <span className="text-xs text-muted-foreground">Auto</span>
            <Switch 
              checked={autoMode} 
              onCheckedChange={setAutoMode}
              className="data-[state=checked]:bg-primary h-4 w-7"
            />
          </div>
          <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                Programar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle className="text-sm">Programar Riego</DialogTitle>
                <DialogDescription className="text-xs">
                  Configura el horario de riego para las zonas.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 py-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="zone" className="text-xs">Zona</Label>
                  <Select>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Seleccionar zona" />
                    </SelectTrigger>
                    <SelectContent>
                      {zones.map(zone => (
                        <SelectItem key={zone.id} value={zone.id} className="text-xs">
                          {zone.name} - {zone.crop}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="preset" className="text-xs">Preset</Label>
                  <Select>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Seleccionar preset" />
                    </SelectTrigger>
                    <SelectContent>
                      {schedulePresets.map(preset => (
                        <SelectItem key={preset.id} value={preset.id.toString()} className="text-xs">
                          {preset.name} ({preset.times})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="startTime" className="text-xs">Hora Inicio</Label>
                    <Input id="startTime" type="time" defaultValue="06:00" className="h-8 text-xs" />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="duration" className="text-xs">Duracion (min)</Label>
                    <Input id="duration" type="number" defaultValue="30" className="h-8 text-xs" />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs">Dias</Label>
                  <div className="flex gap-1">
                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
                      <Button
                        key={day}
                        variant={i < 5 ? 'default' : 'outline'}
                        size="sm"
                        className="w-7 h-7 p-0 text-xs"
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setIsScheduleDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button size="sm" className="h-7 text-xs" onClick={() => setIsScheduleDialogOpen(false)}>
                  Guardar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button size="sm" className="h-7 text-xs">
            <Plus className="h-3 w-3 mr-1" />
            Nueva Zona
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2 flex-shrink-0">
        <Card className="p-2.5 border-0 bg-card/80 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/20">
              <Activity className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Activas</p>
              <p className="text-base font-bold text-foreground">{activeZones}/{zones.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-2.5 border-0 bg-card/80 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-secondary/20">
              <Droplets className="h-3.5 w-3.5 text-secondary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Consumo</p>
              <p className="text-base font-bold text-foreground">{(totalWaterUsage / 1000).toFixed(1)}k L</p>
            </div>
          </div>
        </Card>
        <Card className="p-2.5 border-0 bg-card/80 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-accent/20">
              <Gauge className="h-3.5 w-3.5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Eficiencia</p>
              <p className="text-base font-bold text-foreground">{avgEfficiency}%</p>
            </div>
          </div>
        </Card>
        <Card className="p-2.5 border-0 bg-card/80 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-destructive/20">
              <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Alertas</p>
              <p className="text-base font-bold text-foreground">{warningZones}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-2 min-h-0 overflow-hidden">
        {/* Zones Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-3 gap-2">
            {zones.map((zone) => (
              <Card
                key={zone.id}
                className={`p-2.5 border-0 bg-card/50 shadow-sm transition-all cursor-pointer hover:bg-card/80 ${
                  selectedZone?.id === zone.id
                    ? 'ring-1 ring-primary bg-primary/5'
                    : ''
                } ${zone.isRunning ? 'ring-1 ring-primary/30' : ''}`}
                onClick={() => setSelectedZone(zone)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${
                      zone.isRunning ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                      <Droplets className={`h-3.5 w-3.5 ${
                        zone.isRunning ? 'text-primary animate-pulse' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-foreground">{zone.name}</h3>
                      <p className="text-[10px] text-muted-foreground">{zone.crop} - {zone.area}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getStatusColor(zone.status)}`}>
                      {getStatusLabel(zone.status)}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-xs">
                          <Edit2 className="h-3 w-3 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs">
                          <History className="h-3 w-3 mr-2" />
                          Historial
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs">
                          <Settings className="h-3 w-3 mr-2" />
                          Config
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-xs text-destructive">
                          <Trash2 className="h-3 w-3 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Moisture Bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-muted-foreground">Humedad</span>
                    <span className="text-[10px] font-medium text-foreground">
                      {zone.soilMoisture}% / {zone.targetMoisture}%
                    </span>
                  </div>
                  <div className="relative h-1.5 rounded-full bg-border overflow-hidden">
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
                  <div className="mb-2 p-1.5 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1 text-[10px] text-primary">
                        <Timer className="h-2.5 w-2.5" />
                        Regando
                      </div>
                      <span className="text-[10px] font-medium text-primary">
                        {zone.remainingTime}m
                      </span>
                    </div>
                    <Progress 
                      value={((zone.duration - zone.remainingTime) / zone.duration) * 100} 
                      className="h-1"
                    />
                  </div>
                )}

                {/* Info Row */}
                <div className="grid grid-cols-3 gap-1 mb-2">
                  <div className="text-center p-1 rounded bg-muted/50">
                    <p className="text-[9px] text-muted-foreground">Ultimo</p>
                    <p className="text-[10px] font-medium text-foreground">{zone.lastIrrigation}</p>
                  </div>
                  <div className="text-center p-1 rounded bg-muted/50">
                    <p className="text-[9px] text-muted-foreground">Prox</p>
                    <p className="text-[10px] font-medium text-foreground">{zone.nextIrrigation}</p>
                  </div>
                  <div className="text-center p-1 rounded bg-muted/50">
                    <p className="text-[9px] text-muted-foreground">Dur</p>
                    <p className="text-[10px] font-medium text-foreground">{zone.duration}m</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Button
                    variant={zone.isRunning ? 'destructive' : 'default'}
                    size="sm"
                    className="flex-1 h-6 text-[10px]"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleZoneRunning(zone.id)
                    }}
                  >
                    {zone.isRunning ? (
                      <>
                        <Pause className="h-2.5 w-2.5 mr-1" />
                        Detener
                      </>
                    ) : (
                      <>
                        <Play className="h-2.5 w-2.5 mr-1" />
                        Iniciar
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="icon" className="h-6 w-6">
                    <RotateCcw className="h-2.5 w-2.5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Details Panel */}
        {selectedZone && (
          <Card className="w-64 flex-shrink-0 border-0 bg-card/50 shadow-sm flex flex-col overflow-hidden">
            <div className="p-2.5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${
                  selectedZone.isRunning ? 'bg-primary/10' : 'bg-muted'
                }`}>
                  <Target className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xs font-semibold text-foreground">{selectedZone.name}</h2>
                  <p className="text-[10px] text-muted-foreground">{selectedZone.crop}</p>
                </div>
              </div>
              <Button
                variant={selectedZone.isRunning ? 'destructive' : 'default'}
                size="icon"
                className="h-6 w-6"
                onClick={() => toggleZoneRunning(selectedZone.id)}
              >
                <Power className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
              {/* Current Status */}
              <div className="p-2 rounded-lg bg-muted/30 border border-border">
                <h4 className="text-[10px] font-semibold text-foreground mb-1.5">Estado Actual</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[9px] text-muted-foreground">Humedad</p>
                    <p className="text-sm font-bold text-foreground">{selectedZone.soilMoisture}%</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground">Objetivo</p>
                    <p className="text-sm font-bold text-primary">{selectedZone.targetMoisture}%</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground">Valvula</p>
                    <p className={`text-[10px] font-medium ${
                      selectedZone.valveStatus === 'open' ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {selectedZone.valveStatus === 'open' ? 'Abierta' : 'Cerrada'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground">Eficiencia</p>
                    <p className="text-[10px] font-medium text-foreground">{selectedZone.efficiency}%</p>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="p-2 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-[10px] font-semibold text-foreground">Programacion</h4>
                  <Button variant="ghost" size="sm" className="h-5 text-[9px] px-1">
                    <Edit2 className="h-2.5 w-2.5 mr-0.5" />
                    Editar
                  </Button>
                </div>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-foreground">{selectedZone.schedule}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] mt-1">
                  <Timer className="h-3 w-3 text-muted-foreground" />
                  <span className="text-foreground">{selectedZone.duration} min/sesion</span>
                </div>
              </div>

              {/* Water Usage */}
              <div className="p-2 rounded-lg bg-muted/30 border border-border">
                <h4 className="text-[10px] font-semibold text-foreground mb-1.5">Consumo</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-bold text-secondary">{selectedZone.waterUsage} L</p>
                    <p className="text-[9px] text-muted-foreground">Hoy</p>
                  </div>
                  <div className="flex items-center gap-0.5 text-[10px] text-primary">
                    <TrendingDown className="h-3 w-3" />
                    -8%
                  </div>
                </div>
              </div>

              {/* Weather Conditions */}
              <div className="p-2 rounded-lg bg-muted/30 border border-border">
                <h4 className="text-[10px] font-semibold text-foreground mb-1.5">Condiciones</h4>
                <div className="grid grid-cols-3 gap-1">
                  <div className="flex flex-col items-center p-1.5 rounded bg-background">
                    <Thermometer className="h-3 w-3 text-destructive mb-0.5" />
                    <span className="text-[10px] font-medium text-foreground">24°C</span>
                  </div>
                  <div className="flex flex-col items-center p-1.5 rounded bg-background">
                    <Sun className="h-3 w-3 text-accent mb-0.5" />
                    <span className="text-[10px] font-medium text-foreground">850</span>
                  </div>
                  <div className="flex flex-col items-center p-1.5 rounded bg-background">
                    <Cloud className="h-3 w-3 text-muted-foreground mb-0.5" />
                    <span className="text-[10px] font-medium text-foreground">0%</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-1">
                <Button variant="outline" className="w-full justify-between h-7 text-[10px]">
                  <span className="flex items-center gap-1.5">
                    <History className="h-3 w-3" />
                    Ver historial
                  </span>
                  <ChevronRight className="h-3 w-3" />
                </Button>
                <Button variant="outline" className="w-full justify-between h-7 text-[10px]">
                  <span className="flex items-center gap-1.5">
                    <Settings className="h-3 w-3" />
                    Configuracion
                  </span>
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
