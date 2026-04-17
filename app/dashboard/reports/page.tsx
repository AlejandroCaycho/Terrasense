'use client'

import React, { useState } from 'react'
import { Download, FileText, Calendar, TrendingUp, Cloud } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const reports = [
  { id: '1', title: 'Reporte Temperatura', period: 'Esta semana', status: 'Listo', date: '15 Abr, 2024' },
  { id: '2', title: 'Reporte Humedad', period: 'Este mes', status: 'Listo', date: '10 Abr, 2024' },
  { id: '3', title: 'Análisis Cultivos', period: 'Trimestral', status: 'Procesando', date: 'En curso' },
  { id: '4', title: 'Reporte Inversión', period: 'Mensual', status: 'Listo', date: '01 Abr, 2024' },
  { id: '5', title: 'Resumen Riego', period: 'Semanal', status: 'Listo', date: '08 Abr, 2024' },
  { id: '6', title: 'Análisis Plagas', period: 'Mensual', status: 'Listo', date: '05 Abr, 2024' },
]

const reportStats = [
  { label: 'Reportes Generados', value: '24', icon: FileText },
  { label: 'Este Mes', value: '8', icon: Calendar },
  { label: 'Crecimiento', value: '+12%', icon: TrendingUp },
  { label: 'Datos Procesados', value: '1.2TB', icon: Cloud },
]

export default function ReportsPage() {
  const [tab, setTab] = useState<'generate' | 'history'>('generate')
  const [generating, setGenerating] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setGenerating(false)
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-sm font-semibold text-foreground">Reportes</h1>
            <p className="text-xs text-muted-foreground">Análisis y descargas de datos agrícolas</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2 px-6 py-3 border-b border-border">
        {reportStats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="flex items-center gap-2">
              <Icon className="h-3 w-3 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                <p className="text-sm font-semibold text-foreground">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-border">
        <button
          onClick={() => setTab('generate')}
          className={`text-xs font-semibold pb-2 border-b-2 transition-colors ${
            tab === 'generate'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Generar Reporte
        </button>
        <button
          onClick={() => setTab('history')}
          className={`text-xs font-semibold pb-2 border-b-2 transition-colors ${
            tab === 'history'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Historial
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {tab === 'generate' ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Reporte de Temperatura', desc: 'Análisis horario de temp' },
                { name: 'Reporte de Humedad', desc: 'Niveles de humedad relativa' },
                { name: 'Salud de Cultivos', desc: 'Estado de cada cultivo' },
                { name: 'Consumo de Agua', desc: 'Análisis de riego' },
                { name: 'Plagas Detectadas', desc: 'Alertas fitosanitarias' },
                { name: 'Rentabilidad', desc: 'Análisis económico' },
              ].map((report) => (
                <Card key={report.name} className="border-0 bg-card/50 p-3 hover:bg-card/70 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground">{report.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{report.desc}</p>
                    </div>
                    <Button
                      onClick={handleGenerate}
                      disabled={generating}
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs ml-2 flex-shrink-0"
                    >
                      {generating ? 'Generando...' : 'Generar'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {reports.map((report) => (
              <Card key={report.id} className="border-0 bg-card/50 p-3 hover:bg-card/70 transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground">{report.title}</p>
                    <p className="text-xs text-muted-foreground">{report.period} • {report.date}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${
                      report.status === 'Listo'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-accent/20 text-accent'
                    }`}>
                      {report.status}
                    </span>
                    {report.status === 'Listo' && (
                      <Button size="sm" variant="ghost" className="h-7 px-2">
                        <Download className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
