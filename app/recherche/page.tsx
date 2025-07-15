"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  FileText,
  Users,
  Gavel,
  Eye,
  Edit,
  Calendar,
  User,
  AlertTriangle,
  Clock,
  TrendingUp,
} from "lucide-react"
import Sidebar from "@/components/layout/sidebar"
import AdvancedSearch from "@/components/search/advanced-search"
import { performFullTextSearch, type SearchQuery } from "@/lib/search-utils"

// Types pour les données
interface PV {
  id: string
  numero: string
  titre: string
  categorie: string
  priorite: "faible" | "normale" | "haute" | "urgente"
  statut: "brouillon" | "en_cours" | "transmis" | "archive"
  opj: string
  date: string
  lieu: string
  description: string
}

interface OPJ {
  id: string
  nom: string
  prenom: string
  matricule: string
  grade: string
  unite: string
  specialisation: string
  telephone: string
  email: string
  statut: "actif" | "inactif" | "conge"
}

interface Juge {
  id: string
  nom: string
  prenom: string
  fonction: string
  tribunal: string
  specialite: string
  telephone: string
  email: string
  nbAffaires: number
}

// Données mockées étendues
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
    lieu: "123 Avenue de la République, Paris",
    description: "Vol à main armée perpétré dans une banque avec menaces et violence",
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
    lieu: "Place de la République, Paris",
    description: "Agression physique avec coups et blessures sur la voie publique",
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
    lieu: "Rue des Lilas, Quartier Nord",
    description: "Trafic de stupéfiants organisé avec plusieurs suspects interpellés",
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
    lieu: "45 Rue des Lilas, Banlieue",
    description: "Cambriolage d'une résidence privée avec effraction et vol d'objets de valeur",
  },
  {
    id: "5",
    numero: "PV-2024-005",
    titre: "Fraude informatique - Entreprise TechCorp",
    categorie: "Fraude",
    priorite: "haute",
    statut: "en_cours",
    opj: "Capitaine Martin",
    date: "2024-01-11",
    lieu: "Zone industrielle, TechCorp",
    description: "Fraude informatique avec détournement de fonds et piratage de données",
  },
]

const mockOPJs: OPJ[] = [
  {
    id: "1",
    nom: "Martin",
    prenom: "Jean",
    matricule: "OPJ001",
    grade: "Capitaine",
    unite: "Unité Centrale",
    specialisation: "Crimes financiers",
    telephone: "01.23.45.67.89",
    email: "j.martin@police.fr",
    statut: "actif",
  },
  {
    id: "2",
    nom: "Dubois",
    prenom: "Marie",
    matricule: "OPJ002",
    grade: "Lieutenant",
    unite: "Brigade Anti-Criminalité",
    specialisation: "Stupéfiants",
    telephone: "01.23.45.67.90",
    email: "m.dubois@police.fr",
    statut: "actif",
  },
  {
    id: "3",
    nom: "Moreau",
    prenom: "Pierre",
    matricule: "OPJ003",
    grade: "Sergent",
    unite: "Police Judiciaire",
    specialisation: "Cybercriminalité",
    telephone: "01.23.45.67.91",
    email: "p.moreau@police.fr",
    statut: "conge",
  },
]

const mockJuges: Juge[] = [
  {
    id: "1",
    nom: "Rousseau",
    prenom: "Catherine",
    fonction: "Juge d'instruction",
    tribunal: "TGI Paris",
    specialite: "Crimes financiers",
    telephone: "01.44.32.51.00",
    email: "c.rousseau@justice.fr",
    nbAffaires: 15,
  },
  {
    id: "2",
    nom: "Bernard",
    prenom: "Michel",
    fonction: "Procureur",
    tribunal: "Parquet de Paris",
    specialite: "Stupéfiants",
    telephone: "01.44.32.51.01",
    email: "m.bernard@justice.fr",
    nbAffaires: 23,
  },
]

