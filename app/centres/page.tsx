"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Search,
  Filter,
  Eye,
  Building,
  Users,
  TrendingUp,
  AlertTriangle,
  ArrowUpDown,
  Calendar,
  User,
} from "lucide-react"
import Sidebar from "@/components/layout/sidebar"
import PermissionGuard from "@/components/auth/permission-guard"
import { getCurrentUser } from "@/lib/auth"

interface CentrePenitentiaire {
  id: string
  nom: string
  type: "maison_arret" | "centre_detention" | "etablissement_peines"
  capacite: number
  occupation: number
  adresse: string
  directeur: string
  telephone: string
  email: string
  dateOuverture: string
  statut: "operationnel" | "maintenance" | "ferme"
  niveauSecurite: "minimum" | "moyen" | "maximum"
}

interface DetenuCentre {
  id: string
  centreId: string
  numeroEcrou: string
  nom: string
  prenom: string
  age: number
  dateEntree: string
  typeDetention: "garde_a_vue" | "detention_provisoire" | "condamnation"
  dureeRestante?: string
  cellule: string
  statut: "present" | "transfere" | "libere"
  categorie: string
}

interface TransfertDemande {
  id: string
  detenuId: string
  centreOrigine: string
  centreDestination: string
  motif: string
  datedemande: string
  statut: "en_attente" | "approuve" | "refuse"
  demandeur: string
}

const mockCentres: CentrePenitentiaire[] = [
  {
    id: "1",
    nom: "Maison d'arrêt A",
    type: "maison_arret",
    capacite: 500,
    occupation: 420,
    adresse: "123 Avenue de la Justice, Paris",
    directeur: "M. Durand",
    telephone: "01.23.45.67.89",
    email: "direction@ma-a.justice.fr",
    dateOuverture: "1985-03-15",
    statut: "operationnel",
    niveauSecurite: "moyen",
  },
  {
    id: "2",
    nom: "Centre pénitentiaire B",
    type: "centre_detention",
    capacite: 800,
    occupation: 650,
    adresse: "456 Route de la Détention, Lyon",
    directeur: "Mme Martin",
    telephone: "04.56.78.90.12",
    email: "direction@cp-b.justice.fr",
    dateOuverture: "1992-09-20",
    statut: "operationnel",
    niveauSecurite: "moyen",
  },
  {
    id: "3",
    nom: "Prison centrale C",
    type: "etablissement_peines",
    capacite: 1200,
    occupation: 980,
    adresse: "789 Boulevard de la Réinsertion, Marseille",
    directeur: "M. Rousseau",
    telephone: "04.91.23.45.67",
    email: "direction@pc-c.justice.fr",
    dateOuverture: "1978-11-10",
    statut: "operationnel",
    niveauSecurite: "maximum",
  },
]

const mockDetenus: DetenuCentre[] = [
  {
    id: "1",
    centreId: "1",
    numeroEcrou: "ECR-2024-001",
    nom: "Dupont",
    prenom: "Marc",
    age: 35,
    dateEntree: "2024-01-15",
    typeDetention: "detention_provisoire",
    cellule: "A-101",
    statut: "present",
    categorie: "Vol",
  },
  {
    id: "2",
    centreId: "2",
    numeroEcrou: "ECR-2024-002",
    nom: "Garcia",
    prenom: "Antonio",
    age: 28,
    dateEntree: "2024-01-14",
    typeDetention: "detention_provisoire",
    cellule: "B-205",
    statut: "present",
    categorie: "Trafic",
  },
  {
    id: "3",
    centreId: "3",
    numeroEcrou: "ECR-2024-003",
    nom: "Bernard",
    prenom: "Paul",
    age: 45,
    dateEntree: "2023-06-10",
    typeDetention: "condamnation",
    dureeRestante: "18 mois",
    cellule: "C-312",
    statut: "present",
    categorie: "Fraude",
  },
]

const mockTransferts: TransfertDemande[] = [
  {
    id: "1",
    detenuId: "1",
    centreOrigine: "Maison d'arrêt A",
    centreDestination: "Centre pénitentiaire B",
    motif: "Rapprochement familial",
    datedemande: "2024-01-20",
    statut: "en_attente",
    demandeur: "Juge Moreau",
  },
]

