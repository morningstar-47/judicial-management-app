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
  FileText,
  CheckCircle,
  Building,
  Scale,
} from "lucide-react"
import Sidebar from "@/components/layout/sidebar"
import PermissionGuard from "@/components/auth/permission-guard"
import { getCurrentUser } from "@/lib/auth"

interface DossierAJuger {
  id: string
  numero: string
  titre: string
  categorie: string
  priorite: "faible" | "normale" | "haute" | "urgente"
  suspect: {
    nom: string
    prenom: string
    age: number
    numeroEcrou?: string
  }
  opj: string
  dateOuverture: string
  nbPV: number
  preuves: string[]
  statut: "a_juger" | "en_cours_jugement" | "juge"
  typeDetention: "garde_a_vue" | "detention_provisoire" | "libre"
  lieuDetention?: string
}

interface Jugement {
  id: string
  dossierId: string
  juge: string
  date: string
  decision: "relaxe" | "condamnation" | "detention_provisoire" | "mise_en_liberte"
  peine?: string
  duree?: string
  centreAffectation?: string
  motif: string
}

const mockDossiersAJuger: DossierAJuger[] = [
  {
    id: "1",
    numero: "DOS-2024-001",
    titre: "Vol à main armée - Banque Centrale",
    categorie: "Vol",
    priorite: "urgente",
    suspect: {
      nom: "Dupont",
      prenom: "Marc",
      age: 35,
      numeroEcrou: "ECR-2024-001",
    },
    opj: "Lieutenant Dubois",
    dateOuverture: "2024-01-15",
    nbPV: 3,
    preuves: ["Vidéosurveillance", "Témoignages", "Arme retrouvée"],
    statut: "a_juger",
    typeDetention: "detention_provisoire",
    lieuDetention: "Maison d'arrêt A",
  },
  {
    id: "2",
    numero: "DOS-2024-002",
    titre: "Trafic de stupéfiants - Quartier Nord",
    categorie: "Trafic",
    priorite: "haute",
    suspect: {
      nom: "Garcia",
      prenom: "Antonio",
      age: 28,
      numeroEcrou: "ECR-2024-002",
    },
    opj: "Capitaine Martin",
    dateOuverture: "2024-01-14",
    nbPV: 5,
    preuves: ["Saisie de drogue", "Argent liquide", "Téléphones", "Témoignages"],
    statut: "en_cours_jugement",
    typeDetention: "detention_provisoire",
    lieuDetention: "Centre pénitentiaire B",
  },
  {
    id: "3",
    numero: "DOS-2024-003",
    titre: "Agression physique - Place de la République",
    categorie: "Agression",
    priorite: "normale",
    suspect: {
      nom: "Martin",
      prenom: "Sophie",
      age: 42,
    },
    opj: "Sergent Moreau",
    dateOuverture: "2024-01-13",
    nbPV: 2,
    preuves: ["Certificat médical", "Témoignages"],
    statut: "a_juger",
    typeDetention: "libre",
  },
]

const mockJugements: Jugement[] = [
  {
    id: "1",
    dossierId: "4",
    juge: "Juge Moreau",
    date: "2024-01-12",
    decision: "condamnation",
    peine: "2 ans ferme",
    duree: "24 mois",
    centreAffectation: "Prison centrale C",
    motif: "Récidive et gravité des faits",
  },
]

const centresPenitentiaires = [
  {
    id: "1",
    nom: "Maison d'arrêt A",
    capacite: 500,
    occupation: 420,
    type: "Maison d'arrêt",
  },
  {
    id: "2",
    nom: "Centre pénitentiaire B",
    capacite: 800,
    occupation: 650,
    type: "Centre de détention",
  },
  {
    id: "3",
    nom: "Prison centrale C",
    capacite: 1200,
    occupation: 980,
    type: "Établissement pour peines",
  },
]

