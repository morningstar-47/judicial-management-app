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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Archive,
  AlertTriangle,
  Calendar,
  User,
  FileText,
  Folder,
  TrendingUp,
  BarChart3,
} from "lucide-react"
import Sidebar from "@/components/layout/sidebar"

interface Dossier {
  id: string
  numero: string
  titre: string
  description: string
  categorie: string
  priorite: "faible" | "normale" | "haute" | "urgente"
  statut: "ouvert" | "en_cours" | "en_attente" | "clos" | "archive"
  dateOuverture: string
  dateCloture?: string
  opjResponsable: string
  jugeInstructeur?: string
  nbPV: number
  nbTemoins: number
  progression: number
  lieu: string
  montantPrejudice?: number
}

const mockDossiers: Dossier[] = [
  {
    id: "1",
    numero: "DOS-2024-001",
    titre: "Réseau de trafic de stupéfiants - Quartier Nord",
    description: "Enquête sur un réseau organisé de trafic de stupéfiants impliquant plusieurs suspects",
    categorie: "Trafic",
    priorite: "urgente",
    statut: "en_cours",
    dateOuverture: "2024-01-10",
    opjResponsable: "Capitaine Martin",
    jugeInstructeur: "Juge Rousseau",
    nbPV: 8,
    nbTemoins: 12,
    progression: 75,
    lieu: "Quartier Nord, Paris",
    montantPrejudice: 150000,
  },
  {
    id: "2",
    numero: "DOS-2024-002",
    titre: "Série de cambriolages - Zone résidentielle",
    description: "Enquête sur une série de cambriolages dans le secteur résidentiel",
    categorie: "Vol",
    priorite: "haute",
    statut: "en_cours",
    dateOuverture: "2024-01-08",
    opjResponsable: "Lieutenant Dubois",
    jugeInstructeur: "Juge Bernard",
    nbPV: 5,
    nbTemoins: 8,
    progression: 45,
    lieu: "Zone résidentielle Est",
    montantPrejudice: 75000,
  },
  {
    id: "3",
    numero: "DOS-2024-003",
    titre: "Fraude aux assurances - Compagnie ABC",
    description: "Enquête sur des fraudes présumées dans le secteur des assurances",
    categorie: "Fraude",
    priorite: "normale",
    statut: "en_attente",
    dateOuverture: "2024-01-05",
    opjResponsable: "Sergent Moreau",
    nbPV: 3,
    nbTemoins: 6,
    progression: 30,
    lieu: "Centre-ville",
    montantPrejudice: 200000,
  },
  {
    id: "4",
    numero: "DOS-2023-156",
    titre: "Agression avec arme - Place de la République",
    description: "Agression avec arme blanche sur la voie publique",
    categorie: "Agression",
    priorite: "haute",
    statut: "clos",
    dateOuverture: "2023-12-15",
    dateCloture: "2024-01-12",
    opjResponsable: "Brigadier Leroy",
    jugeInstructeur: "Juge Lefebvre",
    nbPV: 2,
    nbTemoins: 4,
    progression: 100,
    lieu: "Place de la République",
  },
  {
    id: "5",
    numero: "DOS-2024-004",
    titre: "Cybercriminalité - Piratage de données",
    description: "Enquête sur un piratage de données d'entreprise avec demande de rançon",
    categorie: "Cybercriminalité",
    priorite: "urgente",
    statut: "ouvert",
    dateOuverture: "2024-01-14",
    opjResponsable: "Capitaine Martin",
    nbPV: 1,
    nbTemoins: 2,
    progression: 15,
    lieu: "Zone industrielle",
    montantPrejudice: 500000,
  },
]

