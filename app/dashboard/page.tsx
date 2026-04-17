'use client'

import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Cloud, Droplets, Thermometer, AlertTriangle, TrendingUp, Wind, Activity, MapPin } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { mockDashboardData } from '@/lib/mock-data'

export default function DashboardPage() {
  const [refreshing, setRefreshing] = useState(false)

  const temperatureData = [
    { time: '00:00', temp: 22 },
    { time: '04:00', temp: 20 },
    { time: '08:00', temp: 23 },
    { time: '12:00', temp: 26 },
    { time: '16:00', temp: 25 },
    { time: '20:00', temp: 23 },
  ]

  const soilMoistureData = mockDashboardData.soilMoisture
  const cropHealthData = mockDashboardData.cropHealth

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    setRefreshing(false)
  }

  return (
    <div className="h-full bg-background overflow-auto">
      {/* Compact Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur-sm px-4 py-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-sm font-semibold text-foreground">Panel de Control</h1>
            <p className="text-xs text-muted-foreground">Actualizado hace 2 min</p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="gap-1 h-7 text-xs"
          >
            <Activity className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Row 1: KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="border-0 bg-card/80 p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/20 p-1.5 flex-shrink-0">
                <Cloud className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Estaciones</p>
                <p className="text-lg font-bold text-foreground">{mockDashboardData.totalStations}</p>
              </div>
            </div>
          </Card>

          <Card className="border-0 bg-card/80 p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-destructive/20 p-1.5 flex-shrink-0">
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Alertas</p>
                <p className="text-lg font-bold text-foreground">{mockDashboardData.activeAlerts}</p>
              </div>
            </div>
          </Card>

          <Card className="border-0 bg-card/80 p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-accent/20 p-1.5 flex-shrink-0">
                <Thermometer className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Temp</p>
                <p className="text-lg font-bold text-foreground">{mockDashboardData.avgTemperature}°C</p>
              </div>
            </div>
          </Card>

          <Card className="border-0 bg-card/80 p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-secondary/20 p-1.5 flex-shrink-0">
                <Droplets className="h-4 w-4 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Humedad</p>
                <p className="text-lg font-bold text-foreground">{mockDashboardData.avgHumidity}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Row 2: Chart + Side Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Temperature Chart */}
          <Card className="lg:col-span-2 border-0 bg-card/50 p-3 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground mb-2">Temperatura 24h</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={temperatureData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="time" stroke="var(--color-muted-foreground)" style={{ fontSize: '10px' }} height={20} />
                  <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '10px' }} width={28} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '4px', fontSize: '11px' }} />
                  <Line type="monotone" dataKey="temp" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Side Info Panel */}
          <Card className="border-0 bg-card/50 p-3 shadow-sm">
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-foreground mb-2">Humedad del Suelo</p>
                <div className="space-y-1.5">
                  {soilMoistureData.slice(0, 3).map((item) => (
                    <div key={item.zone} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{item.zone}</span>
                      <span className="font-semibold text-secondary">{item.moisture}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-border pt-3">
                <p className="text-xs font-semibold text-foreground mb-2">Estado de Cultivos</p>
                <div className="space-y-1.5">
                  {cropHealthData.slice(0, 2).map((crop) => (
                    <div key={crop.crop} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{crop.crop}</span>
                      <span className="font-semibold text-primary">{crop.health}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Row 3: Bottom Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Cultivos */}
          <Card className="border-0 bg-card/50 p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-primary flex-shrink-0" />
              <h3 className="text-xs font-semibold text-foreground">Cultivos</h3>
            </div>
            <div className="space-y-2">
              {cropHealthData.slice(0, 2).map((crop) => (
                <div key={crop.crop} className="rounded bg-card/50 border border-border/50 p-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-foreground font-medium text-xs">{crop.crop}</span>
                    <span className="text-primary font-semibold text-xs">{crop.health}</span>
                  </div>
                  <div className="h-1 rounded-full bg-border/50 overflow-hidden">
                    <div className="h-1 rounded-full bg-primary" style={{ width: `${crop.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Invernaderos */}
          <Card className="border-0 bg-card/50 p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Wind className="h-4 w-4 text-accent flex-shrink-0" />
              <h3 className="text-xs font-semibold text-foreground">Invernaderos</h3>
            </div>
            <div className="space-y-2">
              {mockDashboardData.greenhouseStatus.slice(0, 2).map((gh) => (
                <div key={gh.name} className="flex items-center justify-between rounded bg-card/50 border border-border/50 p-2 hover:bg-card/70 transition-colors">
                  <span className="text-foreground font-medium truncate text-xs">{gh.name}</span>
                  <span className="text-accent font-semibold flex-shrink-0 ml-2 text-xs">{gh.temperature}°</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Zonas */}
          <Card className="border-0 bg-card/50 p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-secondary flex-shrink-0" />
              <h3 className="text-xs font-semibold text-foreground">Zonas de Riego</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['A', 'B', 'C', 'D', 'E', 'F'].map((zone) => (
                <div key={zone} className="rounded-lg bg-secondary/15 flex items-center justify-center cursor-pointer hover:bg-secondary/25 transition-all py-2 border border-secondary/20">
                  <span className="text-xs font-bold text-secondary">Z{zone}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Row 4: Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card className="border-0 bg-primary/10 p-3 shadow-sm hover:bg-primary/15 transition-colors">
            <div className="flex items-start gap-2">
              <div className="rounded-lg bg-primary/20 p-1.5 flex-shrink-0">
                <AlertTriangle className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-primary mb-0.5">Zona A</p>
                <p className="text-xs text-foreground font-medium">Riego en 2h</p>
                <p className="text-xs text-muted-foreground mt-0.5">Humedad baja</p>
              </div>
            </div>
          </Card>

          <Card className="border-0 bg-secondary/10 p-3 shadow-sm hover:bg-secondary/15 transition-colors">
            <div className="flex items-start gap-2">
              <div className="rounded-lg bg-secondary/20 p-1.5 flex-shrink-0">
                <AlertTriangle className="h-3.5 w-3.5 text-secondary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-secondary mb-0.5">Zona B</p>
                <p className="text-xs text-foreground font-medium">Optimo</p>
                <p className="text-xs text-muted-foreground mt-0.5">Condiciones ideales</p>
              </div>
            </div>
          </Card>

          <Card className="border-0 bg-accent/10 p-3 shadow-sm hover:bg-accent/15 transition-colors">
            <div className="flex items-start gap-2">
              <div className="rounded-lg bg-accent/20 p-1.5 flex-shrink-0">
                <AlertTriangle className="h-3.5 w-3.5 text-accent" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-accent mb-0.5">Zona C</p>
                <p className="text-xs text-foreground font-medium">No requiere</p>
                <p className="text-xs text-muted-foreground mt-0.5">Riego en 4h</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
