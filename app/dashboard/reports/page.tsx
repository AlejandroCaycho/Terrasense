'use client'

import React, { useState } from 'react'
import { 
  Download, 
  FileText, 
  Calendar, 
  TrendingUp, 
  Cloud,
  Clock,
  CheckCircle,
  Loader2,
  Filter,
  Search,
  BarChart3,
  PieChart,
  LineChart,
  Table,
  FileSpreadsheet,
  File,
  ChevronRight,
  Plus,
  Thermometer,
  Droplets,
  Bug,
  DollarSign,
  Leaf,
  Eye,
  Trash2,
  RefreshCw,
  Share2,
  Settings,
  Zap
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Report {
  id: string
  title: string
  description: string
  type: 'temperature' | 'humidity' | 'crops' | 'water' | 'pests' | 'financial'
  period: string
  status: 'ready' | 'processing' | 'scheduled' | 'failed'
  date: string
  size: string
  format: 'pdf' | 'xlsx' | 'csv'
  downloads: number
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  icon: React.ElementType
  color: string
  bgColor: string
  metrics: string[]
  estimatedTime: string
}

const reportTemplates: ReportTemplate[] = [
  {
    id: 'temp',
    name: 'Analisis de Temperatura',
    description: 'Registro horario de temperatura con tendencias y anomalias',
    icon: Thermometer,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    metrics: ['Temp. maxima', 'Temp. minima', 'Promedio', 'Varianza'],
    estimatedTime: '~2 min'
  },
  {
    id: 'humidity',
    name: 'Reporte de Humedad',
    description: 'Niveles de humedad relativa y del suelo por zona',
    icon: Droplets,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    metrics: ['Humedad aire', 'Humedad suelo', 'Punto rocio', 'Tendencias'],
    estimatedTime: '~2 min'
  },
  {
    id: 'crops',
    name: 'Salud de Cultivos',
    description: 'Estado fitosanitario y crecimiento de cada cultivo',
    icon: Leaf,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    metrics: ['Indice salud', 'Crecimiento', 'Rendimiento', 'Alertas'],
    estimatedTime: '~3 min'
  },
  {
    id: 'water',
    name: 'Consumo de Agua',
    description: 'Analisis detallado del sistema de riego y eficiencia',
    icon: Droplets,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    metrics: ['Litros usados', 'Eficiencia', 'Costo', 'Ahorro'],
    estimatedTime: '~2 min'
  },
  {
    id: 'pests',
    name: 'Deteccion de Plagas',
    description: 'Alertas fitosanitarias y recomendaciones de tratamiento',
    icon: Bug,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    metrics: ['Plagas detectadas', 'Zonas afectadas', 'Tratamientos', 'Prevencion'],
    estimatedTime: '~4 min'
  },
  {
    id: 'financial',
    name: 'Rentabilidad',
    description: 'Analisis economico y proyecciones de rendimiento',
    icon: DollarSign,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    metrics: ['Ingresos', 'Costos', 'ROI', 'Proyecciones'],
    estimatedTime: '~5 min'
  },
]

const initialReports: Report[] = [
  { 
    id: '1', 
    title: 'Reporte Semanal de Temperatura', 
    description: 'Analisis completo de temperatura del 8-15 Abril',
    type: 'temperature',
    period: 'Semanal', 
    status: 'ready', 
    date: '15 Abr, 2024',
    size: '2.4 MB',
    format: 'pdf',
    downloads: 12
  },
  { 
    id: '2', 
    title: 'Analisis Mensual de Humedad', 
    description: 'Niveles de humedad y patrones de abril',
    type: 'humidity',
    period: 'Mensual', 
    status: 'ready', 
    date: '10 Abr, 2024',
    size: '4.1 MB',
    format: 'xlsx',
    downloads: 8
  },
  { 
    id: '3', 
    title: 'Estado de Cultivos Q1 2024', 
    description: 'Reporte trimestral de salud de cultivos',
    type: 'crops',
    period: 'Trimestral', 
    status: 'processing', 
    date: 'En proceso',
    size: '-',
    format: 'pdf',
    downloads: 0
  },
  { 
    id: '4', 
    title: 'Analisis de Inversion Marzo', 
    description: 'ROI y analisis financiero del mes',
    type: 'financial',
    period: 'Mensual', 
    status: 'ready', 
    date: '01 Abr, 2024',
    size: '1.8 MB',
    format: 'xlsx',
    downloads: 15
  },
  { 
    id: '5', 
    title: 'Consumo de Agua Semana 14', 
    description: 'Eficiencia de riego y consumo',
    type: 'water',
    period: 'Semanal', 
    status: 'ready', 
    date: '08 Abr, 2024',
    size: '1.2 MB',
    format: 'csv',
    downloads: 6
  },
  { 
    id: '6', 
    title: 'Reporte de Plagas Marzo', 
    description: 'Detecciones y tratamientos aplicados',
    type: 'pests',
    period: 'Mensual', 
    status: 'ready', 
    date: '05 Abr, 2024',
    size: '3.5 MB',
    format: 'pdf',
    downloads: 10
  },
  { 
    id: '7', 
    title: 'Reporte Programado - Temp', 
    description: 'Proxima generacion: Lunes 8:00 AM',
    type: 'temperature',
    period: 'Semanal', 
    status: 'scheduled', 
    date: 'Programado',
    size: '-',
    format: 'pdf',
    downloads: 0
  },
]

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(initialReports)
  const [tab, setTab] = useState<'generate' | 'history' | 'scheduled'>('generate')
  const [generating, setGenerating] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPeriod, setFilterPeriod] = useState<string>('all')
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'xlsx' | 'csv'>('pdf')
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('week')

  const handleGenerate = async (templateId: string) => {
    setGenerating(templateId)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const template = reportTemplates.find(t => t.id === templateId)
    if (template) {
      const newReport: Report = {
        id: String(Date.now()),
        title: `${template.name} - ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}`,
        description: `Generado automaticamente`,
        type: templateId as Report['type'],
        period: selectedPeriod === 'week' ? 'Semanal' : selectedPeriod === 'month' ? 'Mensual' : selectedPeriod === 'quarter' ? 'Trimestral' : 'Anual',
        status: 'ready',
        date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
        size: `${(Math.random() * 4 + 1).toFixed(1)} MB`,
        format: selectedFormat,
        downloads: 0
      }
      setReports([newReport, ...reports])
    }
    
    setGenerating(null)
    setTab('history')
  }

  const handleDownload = (report: Report) => {
    setReports(reports.map(r => r.id === report.id ? { ...r, downloads: r.downloads + 1 } : r))
  }

  const handleDelete = (id: string) => {
    setReports(reports.filter(r => r.id !== id))
    if (selectedReport?.id === id) setSelectedReport(null)
  }

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPeriod = filterPeriod === 'all' || r.period.toLowerCase().includes(filterPeriod)
    const matchesTab = tab === 'history' 
      ? r.status === 'ready' || r.status === 'processing' || r.status === 'failed'
      : tab === 'scheduled' 
        ? r.status === 'scheduled'
        : true
    return matchesSearch && matchesPeriod && matchesTab
  })

  const readyCount = reports.filter(r => r.status === 'ready').length
  const processingCount = reports.filter(r => r.status === 'processing').length
  const scheduledCount = reports.filter(r => r.status === 'scheduled').length

  const getTypeIcon = (type: string) => {
    const template = reportTemplates.find(t => t.id === type)
    return template?.icon || FileText
  }

  const getTypeColor = (type: string) => {
    const template = reportTemplates.find(t => t.id === type)
    return { color: template?.color || 'text-muted-foreground', bg: template?.bgColor || 'bg-muted' }
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return File
      case 'xlsx': return FileSpreadsheet
      case 'csv': return Table
      default: return FileText
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return { bg: 'bg-primary/20', text: 'text-primary', label: 'Listo', icon: CheckCircle }
      case 'processing':
        return { bg: 'bg-amber-500/20', text: 'text-amber-500', label: 'Procesando', icon: Loader2 }
      case 'scheduled':
        return { bg: 'bg-blue-500/20', text: 'text-blue-500', label: 'Programado', icon: Clock }
      case 'failed':
        return { bg: 'bg-red-500/20', text: 'text-red-500', label: 'Error', icon: Zap }
      default:
        return { bg: 'bg-muted', text: 'text-muted-foreground', label: status, icon: FileText }
    }
  }

  return (
    <div className="h-full bg-background flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-border px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-sm font-semibold text-foreground">Centro de Reportes</h1>
              <p className="text-xs text-muted-foreground">Genera y descarga analisis detallados</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5 h-7 text-xs">
                <Settings className="h-3.5 w-3.5" />
                Configurar
              </Button>
              <Button variant="default" size="sm" className="gap-1.5 h-7 text-xs">
                <Plus className="h-3.5 w-3.5" />
                Programar reporte
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="flex-shrink-0 grid grid-cols-4 gap-2 px-6 py-3 border-b border-border">
          <Card className="border border-border bg-card/80 p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/20 p-1.5 flex-shrink-0">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-foreground">Reportes listos</p>
                <p className="text-lg font-bold text-foreground">{readyCount}</p>
              </div>
            </div>
          </Card>
          
          <Card className="border border-border bg-card/80 p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-accent/20 p-1.5 flex-shrink-0">
                <Loader2 className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-xs text-foreground">En proceso</p>
                <p className="text-lg font-bold text-foreground">{processingCount}</p>
              </div>
            </div>
          </Card>
          
          <Card className="border border-border bg-card/80 p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-secondary/20 p-1.5 flex-shrink-0">
                <Calendar className="h-4 w-4 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-foreground">Programados</p>
                <p className="text-lg font-bold text-foreground">{scheduledCount}</p>
              </div>
            </div>
          </Card>

          <Card className="border border-border bg-card/80 p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-destructive/20 p-1.5 flex-shrink-0">
                <TrendingUp className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-foreground">Datos procesados</p>
                <p className="text-lg font-bold text-foreground">1.2TB</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
            {([
              { id: 'generate', label: 'Generar nuevo', icon: Plus },
              { id: 'history', label: 'Historial', icon: FileText },
              { id: 'scheduled', label: 'Programados', icon: Calendar },
            ] as const).map((t) => {
              const Icon = t.icon
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    tab === t.id
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              )
            })}
          </div>

          {tab !== 'generate' && (
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar reportes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg bg-input border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-64"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={filterPeriod}
                  onChange={(e) => setFilterPeriod(e.target.value)}
                  className="bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="all">Todos los periodos</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensual">Mensual</option>
                  <option value="trimestral">Trimestral</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {tab === 'generate' ? (
            <div className="space-y-6">
              {/* Options */}
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Periodo</p>
                  <div className="flex items-center gap-2">
                    {(['week', 'month', 'quarter', 'year'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setSelectedPeriod(p)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          selectedPeriod === p
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {p === 'week' ? 'Semana' : p === 'month' ? 'Mes' : p === 'quarter' ? 'Trimestre' : 'Ano'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Formato</p>
                  <div className="flex items-center gap-2">
                    {(['pdf', 'xlsx', 'csv'] as const).map((f) => {
                      const Icon = getFormatIcon(f)
                      return (
                        <button
                          key={f}
                          onClick={() => setSelectedFormat(f)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                            selectedFormat === f
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {f.toUpperCase()}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Templates Grid */}
              <div className="grid grid-cols-2 gap-4">
                {reportTemplates.map((template) => {
                  const Icon = template.icon
                  const isGenerating = generating === template.id
                  
                  return (
                    <Card 
                      key={template.id} 
                      className={`border border-border hover:border-primary/50 p-5 transition-all hover:shadow-lg cursor-pointer group ${
                        isGenerating ? 'opacity-75 pointer-events-none' : ''
                      }`}
                      onClick={() => !isGenerating && handleGenerate(template.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`h-12 w-12 rounded-xl ${template.bgColor} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`h-6 w-6 ${template.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{template.name}</p>
                              <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                            </div>
                            {isGenerating ? (
                              <Loader2 className="h-5 w-5 text-primary animate-spin flex-shrink-0" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {template.estimatedTime}
                            </div>
                            <div className="flex items-center gap-1 flex-wrap">
                              {template.metrics.slice(0, 3).map((metric, idx) => (
                                <span key={idx} className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                  {metric}
                                </span>
                              ))}
                              {template.metrics.length > 3 && (
                                <span className="text-xs text-muted-foreground">+{template.metrics.length - 3}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => {
                  const TypeIcon = getTypeIcon(report.type)
                  const FormatIcon = getFormatIcon(report.format)
                  const typeColors = getTypeColor(report.type)
                  const statusBadge = getStatusBadge(report.status)
                  const StatusIcon = statusBadge.icon
                  
                  return (
                    <Card 
                      key={report.id} 
                      className={`border border-border hover:border-primary/50 p-4 transition-all hover:shadow-md cursor-pointer ${
                        selectedReport?.id === report.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedReport(report)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-xl ${typeColors.bg} flex items-center justify-center flex-shrink-0`}>
                          <TypeIcon className={`h-6 w-6 ${typeColors.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground truncate">{report.title}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${statusBadge.bg} ${statusBadge.text}`}>
                              <StatusIcon className={`h-3 w-3 ${report.status === 'processing' ? 'animate-spin' : ''}`} />
                              {statusBadge.label}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{report.description}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {report.date}
                            </span>
                            <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{report.period}</span>
                            {report.size !== '-' && (
                              <span className="text-xs text-muted-foreground">{report.size}</span>
                            )}
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <FormatIcon className="h-3 w-3" />
                              {report.format.toUpperCase()}
                            </span>
                            {report.downloads > 0 && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Download className="h-3 w-3" />
                                {report.downloads}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {report.status === 'ready' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDownload(report)
                                }}
                                className="gap-2"
                              >
                                <Download className="h-4 w-4" />
                                Descargar
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                }}
                                className="h-9 w-9 p-0"
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(report.id)
                            }}
                            className="h-9 w-9 p-0 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-foreground">No hay reportes</p>
                    <p className="text-sm text-muted-foreground">Genera tu primer reporte desde la pestana "Generar nuevo"</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedReport && tab !== 'generate' && (
        <div className="w-96 border-l border-border bg-card/50 flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Detalles del reporte</h2>
            <Button variant="ghost" size="sm" onClick={() => setSelectedReport(null)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-6">
            {/* Report Header */}
            <div className={`rounded-xl p-4 ${getTypeColor(selectedReport.type).bg}`}>
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = getTypeIcon(selectedReport.type)
                  const colors = getTypeColor(selectedReport.type)
                  return (
                    <div className={`h-12 w-12 rounded-lg ${colors.bg} flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 ${colors.color}`} />
                    </div>
                  )
                })()}
                <div>
                  <p className="font-semibold text-foreground">{selectedReport.title}</p>
                  <p className="text-xs text-muted-foreground">{selectedReport.date}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Descripcion</h3>
              <p className="text-sm text-foreground leading-relaxed">{selectedReport.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Periodo</p>
                <p className="text-sm font-semibold text-foreground">{selectedReport.period}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Formato</p>
                <p className="text-sm font-semibold text-foreground">{selectedReport.format.toUpperCase()}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Tamano</p>
                <p className="text-sm font-semibold text-foreground">{selectedReport.size}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Descargas</p>
                <p className="text-sm font-semibold text-foreground">{selectedReport.downloads}</p>
              </div>
            </div>

            {/* Preview */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Vista previa</h3>
              <div className="bg-muted/50 rounded-lg p-4 h-48 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Vista previa no disponible</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {selectedReport.status === 'ready' && (
                <>
                  <Button
                    variant="default"
                    className="w-full justify-between bg-primary hover:bg-primary/90"
                    onClick={() => handleDownload(selectedReport)}
                  >
                    <span className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Descargar reporte
                    </span>
                    <span className="text-xs opacity-75">{selectedReport.format.toUpperCase()}</span>
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Share2 className="h-4 w-4" />
                      Compartir
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Ver en linea
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Regenerar
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
