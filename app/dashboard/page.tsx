"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, FileText, Send, Archive, Users, TrendingUp, Clock, Shield } from "lucide-react"
import Sidebar from "@/components/layout/sidebar"
import PermissionGuard from "@/components/auth/permission-guard"
import { getCurrentUser, getRoleDisplayName } from "@/lib/auth"

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/")
    }
  }, [router])

  const user = getCurrentUser()
  if (!user) return null

  const stats = [
    {
      title: "PV Urgents",
      value: "8",
      description: "Nécessitent une attention immédiate",
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-900/20",
      borderColor: "border-red-700",
      show: ["administrateur", "superviseur", "police"].includes(user.role),
    },
    {
      title: "Brouillons",
      value: "15",
      description: "En cours de rédaction",
      icon: FileText,
      color: "text-yellow-400",
      bgColor: "bg-yellow-900/20",
      borderColor: "border-yellow-700",
      show: ["administrateur", "police"].includes(user.role),
    },
    {
      title: "Transmis",
      value: "42",
      description: "Envoyés au parquet",
      icon: Send,
      color: "text-blue-400",
      bgColor: "bg-blue-900/20",
      borderColor: "border-blue-700",
      show: ["administrateur", "superviseur"].includes(user.role),
    },
    {
      title: "Prisonniers",
      value: "28",
      description: "Actuellement détenus",
      icon: Archive,
      color: "text-green-400",
      bgColor: "bg-green-900/20",
      borderColor: "border-green-700",
      show: ["administrateur", "greffier"].includes(user.role),
    },
  ]

  const recentActivity = [
    {
      id: 1,
      action: "PV #2024-001 créé",
      time: "Il y a 2h",
      urgent: true,
      show: ["administrateur", "police", "superviseur"],
    },
    { id: 2, action: "Prisonnier transféré", time: "Il y a 4h", urgent: false, show: ["administrateur", "greffier"] },
    { id: 3, action: "Nouvel OPJ ajouté", time: "Il y a 6h", urgent: false, show: ["administrateur"] },
    { id: 4, action: "Dossier archivé", time: "Il y a 8h", urgent: false, show: ["administrateur", "superviseur"] },
  ]

  const filteredStats = stats.filter((stat) => stat.show)
  const filteredActivity = recentActivity.filter((activity) => activity.show.includes(user.role))

  return (
    <PermissionGuard resource="dashboard" action="read">
      <div className="min-h-screen bg-slate-900">
        <Sidebar />

        <div className="md:ml-64 p-6">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">Dashboard - {getRoleDisplayName(user.role)}</h1>
                <p className="text-slate-400">
                  Bienvenue {user.prenom} {user.nom} - Vue d'ensemble adaptée à votre rôle
                </p>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {filteredStats.map((stat) => (
              <Card key={stat.title} className={`bg-slate-800 border-slate-700 ${stat.borderColor}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-200">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <p className="text-xs text-slate-400">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Activity Chart - Visible pour admin et superviseur */}
            {["administrateur", "superviseur"].includes(user.role) && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Activité par Catégorie</CardTitle>
                  <CardDescription className="text-slate-400">Répartition des PV par type d'infraction</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Vol</span>
                      <span className="text-sm text-slate-400">35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Agression</span>
                      <span className="text-sm text-slate-400">28%</span>
                    </div>
                    <Progress value={28} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Trafic</span>
                      <span className="text-sm text-slate-400">22%</span>
                    </div>
                    <Progress value={22} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Autres</span>
                      <span className="text-sm text-slate-400">15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Activité Récente</CardTitle>
                <CardDescription className="text-slate-400">Dernières actions dans votre domaine</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${activity.urgent ? "bg-red-400" : "bg-green-400"}`} />
                      <div className="flex-1">
                        <p className="text-sm text-slate-200">{activity.action}</p>
                        <p className="text-xs text-slate-400">{activity.time}</p>
                      </div>
                      {activity.urgent && (
                        <Badge variant="destructive" className="text-xs">
                          Urgent
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Role-specific Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stats communes */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">
                  {user.role === "greffier" ? "Prisonniers Actifs" : "OPJ Actifs"}
                </CardTitle>
                <Users className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{user.role === "greffier" ? "156" : "24"}</div>
                <p className="text-xs text-slate-400">
                  {user.role === "greffier" ? "Détenus actuellement" : "+2 ce mois"}
                </p>
              </CardContent>
            </Card>

            {["administrateur", "superviseur"].includes(user.role) && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-200">Taux de Résolution</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">87%</div>
                  <p className="text-xs text-slate-400">+5% vs mois dernier</p>
                </CardContent>
              </Card>
            )}

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">
                  {user.role === "police" ? "Mes PV" : "Temps Moyen"}
                </CardTitle>
                <Clock className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{user.role === "police" ? "12" : "3.2j"}</div>
                <p className="text-xs text-slate-400">
                  {user.role === "police" ? "En cours de traitement" : "Traitement des dossiers"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PermissionGuard>
  )
}