export default function RecherchePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"pv" | "opj" | "juges">("pv")
  const [searchResults, setSearchResults] = useState<{
    pv: PV[]
    opj: OPJ[]
    juges: Juge[]
  }>({
    pv: mockPVs,
    opj: mockOPJs,
    juges: mockJuges,
  })
  const [searchStats, setSearchStats] = useState({
    totalResults: 0,
    searchTime: 0,
    lastSearch: "",
  })

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [router])

  // Configuration des champs de recherche pour chaque type
  const searchConfigs = {
    pv: [
      { key: "numero", label: "N° PV", type: "text" as const },
      { key: "titre", label: "Titre", type: "text" as const },
      {
        key: "categorie",
        label: "Catégorie",
        type: "select" as const,
        options: ["Vol", "Agression", "Trafic", "Fraude"],
      },
      {
        key: "priorite",
        label: "Priorité",
        type: "select" as const,
        options: ["faible", "normale", "haute", "urgente"],
      },
      {
        key: "statut",
        label: "Statut",
        type: "select" as const,
        options: ["brouillon", "en_cours", "transmis", "archive"],
      },
      { key: "opj", label: "OPJ", type: "text" as const },
      { key: "date", label: "Date", type: "date" as const },
      { key: "lieu", label: "Lieu", type: "text" as const },
      { key: "description", label: "Description", type: "text" as const },
    ],
    opj: [
      { key: "nom", label: "Nom", type: "text" as const },
      { key: "prenom", label: "Prénom", type: "text" as const },
      { key: "matricule", label: "Matricule", type: "text" as const },
      {
        key: "grade",
        label: "Grade",
        type: "select" as const,
        options: ["Capitaine", "Lieutenant", "Sergent", "Brigadier"],
      },
      { key: "unite", label: "Unité", type: "text" as const },
      { key: "specialisation", label: "Spécialisation", type: "text" as const },
      { key: "statut", label: "Statut", type: "select" as const, options: ["actif", "inactif", "conge"] },
    ],
    juges: [
      { key: "nom", label: "Nom", type: "text" as const },
      { key: "prenom", label: "Prénom", type: "text" as const },
      { key: "fonction", label: "Fonction", type: "text" as const },
      { key: "tribunal", label: "Tribunal", type: "text" as const },
      { key: "specialite", label: "Spécialité", type: "text" as const },
      { key: "nbAffaires", label: "Nb Affaires", type: "number" as const },
    ],
  }

  const handleSearch = (query: SearchQuery) => {
    const startTime = performance.now()

    const results = {
      pv: performFullTextSearch(mockPVs, query),
      opj: performFullTextSearch(mockOPJs, query),
      juges: performFullTextSearch(mockJuges, query),
    }

    const endTime = performance.now()
    const totalResults = results.pv.length + results.opj.length + results.juges.length

    setSearchResults(results)
    setSearchStats({
      totalResults,
      searchTime: Math.round(endTime - startTime),
      lastSearch: query.fullText || "Recherche avancée",
    })
  }

  const handleReset = () => {
    setSearchResults({
      pv: mockPVs,
      opj: mockOPJs,
      juges: mockJuges,
    })
    setSearchStats({
      totalResults: mockPVs.length + mockOPJs.length + mockJuges.length,
      searchTime: 0,
      lastSearch: "",
    })
  }

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
      actif: "bg-green-600 text-white",
      inactif: "bg-red-600 text-white",
      conge: "bg-yellow-600 text-white",
    }
    return variants[statut as keyof typeof variants] || variants.brouillon
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar />

      <div className="md:ml-64 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Recherche Avancée</h1>
          <p className="text-slate-400">Recherche full-text avec filtres complexes dans toutes les données</p>
        </div>

        {/* Statistiques de recherche */}
        {searchStats.lastSearch && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Résultats trouvés</p>
                    <p className="text-2xl font-bold text-white">{searchStats.totalResults}</p>
                  </div>
                  <Search className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Temps de recherche</p>
                    <p className="text-2xl font-bold text-green-400">{searchStats.searchTime}ms</p>
                  </div>
                  <Clock className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">PV trouvés</p>
                    <p className="text-2xl font-bold text-blue-400">{searchResults.pv.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Dernière recherche</p>
                    <p className="text-sm font-medium text-white truncate">{searchStats.lastSearch}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Interface de recherche */}
        <div className="mb-6">
          <AdvancedSearch onSearch={handleSearch} onReset={handleReset} searchableFields={searchConfigs[activeTab]} />
        </div>

        {/* Résultats par onglets */}
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="pv" className="data-[state=active]:bg-blue-600">
              <FileText className="h-4 w-4 mr-2" />
              PV ({searchResults.pv.length})
            </TabsTrigger>
            <TabsTrigger value="opj" className="data-[state=active]:bg-blue-600">
              <Users className="h-4 w-4 mr-2" />
              OPJ ({searchResults.opj.length})
            </TabsTrigger>
            <TabsTrigger value="juges" className="data-[state=active]:bg-blue-600">
              <Gavel className="h-4 w-4 mr-2" />
              Juges ({searchResults.juges.length})
            </TabsTrigger>
          </TabsList>

          {/* Résultats PV */}
          <TabsContent value="pv">
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
                      {searchResults.pv.map((pv) => (
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
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-green-400 hover:text-green-300 hover:bg-slate-700"
                              >
                                <Edit className="h-4 w-4" />
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

          {/* Résultats OPJ */}
          <TabsContent value="opj">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-300">Matricule</TableHead>
                        <TableHead className="text-slate-300">Nom</TableHead>
                        <TableHead className="text-slate-300">Grade</TableHead>
                        <TableHead className="text-slate-300">Unité</TableHead>
                        <TableHead className="text-slate-300">Spécialisation</TableHead>
                        <TableHead className="text-slate-300">Statut</TableHead>
                        <TableHead className="text-slate-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {searchResults.opj.map((opj) => (
                        <TableRow key={opj.id} className="border-slate-700 hover:bg-slate-700/50">
                          <TableCell className="text-slate-200 font-mono">{opj.matricule}</TableCell>
                          <TableCell className="text-slate-200">
                            {opj.prenom} {opj.nom}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-purple-600 text-white">{opj.grade}</Badge>
                          </TableCell>
                          <TableCell className="text-slate-300">{opj.unite}</TableCell>
                          <TableCell className="text-slate-300">{opj.specialisation}</TableCell>
                          <TableCell>
                            <Badge className={getStatusBadge(opj.statut)}>{opj.statut}</Badge>
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

          {/* Résultats Juges */}
          <TabsContent value="juges">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-300">Nom</TableHead>
                        <TableHead className="text-slate-300">Fonction</TableHead>
                        <TableHead className="text-slate-300">Tribunal</TableHead>
                        <TableHead className="text-slate-300">Spécialité</TableHead>
                        <TableHead className="text-slate-300">Affaires</TableHead>
                        <TableHead className="text-slate-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {searchResults.juges.map((juge) => (
                        <TableRow key={juge.id} className="border-slate-700 hover:bg-slate-700/50">
                          <TableCell className="text-slate-200">
                            {juge.prenom} {juge.nom}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-purple-600 text-white">{juge.fonction}</Badge>
                          </TableCell>
                          <TableCell className="text-slate-300">{juge.tribunal}</TableCell>
                          <TableCell className="text-slate-300">{juge.specialite}</TableCell>
                          <TableCell className="text-slate-200">
                            <Badge variant="outline" className="border-slate-600 text-slate-300">
                              {juge.nbAffaires} affaires
                            </Badge>
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
        </Tabs>

        {/* Message si aucun résultat */}
        {searchStats.totalResults === 0 && searchStats.lastSearch && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg mb-2">Aucun résultat trouvé</p>
            <p className="text-slate-500">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  )
}
