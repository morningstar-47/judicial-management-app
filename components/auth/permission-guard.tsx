"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, hasPermission } from "@/lib/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface PermissionGuardProps {
  resource: string
  action: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function PermissionGuard({ resource, action, children, fallback }: PermissionGuardProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/")
      return
    }

    const access = hasPermission(resource, action)
    setHasAccess(access)
  }, [resource, action, router])

  if (hasAccess === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-400 border-t-transparent" />
      </div>
    )
  }

  if (!hasAccess) {
    return (
      fallback || (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <Alert className="max-w-md bg-red-900/50 border-red-700">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">
              Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.
            </AlertDescription>
          </Alert>
        </div>
      )
    )
  }

  return <>{children}</>
}

// Hook pour vérifier les permissions
export function usePermission(resource: string, action: string): boolean {
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    setHasAccess(hasPermission(resource, action))
  }, [resource, action])

  return hasAccess
}

// Composant pour afficher conditionnellement selon les permissions
interface PermissionWrapperProps {
  resource: string
  action: string
  children: React.ReactNode
}

export function PermissionWrapper({ resource, action, children }: PermissionWrapperProps) {
  const hasAccess = usePermission(resource, action)
  return hasAccess ? <>{children}</> : null
}
