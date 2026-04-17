'use client'

import React, { useState } from 'react'
import { 
  AlertTriangle, 
  AlertCircle, 
  Bell, 
  Trash2, 
  CheckCircle, 
  Clock, 
  XCircle,
  Filter,
  Search,
  MoreVertical,
  Volume2,
  VolumeX,
  Settings,
  RefreshCw,
  ChevronRight,
  Zap,
  Thermometer,
  Droplets,
  Bug,
  Wifi,
  WifiOff,
  TrendingUp,
  Shield
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Alert {
  id: string
  type: 'critical' | 'warning' | 'info' | 'success'
  title: string
  message: string
  time: string
  timestamp: Date
  zone: string
  station: string
  category: 'temperature' | 'humidity' | 'irrigation' | 'pest' | 'system' | 'connection'
  read: boolean
  actions?: { label: string; action: string }[]
}

const initialAlerts: Alert[] = [
  { 
    id: '1', 
    type: 'critical', 
    title: 'Temperatura extrema detectada', 
    message: 'Zona A ha alcanzado 42°C. Riesgo de dano severo en cultivos de tomate. Se recomienda activar sistema de enfriamiento inmediatamente.', 
    time: 'hace 5 min',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    zone: 'A',
    station: 'Estacion Norte',
    category: 'temperature',
    read: false,
    actions: [{ label: 'Activar enfriamiento', action: 'cooling' }, { label: 'Ver detalles', action: 'details' }]
  },
  { 
    id: '2', 
    type: 'critical', 
    title: 'Falla en sistema de riego', 
    message: 'Zona D sin suministro de agua hace 45 minutos. Bomba principal reporta error de presion. Requiere atencion inmediata.', 
    time: 'hace 12 min',
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    zone: 'D',
    station: 'Estacion Sur',
    category: 'irrigation',
    read: false,
    actions: [{ label: 'Reiniciar bomba', action: 'restart' }, { label: 'Llamar tecnico', action: 'support' }]
  },
  { 
    id: '3', 
    type: 'warning', 
    title: 'Humedad del suelo baja', 
    message: 'Zona C registra 22% de humedad. Nivel optimo: 45-65%. Programar riego de emergencia recomendado.', 
    time: 'hace 25 min',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    zone: 'C',
    station: 'Estacion Este',
    category: 'humidity',
    read: false,
    actions: [{ label: 'Iniciar riego', action: 'irrigate' }]
  },
  { 
    id: '4', 
    type: 'warning', 
    title: 'Plagas detectadas', 
    message: 'Sensores detectan presencia de acaros rojos en cultivo de tomate. Afectacion estimada: 15% del area.', 
    time: 'hace 1 hora',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    zone: 'A',
    station: 'Estacion Norte',
    category: 'pest',
    read: true,
    actions: [{ label: 'Ver analisis', action: 'analysis' }, { label: 'Programar fumigacion', action: 'fumigate' }]
  },
  { 
    id: '5', 
    type: 'warning', 
    title: 'Sensor desconectado', 
    message: 'Estacion #5 sin senal durante 45 minutos. Ultima lectura: Temp 28°C, Humedad 55%.', 
    time: 'hace 2 horas',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    zone: 'E',
    station: 'Estacion #5',
    category: 'connection',
    read: true,
    actions: [{ label: 'Diagnosticar', action: 'diagnose' }]
  },
  { 
    id: '6', 
    type: 'info', 
    title: 'Mantenimiento programado', 
    message: 'Estacion #3 requiere calibracion de sensores. Proxima ventana de mantenimiento: Sabado 8:00 AM.', 
    time: 'hace 3 horas',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    zone: 'B',
    station: 'Estacion #3',
    category: 'system',
    read: true
  },
  { 
    id: '7', 
    type: 'success', 
    title: 'Riego completado exitosamente', 
    message: 'Zona B ha completado ciclo de riego programado. Consumo: 1,250 litros. Duracion: 45 min.', 
    time: 'hace 4 horas',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    zone: 'B',
    station: 'Estacion Sur',
    category: 'irrigation',
    read: true
  },
  { 
    id: '8', 
    type: 'info', 
    title: 'Actualizacion del sistema', 
    message: 'Sistema actualizado a version 2.4.1. Nuevas funciones: Deteccion avanzada de plagas, reportes automaticos.', 
    time: 'hace 6 horas',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    zone: '-',
    station: 'Sistema',
    category: 'system',
    read: true
  },
]

const categoryIcons: Record<string, React.ElementType> = {
  temperature: Thermometer,
  humidity: Droplets,
  irrigation: Droplets,
  pest: Bug,
  system: Settings,
  connection: Wifi,
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)
  const [filterType, setFilterType] = useState<'all' | 'critical' | 'warning' | 'info' | 'success'>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleDismiss = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id))
    if (selectedAlert?.id === id) setSelectedAlert(null)
  }

  const handleMarkAsRead = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, read: true } : a))
  }

  const handleMarkAllRead = () => {
    setAlerts(alerts.map(a => ({ ...a, read: true })))
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const filteredAlerts = alerts.filter(a => {
    const matchesType = filterType === 'all' || a.type === filterType
    const matchesCategory = filterCategory === 'all' || a.category === filterCategory
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.station.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesCategory && matchesSearch
  })

  const criticalCount = alerts.filter(a => a.type === 'critical').length
  const warningCount = alerts.filter(a => a.type === 'warning').length
  const infoCount = alerts.filter(a => a.type === 'info').length
  const unreadCount = alerts.filter(a => !a.read).length

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <XCircle className="h-5 w-5" />
      case 'warning': return <AlertTriangle className="h-5 w-5" />
      case 'info': return <AlertCircle className="h-5 w-5" />
      case 'success': return <CheckCircle className="h-5 w-5" />
      default: return <Bell className="h-5 w-5" />
    }
  }

  const getAlertColors = (type: string) => {
    switch (type) {
      case 'critical': return { 
        bg: 'bg-gradient-to-r from-red-500/20 via-red-500/10 to-transparent', 
        border: 'border-red-500/50',
        borderLeft: 'border-l-4 border-l-red-500',
        icon: 'text-red-500 bg-red-500/20 shadow-lg shadow-red-500/20',
        badge: 'bg-red-500 text-white shadow-md shadow-red-500/30',
        glow: 'shadow-lg shadow-red-500/10 hover:shadow-red-500/20',
        text: 'text-red-400'
      }
      case 'warning': return { 
        bg: 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent', 
        border: 'border-amber-500/50',
        borderLeft: 'border-l-4 border-l-amber-500',
        icon: 'text-amber-500 bg-amber-500/20 shadow-lg shadow-amber-500/20',
        badge: 'bg-amber-500 text-white shadow-md shadow-amber-500/30',
        glow: 'shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20',
        text: 'text-amber-400'
      }
      case 'info': return { 
        bg: 'bg-gradient-to-r from-blue-500/15 via-blue-500/5 to-transparent', 
        border: 'border-blue-500/30',
        borderLeft: 'border-l-4 border-l-blue-500',
        icon: 'text-blue-500 bg-blue-500/20',
        badge: 'bg-blue-500 text-white',
        glow: 'hover:shadow-md hover:shadow-blue-500/10',
        text: 'text-blue-400'
      }
      case 'success': return { 
        bg: 'bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent', 
        border: 'border-emerald-500/30',
        borderLeft: 'border-l-4 border-l-emerald-500',
        icon: 'text-emerald-500 bg-emerald-500/20',
        badge: 'bg-emerald-500 text-white',
        glow: 'hover:shadow-md hover:shadow-emerald-500/10',
        text: 'text-emerald-400'
      }
      default: return { 
        bg: 'bg-muted', 
        border: 'border-border',
        borderLeft: '',
        icon: 'text-muted-foreground bg-muted',
        badge: 'bg-muted text-muted-foreground',
        glow: '',
        text: 'text-muted-foreground'
      }
    }
  }

  return (
    <div className="h-full bg-background flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-border bg-card/50 backdrop-blur-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-500/20 to-amber-500/20 flex items-center justify-center">
                <Bell className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-foreground">Centro de Alertas</h1>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-semibold animate-pulse">
                      {unreadCount} nuevas
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Monitoreo en tiempo real de eventos criticos del sistema</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="gap-2"
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                {soundEnabled ? 'Sonido activo' : 'Silenciado'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleMarkAllRead}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                <CheckCircle className="h-4 w-4" />
                Marcar todas leidas
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="flex-shrink-0 grid grid-cols-4 gap-4 p-6 border-b border-border">
          <Card className="border-0 bg-gradient-to-br from-red-500/10 to-red-600/5 p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full -mr-10 -mt-10" />
            <div className="flex items-center gap-4 relative">
              <div className="h-12 w-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-red-500">{criticalCount}</p>
                <p className="text-sm text-muted-foreground">Criticas</p>
              </div>
            </div>
            {criticalCount > 0 && (
              <div className="absolute top-2 right-2 h-3 w-3 rounded-full bg-red-500 animate-ping" />
            )}
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-amber-500/10 to-amber-600/5 p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full -mr-10 -mt-10" />
            <div className="flex items-center gap-4 relative">
              <div className="h-12 w-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-amber-500">{warningCount}</p>
                <p className="text-sm text-muted-foreground">Advertencias</p>
              </div>
            </div>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mr-10 -mt-10" />
            <div className="flex items-center gap-4 relative">
              <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Bell className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-500">{infoCount}</p>
                <p className="text-sm text-muted-foreground">Informativas</p>
              </div>
            </div>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-primary/10 to-primary/5 p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -mr-10 -mt-10" />
            <div className="flex items-center gap-4 relative">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">98%</p>
                <p className="text-sm text-muted-foreground">Sistema estable</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-border flex items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar alertas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-input border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
            {([
              { type: 'all', label: 'Todas' },
              { type: 'critical', label: 'Criticas' },
              { type: 'warning', label: 'Advertencias' },
              { type: 'info', label: 'Info' },
            ] as const).map((tab) => (
              <button
                key={tab.type}
                onClick={() => setFilterType(tab.type)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  filterType === tab.type
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">Todas las categorias</option>
              <option value="temperature">Temperatura</option>
              <option value="humidity">Humedad</option>
              <option value="irrigation">Riego</option>
              <option value="pest">Plagas</option>
              <option value="system">Sistema</option>
              <option value="connection">Conexion</option>
            </select>
          </div>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-3">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => {
                const colors = getAlertColors(alert.type)
                const CategoryIcon = categoryIcons[alert.category] || Bell
                
                return (
                  <Card 
                    key={alert.id} 
                    className={`border ${colors.border} ${colors.bg} ${colors.borderLeft} ${colors.glow} p-4 cursor-pointer transition-all duration-300 ${
                      selectedAlert?.id === alert.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-[1.01]' : ''
                    } ${!alert.read ? 'animate-pulse-subtle' : ''}`}
                    onClick={() => {
                      setSelectedAlert(alert)
                      handleMarkAsRead(alert.id)
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`h-10 w-10 rounded-lg ${colors.icon} flex items-center justify-center flex-shrink-0`}>
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className={`text-sm font-semibold ${alert.type === 'critical' ? 'text-red-400' : alert.type === 'warning' ? 'text-amber-400' : 'text-foreground'}`}>
                                {alert.title}
                              </p>
                              {!alert.read && (
                                <span className={`h-2.5 w-2.5 rounded-full animate-pulse ${
                                  alert.type === 'critical' ? 'bg-red-500 shadow-lg shadow-red-500/50' : 
                                  alert.type === 'warning' ? 'bg-amber-500 shadow-lg shadow-amber-500/50' : 
                                  'bg-primary shadow-lg shadow-primary/50'
                                }`} />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{alert.message}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDismiss(alert.id)
                            }}
                            className="h-8 w-8 p-0 flex-shrink-0 hover:bg-background/50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-3 mt-3 flex-wrap">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {alert.time}
                          </span>
                          {alert.zone !== '-' && (
                            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                              Zona {alert.zone}
                            </span>
                          )}
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CategoryIcon className="h-3 w-3" />
                            {alert.station}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${colors.badge}`}>
                            {alert.type === 'critical' ? 'Critica' : 
                             alert.type === 'warning' ? 'Advertencia' : 
                             alert.type === 'success' ? 'Exito' : 'Info'}
                          </span>
                        </div>
                        {alert.actions && alert.actions.length > 0 && (
                          <div className="flex items-center gap-2 mt-3">
                            {alert.actions.map((action, idx) => (
                              <Button
                                key={idx}
                                variant={idx === 0 ? 'default' : 'outline'}
                                size="sm"
                                onClick={(e) => e.stopPropagation()}
                                className={idx === 0 ? 'bg-primary hover:bg-primary/90' : ''}
                              >
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-foreground">Todo en orden</p>
                  <p className="text-sm text-muted-foreground">No hay alertas que coincidan con tu busqueda</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedAlert && (
        <div className="w-96 border-l border-border bg-card/50 flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Detalles de alerta</h2>
            <Button variant="ghost" size="sm" onClick={() => setSelectedAlert(null)}>
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-6">
            {/* Alert Header */}
            <div className={`rounded-xl p-4 ${getAlertColors(selectedAlert.type).bg}`}>
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-lg ${getAlertColors(selectedAlert.type).icon} flex items-center justify-center`}>
                  {getAlertIcon(selectedAlert.type)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{selectedAlert.title}</p>
                  <p className="text-xs text-muted-foreground">{selectedAlert.time}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Descripcion</h3>
              <p className="text-sm text-foreground leading-relaxed">{selectedAlert.message}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Zona</p>
                <p className="text-sm font-semibold text-foreground">{selectedAlert.zone === '-' ? 'Sistema' : `Zona ${selectedAlert.zone}`}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Estacion</p>
                <p className="text-sm font-semibold text-foreground">{selectedAlert.station}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Categoria</p>
                <p className="text-sm font-semibold text-foreground capitalize">{selectedAlert.category}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Estado</p>
                <p className="text-sm font-semibold text-foreground">{selectedAlert.read ? 'Leida' : 'Nueva'}</p>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Historial</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                  <div>
                    <p className="text-sm text-foreground">Alerta generada</p>
                    <p className="text-xs text-muted-foreground">{selectedAlert.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground mt-1.5" />
                  <div>
                    <p className="text-sm text-foreground">Notificacion enviada</p>
                    <p className="text-xs text-muted-foreground">Automatico</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {selectedAlert.actions && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Acciones rapidas</h3>
                <div className="space-y-2">
                  {selectedAlert.actions.map((action, idx) => (
                    <Button
                      key={idx}
                      variant={idx === 0 ? 'default' : 'outline'}
                      className={`w-full justify-between ${idx === 0 ? 'bg-primary hover:bg-primary/90' : ''}`}
                    >
                      {action.label}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
