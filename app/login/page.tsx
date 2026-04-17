'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Leaf, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (email && password) {
      localStorage.setItem('user', JSON.stringify({ email, name: email.split('@')[0] }))
      router.push('/dashboard')
    } else {
      setError('Por favor ingresa email y contraseña')
    }

    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Hero with Image */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        {/* Background Image */}
        <Image
          src="/images/login-bg.jpg"
          alt="Campo agrícola con cultivos verdes"
          fill
          className="object-cover"
          priority
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f1a]/95 via-[#0a1f1a]/80 to-[#0a1f1a]/40" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">TerraSense</span>
              <p className="text-xs text-white/60">Agricultura Inteligente</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-white/90">Monitoreo en tiempo real</span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-5xl xl:text-6xl font-bold leading-[1.1] text-white">
                El futuro de<br />
                tu <span className="text-primary">campo</span><br />
                comienza hoy
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-base text-white/70 max-w-md leading-relaxed">
              Conecta tus cultivos con tecnología de precisión.<br />
              Toma decisiones basadas en datos reales.
            </p>

            {/* Stats */}
            <div className="flex items-center gap-10 pt-4">
              <div>
                <p className="text-3xl font-bold text-white">+500</p>
                <p className="text-xs text-white/50 mt-1">Agricultores activos</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">98%</p>
                <p className="text-xs text-white/50 mt-1">Precisión de datos</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">24/7</p>
                <p className="text-xs text-white/50 mt-1">Monitoreo continuo</p>
              </div>
            </div>
          </div>

          {/* Footer with Avatars */}
          <div className="flex items-center gap-4 pt-8">
            {/* Avatar Stack */}
            <div className="flex -space-x-3">
              {['A', 'B', 'C', 'D'].map((letter, i) => (
                <div
                  key={letter}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0a1f1a] text-xs font-bold text-white"
                  style={{
                    backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'][i],
                  }}
                >
                  {letter}
                </div>
              ))}
            </div>
            <p className="text-sm text-white/60">
              Confiado por agricultores de <span className="text-white font-medium">toda Latinoamérica</span>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex flex-1 flex-col bg-[#0d1f1a]">
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-12 lg:px-16">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="flex items-center gap-3 lg:hidden mb-10">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <span className="text-lg font-bold text-white">TerraSense</span>
                <p className="text-xs text-white/60">Agricultura Inteligente</p>
              </div>
            </div>

            {/* Form Header */}
            <div className="mb-10">
              <h2 className="text-4xl font-bold text-white tracking-tight">Bienvenido</h2>
              <p className="text-base text-white/50 mt-2">
                Ingresa a tu panel de monitoreo agrícola
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-xl bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-white/80">
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  disabled={isLoading}
                  className="h-12 bg-[#162822] border-[#1e3a32] text-white placeholder:text-white/30 focus:border-primary focus:ring-primary/20"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-white/80">
                    Contraseña
                  </Label>
                  <button
                    type="button"
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingresa tu contraseña"
                    disabled={isLoading}
                    className="h-12 bg-[#162822] border-[#1e3a32] text-white placeholder:text-white/30 focus:border-primary focus:ring-primary/20 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground mt-2"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Ingresando...
                  </div>
                ) : (
                  <span className="flex items-center gap-2">
                    Iniciar sesión
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-[#0d1f1a] px-4 text-white/40">o continúa con</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                className="h-12 bg-transparent border-[#1e3a32] text-white hover:bg-[#162822] hover:text-white"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12 bg-transparent border-[#1e3a32] text-white hover:bg-[#162822] hover:text-white"
              >
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Button>
            </div>

            {/* Demo Notice */}
            <div className="mt-8 flex items-center gap-3 rounded-xl bg-primary/10 border border-primary/20 px-4 py-3">
              <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
              <p className="text-sm text-white/70">
                <span className="text-primary font-medium">Demo:</span> Usa cualquier email y contraseña
              </p>
            </div>

            {/* Register Link */}
            <p className="mt-6 text-center text-sm text-white/50">
              ¿No tienes cuenta?{' '}
              <button type="button" className="text-primary font-medium hover:text-primary/80 transition-colors">
                Regístrate gratis
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="py-6 text-center border-t border-white/5">
          <p className="flex items-center justify-center gap-2 text-xs text-white/30">
            <Shield className="h-3.5 w-3.5" />
            Protegido con encriptación de grado empresarial
          </p>
        </div>
      </div>
    </div>
  )
}
