'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { ClimateStation } from '@/lib/types'

interface ClimateStationFormProps {
  station?: ClimateStation
  onSubmit: (data: Omit<ClimateStation, 'id' | 'createdAt'>) => void
  isLoading?: boolean
}

export function ClimateStationForm({
  station,
  onSubmit,
  isLoading = false,
}: ClimateStationFormProps) {
  const [formData, setFormData] = useState({
    name: station?.name || '',
    location: station?.location || '',
    latitude: station?.latitude || '',
    longitude: station?.longitude || '',
    altitude: station?.altitude || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Nombre es requerido'
    if (!formData.location.trim()) newErrors.location = 'Ubicación es requerida'
    if (!formData.latitude) newErrors.latitude = 'Latitud es requerida'
    if (!formData.longitude) newErrors.longitude = 'Longitud es requerida'
    if (!formData.altitude) newErrors.altitude = 'Altitud es requerida'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit({
        name: formData.name,
        location: formData.location,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        altitude: parseFloat(formData.altitude),
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre de la Estación</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ej: Estación Norte"
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      <div>
        <Label htmlFor="location">Ubicación</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          placeholder="Ej: Campo Principal"
          className={errors.location ? 'border-destructive' : ''}
        />
        {errors.location && (
          <p className="mt-1 text-sm text-destructive">{errors.location}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="latitude">Latitud</Label>
          <Input
            id="latitude"
            type="number"
            step="0.0001"
            value={formData.latitude}
            onChange={(e) =>
              setFormData({ ...formData, latitude: e.target.value })
            }
            placeholder="-25.2637"
            className={errors.latitude ? 'border-destructive' : ''}
          />
          {errors.latitude && (
            <p className="mt-1 text-sm text-destructive">{errors.latitude}</p>
          )}
        </div>
        <div>
          <Label htmlFor="longitude">Longitud</Label>
          <Input
            id="longitude"
            type="number"
            step="0.0001"
            value={formData.longitude}
            onChange={(e) =>
              setFormData({ ...formData, longitude: e.target.value })
            }
            placeholder="-57.5750"
            className={errors.longitude ? 'border-destructive' : ''}
          />
          {errors.longitude && (
            <p className="mt-1 text-sm text-destructive">
              {errors.longitude}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="altitude">Altitud (metros)</Label>
        <Input
          id="altitude"
          type="number"
          value={formData.altitude}
          onChange={(e) =>
            setFormData({ ...formData, altitude: e.target.value })
          }
          placeholder="150"
          className={errors.altitude ? 'border-destructive' : ''}
        />
        {errors.altitude && (
          <p className="mt-1 text-sm text-destructive">{errors.altitude}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Guardando...
          </div>
        ) : (
          station ? 'Guardar Cambios' : 'Crear Estación'
        )}
      </Button>
    </form>
  )
}
