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
  UserX,
  Calendar,
  MapPin,
  AlertTriangle,
  Users,
  Building,
  Clock,
  Activity,
  TrendingUp,
  Heart,
} from "lucide-react"
import Sidebar from "@/components/layout/sidebar"
import PermissionGuard from "@/components/auth/permission-guard"
import { getCurrentUser } from "@/lib/auth"

interface Detenu {
  id: string
  numeroEcrou: string
  nom: string
  prenom: string
  dateNaissance: string
  lieuNaissance: string
  nationalite: string
  dateIncarceration: string
  datePrevueLiberation?: string
  motifIncarceration: string
  typeDetention: "preventive" | "definitive" | "correction"
  statut: "detenu" | "libere" | "transfere" | "evade" | "decede"
  quartier: string
  cellule: string
  regime: "ferme" | "semi_liberte" | "ouvert"
  categorie: "A" | "B" | "C" | "D" // Catégorie pénale
  dangerosité: "faible" | "moyenne" | "elevee" | "maximale"
  profession?: string
  situationFamiliale: string
  nombreEnfants: number
  contactUrgence: {
    nom: string
    telephone: string
    relation: string
  }
  antecedents: string[]
  condamnations: Array<{
    date: string
    tribunal: string
    peine: string
    duree: string
  }>
  sanctions: Array<{
    date: string
    motif: string
    sanction: string
    duree: string
  }>
  visites: Array<{
    date: string
    visiteur: string
    duree: number
    type: "familiale" | "avocat" | "medicale" | "administrative"
  }>
  etatSante: "bon" | "moyen" | "fragile" | "critique"
  traitementMedical?: string
  activites: string[]
  formation?: string
  travail?: string
  comportement: "excellent" | "bon" | "moyen" | "difficile" | "dangereux"
  observations: string
}

const mockDetenus: Detenu[] = [
  {
    id: "1",
    numeroEcrou: "ECR-2024-001",
    nom: "Dupont",
    prenom: "Marc",
    dateNaissance: "1985-03-15",
    lieuNaissance: "Paris",
    nationalite: "Française",
    dateIncarceration: "2024-01-10",
    datePrevueLiberation: "2026-01-10",
    motifIncarceration: "Vol aggravé avec violence",
    typeDetention: "definitive",
    statut: "detenu",
    quartier: "Quartier A",
    cellule: "A-101",
    regime: "ferme",
    categorie: "B",
    dangerosité: "moyenne",
    profession: "Mécanicien",
    situationFamiliale: "Marié",
    nombreEnfants: 2,
    contactUrgence: {
      nom: "Marie Dupont",
      telephone: "06.12.34.56.78",
      relation: "Épouse",
    },
    antecedents: ["Vol simple (2020)", "Conduite sans permis (2018)"],
    condamnations: [
      {
        date: "2024-01-05",
        tribunal: "TGI Paris",
        peine: "2 ans ferme",
        duree: "24 mois",
      },
    ],
    sanctions: [],
    visites: [
      {
        date: "2024-01-14",
        visiteur: "Marie Dupont",
        duree: 60,
        type: "familiale",
      },
    ],
    etatSante: "bon",
    activites: ["Sport", "Lecture"],
    formation: "Électricité",
    travail: "Atelier menuiserie",
    comportement: "bon",
    observations: "Détenu coopératif, participe aux activités",
  },
  {
    id: "2",
    numeroEcrou: "ECR-2024-002",
    nom: "Martin",
    prenom: "Sophie",
    dateNaissance: "1990-07-22",
    lieuNaissance: "Lyon",
    nationalite: "Française",
    dateIncarceration: "2024-01-08",
    motifIncarceration: "Trafic de stupéfiants",
    typeDetention: "preventive",
    statut: "detenu",
    quartier: "Quartier B",
    cellule: "B-205",
    regime: "ferme",
    categorie: "C",
    dangerosité: "faible",
    profession: "Infirmière",
    situationFamiliale: "Célibataire",
    nombreEnfants: 0,
    contactUrgence: {
      nom: "Jean Martin",
      telephone: "06.98.76.54.32",
      relation: "Père",
    },
    antecedents: [],
    condamnations: [],
    sanctions: [
      {
        date: "2024-01-12",
        motif: "Refus d'obtempérer",
        sanction: "Privation de cantine",
        duree: "3 jours",
      },
    ],
    visites: [],
    etatSante: "moyen",
    traitementMedical: "Antidépresseurs",
    activites: ["Bibliothèque"],
    comportement: "moyen",
    observations: "Détenue en attente de jugement, état psychologique fragile",
  },
  {
    id: "3",
    numeroEcrou: "ECR-2023-156",
    nom: "Garcia",
    prenom: "Antonio",
    dateNaissance: "1978-11-03",
    lieuNaissance: "Madrid, Espagne",
    nationalite: "Espagnole",
    dateIncarceration: "2023-12-20",
    datePrevueLiberation: "2024-02-15",
    motifIncarceration: "Agression physique",
    typeDetention: "correction",
    statut: "libere",
    quartier: "-",
    cellule: "-",
    regime: "ferme",
    categorie: "A",
    dangerosité: "elevee",
    profession: "Ouvrier BTP",
    situationFamiliale: "Divorcé",
    nombreEnfants: 1,
    contactUrgence: {
      nom: "Carmen Garcia",
      telephone: "+34.612.345.678",
      relation: "Ex-épouse",
    },
    antecedents: ["Violence conjugale (2019)", "Rébellion (2021)"],
    condamnations: [
      {
        date: "2023-12-15",
        tribunal: "TGI Bobigny",
        peine: "6 mois ferme",
        duree: "6 mois",
      },
    ],
    sanctions: [
      {
        date: "2024-01-02",
        motif: "Bagarre avec codétenu",
        sanction: "Isolement disciplinaire",
        duree: "7 jours",
      },
    ],
    visites: [],
    etatSante: "bon",
    activites: [],
    comportement: "difficile",
    observations: "Libéré le 15/02/2024 - Comportement agressif durant la détention",
  },
]

