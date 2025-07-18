"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Search,
  Filter,
  Eye,
  Gavel,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  FileText,
  CheckCircle,
  Building,
} from "lucide-react"
import Sidebar from "@/components/layout/sidebar"
import PermissionGuard from "@/components/auth/permission-guard"
import { getCurrentUser } from "@/lib/auth"

interface PVEnAttente {
  id: string
  numero: string
  titre: string
  categorie: string
  priorite: "faible" | "normale" | "haute" | "urgente"
  opj: string
  date: string
  lieu: string
  suspect: {
    nom: string
    prenom: string
    age: number
  }
  description: string
  preuves: string[]
  temoins: number
  statut: "en_attente_decision" | "garde_a_vue" | "detention" | "relache"
}

interface Decision {
  id: string
  pvId: string
  commandant: string
  date: string
  decision: "garde_a_vue" | "detention" | "relache"
  motif: string
  duree?: string
  lieuDetention?: string
}

const mockPVsEnAttente: PVEnAttente[] = [
  {
    id: "1",
    numero: "PV-2024-001",
    titre: "Vol à main armée - Banque Centrale",
    categorie: "Vol",
    priorite: "urgente",
    opj: "Lieutenant Dubois",
    date: "2024-01-15",
    lieu: "123 Avenue de la République, Paris",
    suspect: {
      nom: "Dupont",
      prenom: "Marc",
      age: 35,
    },
    description: "Vol à main armée perpétré dans une banque avec menaces et violence",
    preuves: ["Vidéosurveillance", "Témoignages", "Arme retrouvée"],
    temoins: 3,
    statut: "en_attente_decision",
  },
  {
    id: "2",
    numero: "PV-2024-002",
    titre: "Trafic de stupéfiants - Quartier Nord",
    categorie: "Trafic",
    priorite: "haute",
    opj: "Capitaine Martin",
    date: "2024-01-14",
    lieu: "Rue des Lilas, Quartier Nord",
    suspect: {
      nom: "Garcia",
      prenom: "Antonio",
      age: 28,
    },
    description: "Trafic de stupéfiants organisé avec plusieurs suspects interpellés",
    preuves: ["Saisie de drogue", "Argent liquide", "Téléphones"],
    temoins: 2,
    statut: "en_attente_decision",
  },
  {
    id: "3",
    numero: "PV-2024-003",
    titre: "Agression physique - Place de la République",
    categorie: "Agression",
    priorite: "normale",
    opj: "Sergent Moreau",
    date: "2024-01-13",
    lieu: "Place de la République, Paris",
    suspect: {
      nom: "Martin",
      prenom: "Sophie",
      age: 42,
    },
    description: "Agression physique avec coups et blessures sur la voie publique",
    preuves: ["Certificat médical", "Témoignages"],
    temoins: 4,
    statut: "garde_a_vue",
  },
]

const mockDecisions: Decision[] = [
  {
    id: "1",
    pvId: "3",
    commandant: "Commandant Rousseau",
    date: "2024-01-13",
    decision: "garde_a_vue",
    motif: "Nécessité d'approfondir l'enquête",
    duree: "24 heures",
    lieuDetention: "Commissariat Central",
  },
]

