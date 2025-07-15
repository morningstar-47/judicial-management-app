"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Users,
  Gavel,
  Settings,
  Menu,
  X,
  Scale,
  LogOut,
  Search,
  BarChart3,
  Shield,
  Building,
} from "lucide-react"
import { getCurrentUser, logout, hasPermission, getRoleDisplayName, getRoleBadgeColor, type User } from "@/lib/auth"

interface NavigationItem {
  name: string
  href: string
  icon: any
  badge?: string
  resource: string
  action: string
}

const allNavigationItems: NavigationItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, resource: "dashboard", action: "read" },
  { name: "Recherche", href: "/recherche", icon: Search, resource: "recherche", action: "read" },
  { name: "Dossiers", href: "/dossiers", icon: FolderOpen, badge: "12", resource: "dossiers", action: "read" },
  { name: "Procès-Verbaux", href: "/pv", icon: FileText, badge: "5", resource: "pv", action: "read" },
  { name: "OPJ", href: "/opj", icon: Users, resource: "opj", action: "read" },
  { name: "Juges", href: "/juges", icon: Gavel, resource: "juges", action: "read" },
  { name: "Détenus", href: "/detenus", icon: Building, resource: "prisonniers", action: "read" },
  { name: "Audit", href: "/audit", icon: BarChart3, resource: "audit", action: "read" },
  { name: "Paramètres", href: "/parametres", icon: Settings, resource: "parametres", action: "read" },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [navigation, setNavigation] = useState<NavigationItem[]>([])
  const pathname = usePathname()

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    if (currentUser) {
      // Filtrer la navigation selon les permissions
      const allowedNavigation = allNavigationItems.filter((item) => hasPermission(item.resource, item.action))
      setNavigation(allowedNavigation)
    }
  }, [])

  const handleLogout = () => {
    logout()
    window.location.href = "/"
  }

  if (!user) return null

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-slate-800 text-white hover:bg-slate-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-slate-800 border-r border-slate-700 transform transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-3 p-6 border-b border-slate-700">
            <Scale className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-lg font-semibold text-white">SGJ</h1>
              <p className="text-xs text-slate-400">Système de Gestion Judiciaire</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="bg-red-600 text-white text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.prenom} {user.nom}
                </p>
                <div className="flex items-center gap-2">
                  <Badge className={`${getRoleBadgeColor(user.role)} text-xs`}>{getRoleDisplayName(user.role)}</Badge>
                </div>
                {user.unite && <p className="text-xs text-slate-400 truncate">{user.unite}</p>}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}