export default function JugementsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("a_juger")
  const [dossiers, setDossiers] = useState<DossierAJuger[]>(mockDossiersAJuger)
  const [jugements, setJugements] = useState<Jugement[]>(mockJugements)
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("tous")
  const [selectedDossier, setSelectedDossier] = useState<DossierAJuger | null>(null)
  const [jugementForm, setJugementForm] = useState({
    decision: "",
    peine: "",
    duree: "",
    centreAffectation: "",
    motif: "",
  })

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.role !== "juge") {
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
      a_juger: "bg-yellow-600 text-white",
      en_cours_jugement: "bg-blue-600 text-white",
      juge: "bg-green-600 text-white",
    }
    return variants[statut as keyof typeof variants] || variants.a_juger
  }

  const getDetentionBadge = (type: string) => {
    const variants = {
      garde_a_vue: "bg-blue-600 text-white",
      detention_provisoire: "bg-red-600 text-white",
      libre: "bg-green-600 text-white",
    }
    return variants[type as keyof typeof variants] || variants.libre
  }

  const getDecisionBadge = (decision: string) => {
    const variants = {
      relaxe: "bg-green-600 text-white",
      condamnation: "bg-red-600 text-white",
      detention_provisoire: "bg-orange-600 text-white",
      mise_en_liberte: "bg-blue-600 text-white",
    }
    return variants[decision as keyof typeof variants] || variants.relaxe
  }

  const filteredDossiers = dossiers.filter((dossier) => {
    const matchesSearch =
      dossier.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.suspect.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.suspect.prenom.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPriority = priorityFilter === "tous" || dossier.priorite === priorityFilter

    return matchesSearch && matchesPriority
  })

  const handleJugement = () => {
    if (!selectedDossier || !jugementForm.decision) return

    const newJugement: Jugement = {
      id: Date.now().toString(),
      dossierId: selectedDossier.id,
      juge: getCurrentUser()?.prenom + " " + getCurrentUser()?.nom || "Juge",
      date: new Date().toISOString().split("T")[0],
      decision: jugementForm.decision as any,
      peine: jugementForm.peine,
      duree: jugementForm.duree,
      centreAffectation: jugementForm.centreAffectation,
      motif: jugementForm.motif,
    }

    setJugements([...jugements, newJugement])

    // Mettre à jour le statut du dossier
    setDossiers(
      dossiers.map((dossier) => (dossier.id === selectedDossier.id ? { ...dossier, statut: "juge" } : dossier)),
    )

    // Réinitialiser le formulaire
    setJugementForm({
      decision: "",
      peine: "",
      duree: "",
      centreAffectation: "",
      motif: "",
    })
    setSelectedDossier(null)
  }

  const stats = {
    aJuger: dossiers.filter((d) => d.statut === "a_juger").length,
    enCours: dossiers.filter((d) => d.statut === "en_cours_jugement").length,
    juges: dossiers.filter((d) => d.statut === "juge").length,
    urgents: dossiers.filter((d) => d.priorite === "urgente").length,
    detention: dossiers.filter((d) => d.typeDetention === "detention_provisoire").length,
  }

  return (
    <PermissionGuard resource="jugements" action="read">
      <div className="min-h-screen bg-slate-900">
        <Sidebar />

        <div className="md:ml-64 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Jugements et Décisions</h1>
            <p className="text-slate-400">Gestion des dossiers à juger et affectation des détenus</p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">À juger</p>
                    <p className="text-2xl font-bold text-yellow-400">{stats.aJuger}</p>
                  </div>
                  <Scale className="h-8 w-8 text-yellow-400" />
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
                  <Clock className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Jugés</p>
                    <p className="text-2xl font-bold text-green-400">{stats.juges}</p>
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

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">En détention</p>
                    <p className="text-2xl font-bold text-red-400">{stats.detention}</p>
                  </div>
                  <Building className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-slate-800 border-slate-700 mb-6">
              <TabsTrigger value="a_juger" className="data-[state=active]:bg-blue-600">
                <Scale className="h-4 w-4 mr-2" />À juger ({stats.aJuger})
              </TabsTrigger>
              <TabsTrigger value="jugements" className="data-[state=active]:bg-blue-600">
                <Gavel className="h-4 w-4 mr-2" />
                Jugements rendus
              </TabsTrigger>
              <TabsTrigger value="centres" className="data-[state=active]:bg-blue-600">
                <Building className="h-4 w-4 mr-2" />
                Centres pénitentiaires
              </TabsTrigger>
            </TabsList>

            <TabsContent value="a_juger">
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
                        placeholder="Rechercher un dossier..."
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

              {/* Table des dossiers */}
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700">
                          <TableHead className="text-slate-300">N° Dossier</TableHead>
                          <TableHead className="text-slate-300">Affaire</TableHead>
                          <TableHead className="text-slate-300">Suspect</TableHead>
                          <TableHead className="text-slate-300">Priorité</TableHead>
                          <TableHead className="text-slate-300">Détention</TableHead>
                          <TableHead className="text-slate-300">PV</TableHead>
                          <TableHead className="text-slate-300">Statut</TableHead>
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
                                  <p className="text-xs text-slate-400">{dossier.categorie}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-200">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-slate-400" />
                                <div>
                                  <p className="font-medium">
                                    {dossier.suspect.prenom} {dossier.suspect.nom}
                                  </p>
                                  <p className="text-xs text-slate-400">{dossier.suspect.age} ans</p>
                                  {dossier.suspect.numeroEcrou && (
                                    <p className="text-xs text-slate-500 font-mono">{dossier.suspect.numeroEcrou}</p>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getPriorityBadge(dossier.priorite)}>{dossier.priorite}</Badge>
                            </TableCell>
                            <TableCell>
                              <div>
                                <Badge className={getDetentionBadge(dossier.typeDetention)}>
                                  {dossier.typeDetention.replace("_", " ")}
                                </Badge>
                                {dossier.lieuDetention && (
                                  <p className="text-xs text-slate-400 mt-1">{dossier.lieuDetention}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-300">
                              <div className="flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                {dossier.nbPV}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusBadge(dossier.statut)}>
                                {dossier.statut.replace("_", " ")}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-blue-400 hover:text-blue-300 hover:bg-slate-700"
                                      onClick={() => setSelectedDossier(dossier)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="bg-slate-800 border-slate-700 max-w-4xl">
                                    <DialogHeader>
                                      <DialogTitle className="text-white">
                                        Dossier {selectedDossier?.numero}
                                      </DialogTitle>
                                    </DialogHeader>
                                    {selectedDossier && (
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
                                                  <span className="text-slate-300">{selectedDossier.titre}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                  <span className="text-slate-400">Catégorie:</span>
                                                  <span className="text-slate-300">{selectedDossier.categorie}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                  <span className="text-slate-400">OPJ:</span>
                                                  <span className="text-slate-300">{selectedDossier.opj}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                  <span className="text-slate-400">Date ouverture:</span>
                                                  <span className="text-slate-300">
                                                    {new Date(selectedDossier.dateOuverture).toLocaleDateString(
                                                      "fr-FR",
                                                    )}
                                                  </span>
                                                </div>
                                                <div className="flex justify-between">
                                                  <span className="text-slate-400">Nombre de PV:</span>
                                                  <span className="text-slate-300">{selectedDossier.nbPV}</span>
                                                </div>
                                              </div>
                                            </div>

                                            <div>
                                              <h3 className="text-lg font-medium text-white mb-2">Suspect</h3>
                                              <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                  <span className="text-slate-400">Nom:</span>
                                                  <span className="text-slate-300">
                                                    {selectedDossier.suspect.prenom} {selectedDossier.suspect.nom}
                                                  </span>
                                                </div>
                                                <div className="flex justify-between">
                                                  <span className="text-slate-400">Âge:</span>
                                                  <span className="text-slate-300">
                                                    {selectedDossier.suspect.age} ans
                                                  </span>
                                                </div>
                                                {selectedDossier.suspect.numeroEcrou && (
                                                  <div className="flex justify-between">
                                                    <span className="text-slate-400">N° Écrou:</span>
                                                    <span className="text-slate-300 font-mono">
                                                      {selectedDossier.suspect.numeroEcrou}
                                                    </span>
                                                  </div>
                                                )}
                                                <div className="flex justify-between">
                                                  <span className="text-slate-400">Détention:</span>
                                                  <div>
                                                    <Badge className={getDetentionBadge(selectedDossier.typeDetention)}>
                                                      {selectedDossier.typeDetention.replace("_", " ")}
                                                    </Badge>
                                                    {selectedDossier.lieuDetention && (
                                                      <p className="text-xs text-slate-400 mt-1">
                                                        {selectedDossier.lieuDetention}
                                                      </p>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>

                                            <div>
                                              <h3 className="text-lg font-medium text-white mb-2">Preuves</h3>
                                              <div className="space-y-1">
                                                {selectedDossier.preuves.map((preuve, index) => (
                                                  <div key={index} className="flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                                    <span className="text-sm text-slate-300">{preuve}</span>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          </div>

                                          <div className="space-y-4">
                                            {(selectedDossier.statut === "a_juger" ||
                                              selectedDossier.statut === "en_cours_jugement") && (
                                              <div>
                                                <h3 className="text-lg font-medium text-white mb-4">
                                                  Rendre un jugement
                                                </h3>
                                                <div className="space-y-4">
                                                  <div>
                                                    <label className="text-sm text-slate-300 mb-2 block">
                                                      Décision
                                                    </label>
                                                    <Select
                                                      value={jugementForm.decision}
                                                      onValueChange={(value) =>
                                                        setJugementForm({ ...jugementForm, decision: value })
                                                      }
                                                    >
                                                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                                        <SelectValue placeholder="Choisir une décision" />
                                                      </SelectTrigger>
                                                      <SelectContent className="bg-slate-700 border-slate-600">
                                                        <SelectItem value="relaxe">Relaxe</SelectItem>
                                                        <SelectItem value="condamnation">Condamnation</SelectItem>
                                                        <SelectItem value="detention_provisoire">
                                                          Détention provisoire
                                                        </SelectItem>
                                                        <SelectItem value="mise_en_liberte">Mise en liberté</SelectItem>
                                                      </SelectContent>
                                                    </Select>
                                                  </div>

                                                  {jugementForm.decision === "condamnation" && (
                                                    <>
                                                      <div>
                                                        <label className="text-sm text-slate-300 mb-2 block">
                                                          Peine
                                                        </label>
                                                        <Input
                                                          value={jugementForm.peine}
                                                          onChange={(e) =>
                                                            setJugementForm({ ...jugementForm, peine: e.target.value })
                                                          }
                                                          className="bg-slate-700 border-slate-600 text-white"
                                                          placeholder="Ex: 2 ans ferme, 6 mois avec sursis..."
                                                        />
                                                      </div>
                                                      <div>
                                                        <label className="text-sm text-slate-300 mb-2 block">
                                                          Durée (mois)
                                                        </label>
                                                        <Input
                                                          type="number"
                                                          value={jugementForm.duree}
                                                          onChange={(e) =>
                                                            setJugementForm({ ...jugementForm, duree: e.target.value })
                                                          }
                                                          className="bg-slate-700 border-slate-600 text-white"
                                                          placeholder="Durée en mois"
                                                        />
                                                      </div>
                                                    </>
                                                  )}

                                                  {(jugementForm.decision === "condamnation" ||
                                                    jugementForm.decision === "detention_provisoire") && (
                                                    <div>
                                                      <label className="text-sm text-slate-300 mb-2 block">
                                                        Centre d'affectation
                                                      </label>
                                                      <Select
                                                        value={jugementForm.centreAffectation}
                                                        onValueChange={(value) =>
                                                          setJugementForm({
                                                            ...jugementForm,
                                                            centreAffectation: value,
                                                          })
                                                        }
                                                      >
                                                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                                          <SelectValue placeholder="Choisir un centre" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-slate-700 border-slate-600">
                                                          {centresPenitentiaires.map((centre) => (
                                                            <SelectItem key={centre.id} value={centre.nom}>
                                                              {centre.nom} ({centre.type})
                                                            </SelectItem>
                                                          ))}
                                                        </SelectContent>
                                                      </Select>
                                                    </div>
                                                  )}

                                                  <div>
                                                    <label className="text-sm text-slate-300 mb-2 block">
                                                      Motif de la décision
                                                    </label>
                                                    <Textarea
                                                      value={jugementForm.motif}
                                                      onChange={(e) =>
                                                        setJugementForm({ ...jugementForm, motif: e.target.value })
                                                      }
                                                      className="bg-slate-700 border-slate-600 text-white"
                                                      placeholder="Justifiez votre décision..."
                                                      rows={4}
                                                    />
                                                  </div>

                                                  <Button
                                                    onClick={handleJugement}
                                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                                    disabled={!jugementForm.decision || !jugementForm.motif}
                                                  >
                                                    <Gavel className="h-4 w-4 mr-2" />
                                                    Rendre le jugement
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

                                {(dossier.statut === "a_juger" || dossier.statut === "en_cours_jugement") && (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        size="sm"
                                        className="bg-blue-600 hover:bg-blue-700"
                                        onClick={() => setSelectedDossier(dossier)}
                                      >
                                        <Gavel className="h-4 w-4 mr-1" />
                                        Juger
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

            <TabsContent value="jugements">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Historique des jugements</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700">
                          <TableHead className="text-slate-300">Date</TableHead>
                          <TableHead className="text-slate-300">N° Dossier</TableHead>
                          <TableHead className="text-slate-300">Décision</TableHead>
                          <TableHead className="text-slate-300">Peine/Durée</TableHead>
                          <TableHead className="text-slate-300">Centre</TableHead>
                          <TableHead className="text-slate-300">Juge</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {jugements.map((jugement) => {
                          const dossier = dossiers.find((d) => d.id === jugement.dossierId)
                          return (
                            <TableRow key={jugement.id} className="border-slate-700 hover:bg-slate-700/50">
                              <TableCell className="text-slate-300">
                                {new Date(jugement.date).toLocaleDateString("fr-FR")}
                              </TableCell>
                              <TableCell className="text-slate-200 font-mono">{dossier?.numero}</TableCell>
                              <TableCell>
                                <Badge className={getDecisionBadge(jugement.decision)}>
                                  {jugement.decision.replace("_", " ")}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-slate-300">
                                {jugement.peine && <div>{jugement.peine}</div>}
                                {jugement.duree && <div className="text-xs text-slate-400">{jugement.duree} mois</div>}
                              </TableCell>
                              <TableCell className="text-slate-300">{jugement.centreAffectation}</TableCell>
                              <TableCell className="text-slate-300">{jugement.juge}</TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="centres">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {centresPenitentiaires.map((centre) => {
                  const tauxOccupation = Math.round((centre.occupation / centre.capacite) * 100)
                  const couleurTaux =
                    tauxOccupation >= 90 ? "text-red-400" : tauxOccupation >= 75 ? "text-orange-400" : "text-green-400"

                  return (
                    <Card key={centre.id} className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Building className="h-5 w-5" />
                          {centre.nom}
                        </CardTitle>
                        <p className="text-slate-400 text-sm">{centre.type}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300">Capacité:</span>
                            <span className="text-white font-medium">{centre.capacite}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300">Occupation:</span>
                            <span className="text-white font-medium">{centre.occupation}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300">Taux:</span>
                            <span className={`font-medium ${couleurTaux}`}>{tauxOccupation}%</span>
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
                            {centre.capacite - centre.occupation} places disponibles
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>

          {filteredDossiers.length === 0 && activeTab === "a_juger" && (
            <div className="text-center py-12">
              <Scale className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg mb-2">Aucun dossier à juger</p>
              <p className="text-slate-500">Tous les dossiers ont été traités</p>
            </div>
          )}
        </div>
      </div>
    </PermissionGuard>
  )
}
