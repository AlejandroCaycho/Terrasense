'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Leaf, BarChart3, Target, Zap } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (email && password) {
      // Store in localStorage for demo purposes
      localStorage.setItem('user', JSON.stringify({ email, name: email.split('@')[0] }))
      router.push('/dashboard')
    } else {
      setError('Por favor ingresa email y contraseña')
    }

    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - Modern Gradient + Features */}
      <div className="hidden lg:flex lg:flex-1 flex-col justify-between bg-gradient-to-br from-primary via-primary/95 to-accent/90 p-12 text-white overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        </div>

        {/* Logo & Brand */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 mb-8">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
              <Leaf className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold">AgriMonitor</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl font-bold leading-tight text-white">
              Cultiva<br />con Precisión
            </h2>
            <p className="text-base text-white/80 font-medium max-w-md">
              Monitoreo inteligente en tiempo real para optimizar cada decisión agrícola
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-3 pt-4">
            {[
              { Icon: BarChart3, title: 'Datos en Tiempo Real', desc: 'Sensores conectados 24/7' },
              { Icon: Target, title: 'Recomendaciones IA', desc: 'Sugerencias automáticas' },
              { Icon: Zap, title: 'Alertas Instantáneas', desc: 'Notificaciones críticas' },
            ].map((item) => {
              const Icon = item.Icon
              return (
                <div key={item.title} className="flex items-start gap-3">
                  <Icon className="h-5 w-5 text-white/90 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white text-sm">{item.title}</p>
                    <p className="text-xs text-white/70">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 pt-8 border-t border-white/10">
          <p className="text-sm text-white/60">
            Confían en nosotros más de 500 agricultores en toda Latinoamérica
          </p>
        </div>
      </div>

      {/* Right side - Clean Login Form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-8 lg:px-12">
        <div className="w-full max-w-sm">
          {/* Mobile Logo - Small */}
          <div className="flex items-center gap-2 lg:hidden mb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Leaf className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">AgriMonitor</span>
          </div>

          {/* Form Header - Minimal & Clean */}
          <div className="mb-8 space-y-2">
            <h1 className="text-4xl font-bold text-foreground tracking-tight">Ingresa</h1>
            <p className="text-sm text-muted-foreground font-medium">
              A tu panel de monitoreo agrícola
            </p>
          </div>

          {/* Login Form - Clean */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message - Minimal */}
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/30 px-3.5 py-2.5 text-xs font-medium text-destructive">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@ejemplo.com"
                disabled={isLoading}
                className="h-10 text-sm border-border/50 focus:border-primary transition-colors"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="h-10 text-sm border-border/50 focus:border-primary transition-colors"
              />
            </div>

            {/* Submit Button - Bold CTA */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 text-sm font-bold mt-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Ingresando...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>

          {/* Demo Note - Subtle */}
          <div className="mt-6 flex items-center gap-2 rounded-lg bg-secondary/5 border border-secondary/20 px-3.5 py-2.5">
            <div className="h-1.5 w-1.5 rounded-full bg-secondary flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Demostración: Ingresa cualquier email y contraseña
            </p>
          </div>

          {/* Footer Info */}
          <p className="mt-8 text-center text-xs text-muted-foreground">
            Protegido por encriptación de grado empresarial
          </p>
        </div>
      </div>
    </div>
  )
}