export default function DecisionsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("en_attente")
  const [pvsEnAttente, setPvsEnAttente] = useState<PVEnAttente[]>(mockPVsEnAttente)
  const [decisions, setDecisions] = useState<Decision[]>(mockDecisions)
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("tous")
  const [selectedPV, setSelectedPV] = useState<PVEnAttente | null>(null)
  const [decisionForm, setDecisionForm] = useState({
    decision: "",
    motif: "",
    duree: "",
    lieuDetention: "",
  })

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.role !== "commandant") {
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
      en_attente_decision: "bg-yellow-600 text-white",
      garde_a_vue: "bg-blue-600 text-white",
      detention: "bg-red-600 text-white",
      relache: "bg-green-600 text-white",
    }
    return variants[statut as keyof typeof variants] || variants.en_attente_decision
  }

  const getDecisionBadge = (decision: string) => {
    const variants = {
      garde_a_vue: "bg-blue-600 text-white",
      detention: "bg-red-600 text-white",
      relache: "bg-green-600 text-white",
    }
    return variants[decision as keyof typeof variants] || variants.garde_a_vue
  }

  const filteredPVs = pvsEnAttente.filter((pv) => {
    const matchesSearch =
      pv.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pv.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pv.suspect.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pv.suspect.prenom.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPriority = priorityFilter === "tous" || pv.priorite === priorityFilter

    return matchesSearch && matchesPriority
  })

  const handleDecision = () => {
    if (!selectedPV || !decisionForm.decision) return

    const newDecision: Decision = {
      id: Date.now().toString(),
      pvId: selectedPV.id,
      commandant: getCurrentUser()?.prenom + " " + getCurrentUser()?.nom || "Commandant",
      date: new Date().toISOString().split("T")[0],
      decision: decisionForm.decision as "garde_a_vue" | "detention" | "relache",
      motif: decisionForm.motif,
      duree: decisionForm.duree,
      lieuDetention: decisionForm.lieuDetention,
    }

    setDecisions([...decisions, newDecision])

    // Mettre à jour le statut du PV
    setPvsEnAttente(
      pvsEnAttente.map((pv) => (pv.id === selectedPV.id ? { ...pv, statut: decisionForm.decision as any } : pv)),
    )

    // Réinitialiser le formulaire
    setDecisionForm({
      decision: "",
      motif: "",
      duree: "",
      lieuDetention: "",
    })
    setSelectedPV(null)
  }

  const stats = {
    enAttente: pvsEnAttente.filter((pv) => pv.statut === "en_attente_decision").length,
    gardeAVue: pvsEnAttente.filter((pv) => pv.statut === "garde_a_vue").length,
    detention: pvsEnAttente.filter((pv) => pv.statut === "detention").length,
    relaches: pvsEnAttente.filter((pv) => pv.statut === "relache").length,
    urgents: pvsEnAttente.filter((pv) => pv.priorite === "urgente").length,
  }

  return (
    <PermissionGuard resource="decisions" action="read">
      <div className="min-h-screen bg-slate-900">
        <Sidebar />

        <div className="md:ml-64 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Décisions Judiciaires</h1>
            <p className="text-slate-400">Gestion des décisions pour les PV en attente - Commandant de Brigade</p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">En attente</p>
                    <p className="text-2xl font-bold text-yellow-400">{stats.enAttente}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Garde à vue</p>
                    <p className="text-2xl font-bold text-blue-400">{stats.gardeAVue}</p>
                  </div>
                  <Building className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Détention</p>
                    <p className="text-2xl font-bold text-red-400">{stats.detention}</p>
                  </div>
                  <Gavel className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Relâchés</p>
                    <p className="text-2xl font-bold text-green-400">{stats.relaches}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Urgents</p>
                    <p className="text-2xl font-bold text-orange-400">{stats.urgents}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-slate-800 border-slate-700 mb-6">
              <TabsTrigger value="en_attente" className="data-[state=active]:bg-blue-600">
                <Clock className="h-4 w-4 mr-2" />
                PV en attente ({stats.enAttente})
              </TabsTrigger>
              <TabsTrigger value="decisions" className="data-[state=active]:bg-blue-600">
                <Gavel className="h-4 w-4 mr-2" />
                Décisions prises
              </TabsTrigger>
            </TabsList>

            <TabsContent value="en_attente">
              {/* Filtres */}
              <Card className="bg-slate-800 border-slate-700 mb-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filtres
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Rechercher un PV ou suspect..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>

                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Priorité" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="tous">Toutes priorités</SelectItem>
                        <SelectItem value="urgente">Urgente</SelectItem>
                        <SelectItem value="haute">Haute</SelectItem>
                        <SelectItem value="normale">Normale</SelectItem>
                        <SelectItem value="faible">Faible</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                      onClick={() => {
                        setSearchTerm("")
                        setPriorityFilter("tous")
                      }}
                    >
                      Réinitialiser
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Table des PV en attente */}
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700">
                          <TableHead className="text-slate-300">N° PV</TableHead>
                          <TableHead className="text-slate-300">Affaire</TableHead>
                          <TableHead className="text-slate-300">Suspect</TableHead>
                          <TableHead className="text-slate-300">Priorité</TableHead>
                          <TableHead className="text-slate-300">OPJ</TableHead>
                          <TableHead className="text-slate-300">Date</TableHead>
                          <TableHead className="text-slate-300">Statut</TableHead>
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
                                <div>
                                  <p className="font-medium">{pv.titre}</p>
                                  <p className="text-xs text-slate-400">{pv.categorie}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-200">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-slate-400" />
                                <div>
                                  <p className="font-medium">
                                    {pv.suspect.prenom} {pv.suspect.nom}
                                  </p>
                                  <p className="text-xs text-slate-400">{pv.suspect.age} ans</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getPriorityBadge(pv.priorite)}>{pv.priorite}</Badge>
                            </TableCell>
                            <TableCell className="text-slate-300">{pv.opj}</TableCell>
                            <TableCell className="text-slate-300">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {new Date(pv.date).toLocaleDateString("fr-FR")}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusBadge(pv.statut)}>{pv.statut.replace("_", " ")}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-blue-400 hover:text-blue-300 hover:bg-slate-700"
                                      onClick={() => setSelectedPV(pv)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="bg-slate-800 border-slate-700 max-w-4xl">
                                    <DialogHeader>
                                      <DialogTitle className="text-white">Détails du PV - {pv.numero}</DialogTitle>
                                    </DialogHeader>
                                    {selectedPV && (
                                      <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          <div className="space-y-4">
                                            <div>
                                              <h3 className="text-lg font-medium text-white mb-2">
                                                Informations générales
                                              </h3>
                                              <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                  <span className="text-slate-400">Titre:</span>
                                                  <span className="text-slate-300">{selectedPV.titre}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                  <span className="text-slate-400">Catégorie:</span>
                                                  <span className="text-slate-300">{selectedPV.categorie}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                  <span className="text-slate-400">OPJ:</span>
                                                  <span className="text-slate-300">{selectedPV.opj}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                  <span className="text-slate-400">Lieu:</span>
                                                  <span className="text-slate-300">{selectedPV.lieu}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                  <span className="text-slate-400">Témoins:</span>
                                                  <span className="text-slate-300">{selectedPV.temoins}</span>
                                                </div>
                                              </div>
                                            </div>

                                            <div>
                                              <h3 className="text-lg font-medium text-white mb-2">Suspect</h3>
                                              <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                  <span className="text-slate-400">Nom:</span>
                                                  <span className="text-slate-300">
                                                    {selectedPV.suspect.prenom} {selectedPV.suspect.nom}
                                                  </span>
                                                </div>
                                                <div className="flex justify-between">
                                                  <span className="text-slate-400">Âge:</span>
                                                  <span className="text-slate-300">{selectedPV.suspect.age} ans</span>
                                                </div>
                                              </div>
                                            </div>

                                            <div>
                                              <h3 className="text-lg font-medium text-white mb-2">Preuves</h3>
                                              <div className="space-y-1">
                                                {selectedPV.preuves.map((preuve, index) => (
                                                  <div key={index} className="flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                                    <span className="text-sm text-slate-300">{preuve}</span>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          </div>

                                          <div className="space-y-4">
                                            <div>
                                              <h3 className="text-lg font-medium text-white mb-2">Description</h3>
                                              <p className="text-sm text-slate-300 bg-slate-700 p-3 rounded">
                                                {selectedPV.description}
                                              </p>
                                            </div>

                                            {selectedPV.statut === "en_attente_decision" && (
                                              <div>
                                                <h3 className="text-lg font-medium text-white mb-4">
                                                  Prendre une décision
                                                </h3>
                                                <div className="space-y-4">
                                                  <div>
                                                    <label className="text-sm text-slate-300 mb-2 block">
                                                      Décision
                                                    </label>
                                                    <Select
                                                      value={decisionForm.decision}
                                                      onValueChange={(value) =>
                                                        setDecisionForm({ ...decisionForm, decision: value })
                                                      }
                                                    >
                                                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                                        <SelectValue placeholder="Choisir une décision" />
                                                      </SelectTrigger>
                                                      <SelectContent className="bg-slate-700 border-slate-600">
                                                        <SelectItem value="garde_a_vue">Garde à vue</SelectItem>
                                                        <SelectItem value="detention">Détention</SelectItem>
                                                        <SelectItem value="relache">Relâcher</SelectItem>
                                                      </SelectContent>
                                                    </Select>
                                                  </div>

                                                  {decisionForm.decision === "garde_a_vue" && (
                                                    <>
                                                      <div>
                                                        <label className="text-sm text-slate-300 mb-2 block">
                                                          Durée
                                                        </label>
                                                        <Select
                                                          value={decisionForm.duree}
                                                          onValueChange={(value) =>
                                                            setDecisionForm({ ...decisionForm, duree: value })
                                                          }
                                                        >
                                                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                                            <SelectValue placeholder="Durée de garde à vue" />
                                                          </SelectTrigger>
                                                          <SelectContent className="bg-slate-700 border-slate-600">
                                                            <SelectItem value="24h">24 heures</SelectItem>
                                                            <SelectItem value="48h">48 heures</SelectItem>
                                                            <SelectItem value="72h">72 heures</SelectItem>
                                                          </SelectContent>
                                                        </Select>
                                                      </div>
                                                      <div>
                                                        <label className="text-sm text-slate-300 mb-2 block">
                                                          Lieu de détention
                                                        </label>
                                                        <Select
                                                          value={decisionForm.lieuDetention}
                                                          onValueChange={(value) =>
                                                            setDecisionForm({ ...decisionForm, lieuDetention: value })
                                                          }
                                                        >
                                                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                                            <SelectValue placeholder="Lieu de garde à vue" />
                                                          </SelectTrigger>
                                                          <SelectContent className="bg-slate-700 border-slate-600">
                                                            <SelectItem value="Commissariat Central">
                                                              Commissariat Central
                                                            </SelectItem>
                                                            <SelectItem value="Brigade Nord">Brigade Nord</SelectItem>
                                                            <SelectItem value="Brigade Sud">Brigade Sud</SelectItem>
                                                          </SelectContent>
                                                        </Select>
                                                      </div>
                                                    </>
                                                  )}

                                                  {decisionForm.decision === "detention" && (
                                                    <div>
                                                      <label className="text-sm text-slate-300 mb-2 block">
                                                        Centre pénitentiaire
                                                      </label>
                                                      <Select
                                                        value={decisionForm.lieuDetention}
                                                        onValueChange={(value) =>
                                                          setDecisionForm({ ...decisionForm, lieuDetention: value })
                                                        }
                                                      >
                                                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                                          <SelectValue placeholder="Centre de détention" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-slate-700 border-slate-600">
                                                          <SelectItem value="Maison d'arrêt A">
                                                            Maison d'arrêt A
                                                          </SelectItem>
                                                          <SelectItem value="Centre pénitentiaire B">
                                                            Centre pénitentiaire B
                                                          </SelectItem>
                                                          <SelectItem value="Prison centrale C">
                                                            Prison centrale C
                                                          </SelectItem>
                                                        </SelectContent>
                                                      </Select>
                                                    </div>
                                                  )}

                                                  <div>
                                                    <label className="text-sm text-slate-300 mb-2 block">
                                                      Motif de la décision
                                                    </label>
                                                    <Textarea
                                                      value={decisionForm.motif}
                                                      onChange={(e) =>
                                                        setDecisionForm({ ...decisionForm, motif: e.target.value })
                                                      }
                                                      className="bg-slate-700 border-slate-600 text-white"
                                                      placeholder="Justifiez votre décision..."
                                                      rows={3}
                                                    />
                                                  </div>

                                                  <Button
                                                    onClick={handleDecision}
                                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                                    disabled={!decisionForm.decision || !decisionForm.motif}
                                                  >
                                                    <Gavel className="h-4 w-4 mr-2" />
                                                    Valider la décision
                                                  </Button>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>

                                {pv.statut === "en_attente_decision" && (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        size="sm"
                                        className="bg-blue-600 hover:bg-blue-700"
                                        onClick={() => setSelectedPV(pv)}
                                      >
                                        <Gavel className="h-4 w-4 mr-1" />
                                        Décider
                                      </Button>
                                    </DialogTrigger>
                                  </Dialog>
                                )}
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

            <TabsContent value="decisions">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Historique des décisions</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700">
                          <TableHead className="text-slate-300">Date</TableHead>
                          <TableHead className="text-slate-300">N° PV</TableHead>
                          <TableHead className="text-slate-300">Décision</TableHead>
                          <TableHead className="text-slate-300">Motif</TableHead>
                          <TableHead className="text-slate-300">Durée/Lieu</TableHead>
                          <TableHead className="text-slate-300">Commandant</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {decisions.map((decision) => {
                          const pv = pvsEnAttente.find((p) => p.id === decision.pvId)
                          return (
                            <TableRow key={decision.id} className="border-slate-700 hover:bg-slate-700/50">
                              <TableCell className="text-slate-300">
                                {new Date(decision.date).toLocaleDateString("fr-FR")}
                              </TableCell>
                              <TableCell className="text-slate-200 font-mono">{pv?.numero}</TableCell>
                              <TableCell>
                                <Badge className={getDecisionBadge(decision.decision)}>
                                  {decision.decision.replace("_", " ")}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-slate-300 max-w-xs truncate">{decision.motif}</TableCell>
                              <TableCell className="text-slate-300">
                                {decision.duree && <div>{decision.duree}</div>}
                                {decision.lieuDetention && (
                                  <div className="text-xs text-slate-400">{decision.lieuDetention}</div>
                                )}
                              </TableCell>
                              <TableCell className="text-slate-300">{decision.commandant}</TableCell>
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

          {filteredPVs.length === 0 && activeTab === "en_attente" && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg mb-2">Aucun PV en attente</p>
              <p className="text-slate-500">Tous les PV ont été traités</p>
            </div>
          )}
        </div>
      </div>
    </PermissionGuard>
  )
}
