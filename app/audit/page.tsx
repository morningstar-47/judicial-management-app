"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Search, Calendar, User, Activity, Shield, AlertTriangle, CheckCircle } from "lucide-react"
import Sidebar from "@/components/layout/sidebar"
import PermissionGuard from "@/components/auth/permission-guard"
import { getCurrentUser } from "@/lib/auth"

interface AuditLog {
  id: string
  timestamp: string
  user: string
  action: string
  resource: string
  details: string
  ip: string
  status: "success" | "warning" | "error"
}

const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    timestamp: "2024-01-15T14:30:00Z",
    user: "admin",
    action: "CREATE",
    resource: "PV",
    details: "Création du PV #2024-001",
    ip: "192.168.1.100",
    status: "success",
  },
  {
    id: "2",
    timestamp: "2024-01-15T14:25:00Z",
    user: "opj1",
    action: "UPDATE",
    resource: "DOSSIER",
    details: "Modification du dossier DOS-2024-001",
    ip: "192.168.1.101",
    status: "success",
  },
  {
    id: "3",
    timestamp: "2024-01-15T14:20:00Z",
    user: "greffier1",
    action: "DELETE",
    resource: "PRISONNIER",
    details: "Tentative de suppression non autorisée",
    ip: "192.168.1.102",
    status: "error",
  },
  {
    id: "4",
    timestamp: "2024-01-15T14:15:00Z",
    user: "superviseur1",
    action: "READ",
    resource: "STATISTIQUES",
    details: "Consultation des statistiques mensuelles",
    ip: "192.168.1.103",
    status: "success",
  },
  {
    id: "5",
    timestamp: "2024-01-15T14:10:00Z",
    user: "admin",
    action: "LOGIN",
    resource: "SYSTEM",
    details: "Connexion administrateur",
    ip: "192.168.1.100",
    status: "success",
  },
]

export default function AuditPage() {
  const router = useRouter()
  const [logs, setLogs] = useState<AuditLog[]>(mockAuditLogs)
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("tous")
  const [statusFilter, setStatusFilter] = useState("tous")

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/")
    }
  }, [router])

  const getStatusBadge = (status: string) => {
    const variants = {
      success: "bg-green-600 text-white",
      warning: "bg-yellow-600 text-white",
      error: "bg-red-600 text-white",
    }
    return variants[status as keyof typeof variants] || variants.success
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      default:
        return <Activity className="h-4 w-4 text-blue-400" />
    }
  }

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesAction = actionFilter === "tous" || log.action === actionFilter
    const matchesStatus = statusFilter === "tous" || log.status === statusFilter

    return matchesSearch && matchesAction && matchesStatus
  })

  const stats = {
    total: logs.length,
    success: logs.filter((l) => l.status === "success").length,
    warnings: logs.filter((l) => l.status === "warning").length,
    errors: logs.filter((l) => l.status === "error").length,
  }

  return (
    <PermissionGuard resource="audit" action="read">
      <div className="min-h-screen bg-slate-900">
        <Sidebar />

        <div className="md:ml-64 p-6">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">Audit et Logs</h1>
                <p className="text-slate-400">Suivi des activités et actions système</p>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Actions</p>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Succès</p>
                    <p className="text-2xl font-bold text-green-400">{stats.success}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Avertissements</p>
                    <p className="text-2xl font-bold text-yellow-400">{stats.warnings}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Erreurs</p>
                    <p className="text-2xl font-bold text-red-400">{stats.errors}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtres */}
          <Card className="bg-slate-800 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Filtres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Rechercher dans les logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>

                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="tous">Toutes les actions</SelectItem>
                    <SelectItem value="CREATE">Création</SelectItem>
                    <SelectItem value="READ">Lecture</SelectItem>
                    <SelectItem value="UPDATE">Modification</SelectItem>
                    <SelectItem value="DELETE">Suppression</SelectItem>
                    <SelectItem value="LOGIN">Connexion</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="tous">Tous les statuts</SelectItem>
                    <SelectItem value="success">Succès</SelectItem>
                    <SelectItem value="warning">Avertissement</SelectItem>
                    <SelectItem value="error">Erreur</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-400">Dernières 24h</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Table des logs */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Timestamp</TableHead>
                      <TableHead className="text-slate-300">Utilisateur</TableHead>
                      <TableHead className="text-slate-300">Action</TableHead>
                      <TableHead className="text-slate-300">Ressource</TableHead>
                      <TableHead className="text-slate-300">Détails</TableHead>
                      <TableHead className="text-slate-300">IP</TableHead>
                      <TableHead className="text-slate-300">Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id} className="border-slate-700 hover:bg-slate-700/50">
                        <TableCell className="text-slate-300 font-mono text-sm">
                          {new Date(log.timestamp).toLocaleString("fr-FR")}
                        </TableCell>
                        <TableCell className="text-slate-200">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-slate-400" />
                            {log.user}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              log.action === "CREATE"
                                ? "bg-green-600 text-white"
                                : log.action === "DELETE"
                                  ? "bg-red-600 text-white"
                                  : log.action === "UPDATE"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-600 text-white"
                            }
                          >
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-300">{log.resource}</TableCell>
                        <TableCell className="text-slate-300 max-w-xs truncate">{log.details}</TableCell>
                        <TableCell className="text-slate-400 font-mono text-sm">{log.ip}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(log.status)}
                            <Badge className={getStatusBadge(log.status)}>{log.status}</Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg mb-2">Aucun log trouvé</p>
              <p className="text-slate-500">Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </div>
      </div>
    </PermissionGuard>
  )
}
