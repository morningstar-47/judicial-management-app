"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Home,
  Search,
  FileText,
  Users,
  Settings,
  LogOut,
  User,
  Shield,
  Activity,
  ChevronDown,
  Gavel,
  Building,
  Scale,
  Clock,
  UserCheck,
  AlertTriangle,
} from "lucide-react"
import { getCurrentUser, logout, getRoleDisplayName, getRoleBadgeColor, hasPermission } from "@/lib/auth"

const navigationItems = [
  {
    name: "Tableau de bord",
    href: "/dashboard",
    icon: Home,
    permission: { resource: "dashboard", action: "read" },
  },
  {
    name: "Recherche",
    href: "/recherche",
    icon: Search,
    permission: { resource: "recherche", action: "read" },
  },
  {
    name: "Dossiers",
    href: "/dossiers",
    icon: FileText,
    permission: { resource: "dossiers", action: "read" },
  },
  {
    name: "Procès-verbaux",
    href: "/pv",
    icon: FileText,
    permission: { resource: "pv", action: "read" },
  },
  {
    name: "Décisions OPJ",
    href: "/decisions",
    icon: Gavel,
    permission: { resource: "decisions", action: "read" },
    roles: ["commandant"],
  },
  {
    name: "Jugements",
    href: "/jugements",
    icon: Scale,
    permission: { resource: "jugements", action: "read" },
    roles: ["juge"],
  },
  {
    name: "OPJ",
    href: "/opj",
    icon: Shield,
    permission: { resource: "opj", action: "read" },
  },
  {
    name: "Juges",
    href: "/juges",
    icon: UserCheck,
    permission: { resource: "juges", action: "read" },
  },
  {
    name: "Détenus",
    href: "/detenus",
    icon: Users,
    permission: { resource: "prisonniers", action: "read" },
  },
  {
    name: "Centres pénitentiaires",
    href: "/centres",
    icon: Building,
    permission: { resource: "centres", action: "read" },
  },
  {
    name: "Audit",
    href: "/audit",
    icon: Activity,
    permission: { resource: "audit", action: "read" },
  },
  {
    name: "Paramètres",
    href: "/parametres",
    icon: Settings,
    permission: { resource: "parametres", action: "read" },
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!user) return null

  const filteredNavigation = navigationItems.filter((item) => {
    // Vérifier les permissions
    if (!hasPermission(item.permission.resource, item.permission.action)) {
      return false
    }

    // Vérifier les rôles spécifiques si définis
    if (item.roles && !item.roles.includes(user.role)) {
      return false
    }

    return true
  })

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 border-r border-slate-700">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-center h-16 px-4 bg-slate-900 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <Scale className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold text-white">JusticeApp</span>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 bg-slate-900/50 border-b border-slate-700">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start text-left p-2 h-auto hover:bg-slate-700">
                <div className="flex items-center space-x-3 w-full">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user.prenom} {user.nom}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${getRoleBadgeColor(user.role)}`}>
                        {getRoleDisplayName(user.role)}
                      </Badge>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700" align="start">
              <DropdownMenuLabel className="text-slate-300">Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem className="text-slate-300 hover:bg-slate-700 focus:bg-slate-700">
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-slate-300 hover:bg-slate-700 focus:bg-slate-700">
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem className="text-red-400 hover:bg-slate-700 focus:bg-slate-700" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start text-left ${
                    isActive
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.name}
                  {item.name === "Décisions OPJ" && user.role === "commandant" && (
                    <Badge className="ml-auto bg-yellow-600 text-white text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      Nouveau
                    </Badge>
                  )}
                  {item.name === "Jugements" && user.role === "juge" && (
                    <Badge className="ml-auto bg-orange-600 text-white text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Urgent
                    </Badge>
                  )}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <div className="text-xs text-slate-500 text-center">
            <p>Système Judiciaire v2.0</p>
            <p>© 2024 - Tous droits réservés</p>
          </div>
        </div>
      </div>
    </div>
  )
}