export default function DeteusPage() {
  const router = useRouter()
  const [detenus, setDetenus] = useState<Detenu[]>(mockDetenus)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("tous")
  const [quartierFilter, setQuartierFilter] = useState("tous")
  const [dangerositéFilter, setDangerositéFilter] = useState("tous")
  const [activeTab, setActiveTab] = useState("liste")

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/")
    }
  }, [router])

  const getStatusBadge = (statut: string) => {
    const variants = {
      detenu: "bg-red-600 text-white",
      libere: "bg-green-600 text-white",
      transfere: "bg-blue-600 text-white",
      evade: "bg-orange-600 text-white",
      decede: "bg-gray-600 text-white",
    }
    return variants[statut as keyof typeof variants] || variants.detenu
  }

  const getDangerositéBadge = (dangerosité: string) => {
    const variants = {
      faible: "bg-green-600 text-white",
      moyenne: "bg-yellow-600 text-white",
      elevee: "bg-orange-600 text-white",
      maximale: "bg-red-600 text-white",
    }
    return variants[dangerosité as keyof typeof variants] || variants.faible
  }

  const getComportementBadge = (comportement: string) => {
    const variants = {
      excellent: "bg-green-600 text-white",
      bon: "bg-blue-600 text-white",
      moyen: "bg-yellow-600 text-white",
      difficile: "bg-orange-600 text-white",
      dangereux: "bg-red-600 text-white",
    }
    return variants[comportement as keyof typeof variants] || variants.moyen
  }

  const getEtatSanteBadge = (etat: string) => {
    const variants = {
      bon: "bg-green-600 text-white",
      moyen: "bg-yellow-600 text-white",
      fragile: "bg-orange-600 text-white",
      critique: "bg-red-600 text-white",
    }
    return variants[etat as keyof typeof variants] || variants.bon
  }

  const filteredDetenus = detenus.filter((detenu) => {
    const matchesSearch =
      detenu.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detenu.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detenu.numeroEcrou.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detenu.motifIncarceration.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "tous" || detenu.statut === statusFilter
    const matchesQuartier = quartierFilter === "tous" || detenu.quartier === quartierFilter
    const matchesDangerosité = dangerositéFilter === "tous" || detenu.dangerosité === dangerositéFilter

    return matchesSearch && matchesStatus && matchesQuartier && matchesDangerosité
  })

  // Statistiques
  const stats = {
    total: detenus.length,
    detenus: detenus.filter((d) => d.statut === "detenu").length,
    liberes: detenus.filter((d) => d.statut === "libere").length,
    transferes: detenus.filter((d) => d.statut === "transfere").length,
    evades: detenus.filter((d) => d.statut === "evade").length,
    preventive: detenus.filter((d) => d.typeDetention === "preventive").length,
    definitive: detenus.filter((d) => d.typeDetention === "definitive").length,
    dangereux: detenus.filter((d) => ["elevee", "maximale"].includes(d.dangerosité)).length,
    malades: detenus.filter((d) => ["fragile", "critique"].includes(d.etatSante)).length,
  }

  const quartiers = [...new Set(detenus.map((d) => d.quartier).filter((q) => q !== "-"))]

  return (
    <PermissionGuard resource="prisonniers" action="read">
      <div className="min-h-screen bg-slate-900">
        <Sidebar />

        <div className="md:ml-64 p-6">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Gestion des Détenus</h1>
                <p className="text-slate-400">Administration pénitentiaire et suivi des détenus</p>
              </div>
              <Link href="/detenus/nouveau">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Détenu
                </Button>
              </Link>
            </div>
          </div>

          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Détenus</p>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Actuellement Détenus</p>
                    <p className="text-2xl font-bold text-red-400">{stats.detenus}</p>
                  </div>
                  <Building className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Préventive</p>
                    <p className="text-2xl font-bold text-yellow-400">{stats.preventive}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Dangereux</p>
                    <p className="text-2xl font-bold text-orange-400">{stats.dangereux}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-slate-800 border-slate-700 mb-6">
              <TabsTrigger value="liste" className="data-[state=active]:bg-blue-600">
                <Users className="h-4 w-4 mr-2" />
                Liste des détenus
              </TabsTrigger>
              <TabsTrigger value="statistiques" className="data-[state=active]:bg-blue-600">
                <TrendingUp className="h-4 w-4 mr-2" />
                Statistiques
              </TabsTrigger>
              <TabsTrigger value="mouvements" className="data-[state=active]:bg-blue-600">
                <Activity className="h-4 w-4 mr-2" />
                Mouvements
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
                        placeholder="Rechercher un détenu..."
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
                        <SelectItem value="detenu">Détenu</SelectItem>
                        <SelectItem value="libere">Libéré</SelectItem>
                        <SelectItem value="transfere">Transféré</SelectItem>
                        <SelectItem value="evade">Évadé</SelectItem>
                        <SelectItem value="decede">Décédé</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={quartierFilter} onValueChange={setQuartierFilter}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Quartier" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="tous">Tous les quartiers</SelectItem>
                        {quartiers.map((quartier) => (
                          <SelectItem key={quartier} value={quartier}>
                            {quartier}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={dangerositéFilter} onValueChange={setDangerositéFilter}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Dangerosité" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="tous">Toutes dangerosités</SelectItem>
                        <SelectItem value="faible">Faible</SelectItem>
                        <SelectItem value="moyenne">Moyenne</SelectItem>
                        <SelectItem value="elevee">Élevée</SelectItem>
                        <SelectItem value="maximale">Maximale</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                      onClick={() => {
                        setSearchTerm("")
                        setStatusFilter("tous")
                        setQuartierFilter("tous")
                        setDangerositéFilter("tous")
                      }}
                    >
                      Réinitialiser
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Table des détenus */}
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700">
                          <TableHead className="text-slate-300">N° Écrou</TableHead>
                          <TableHead className="text-slate-300">Identité</TableHead>
                          <TableHead className="text-slate-300">Motif</TableHead>
                          <TableHead className="text-slate-300">Statut</TableHead>
                          <TableHead className="text-slate-300">Localisation</TableHead>
                          <TableHead className="text-slate-300">Dangerosité</TableHead>
                          <TableHead className="text-slate-300">Santé</TableHead>
                          <TableHead className="text-slate-300">Comportement</TableHead>
                          <TableHead className="text-slate-300">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDetenus.map((detenu) => (
                          <TableRow key={detenu.id} className="border-slate-700 hover:bg-slate-700/50">
                            <TableCell className="text-slate-200 font-mono">{detenu.numeroEcrou}</TableCell>
                            <TableCell className="text-slate-200">
                              <div>
                                <p className="font-medium">
                                  {detenu.prenom} {detenu.nom}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {new Date().getFullYear() - new Date(detenu.dateNaissance).getFullYear()} ans •{" "}
                                  {detenu.nationalite}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-300">
                              <div>
                                <p className="text-sm">{detenu.motifIncarceration}</p>
                                <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs mt-1">
                                  {detenu.typeDetention}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusBadge(detenu.statut)}>{detenu.statut}</Badge>
                            </TableCell>
                            <TableCell className="text-slate-300">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <div>
                                  <p className="text-sm">{detenu.quartier}</p>
                                  <p className="text-xs text-slate-400">{detenu.cellule}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getDangerositéBadge(detenu.dangerosité)}>{detenu.dangerosité}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Heart className="h-4 w-4 text-slate-400" />
                                <Badge className={getEtatSanteBadge(detenu.etatSante)}>{detenu.etatSante}</Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getComportementBadge(detenu.comportement)}>{detenu.comportement}</Badge>
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
                                  className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                                >
                                  <UserX className="h-4 w-4" />
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
                {/* Répartition par statut */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Répartition par Statut</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">Détenus</span>
                        <span className="text-sm text-slate-400">{stats.detenus}</span>
                      </div>
                      <Progress value={(stats.detenus / stats.total) * 100} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">Libérés</span>
                        <span className="text-sm text-slate-400">{stats.liberes}</span>
                      </div>
                      <Progress value={(stats.liberes / stats.total) * 100} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">Transférés</span>
                        <span className="text-sm text-slate-400">{stats.transferes}</span>
                      </div>
                      <Progress value={(stats.transferes / stats.total) * 100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Alertes et surveillance */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                      Alertes et Surveillance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-red-900/20 border border-red-700 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-red-200">Détenus dangereux</p>
                          <p className="text-xs text-red-300">Surveillance renforcée</p>
                        </div>
                        <Badge className="bg-red-600 text-white">{stats.dangereux}</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-orange-900/20 border border-orange-700 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-orange-200">État de santé fragile</p>
                          <p className="text-xs text-orange-300">Suivi médical requis</p>
                        </div>
                        <Badge className="bg-orange-600 text-white">{stats.malades}</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-yellow-200">Détention préventive</p>
                          <p className="text-xs text-yellow-300">En attente de jugement</p>
                        </div>
                        <Badge className="bg-yellow-600 text-white">{stats.preventive}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Statistiques détaillées */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Statistiques Détaillées</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-400">
                          {Math.round(
                            detenus
                              .filter((d) => d.statut === "detenu")
                              .reduce((acc, d) => {
                                const duree =
                                  (new Date().getTime() - new Date(d.dateIncarceration).getTime()) /
                                  (1000 * 60 * 60 * 24)
                                return acc + duree
                              }, 0) / detenus.filter((d) => d.statut === "detenu").length || 0,
                          )}
                        </p>
                        <p className="text-sm text-slate-400">Durée moy. détention (jours)</p>
                      </div>
                      <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                        <p className="text-2xl font-bold text-green-400">
                          {Math.round(
                            (detenus.filter((d) => ["excellent", "bon"].includes(d.comportement)).length /
                              detenus.length) *
                              100,
                          )}
                          %
                        </p>
                        <p className="text-sm text-slate-400">Bon comportement</p>
                      </div>
                      <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-400">
                          {detenus.filter((d) => d.activites.length > 0).length}
                        </p>
                        <p className="text-sm text-slate-400">Participent aux activités</p>
                      </div>
                      <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-400">
                          {detenus.filter((d) => d.formation || d.travail).length}
                        </p>
                        <p className="text-sm text-slate-400">En formation/travail</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Libérations prochaines */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-400" />
                      Libérations Prochaines
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {detenus
                        .filter((d) => d.datePrevueLiberation && d.statut === "detenu")
                        .sort(
                          (a, b) =>
                            new Date(a.datePrevueLiberation!).getTime() - new Date(b.datePrevueLiberation!).getTime(),
                        )
                        .slice(0, 4)
                        .map((detenu) => (
                          <div key={detenu.id} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                            <Calendar className="h-4 w-4 text-green-400" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-slate-200">
                                {detenu.prenom} {detenu.nom}
                              </p>
                              <p className="text-xs text-slate-400">{detenu.numeroEcrou}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-green-400">
                                {new Date(detenu.datePrevueLiberation!).toLocaleDateString("fr-FR")}
                              </p>
                              <p className="text-xs text-slate-400">
                                {Math.ceil(
                                  (new Date(detenu.datePrevueLiberation!).getTime() - new Date().getTime()) /
                                    (1000 * 60 * 60 * 24),
                                )}{" "}
                                jours
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="mouvements">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Mouvements Récents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-lg">
                      <div className="w-3 h-3 bg-green-400 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-200">Incarcération - Marc Dupont</p>
                        <p className="text-xs text-slate-400">10/01/2024 - Quartier A, Cellule A-101</p>
                      </div>
                      <Badge className="bg-green-600 text-white">Entrée</Badge>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-lg">
                      <div className="w-3 h-3 bg-blue-400 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-200">Transfert - Sophie Martin</p>
                        <p className="text-xs text-slate-400">08/01/2024 - Quartier A vers Quartier B</p>
                      </div>
                      <Badge className="bg-blue-600 text-white">Transfert</Badge>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-lg">
                      <div className="w-3 h-3 bg-red-400 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-200">Libération - Antonio Garcia</p>
                        <p className="text-xs text-slate-400">15/02/2024 - Fin de peine</p>
                      </div>
                      <Badge className="bg-gray-600 text-white">Sortie</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {filteredDetenus.length === 0 && activeTab === "liste" && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg mb-2">Aucun détenu trouvé</p>
              <p className="text-slate-500">Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </div>
      </div>
    </PermissionGuard>
  )
}
