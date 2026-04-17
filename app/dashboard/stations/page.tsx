'use client'

import React, { useState, useMemo } from 'react'
import { Search, Plus, Edit2, Trash2, Eye, Download, Cloud, MapPin, Mountain, Calendar, Activity, Radio, Filter, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Modal } from '@/components/modal'
import { Drawer } from '@/components/drawer'
import { ConfirmationDialog } from '@/components/confirmation-dialog'
import { ClimateStationForm } from '@/components/climate-station-form'
import { mockClimateStations } from '@/lib/mock-data'
import type { ClimateStation } from '@/lib/types'

export default function StationsPage() {
  const [stations, setStations] = useState<ClimateStation[]>(mockClimateStations)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLocation, setFilterLocation] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [selectedStation, setSelectedStation] = useState<ClimateStation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')

  const itemsPerPage = 10

  // Filter and search
  const filteredStations = useMemo(() => {
    return stations.filter((station) => {
      const matchesSearch =
        station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        station.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesLocation =
        !filterLocation || station.location === filterLocation
      return matchesSearch && matchesLocation
    })
  }, [stations, searchTerm, filterLocation])

  // Pagination
  const paginatedStations = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage
    return filteredStations.slice(startIdx, startIdx + itemsPerPage)
  }, [filteredStations, currentPage])

  const totalPages = Math.ceil(filteredStations.length / itemsPerPage)
  const uniqueLocations = [...new Set(stations.map((s) => s.location))]

  // Stats
  const stats = useMemo(() => {
    const avgAltitude = stations.length > 0 
      ? Math.round(stations.reduce((acc, s) => acc + s.altitude, 0) / stations.length)
      : 0
    return {
      total: stations.length,
      locations: uniqueLocations.length,
      avgAltitude,
      recent: stations.filter(s => {
        const daysDiff = (Date.now() - s.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        return daysDiff <= 30
      }).length
    }
  }, [stations, uniqueLocations])

  // Toast handler
  const showSuccessToast = (message: string) => {
    setToastMessage(message)
    setToastType('success')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  // CRUD Operations
  const handleCreate = async (data: Omit<ClimateStation, 'id' | 'createdAt'>) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    const newStation: ClimateStation = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
    }

    setStations([...stations, newStation])
    setIsCreateModalOpen(false)
    showSuccessToast('Estacion creada exitosamente')
    setIsLoading(false)
  }

  const handleUpdate = async (data: Omit<ClimateStation, 'id' | 'createdAt'>) => {
    if (!selectedStation) return
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    const updatedStations = stations.map((s) =>
      s.id === selectedStation.id
        ? {
            ...s,
            ...data,
          }
        : s
    )

    setStations(updatedStations)
    setIsEditModalOpen(false)
    setSelectedStation(null)
    showSuccessToast('Estacion actualizada exitosamente')
    setIsLoading(false)
  }

  const handleDelete = async () => {
    if (!selectedStation) return
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    setStations(stations.filter((s) => s.id !== selectedStation.id))
    setIsDeleteConfirmOpen(false)
    setSelectedStation(null)
    showSuccessToast('Estacion eliminada exitosamente')
    setIsLoading(false)
  }

  const handleExport = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const csv = [
      ['Nombre', 'Ubicacion', 'Latitud', 'Longitud', 'Altitud', 'Fecha Creacion'].join(','),
      ...stations.map((s) =>
        [
          s.name,
          s.location,
          s.latitude,
          s.longitude,
          s.altitude,
          s.createdAt.toISOString(),
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'estaciones.csv'
    a.click()

    showSuccessToast('CSV exportado exitosamente')
    setIsLoading(false)
  }

  const openEditModal = (station: ClimateStation) => {
    setSelectedStation(station)
    setIsEditModalOpen(true)
  }

  const openDetailDrawer = (station: ClimateStation) => {
    setSelectedStation(station)
    setIsDetailDrawerOpen(true)
  }

  const openDeleteConfirm = (station: ClimateStation) => {
    setSelectedStation(station)
    setIsDeleteConfirmOpen(true)
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden p-3 gap-2">
      {/* Toast Notifications */}
      {showToast && (
        <div
          className={`fixed right-4 top-4 rounded-lg px-4 py-3 text-sm font-semibold shadow-lg z-50 animate-in fade-in slide-in-from-right-4 ${
            toastType === 'success' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-destructive text-destructive-foreground'
          }`}
        >
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-sm font-semibold text-foreground">Estaciones Climaticas</h1>
          <p className="text-xs text-muted-foreground">Gestion y monitoreo de estaciones</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} disabled={isLoading} className="gap-1 h-7 text-xs">
            <Download className="h-3 w-3" />
            Exportar
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-1 h-7 text-xs">
            <Plus className="h-3 w-3" />
            Nueva
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-2 flex-shrink-0">
        <Card className="border-0 bg-card/80 p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/20 p-1.5 flex-shrink-0">
              <Cloud className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Estaciones</p>
              <p className="text-lg font-bold text-foreground">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="border-0 bg-card/80 p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-secondary/20 p-1.5 flex-shrink-0">
              <MapPin className="h-4 w-4 text-secondary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ubicaciones</p>
              <p className="text-lg font-bold text-foreground">{stats.locations}</p>
            </div>
          </div>
        </Card>

        <Card className="border-0 bg-card/80 p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-accent/20 p-1.5 flex-shrink-0">
              <Mountain className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Altitud Prom.</p>
              <p className="text-lg font-bold text-foreground">{stats.avgAltitude}m</p>
            </div>
          </div>
        </Card>

        <Card className="border-0 bg-card/80 p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-destructive/20 p-1.5 flex-shrink-0">
              <Calendar className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Nuevas (30d)</p>
              <p className="text-lg font-bold text-foreground">{stats.recent}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 bg-card/50 p-2.5 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar estacion..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
              className="pl-8 h-8 text-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <select
              value={filterLocation}
              onChange={(e) => { setFilterLocation(e.target.value); setCurrentPage(1) }}
              className="h-8 rounded-lg border border-input bg-background pl-8 pr-8 text-sm text-foreground appearance-none cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <option value="">Todas las ubicaciones</option>
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
          <div className="flex items-center gap-1 border-l border-border pl-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
          <span className="text-xs font-medium text-primary ml-2">{filteredStations.length} registros</span>
        </div>
      </Card>

      {/* Content Area */}
      <Card className="border-0 bg-card/50 shadow-sm flex-1 min-h-0 flex flex-col overflow-hidden">
        {viewMode === 'grid' ? (
          /* Grid View */
          <div className="flex-1 overflow-auto p-3">
            <div className="grid grid-cols-3 gap-2">
              {paginatedStations.length > 0 ? (
                paginatedStations.map((station) => (
                  <div 
                    key={station.id} 
                    className="rounded-lg bg-card/80 border border-border/50 p-3 hover:border-primary/30 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-primary/20 p-1.5">
                          <Radio className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">{station.name}</h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {station.location}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary font-medium flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        Activa
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="rounded-lg bg-muted/30 p-2">
                        <p className="text-[10px] text-muted-foreground mb-0.5">Latitud</p>
                        <p className="text-xs font-semibold text-foreground">{station.latitude.toFixed(4)}</p>
                      </div>
                      <div className="rounded-lg bg-muted/30 p-2">
                        <p className="text-[10px] text-muted-foreground mb-0.5">Longitud</p>
                        <p className="text-xs font-semibold text-foreground">{station.longitude.toFixed(4)}</p>
                      </div>
                      <div className="rounded-lg bg-muted/30 p-2">
                        <p className="text-[10px] text-muted-foreground mb-0.5">Altitud</p>
                        <p className="text-xs font-semibold text-foreground">{station.altitude}m</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {station.createdAt.toLocaleDateString('es-ES')}
                      </p>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openDetailDrawer(station)} className="p-1.5 hover:bg-primary/20 rounded-lg transition-colors">
                          <Eye className="h-3.5 w-3.5 text-primary" />
                        </button>
                        <button onClick={() => openEditModal(station)} className="p-1.5 hover:bg-secondary/20 rounded-lg transition-colors">
                          <Edit2 className="h-3.5 w-3.5 text-secondary" />
                        </button>
                        <button onClick={() => openDeleteConfirm(station)} className="p-1.5 hover:bg-destructive/20 rounded-lg transition-colors">
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Cloud className="h-12 w-12 mb-2 opacity-50" />
                  <p className="text-sm">No se encontraron estaciones</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Table View */
          <div className="overflow-auto flex-1">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/30 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Estacion</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Ubicacion</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Latitud</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Longitud</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Altitud</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Fecha</th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStations.length > 0 ? (
                  paginatedStations.map((station) => (
                    <tr key={station.id} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="rounded-lg bg-primary/20 p-1.5">
                            <Radio className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <span className="font-medium text-foreground">{station.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {station.location}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{station.latitude.toFixed(4)}</td>
                      <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{station.longitude.toFixed(4)}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-1.5 py-0.5 rounded bg-accent/20 text-accent font-medium">
                          {station.altitude}m
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{station.createdAt.toLocaleDateString('es-ES')}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openDetailDrawer(station)} className="p-1.5 hover:bg-primary/20 rounded-lg transition-colors">
                            <Eye className="h-4 w-4 text-primary" />
                          </button>
                          <button onClick={() => openEditModal(station)} className="p-1.5 hover:bg-secondary/20 rounded-lg transition-colors">
                            <Edit2 className="h-4 w-4 text-secondary" />
                          </button>
                          <button onClick={() => openDeleteConfirm(station)} className="p-1.5 hover:bg-destructive/20 rounded-lg transition-colors">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                      <Cloud className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No se encontraron estaciones</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border/50 px-4 py-2.5 bg-muted/20 flex-shrink-0">
            <p className="text-sm font-medium">
              Pagina <span className="text-primary">{currentPage}</span> de {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                size="sm"
                className="h-8 text-sm px-3"
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                size="sm"
                className="h-8 text-sm px-3"
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nueva Estacion Climatica"
        description="Registra una nueva estacion de monitoreo"
        actions={[
          {
            label: 'Crear',
            onClick: () => {
              const form = document.querySelector('form') as HTMLFormElement
              form?.dispatchEvent(new Event('submit', { bubbles: true }))
            },
            isLoading,
          },
        ]}
      >
        <ClimateStationForm
          onSubmit={handleCreate}
          isLoading={isLoading}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedStation(null)
        }}
        title="Editar Estacion"
        description="Actualiza los datos de la estacion"
        actions={[
          {
            label: 'Guardar',
            onClick: () => {
              const form = document.querySelector('form') as HTMLFormElement
              form?.dispatchEvent(new Event('submit', { bubbles: true }))
            },
            isLoading,
          },
        ]}
      >
        {selectedStation && (
          <ClimateStationForm
            station={selectedStation}
            onSubmit={handleUpdate}
            isLoading={isLoading}
          />
        )}
      </Modal>

      {/* Detail Drawer */}
      <Drawer
        isOpen={isDetailDrawerOpen}
        onClose={() => {
          setIsDetailDrawerOpen(false)
          setSelectedStation(null)
        }}
        title="Detalles de la Estacion"
      >
        {selectedStation && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="rounded-xl bg-primary/20 p-3">
                <Radio className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{selectedStation.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {selectedStation.location}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground mb-1">Latitud</p>
                <p className="font-semibold text-foreground">{selectedStation.latitude.toFixed(4)}</p>
              </div>
              <div className="rounded-lg bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground mb-1">Longitud</p>
                <p className="font-semibold text-foreground">{selectedStation.longitude.toFixed(4)}</p>
              </div>
            </div>

            <div className="rounded-lg bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground mb-1">Altitud</p>
              <p className="font-semibold text-foreground">{selectedStation.altitude} metros</p>
            </div>

            <div className="rounded-lg bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground mb-1">Fecha de Creacion</p>
              <p className="font-semibold text-foreground">{selectedStation.createdAt.toLocaleDateString('es-ES')}</p>
            </div>

            <div className="flex gap-2 pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDetailDrawerOpen(false)
                  openEditModal(selectedStation)
                }}
                className="flex-1 gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Editar
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setIsDetailDrawerOpen(false)
                  openDeleteConfirm(selectedStation)
                }}
                className="flex-1 gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={isDeleteConfirmOpen}
        onConfirm={handleDelete}
        onCancel={() => {
          setIsDeleteConfirmOpen(false)
          setSelectedStation(null)
        }}
        title="Eliminar estacion"
        description={`Estas seguro de que deseas eliminar la estacion "${selectedStation?.name}"? Esta accion no se puede deshacer.`}
        confirmText="Eliminar"
        isDestructive
        isLoading={isLoading}
      />
    </div>
  )
}
