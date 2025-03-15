"use client"

import { useState, useCallback, useEffect } from "react"

type ToastVariant = "default" | "destructive" | "success"

interface Toast {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
}

interface ToastOptions {
  title: string
  description?: string
  variant?: ToastVariant
}

// Create a singleton instance to share toast state across components
let toasts: Toast[] = []
let listeners: Function[] = []

const emitChange = () => {
  listeners.forEach(listener => listener(toasts))
}

export function useToast() {
  const [state, setState] = useState<Toast[]>(toasts)

  useEffect(() => {
    const handler = (newToasts: Toast[]) => {
      setState([...newToasts])
    }
    
    listeners.push(handler)
    return () => {
      listeners = listeners.filter(listener => listener !== handler)
    }
  }, [])

  const toast = useCallback(({ title, description, variant = "default" }: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { id, title, description, variant }
    
    toasts = [...toasts, newToast]
    emitChange()
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      toasts = toasts.filter(t => t.id !== id)
      emitChange()
    }, 5000)
    
    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    toasts = toasts.filter(t => t.id !== id)
    emitChange()
  }, [])

  return {
    toasts: state,
    toast,
    dismiss
  }
} 