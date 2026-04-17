'use client'

import React, { useState } from 'react'
import { AlertTriangle, AlertCircle, Bell, Trash2, CheckCircle, Clock, XCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const alerts = [
  { id: '1', type: 'critical', title: 'Temperatura extrema', message: 'Zona A: 42°C - Riesgo de quemadura en cultivos', time: 'hace 5 min', zone: 'A' },
  { id: '2', type: 'warning', title: 'Humedad baja', message: 'Zona C: 22% - Activar riego de emergencia', time: 'hace 15 min', zone: 'C' },
  { id: '3', type: 'info', title: 'Mantenimiento pendiente', message: 'Estacion #3 requiere calibracion de sensores', time: 'hace 1 hora', zone: 'B' },
  { id: '4', type: 'critical', title: 'Sistema de riego falla', message: 'Zona D: Sin suministro de agua hace 30 minutos', time: 'hace 2 horas', zone: 'D' },
  { id: '5', type: 'warning', title: 'Plagas detectadas', message: 'Cultivo Tomate: Presencia de acaros rojos', time: 'hace 3 horas', zone: 'A' },
  { id: '6', type: 'info', title: 'Actualizacion completada', message: 'Sistema actualizado a version 2.4.1', time: 'hace 5 horas', zone: '-' },
  { id: '7', type: 'warning', title: 'Sensor desconectado', message: 'Estacion #5: Sin señal durante 45 minutos', time: 'hace 6 horas', zone: 'E' },
]

export default function AlertsPage() {
  const [filterType, setFilterType] = useState<'all' | 'critical' | 'warning' | 'info'>('all')
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([])

  const filteredAlerts = alerts.filter(a => {
    if (filterType === 'all') return true
    return a.type === filterType
  }).filter(a => !dismissedAlerts.includes(a.id))

  const criticalCount = alerts.filter(a => a.type === 'critical' && !dismissedAlerts.includes(a.id)).length
  const warningCount = alerts.filter(a => a.type === 'warning' && !dismissedAlerts.includes(a.id)).length
  const infoCount = alerts.filter(a => a.type === 'info' && !dismissedAlerts.includes(a.id)).length

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <XCircle className="h-5 w-5 text-destructive" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-accent" />
      case 'info': return <Bell className="h-5 w-5 text-secondary" />
      default: return <AlertCircle className="h-5 w-5 text-primary" />
    }
  }

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-destructive/10 border-l-4 border-destructive'
      case 'warning': return 'bg-accent/10 border-l-4 border-accent'
      case 'info': return 'bg-secondary/10 border-l-4 border-secondary'
      default: return 'bg-primary/10 border-l-4 border-primary'
    }
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden p-3 gap-2">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-sm font-semibold text-foreground">Centro de Alertas</h1>
          <p className="text-xs text-muted-foreground">Monitoreo en tiempo real de eventos criticos</p>
        </div>
        <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => setDismissedAlerts(alerts.map(a => a.id))}>
          <CheckCircle className="h-3 w-3" />
          Marcar todas leidas
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2 flex-shrink-0">
        <Card className="border-0 bg-destructive/10 p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-destructive/20 p-2">
              <XCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-destructive">{criticalCount}</p>
              <p className="text-xs text-muted-foreground">Criticas</p>
            </div>
          </div>
        </Card>
        <Card className="border-0 bg-accent/10 p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent/20 p-2">
              <AlertTriangle className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">{warningCount}</p>
              <p className="text-xs text-muted-foreground">Advertencias</p>
            </div>
          </div>
        </Card>
        <Card className="border-0 bg-secondary/10 p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-secondary/20 p-2">
              <Bell className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">{infoCount}</p>
              <p className="text-xs text-muted-foreground">Informativas</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Card className="border-0 bg-card/50 p-2 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-2">
          {([
            { type: 'all', label: 'Todas', count: filteredAlerts.length },
            { type: 'critical', label: 'Criticas', count: criticalCount },
            { type: 'warning', label: 'Advertencias', count: warningCount },
            { type: 'info', label: 'Informativas', count: infoCount },
          ] as const).map((tab) => (
            <button
              key={tab.type}
              onClick={() => setFilterType(tab.type)}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                filterType === tab.type
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </Card>

      {/* Alerts List */}
      <Card className="border-0 bg-card/50 shadow-sm flex-1 min-h-0 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto p-3 space-y-2">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <div key={alert.id} className={`rounded-lg p-4 ${getAlertStyles(alert.type)} transition-all hover:shadow-md`}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">{getAlertIcon(alert.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{alert.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDismissedAlerts([...dismissedAlerts, alert.id])}
                        className="h-8 w-8 p-0 flex-shrink-0 hover:bg-background/50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {alert.time}
                      </span>
                      {alert.zone !== '-' && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                          Zona {alert.zone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <CheckCircle className="h-12 w-12 text-primary/30" />
              <p className="text-sm text-muted-foreground">No hay alertas pendientes</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
