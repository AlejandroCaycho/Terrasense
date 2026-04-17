'use client'

import React from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  actions?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'destructive' | 'outline'
    isLoading?: boolean
  }[]
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions,
}: ModalProps) {
  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
      />
      <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-lg border border-border bg-card p-6 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-card-foreground">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
        {actions && actions.length > 0 && (
          <div className="mt-6 flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            {actions.map((action, idx) => (
              <Button
                key={idx}
                variant={action.variant || 'default'}
                onClick={action.onClick}
                disabled={action.isLoading}
              >
                {action.isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {action.label}
                  </div>
                ) : (
                  action.label
                )}
              </Button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
