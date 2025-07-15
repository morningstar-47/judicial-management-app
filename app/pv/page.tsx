"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Plus, Edit, Send, Archive, AlertTriangle, Calendar, User } from "lucide-react"
import Sidebar from "@/components/layout/sidebar"

interface PV {
  id: string
  numero: string
  titre: string
  categorie: string
  priorite: "faible" | "normale" | "haute" | "urgente"
  statut: "brouillon" | "en_cours" | "transmis" | "archive"
  opj: string
  date: string
}

const mockPVs: PV[] = [
  {
    id: "1",
    numero: "PV-2024-001",
    titre: "Vol à main armée - Banque Centrale",
    categorie: "Vol",
    priorite: "urgente",
    statut: "en_cours",
    opj: "Capitaine Martin",
    date: "2024-01-15",
  },
  {
    id: "2",
    numero: "PV-2024-002",
    titre: "Agression physique - Place de la République",
    categorie: "Agression",
    priorite: "haute",
    statut: "brouillon",
    opj: "Lieutenant Dubois",
    date: "2024-01-14",
  },
  {
    id: "3",
    numero: "PV-2024-003",
    titre: "Trafic de stupéfiants - Quartier Nord",
    categorie: "Trafic",
    priorite: "normale",
    statut: "transmis",
    opj: "Sergent Moreau",
    date: "2024-01-13",
  },
  {
    id: "4",
    numero: "PV-2024-004",
    titre: "Cambriolage résidentiel - Rue des Lilas",
    categorie: "Vol",
    priorite: "normale",
    statut: "archive",
    opj: "Brigadier Leroy",
    date: "2024-01-12",
  },
]

export default function PVPage() {
  const router = useRouter()
  const [pvs, setPvs] = useState<PV[]>(mockPVs)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("tous")
  const [priorityFilter, setPriorityFilter] = useState("tous")

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [router])

  const getPriorityBadge = (priorite: string) => {
    const variants = {
      faible: "bg-gray-600 text-white",
      normale: "bg-blue-600 text-white",
      haute: "bg-orange-600 text-white",
      urgente: "bg-red-600 text-white",
    }
    return variants[priorite as keyof typeof variants] || variants.normale
  }

  const getStatusBadge = (statut: string) => {
    const variants = {
      brouillon: "bg-yellow-600 text-white",
      en_cours: "bg-blue-600 text-white",
      transmis: "bg-green-600 text-white",
      archive: "bg-gray-600 text-white",
    }
    return variants[statut as keyof typeof variants] || variants.brouillon
  }

  const filteredPVs = pvs.filter((pv) => {
    const matchesSearch =
      pv.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pv.numero.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "tous" || pv.statut === statusFilter
    const matchesPriority = priorityFilter === "tous" || pv.priorite === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar />

      <div className="md:ml-64 p-6">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Procès-Verbaux</h1>
              <p className="text-slate-400">Gestion des procès-verbaux et rapports</p>
            </div>
            <Link href="/pv/nouveau">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau PV
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Rechercher un PV..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="tous">Tous les statuts</SelectItem>
                  <SelectItem value="brouillon">Brouillon</SelectItem>
                  <SelectItem value="en_cours">En cours</SelectItem>
                  <SelectItem value="transmis">Transmis</SelectItem>
                  <SelectItem value="archive">Archivé</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Priorité" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="tous">Toutes priorités</SelectItem>
                  <SelectItem value="faible">Faible</SelectItem>
                  <SelectItem value="normale">Normale</SelectItem>
                  <SelectItem value="haute">Haute</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent">
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* PV Table */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">N° PV</TableHead>
                    <TableHead className="text-slate-300">Titre</TableHead>
                    <TableHead className="text-slate-300">Catégorie</TableHead>
                    <TableHead className="text-slate-300">Priorité</TableHead>
                    <TableHead className="text-slate-300">Statut</TableHead>
                    <TableHead className="text-slate-300">OPJ</TableHead>
                    <TableHead className="text-slate-300">Date</TableHead>
                    <TableHead className="text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPVs.map((pv) => (
                    <TableRow key={pv.id} className="border-slate-700 hover:bg-slate-700/50">
                      <TableCell className="text-slate-200 font-mono">{pv.numero}</TableCell>
                      <TableCell className="text-slate-200">
                        <div className="flex items-center gap-2">
                          {pv.priorite === "urgente" && <AlertTriangle className="h-4 w-4 text-red-400" />}
                          {pv.titre}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">{pv.categorie}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityBadge(pv.priorite)}>{pv.priorite}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(pv.statut)}>{pv.statut.replace("_", " ")}</Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {pv.opj}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(pv.date).toLocaleDateString("fr-FR")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-blue-400 hover:text-blue-300 hover:bg-slate-700"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-400 hover:text-green-300 hover:bg-slate-700"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-gray-300 hover:bg-slate-700"
                          >
                            <Archive className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {filteredPVs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">Aucun procès-verbal trouvé avec ces critères.</p>
          </div>
        )}
      </div>
    </div>
  )
}
