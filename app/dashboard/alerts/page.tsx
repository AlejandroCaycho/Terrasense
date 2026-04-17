'use client'

import React, { useState } from 'react'
import { AlertTriangle, AlertCircle, Bell, Trash2, Filter } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const alerts = [
  { id: '1', type: 'critical', title: 'Temperatura extrema', message: 'Zona A: 42°C - Riesgo de quemadura', time: 'hace 5 min', zone: 'A' },
  { id: '2', type: 'warning', title: 'Humedad baja', message: 'Zona C: 22% - Activar riego de emergencia', time: 'hace 15 min', zone: 'C' },
  { id: '3', type: 'info', title: 'Mantenimiento pendiente', message: 'Estación #3 requiere calibración', time: 'hace 1 hora', zone: 'B' },
  { id: '4', type: 'critical', title: 'Sistema de riego falla', message: 'Zona D: Sin agua hace 30 minutos', time: 'hace 2 horas', zone: 'D' },
  { id: '5', type: 'warning', title: 'Plagas detectadas', message: 'Cultivo Tomate: Presencia de ácaros', time: 'hace 3 horas', zone: 'A' },
  { id: '6', type: 'info', title: 'Actualización completada', message: 'Dashboard actualizado correctamente', time: 'hace 5 horas', zone: '-' },
  { id: '7', type: 'warning', title: 'Sensor desconectado', message: 'Estación #5: Sin señal 45 min', time: 'hace 6 horas', zone: 'E' },
]

const alertStats = [
  { label: 'Críticas', value: '2', color: 'text-destructive' },
  { label: 'Advertencias', value: '3', color: 'text-accent' },
  { label: 'Informativas', value: '2', color: 'text-secondary' },
]

export default function AlertsPage() {
  const [filterType, setFilterType] = useState<'all' | 'critical' | 'warning' | 'info'>('all')
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([])

  const filteredAlerts = alerts.filter(a => {
    if (filterType === 'all') return true
    return a.type === filterType
  }).filter(a => !dismissedAlerts.includes(a.id))

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-accent" />
      case 'info':
        return <Bell className="h-4 w-4 text-secondary" />
      default:
        return <AlertCircle className="h-4 w-4 text-primary" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-destructive/10 border-l-2 border-destructive'
      case 'warning':
        return 'bg-accent/10 border-l-2 border-accent'
      case 'info':
        return 'bg-secondary/10 border-l-2 border-secondary'
      default:
        return 'bg-primary/10 border-l-2 border-primary'
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-sm font-semibold text-foreground">Alertas</h1>
            <p className="text-xs text-muted-foreground">Monitoreo en tiempo real de eventos</p>
          </div>
        </div>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-3 gap-4 px-6 py-3 border-b border-border">
        {alertStats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-2">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2 px-6 py-3 border-b border-border overflow-x-auto">
        <Filter className="h-3 w-3 text-muted-foreground flex-shrink-0" />
        {(['all', 'critical', 'warning', 'info'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex-shrink-0 ${
              filterType === type
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {type === 'all' ? 'Todas' : type === 'critical' ? 'Críticas' : type === 'warning' ? 'Advertencias' : 'Informativas'}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="flex-1 overflow-auto px-6 py-4 space-y-2">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <Card key={alert.id} className={`border-0 p-3 ${getAlertColor(alert.type)}`}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">{getAlertIcon(alert.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-foreground">{alert.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDismissedAlerts([...dismissedAlerts, alert.id])}
                      className="h-6 w-6 p-0 flex-shrink-0 hover:bg-black/10 dark:hover:bg-white/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                    {alert.zone !== '-' && <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">Zona {alert.zone}</span>}
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs text-muted-foreground">Sin alertas en este momento</p>
          </div>
        )}
      </div>
    </div>
  )
}
