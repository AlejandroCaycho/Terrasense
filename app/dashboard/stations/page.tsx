'use client'

import React, { useState, useMemo } from 'react'
import { Search, Plus, Edit2, Trash2, Eye, Download } from 'lucide-react'
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

  // Toast handler
  const showSuccessToast = (message: string) => {
    setToastMessage(message)
    setToastType('success')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const showErrorToast = (message: string) => {
    setToastMessage(message)
    setToastType('error')
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
    showSuccessToast('Estación creada exitosamente')
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
    showSuccessToast('Estación actualizada exitosamente')
    setIsLoading(false)
  }

  const handleDelete = async () => {
    if (!selectedStation) return
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    setStations(stations.filter((s) => s.id !== selectedStation.id))
    setIsDeleteConfirmOpen(false)
    setSelectedStation(null)
    showSuccessToast('Estación eliminada exitosamente')
    setIsLoading(false)
  }

  const handleExport = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const csv = [
      ['Nombre', 'Ubicación', 'Latitud', 'Longitud', 'Altitud', 'Fecha Creación'].join(','),
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
    <div className="flex flex-col min-h-screen bg-background">
      {/* Toast Notifications */}
      {showToast && (
        <div
          className={`fixed right-6 top-24 rounded-lg px-4 py-3 text-sm font-semibold shadow-lg z-50 animate-in fade-in slide-in-from-right-4 ${
            toastType === 'success' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-destructive text-destructive-foreground'
          }`}
        >
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm px-6 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-sm font-semibold text-foreground">
              Estaciones Climáticas
            </h1>
            <p className="text-xs text-muted-foreground">
              {filteredStations.length} estaciones disponibles
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={isLoading}
              className="gap-1 h-8 text-xs"
            >
              <Download className="h-3 w-3" />
              Exportar
            </Button>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="gap-1 h-8 text-xs"
            >
              <Plus className="h-3 w-3" />
              Nuevo
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-3 overflow-auto">
        {/* Filters Card - Compact */}
        <Card className="border-0 bg-card/50 backdrop-blur-sm p-2.5 shadow-sm">
          <div className="grid gap-2 grid-cols-4">
            <div className="col-span-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-7 h-8 text-xs"
                />
              </div>
            </div>
            <div>
              <select
                value={filterLocation}
                onChange={(e) => {
                  setFilterLocation(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full h-8 rounded-lg border border-input bg-background px-2 text-xs text-foreground"
              >
                <option value="">Todas</option>
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-end">
              <p className="text-xs font-semibold text-primary">{filteredStations.length} registros</p>
            </div>
          </div>
        </Card>

        {/* Table Card - Compact */}
        <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden flex-1 min-h-0 flex flex-col">
          <div className="overflow-x-auto overflow-y-auto flex-1">
            <table className="w-full text-xs">
              <thead className="border-b border-border bg-muted/40 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Estación</th>
                  <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Ubicación</th>
                  <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Latitud</th>
                  <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Longitud</th>
                  <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Alt.</th>
                  <th className="px-3 py-2 text-right font-semibold text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStations.length > 0 ? (
                  paginatedStations.map((station) => (
                    <tr key={station.id} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                      <td className="px-3 py-2 font-medium text-foreground">{station.name}</td>
                      <td className="px-3 py-2 text-muted-foreground">{station.location}</td>
                      <td className="px-3 py-2 text-muted-foreground">{station.latitude.toFixed(2)}</td>
                      <td className="px-3 py-2 text-muted-foreground">{station.longitude.toFixed(2)}</td>
                      <td className="px-3 py-2 text-muted-foreground">{station.altitude}m</td>
                      <td className="px-3 py-2 text-right">
                        <div className="flex items-center justify-end gap-0.5">
                          <button onClick={() => openDetailDrawer(station)} className="p-1 hover:bg-primary/20 rounded transition-colors">
                            <Eye className="h-3 w-3 text-primary" />
                          </button>
                          <button onClick={() => openEditModal(station)} className="p-1 hover:bg-secondary/20 rounded transition-colors">
                            <Edit2 className="h-3 w-3 text-secondary" />
                          </button>
                          <button onClick={() => openDeleteConfirm(station)} className="p-1 hover:bg-destructive/20 rounded transition-colors">
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">
                      No hay estaciones
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination - Compact */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border/50 px-3 py-2 bg-muted/20">
              <p className="text-xs font-semibold">
                Pág <span className="text-primary">{currentPage}</span>/{totalPages}
              </p>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  size="sm"
                  className="h-7 text-xs px-2"
                >
                  Ant
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  size="sm"
                  className="h-7 text-xs px-2"
                >
                  Sig
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nueva Estación Climática"
        description="Registra una nueva estación de monitoreo"
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
        title="Editar Estación"
        description="Actualiza los datos de la estación"
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
        title="Detalles de la Estación"
      >
        {selectedStation && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Nombre</p>
              <p className="mt-1 font-medium text-foreground">{selectedStation.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ubicación</p>
              <p className="mt-1 font-medium text-foreground">
                {selectedStation.location}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Latitud</p>
                <p className="mt-1 font-medium text-foreground">
                  {selectedStation.latitude.toFixed(4)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Longitud</p>
                <p className="mt-1 font-medium text-foreground">
                  {selectedStation.longitude.toFixed(4)}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Altitud</p>
              <p className="mt-1 font-medium text-foreground">
                {selectedStation.altitude} metros
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fecha de Creación</p>
              <p className="mt-1 font-medium text-foreground">
                {selectedStation.createdAt.toLocaleDateString('es-ES')}
              </p>
            </div>
            <div className="flex gap-2 border-t border-border pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDetailDrawerOpen(false)
                  openEditModal(selectedStation)
                }}
                className="flex-1"
              >
                Editar
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setIsDetailDrawerOpen(false)
                  openDeleteConfirm(selectedStation)
                }}
                className="flex-1"
              >
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
        title="Eliminar estación"
        description={`¿Estás seguro de que deseas eliminar la estación "${selectedStation?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        isDestructive
        isLoading={isLoading}
      />
    </div>
  )
}
