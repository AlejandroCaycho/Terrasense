'use client'

import React, { useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Cloud, Droplets, Thermometer, AlertTriangle, TrendingUp, Wind, Activity, MapPin, Sun, Zap, Leaf, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { mockDashboardData } from '@/lib/mock-data'

export default function DashboardPage() {
  const [refreshing, setRefreshing] = useState(false)

  const temperatureData = [
    { time: '00:00', temp: 22, humidity: 75 },
    { time: '04:00', temp: 20, humidity: 82 },
    { time: '08:00', temp: 23, humidity: 70 },
    { time: '12:00', temp: 26, humidity: 58 },
    { time: '16:00', temp: 25, humidity: 62 },
    { time: '20:00', temp: 23, humidity: 68 },
  ]

  const precipitationData = [
    { day: 'Lun', rain: 12 },
    { day: 'Mar', rain: 5 },
    { day: 'Mié', rain: 0 },
    { day: 'Jue', rain: 8 },
    { day: 'Vie', rain: 15 },
    { day: 'Sáb', rain: 3 },
    { day: 'Dom', rain: 0 },
  ]


  const cropHealthData = [
    { crop: 'Tomate', health: 'Excelente', percentage: 92, area: '2.5 ha', nextHarvest: '15 días' },
    { crop: 'Lechuga', health: 'Buena', percentage: 85, area: '1.8 ha', nextHarvest: '8 días' },
    { crop: 'Pepino', health: 'Regular', percentage: 72, area: '1.2 ha', nextHarvest: '22 días' },
    { crop: 'Pimiento', health: 'Excelente', percentage: 88, area: '0.9 ha', nextHarvest: '12 días' },
  ]

  const greenhouseData = [
    { name: 'Invernadero A', status: 'Activo', temperature: 25, humidity: 72, co2: 420, light: 85 },
    { name: 'Invernadero B', status: 'Activo', temperature: 23, humidity: 68, co2: 390, light: 78 },
    { name: 'Invernadero C', status: 'Mantenimiento', temperature: 21, humidity: 65, co2: 350, light: 0 },
  ]

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    setRefreshing(false)
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Compact Header */}
      <div className="flex-shrink-0 px-3 py-1.5">
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
            className="gap-1 h-6 text-xs"
          >
            <Activity className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-3 pt-0 space-y-2 overflow-hidden flex flex-col">
        {/* Row 1: KPI Cards */}
        <div className="grid grid-cols-4 gap-2 flex-shrink-0">
          <Card className="border-0 bg-card/80 p-2 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-primary/20 p-1 flex-shrink-0">
                <Cloud className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Estaciones</p>
                <p className="text-base font-bold text-foreground">{mockDashboardData.totalStations}</p>
              </div>
            </div>
          </Card>

          <Card className="border-0 bg-card/80 p-2 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-destructive/20 p-1 flex-shrink-0">
                <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Alertas</p>
                <p className="text-base font-bold text-foreground">{mockDashboardData.activeAlerts}</p>
              </div>
            </div>
          </Card>

          <Card className="border-0 bg-card/80 p-2 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-accent/20 p-1 flex-shrink-0">
                <Thermometer className="h-3.5 w-3.5 text-accent" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Temp</p>
                <p className="text-base font-bold text-foreground">{mockDashboardData.avgTemperature}°C</p>
              </div>
            </div>
          </Card>

          <Card className="border-0 bg-card/80 p-2 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-secondary/20 p-1 flex-shrink-0">
                <Droplets className="h-3.5 w-3.5 text-secondary" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Humedad</p>
                <p className="text-base font-bold text-foreground">{mockDashboardData.avgHumidity}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Row 2: Charts Grid */}
        <div className="grid grid-cols-2 gap-2 flex-shrink-0">
          {/* Temperature & Humidity Chart */}
          <Card className="border-0 bg-card/50 p-2 shadow-sm">
            <h3 className="text-xs font-semibold text-foreground mb-1">Temperatura y Humedad 24h</h3>
            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={temperatureData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="time" stroke="var(--color-muted-foreground)" style={{ fontSize: '9px' }} height={16} />
                  <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '9px' }} width={24} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '4px', fontSize: '10px' }} />
                  <Line type="monotone" dataKey="temp" stroke="var(--color-primary)" strokeWidth={1.5} dot={false} name="Temp °C" />
                  <Line type="monotone" dataKey="humidity" stroke="var(--color-secondary)" strokeWidth={1.5} dot={false} name="Humedad %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Precipitation Chart */}
          <Card className="border-0 bg-card/50 p-2 shadow-sm">
            <h3 className="text-xs font-semibold text-foreground mb-1">Precipitacion Semanal (mm)</h3>
            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={precipitationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--color-muted-foreground)" style={{ fontSize: '9px' }} height={16} />
                  <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '9px' }} width={24} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '4px', fontSize: '10px' }} />
                  <Bar dataKey="rain" fill="var(--color-secondary)" radius={[3, 3, 0, 0]} name="Lluvia mm" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Row 3: Cultivos */}
        <Card className="border-0 bg-card/50 p-2 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Leaf className="h-3.5 w-3.5 text-primary flex-shrink-0" />
            <h3 className="text-xs font-semibold text-foreground">Estado de Cultivos</h3>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {cropHealthData.map((crop) => (
              <div key={crop.crop} className="rounded-md bg-card/80 border border-border/50 p-2 hover:border-primary/30 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-foreground font-semibold text-xs">{crop.crop}</span>
                  <span className={`text-[10px] font-medium px-1 py-0.5 rounded ${
                    crop.health === 'Excelente' ? 'bg-primary/20 text-primary' : 
                    crop.health === 'Buena' ? 'bg-secondary/20 text-secondary' : 'bg-accent/20 text-accent'
                  }`}>{crop.health}</span>
                </div>
                <div className="h-1 rounded-full bg-border/50 overflow-hidden mb-1">
                  <div className="h-1 rounded-full bg-primary transition-all" style={{ width: `${crop.percentage}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-0.5"><MapPin className="h-2.5 w-2.5" />{crop.area}</span>
                  <span className="flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" />{crop.nextHarvest}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Row 4: Invernaderos + Zonas */}
        <div className="grid grid-cols-3 gap-2 flex-1 min-h-0">
          {/* Invernaderos */}
          <Card className="col-span-2 border-0 bg-card/50 p-2 shadow-sm flex flex-col">
            <div className="flex items-center gap-1.5 mb-1.5 flex-shrink-0">
              <Wind className="h-3.5 w-3.5 text-accent flex-shrink-0" />
              <h3 className="text-xs font-semibold text-foreground">Invernaderos</h3>
            </div>
            <div className="space-y-1.5 flex-1 overflow-auto">
              {greenhouseData.map((gh) => (
                <div key={gh.name} className="rounded-md bg-card/80 border border-border/50 p-2 hover:border-accent/30 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-foreground font-semibold text-xs">{gh.name}</span>
                      <span className={`text-[10px] px-1 py-0.5 rounded ${
                        gh.status === 'Activo' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'
                      }`}>{gh.status}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    <div className="flex items-center gap-1 text-[10px]">
                      <Thermometer className="h-3 w-3 text-destructive" />
                      <span className="text-muted-foreground">Temp:</span>
                      <span className="font-semibold text-foreground">{gh.temperature}°C</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px]">
                      <Droplets className="h-3 w-3 text-secondary" />
                      <span className="text-muted-foreground">Hum:</span>
                      <span className="font-semibold text-foreground">{gh.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px]">
                      <Wind className="h-3 w-3 text-accent" />
                      <span className="text-muted-foreground">CO2:</span>
                      <span className="font-semibold text-foreground">{gh.co2}ppm</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px]">
                      <Sun className="h-3 w-3 text-primary" />
                      <span className="text-muted-foreground">Luz:</span>
                      <span className="font-semibold text-foreground">{gh.light}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Zonas de Riego */}
          <Card className="border-0 bg-card/50 p-2 shadow-sm flex flex-col">
            <div className="flex items-center gap-1.5 mb-1.5 flex-shrink-0">
              <MapPin className="h-3.5 w-3.5 text-secondary flex-shrink-0" />
              <h3 className="text-xs font-semibold text-foreground">Zonas de Riego</h3>
            </div>
            <div className="grid grid-cols-2 gap-1.5 flex-1 content-start">
              {[
                { zone: 'A', status: 'Activo', nextRiego: '2h' },
                { zone: 'B', status: 'Optimo', nextRiego: '5h' },
                { zone: 'C', status: 'Activo', nextRiego: '1h' },
                { zone: 'D', status: 'Espera', nextRiego: '8h' },
                { zone: 'E', status: 'Optimo', nextRiego: '6h' },
                { zone: 'F', status: 'Activo', nextRiego: '3h' },
              ].map((item) => (
                <div key={item.zone} className="rounded-md bg-secondary/10 p-1.5 border border-secondary/20 hover:bg-secondary/20 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-secondary">Zona {item.zone}</span>
                    <span className={`text-[9px] px-1 py-0.5 rounded ${
                      item.status === 'Activo' ? 'bg-primary/20 text-primary' : 
                      item.status === 'Optimo' ? 'bg-secondary/20 text-secondary' : 'bg-muted text-muted-foreground'
                    }`}>{item.status}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                    <Droplets className="h-2.5 w-2.5" /> Riego en {item.nextRiego}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Row 5: Recommendations */}
        <div className="grid grid-cols-4 gap-2 flex-shrink-0">
          <Card className="border-0 bg-primary/10 p-2 shadow-sm hover:bg-primary/15 transition-colors">
            <div className="flex items-start gap-1.5">
              <div className="rounded-md bg-primary/20 p-1 flex-shrink-0">
                <AlertTriangle className="h-3 w-3 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-primary">Alerta Riego</p>
                <p className="text-[10px] text-foreground font-medium">Zona A necesita agua</p>
              </div>
            </div>
          </Card>

          <Card className="border-0 bg-secondary/10 p-2 shadow-sm hover:bg-secondary/15 transition-colors">
            <div className="flex items-start gap-1.5">
              <div className="rounded-md bg-secondary/20 p-1 flex-shrink-0">
                <TrendingUp className="h-3 w-3 text-secondary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-secondary">Rendimiento</p>
                <p className="text-[10px] text-foreground font-medium">+12% vs mes anterior</p>
              </div>
            </div>
          </Card>

          <Card className="border-0 bg-accent/10 p-2 shadow-sm hover:bg-accent/15 transition-colors">
            <div className="flex items-start gap-1.5">
              <div className="rounded-md bg-accent/20 p-1 flex-shrink-0">
                <Zap className="h-3 w-3 text-accent" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-accent">Energia</p>
                <p className="text-[10px] text-foreground font-medium">142 kWh hoy</p>
              </div>
            </div>
          </Card>

          <Card className="border-0 bg-destructive/10 p-2 shadow-sm hover:bg-destructive/15 transition-colors">
            <div className="flex items-start gap-1.5">
              <div className="rounded-md bg-destructive/20 p-1 flex-shrink-0">
                <Thermometer className="h-3 w-3 text-destructive" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-destructive">Temp Alta</p>
                <p className="text-[10px] text-foreground font-medium">Invernadero B</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