export default function DossiersPage() {
  const router = useRouter()
  const [dossiers, setDossiers] = useState<Dossier[]>(mockDossiers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("tous")
  const [priorityFilter, setPriorityFilter] = useState("tous")
  const [categoryFilter, setCategoryFilter] = useState("tous")
  const [activeTab, setActiveTab] = useState("liste")

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
      ouvert: "bg-green-600 text-white",
      en_cours: "bg-blue-600 text-white",
      en_attente: "bg-yellow-600 text-white",
      clos: "bg-gray-600 text-white",
      archive: "bg-slate-600 text-white",
    }
    return variants[statut as keyof typeof variants] || variants.ouvert
  }

  const getProgressColor = (progression: number) => {
    if (progression >= 80) return "bg-green-500"
    if (progression >= 50) return "bg-blue-500"
    if (progression >= 25) return "bg-yellow-500"
    return "bg-red-500"
  }

  const filteredDossiers = dossiers.filter((dossier) => {
    const matchesSearch =
      dossier.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "tous" || dossier.statut === statusFilter
    const matchesPriority = priorityFilter === "tous" || dossier.priorite === priorityFilter
    const matchesCategory = categoryFilter === "tous" || dossier.categorie === categoryFilter

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  // Statistiques
  const stats = {
    total: dossiers.length,
    ouverts: dossiers.filter((d) => d.statut === "ouvert").length,
    enCours: dossiers.filter((d) => d.statut === "en_cours").length,
    urgents: dossiers.filter((d) => d.priorite === "urgente").length,
    clos: dossiers.filter((d) => d.statut === "clos").length,
    progressionMoyenne: Math.round(dossiers.reduce((acc, d) => acc + d.progression, 0) / dossiers.length),
  }

  // Données pour les graphiques
  const categoriesData = dossiers.reduce(
    (acc, dossier) => {
      acc[dossier.categorie] = (acc[dossier.categorie] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const categories = Object.keys(categoriesData)

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar />

      <div className="md:ml-64 p-6">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Dossiers</h1>
              <p className="text-slate-400">Gestion des dossiers d'enquête et de procédure</p>
            </div>
            <Link href="/dossiers/nouveau">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Dossier
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <Folder className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Ouverts</p>
                  <p className="text-2xl font-bold text-green-400">{stats.ouverts}</p>
                </div>
                <div className="w-3 h-3 bg-green-400 rounded-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">En cours</p>
                  <p className="text-2xl font-bold text-blue-400">{stats.enCours}</p>
                </div>
                <div className="w-3 h-3 bg-blue-400 rounded-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Urgents</p>
                  <p className="text-2xl font-bold text-red-400">{stats.urgents}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Clos</p>
                  <p className="text-2xl font-bold text-gray-400">{stats.clos}</p>
                </div>
                <Archive className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Progression</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.progressionMoyenne}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-800 border-slate-700 mb-6">
            <TabsTrigger value="liste" className="data-[state=active]:bg-blue-600">
              <FileText className="h-4 w-4 mr-2" />
              Liste des dossiers
            </TabsTrigger>
            <TabsTrigger value="statistiques" className="data-[state=active]:bg-blue-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              Statistiques
            </TabsTrigger>
          </TabsList>

          <TabsContent value="liste">
            {/* Filtres */}
            <Card className="bg-slate-800 border-slate-700 mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Rechercher un dossier..."
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
                      <SelectItem value="ouvert">Ouvert</SelectItem>
                      <SelectItem value="en_cours">En cours</SelectItem>
                      <SelectItem value="en_attente">En attente</SelectItem>
                      <SelectItem value="clos">Clos</SelectItem>
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

                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="tous">Toutes catégories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                    onClick={() => {
                      setSearchTerm("")
                      setStatusFilter("tous")
                      setPriorityFilter("tous")
                      setCategoryFilter("tous")
                    }}
                  >
                    Réinitialiser
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Table des dossiers */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-300">N° Dossier</TableHead>
                        <TableHead className="text-slate-300">Titre</TableHead>
                        <TableHead className="text-slate-300">Catégorie</TableHead>
                        <TableHead className="text-slate-300">Priorité</TableHead>
                        <TableHead className="text-slate-300">Statut</TableHead>
                        <TableHead className="text-slate-300">Progression</TableHead>
                        <TableHead className="text-slate-300">OPJ</TableHead>
                        <TableHead className="text-slate-300">Date</TableHead>
                        <TableHead className="text-slate-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDossiers.map((dossier) => (
                        <TableRow key={dossier.id} className="border-slate-700 hover:bg-slate-700/50">
                          <TableCell className="text-slate-200 font-mono">{dossier.numero}</TableCell>
                          <TableCell className="text-slate-200">
                            <div className="flex items-center gap-2">
                              {dossier.priorite === "urgente" && <AlertTriangle className="h-4 w-4 text-red-400" />}
                              <div>
                                <p className="font-medium">{dossier.titre}</p>
                                <p className="text-xs text-slate-400 truncate max-w-xs">{dossier.description}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-300">{dossier.categorie}</TableCell>
                          <TableCell>
                            <Badge className={getPriorityBadge(dossier.priorite)}>{dossier.priorite}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadge(dossier.statut)}>{dossier.statut.replace("_", " ")}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-slate-700 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${getProgressColor(dossier.progression)}`}
                                  style={{ width: `${dossier.progression}%` }}
                                />
                              </div>
                              <span className="text-xs text-slate-400">{dossier.progression}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-300">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {dossier.opjResponsable}
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-300">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {new Date(dossier.dateOuverture).toLocaleDateString("fr-FR")}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-blue-400 hover:text-blue-300 hover:bg-slate-700"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-green-400 hover:text-green-300 hover:bg-slate-700"
                              >
                                <Edit className="h-4 w-4" />
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
          </TabsContent>

          <TabsContent value="statistiques">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Répartition par catégorie */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Répartition par Catégorie</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(categoriesData).map(([category, count]) => {
                    const percentage = Math.round((count / dossiers.length) * 100)
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-300">{category}</span>
                          <span className="text-sm text-slate-400">
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Dossiers récents */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Dossiers Récents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dossiers
                      .sort((a, b) => new Date(b.dateOuverture).getTime() - new Date(a.dateOuverture).getTime())
                      .slice(0, 5)
                      .map((dossier) => (
                        <div key={dossier.id} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-200">{dossier.titre}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-xs text-slate-400">{dossier.numero}</span>
                              <Badge className={getStatusBadge(dossier.statut)} size="sm">
                                {dossier.statut.replace("_", " ")}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-400">
                              {new Date(dossier.dateOuverture).toLocaleDateString("fr-FR")}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <div className={`w-2 h-2 rounded-full ${getProgressColor(dossier.progression)}`} />
                              <span className="text-xs text-slate-400">{dossier.progression}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Statistiques détaillées */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Statistiques Détaillées</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-400">{dossiers.reduce((acc, d) => acc + d.nbPV, 0)}</p>
                      <p className="text-sm text-slate-400">Total PV</p>
                    </div>
                    <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                      <p className="text-2xl font-bold text-green-400">
                        {dossiers.reduce((acc, d) => acc + d.nbTemoins, 0)}
                      </p>
                      <p className="text-sm text-slate-400">Total Témoins</p>
                    </div>
                    <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-400">
                        {dossiers
                          .filter((d) => d.montantPrejudice)
                          .reduce((acc, d) => acc + (d.montantPrejudice || 0), 0)
                          .toLocaleString("fr-FR")}
                        €
                      </p>
                      <p className="text-sm text-slate-400">Préjudice Total</p>
                    </div>
                    <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-400">
                        {Math.round(
                          dossiers
                            .filter((d) => d.dateCloture)
                            .reduce((acc, d) => {
                              const ouverture = new Date(d.dateOuverture)
                              const cloture = new Date(d.dateCloture!)
                              return acc + (cloture.getTime() - ouverture.getTime()) / (1000 * 60 * 60 * 24)
                            }, 0) / dossiers.filter((d) => d.dateCloture).length || 0,
                        )}
                      </p>
                      <p className="text-sm text-slate-400">Durée Moy. (jours)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dossiers prioritaires */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    Dossiers Prioritaires
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dossiers
                      .filter((d) => d.priorite === "urgente" || d.priorite === "haute")
                      .slice(0, 4)
                      .map((dossier) => (
                        <div key={dossier.id} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-red-400" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-200">{dossier.titre}</p>
                            <p className="text-xs text-slate-400">{dossier.numero}</p>
                          </div>
                          <Badge className={getPriorityBadge(dossier.priorite)}>{dossier.priorite}</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {filteredDossiers.length === 0 && activeTab === "liste" && (
          <div className="text-center py-12">
            <Folder className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg mb-2">Aucun dossier trouvé</p>
            <p className="text-slate-500">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  )
}
