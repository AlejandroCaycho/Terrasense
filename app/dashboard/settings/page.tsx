'use client'

import React, { useState } from 'react'
import { User, Bell, Settings as SettingsIcon, Save, LogOut } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const userInfo = {
  name: 'Juan Pérez',
  email: 'juan@agrimonitor.com',
  farm: 'Granja Los Andes',
  location: 'Valle del Cauca, Colombia',
}

const notificationSettings = [
  { id: 'alerts', label: 'Alertas Críticas', enabled: true, desc: 'Notificaciones de eventos críticos' },
  { id: 'warnings', label: 'Advertencias', enabled: true, desc: 'Notificaciones de advertencias' },
  { id: 'reports', label: 'Reportes', enabled: false, desc: 'Reportes semanales automáticos' },
  { id: 'maintenance', label: 'Mantenimiento', enabled: true, desc: 'Recordatorios de mantenimiento' },
]

const systemSettings = [
  { id: 'units', label: 'Unidades de Medida', value: 'Métrico (°C, %)' },
  { id: 'timezone', label: 'Zona Horaria', value: 'America/Bogota' },
  { id: 'language', label: 'Idioma', value: 'Español' },
  { id: 'theme', label: 'Tema', value: 'Sistema' },
]

export default function SettingsPage() {
  const [tab, setTab] = useState<'profile' | 'notifications' | 'system'>('profile')
  const [notifications, setNotifications] = useState(notificationSettings)
  const [saving, setSaving] = useState(false)

  const handleNotificationToggle = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, enabled: !n.enabled } : n
    ))
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-sm font-semibold text-foreground">Configuración</h1>
            <p className="text-xs text-muted-foreground">Manage your account and preferences</p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            size="sm"
            className="gap-1 h-8 text-xs"
          >
            <Save className="h-3 w-3" />
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-border overflow-x-auto">
        {[
          { id: 'profile', label: 'Perfil', icon: User },
          { id: 'notifications', label: 'Notificaciones', icon: Bell },
          { id: 'system', label: 'Sistema', icon: SettingsIcon },
        ].map((tabItem) => {
          const Icon = tabItem.icon
          return (
            <button
              key={tabItem.id}
              onClick={() => setTab(tabItem.id as any)}
              className={`flex items-center gap-1.5 text-xs font-semibold pb-2 border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                tab === tabItem.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-3 w-3" />
              {tabItem.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {tab === 'profile' && (
          <div className="space-y-4">
            <Card className="border-0 bg-card/50 p-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">Nombre Completo</label>
                <Input defaultValue={userInfo.name} className="h-8 text-xs" />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">Email</label>
                <Input defaultValue={userInfo.email} type="email" className="h-8 text-xs" />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">Nombre de la Granja</label>
                <Input defaultValue={userInfo.farm} className="h-8 text-xs" />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">Ubicación</label>
                <Input defaultValue={userInfo.location} className="h-8 text-xs" />
              </div>
            </Card>

            <Card className="border-0 bg-destructive/10 border-l-2 border-destructive p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-foreground">Cerrar Sesión</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Finalizar tu sesión actual</p>
                </div>
                <Button variant="outline" size="sm" className="gap-1 h-7 text-xs">
                  <LogOut className="h-3 w-3" />
                  Salir
                </Button>
              </div>
            </Card>
          </div>
        )}

        {tab === 'notifications' && (
          <div className="space-y-2">
            {notifications.map((notif) => (
              <Card key={notif.id} className="border-0 bg-card/50 p-3 flex items-center justify-between hover:bg-card/70 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-foreground">{notif.label}</p>
                  <p className="text-xs text-muted-foreground">{notif.desc}</p>
                </div>
                <button
                  onClick={() => handleNotificationToggle(notif.id)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full flex-shrink-0 transition-colors ${
                    notif.enabled ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notif.enabled ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </Card>
            ))}
          </div>
        )}

        {tab === 'system' && (
          <div className="space-y-2">
            {systemSettings.map((setting) => (
              <Card key={setting.id} className="border-0 bg-card/50 p-3 flex items-center justify-between hover:bg-card/70 transition-colors">
                <div>
                  <p className="text-xs font-semibold text-foreground">{setting.label}</p>
                  <p className="text-xs text-muted-foreground">{setting.value}</p>
                </div>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  Cambiar
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