export default function CentresPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("centres")
  const [centres] = useState<CentrePenitentiaire[]>(mockCentres)
  const [detenus] = useState<DetenuCentre[]>(mockDetenus)
  const [transferts] = useState<TransfertDemande[]>(mockTransferts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCentre, setSelectedCentre] = useState<CentrePenitentiaire | null>(null)
  const [selectedDetenu, setSelectedDetenu] = useState<DetenuCentre | null>(null)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/")
    }
  }, [router])

  const getTypeBadge = (type: string) => {
    const variants = {
      maison_arret: "bg-blue-600 text-white",
      centre_detention: "bg-green-600 text-white",
      etablissement_peines: "bg-purple-600 text-white",
    }
    return variants[type as keyof typeof variants] || variants.maison_arret
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      maison_arret: "Maison d'arrêt",
      centre_detention: "Centre de détention",
      etablissement_peines: "Établissement pour peines",
    }
    return labels[type as keyof typeof labels] || type
  }

  const getStatutBadge = (statut: string) => {
    const variants = {
      operationnel: "bg-green-600 text-white",
      maintenance: "bg-orange-600 text-white",
      ferme: "bg-red-600 text-white",
    }
    return variants[statut as keyof typeof variants] || variants.operationnel
  }

  const getSecuriteBadge = (niveau: string) => {
    const variants = {
      minimum: "bg-green-600 text-white",
      moyen: "bg-orange-600 text-white",
      maximum: "bg-red-600 text-white",
    }
    return variants[niveau as keyof typeof variants] || variants.moyen
  }

  const getDetentionBadge = (type: string) => {
    const variants = {
      garde_a_vue: "bg-blue-600 text-white",
      detention_provisoire: "bg-orange-600 text-white",
      condamnation: "bg-red-600 text-white",
    }
    return variants[type as keyof typeof variants] || variants.garde_a_vue
  }

  const getTransfertBadge = (statut: string) => {
    const variants = {
      en_attente: "bg-yellow-600 text-white",
      approuve: "bg-green-600 text-white",
      refuse: "bg-red-600 text-white",
    }
    return variants[statut as keyof typeof variants] || variants.en_attente
  }

  const getTauxOccupation = (centre: CentrePenitentiaire) => {
    return Math.round((centre.occupation / centre.capacite) * 100)
  }

  const getCouleurTaux = (taux: number) => {
    if (taux >= 90) return "text-red-400"
    if (taux >= 75) return "text-orange-400"
    return "text-green-400"
  }

  const filteredCentres = centres.filter(
    (centre) =>
      centre.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      centre.directeur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      centre.adresse.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredDetenus = detenus.filter(
    (detenu) =>
      detenu.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detenu.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detenu.numeroEcrou.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    totalCentres: centres.length,
    totalDetenus: detenus.length,
    capaciteTotale: centres.reduce((sum, centre) => sum + centre.capacite, 0),
    occupationTotale: centres.reduce((sum, centre) => sum + centre.occupation, 0),
    transfertsEnAttente: transferts.filter((t) => t.statut === "en_attente").length,
  }

  const tauxOccupationGlobal = Math.round((stats.occupationTotale / stats.capaciteTotale) * 100)

  return (
    <PermissionGuard resource="centres" action="read">
      <div className="min-h-screen bg-slate-900">
        <Sidebar />

        <div className="md:ml-64 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Centres Pénitentiaires</h1>
            <p className="text-slate-400">Gestion des établissements pénitentiaires et des détenus</p>
          </div>

          {/* Statistiques globales */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Centres</p>
                    <p className="text-2xl font-bold text-blue-400">{stats.totalCentres}</p>
                  </div>
                  <Building className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Détenus</p>
                    <p className="text-2xl font-bold text-orange-400">{stats.totalDetenus}</p>
                  </div>
                  <Users className="h-8 w-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Capacité totale</p>
                    <p className="text-2xl font-bold text-green-400">{stats.capaciteTotale}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Taux occupation</p>
                    <p className={`text-2xl font-bold ${getCouleurTaux(tauxOccupationGlobal)}`}>
                      {tauxOccupationGlobal}%
                    </p>
                  </div>
                  <AlertTriangle className={`h-8 w-8 ${getCouleurTaux(tauxOccupationGlobal)}`} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Transferts</p>
                    <p className="text-2xl font-bold text-yellow-400">{stats.transfertsEnAttente}</p>
                  </div>
                  <ArrowUpDown className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-slate-800 border-slate-700 mb-6">
              <TabsTrigger value="centres" className="data-[state=active]:bg-blue-600">
                <Building className="h-4 w-4 mr-2" />
                Centres ({centres.length})
              </TabsTrigger>
              <TabsTrigger value="detenus" className="data-[state=active]:bg-blue-600">
                <Users className="h-4 w-4 mr-2" />
                Détenus ({detenus.length})
              </TabsTrigger>
              <TabsTrigger value="transferts" className="data-[state=active]:bg-blue-600">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Transferts ({transferts.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="centres">
              {/* Filtres */}
              <Card className="bg-slate-800 border-slate-700 mb-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Recherche
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Rechercher un centre, directeur ou adresse..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Grille des centres */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCentres.map((centre) => {
                  const tauxOccupation = getTauxOccupation(centre)
                  const couleurTaux = getCouleurTaux(tauxOccupation)
                  const detenusCentre = detenus.filter((d) => d.centreId === centre.id)

                  return (
                    <Card
                      key={centre.id}
                      className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-white flex items-center gap-2">
                              <Building className="h-5 w-5" />
                              {centre.nom}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={getTypeBadge(centre.type)}>{getTypeLabel(centre.type)}</Badge>
                              <Badge className={getStatutBadge(centre.statut)}>{centre.statut}</Badge>
                            </div>
                          </div>
                          <Badge className={getSecuriteBadge(centre.niveauSecurite)}>{centre.niveauSecurite}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-slate-400">Capacité:</p>
                              <p className="text-white font-medium">{centre.capacite}</p>
                            </div>
                            <div>
                              <p className="text-slate-400">Occupation:</p>
                              <p className="text-white font-medium">{centre.occupation}</p>
                            </div>
                            <div>
                              <p className="text-slate-400">Taux:</p>
                              <p className={`font-medium ${couleurTaux}`}>{tauxOccupation}%</p>
                            </div>
                            <div>
                              <p className="text-slate-400">Détenus:</p>
                              <p className="text-white font-medium">{detenusCentre.length}</p>
                            </div>
                          </div>

                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                tauxOccupation >= 90
                                  ? "bg-red-500"
                                  : tauxOccupation >= 75
                                    ? "bg-orange-500"
                                    : "bg-green-500"
                              }`}
                              style={{ width: `${Math.min(tauxOccupation, 100)}%` }}
                            />
                          </div>

                          <div className="text-xs text-slate-400">
                            <p>Directeur: {centre.directeur}</p>
                            <p className="truncate">{centre.adresse}</p>
                            <p>{centre.telephone}</p>
                          </div>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                                onClick={() => setSelectedCentre(centre)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Voir détails
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-800 border-slate-700 max-w-4xl">
                              <DialogHeader>
                                <DialogTitle className="text-white flex items-center gap-2">
                                  <Building className="h-5 w-5" />
                                  {selectedCentre?.nom}
                                </DialogTitle>
                              </DialogHeader>
                              {selectedCentre && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                      <div>
                                        <h3 className="text-lg font-medium text-white mb-2">Informations générales</h3>
                                        <div className="space-y-2 text-sm">
                                          <div className="flex justify-between">
                                            <span className="text-slate-400">Type:</span>
                                            <Badge className={getTypeBadge(selectedCentre.type)}>
                                              {getTypeLabel(selectedCentre.type)}
                                            </Badge>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-slate-400">Statut:</span>
                                            <Badge className={getStatutBadge(selectedCentre.statut)}>
                                              {selectedCentre.statut}
                                            </Badge>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-slate-400">Sécurité:</span>
                                            <Badge className={getSecuriteBadge(selectedCentre.niveauSecurite)}>
                                              {selectedCentre.niveauSecurite}
                                            </Badge>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-slate-400">Ouverture:</span>
                                            <span className="text-slate-300">
                                              {new Date(selectedCentre.dateOuverture).toLocaleDateString("fr-FR")}
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      <div>
                                        <h3 className="text-lg font-medium text-white mb-2">Contact</h3>
                                        <div className="space-y-2 text-sm">
                                          <div>
                                            <span className="text-slate-400">Directeur:</span>
                                            <p className="text-slate-300">{selectedCentre.directeur}</p>
                                          </div>
                                          <div>
                                            <span className="text-slate-400">Adresse:</span>
                                            <p className="text-slate-300">{selectedCentre.adresse}</p>
                                          </div>
                                          <div>
                                            <span className="text-slate-400">Téléphone:</span>
                                            <p className="text-slate-300">{selectedCentre.telephone}</p>
                                          </div>
                                          <div>
                                            <span className="text-slate-400">Email:</span>
                                            <p className="text-slate-300">{selectedCentre.email}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="space-y-4">
                                      <div>
                                        <h3 className="text-lg font-medium text-white mb-2">Occupation</h3>
                                        <div className="space-y-4">
                                          <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center p-3 bg-slate-700 rounded">
                                              <p className="text-2xl font-bold text-blue-400">
                                                {selectedCentre.capacite}
                                              </p>
                                              <p className="text-xs text-slate-400">Capacité</p>
                                            </div>
                                            <div className="text-center p-3 bg-slate-700 rounded">
                                              <p className="text-2xl font-bold text-orange-400">
                                                {selectedCentre.occupation}
                                              </p>
                                              <p className="text-xs text-slate-400">Occupation</p>
                                            </div>
                                          </div>
                                          <div className="text-center p-3 bg-slate-700 rounded">
                                            <p
                                              className={`text-2xl font-bold ${getCouleurTaux(
                                                getTauxOccupation(selectedCentre),
                                              )}`}
                                            >
                                              {getTauxOccupation(selectedCentre)}%
                                            </p>
                                            <p className="text-xs text-slate-400">Taux d'occupation</p>
                                          </div>
                                          <div className="w-full bg-slate-600 rounded-full h-3">
                                            <div
                                              className={`h-3 rounded-full ${
                                                getTauxOccupation(selectedCentre) >= 90
                                                  ? "bg-red-500"
                                                  : getTauxOccupation(selectedCentre) >= 75
                                                    ? "bg-orange-500"
                                                    : "bg-green-500"
                                              }`}
                                              style={{
                                                width: `${Math.min(getTauxOccupation(selectedCentre), 100)}%`,
                                              }}
                                            />
                                          </div>
                                          <p className="text-sm text-slate-400 text-center">
                                            {selectedCentre.capacite - selectedCentre.occupation} places disponibles
                                          </p>
                                        </div>
                                      </div>

                                      <div>
                                        <h3 className="text-lg font-medium text-white mb-2">
                                          Détenus ({detenusCentre.length})
                                        </h3>
                                        <div className="max-h-40 overflow-y-auto space-y-2">
                                          {detenusCentre.map((detenu) => (
                                            <div
                                              key={detenu.id}
                                              className="flex items-center justify-between p-2 bg-slate-700 rounded text-sm"
                                            >
                                              <div>
                                                <p className="text-slate-200">
                                                  {detenu.prenom} {detenu.nom}
                                                </p>
                                                <p className="text-xs text-slate-400">{detenu.numeroEcrou}</p>
                                              </div>
                                              <Badge className={getDetentionBadge(detenu.typeDetention)}>
                                                {detenu.typeDetention.replace("_", " ")}
                                              </Badge>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="detenus">
              {/* Filtres */}
              <Card className="bg-slate-800 border-slate-700 mb-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Recherche
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Rechercher un détenu par nom ou numéro d'écrou..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
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
                          <TableHead className="text-slate-300">Détenu</TableHead>
                          <TableHead className="text-slate-300">Centre</TableHead>
                          <TableHead className="text-slate-300">Cellule</TableHead>
                          <TableHead className="text-slate-300">Type détention</TableHead>
                          <TableHead className="text-slate-300">Date entrée</TableHead>
                          <TableHead className="text-slate-300">Statut</TableHead>
                          <TableHead className="text-slate-300">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDetenus.map((detenu) => {
                          const centre = centres.find((c) => c.id === detenu.centreId)
                          return (
                            <TableRow key={detenu.id} className="border-slate-700 hover:bg-slate-700/50">
                              <TableCell className="text-slate-200 font-mono">{detenu.numeroEcrou}</TableCell>
                              <TableCell className="text-slate-200">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-slate-400" />
                                  <div>
                                    <p className="font-medium">
                                      {detenu.prenom} {detenu.nom}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                      {detenu.age} ans - {detenu.categorie}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-slate-300">{centre?.nom}</TableCell>
                              <TableCell className="text-slate-300 font-mono">{detenu.cellule}</TableCell>
                              <TableCell>
                                <Badge className={getDetentionBadge(detenu.typeDetention)}>
                                  {detenu.typeDetention.replace("_", " ")}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-slate-300">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(detenu.dateEntree).toLocaleDateString("fr-FR")}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    detenu.statut === "present"
                                      ? "bg-green-600 text-white"
                                      : detenu.statut === "transfere"
                                        ? "bg-orange-600 text-white"
                                        : "bg-gray-600 text-white"
                                  }
                                >
                                  {detenu.statut}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-blue-400 hover:text-blue-300 hover:bg-slate-700"
                                      onClick={() => setSelectedDetenu(detenu)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle className="text-white flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        {selectedDetenu?.prenom} {selectedDetenu?.nom}
                                      </DialogTitle>
                                    </DialogHeader>
                                    {selectedDetenu && (
                                      <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <label className="text-sm text-slate-400">N° Écrou:</label>
                                            <p className="text-slate-200 font-mono">{selectedDetenu.numeroEcrou}</p>
                                          </div>
                                          <div>
                                            <label className="text-sm text-slate-400">Âge:</label>
                                            <p className="text-slate-200">{selectedDetenu.age} ans</p>
                                          </div>
                                          <div>
                                            <label className="text-sm text-slate-400">Centre:</label>
                                            <p className="text-slate-200">
                                              {centres.find((c) => c.id === selectedDetenu.centreId)?.nom}
                                            </p>
                                          </div>
                                          <div>
                                            <label className="text-sm text-slate-400">Cellule:</label>
                                            <p className="text-slate-200 font-mono">{selectedDetenu.cellule}</p>
                                          </div>
                                          <div>
                                            <label className="text-sm text-slate-400">Type détention:</label>
                                            <div className="mt-1">
                                              <Badge className={getDetentionBadge(selectedDetenu.typeDetention)}>
                                                {selectedDetenu.typeDetention.replace("_", " ")}
                                              </Badge>
                                            </div>
                                          </div>
                                          <div>
                                            <label className="text-sm text-slate-400">Statut:</label>
                                            <div className="mt-1">
                                              <Badge
                                                className={
                                                  selectedDetenu.statut === "present"
                                                    ? "bg-green-600 text-white"
                                                    : selectedDetenu.statut === "transfere"
                                                      ? "bg-orange-600 text-white"
                                                      : "bg-gray-600 text-white"
                                                }
                                              >
                                                {selectedDetenu.statut}
                                              </Badge>
                                            </div>
                                          </div>
                                          <div>
                                            <label className="text-sm text-slate-400">Date entrée:</label>
                                            <p className="text-slate-200">
                                              {new Date(selectedDetenu.dateEntree).toLocaleDateString("fr-FR")}
                                            </p>
                                          </div>
                                          {selectedDetenu.dureeRestante && (
                                            <div>
                                              <label className="text-sm text-slate-400">Durée restante:</label>
                                              <p className="text-slate-200">{selectedDetenu.dureeRestante}</p>
                                            </div>
                                          )}
                                        </div>
                                        <div>
                                          <label className="text-sm text-slate-400">Catégorie d'infraction:</label>
                                          <p className="text-slate-200 bg-slate-700 p-2 rounded mt-1">
                                            {selectedDetenu.categorie}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transferts">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Demandes de transfert</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700">
                          <TableHead className="text-slate-300">Date demande</TableHead>
                          <TableHead className="text-slate-300">Détenu</TableHead>
                          <TableHead className="text-slate-300">Centre origine</TableHead>
                          <TableHead className="text-slate-300">Centre destination</TableHead>
                          <TableHead className="text-slate-300">Motif</TableHead>
                          <TableHead className="text-slate-300">Demandeur</TableHead>
                          <TableHead className="text-slate-300">Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transferts.map((transfert) => {
                          const detenu = detenus.find((d) => d.id === transfert.detenuId)
                          return (
                            <TableRow key={transfert.id} className="border-slate-700 hover:bg-slate-700/50">
                              <TableCell className="text-slate-300">
                                {new Date(transfert.datedemande).toLocaleDateString("fr-FR")}
                              </TableCell>
                              <TableCell className="text-slate-200">
                                {detenu && (
                                  <div>
                                    <p className="font-medium">
                                      {detenu.prenom} {detenu.nom}
                                    </p>
                                    <p className="text-xs text-slate-400 font-mono">{detenu.numeroEcrou}</p>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-slate-300">{transfert.centreOrigine}</TableCell>
                              <TableCell className="text-slate-300">{transfert.centreDestination}</TableCell>
                              <TableCell className="text-slate-300 max-w-xs truncate">{transfert.motif}</TableCell>
                              <TableCell className="text-slate-300">{transfert.demandeur}</TableCell>
                              <TableCell>
                                <Badge className={getTransfertBadge(transfert.statut)}>
                                  {transfert.statut.replace("_", " ")}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {filteredCentres.length === 0 && activeTab === "centres" && (
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg mb-2">Aucun centre trouvé</p>
              <p className="text-slate-500">Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </div>
      </div>
    </PermissionGuard>
  )
}
