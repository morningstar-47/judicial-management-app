"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Eye, Calendar, User, FileText, Users, Gavel, Building, TrendingUp, BarChart3 } from "lucide-react"
import Sidebar from "@/components/layout/sidebar"
import PermissionGuard from "@/components/auth/permission-guard"
import { getCurrentUser } from "@/lib/auth"
import {
  type SearchFilters,
  type SearchableItem,
  searchItems,
  getSearchSuggestions,
  getSearchStats,
  mockSearchData,
} from "@/lib/search-utils"

export default function RecherchePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("resultats")
  const [searchData] = useState<SearchableItem[]>(mockSearchData)
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    dateDebut: "",
    dateFin: "",
    categorie: "tous",
    statut: "tous",
    priorite: "tous",
    typeDetention: "tous",
    lieuDetention: "tous",
    opj: "tous",
    juge: "tous",
  })
  const [selectedItem, setSelectedItem] = useState<SearchableItem | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/")
    }
  }, [router])

  // Résultats de recherche filtrés
  const filteredResults = useMemo(() => {
    return searchItems(searchData, filters)
  }, [searchData, filters])

  // Statistiques de recherche
  const searchStats = useMemo(() => {
    return getSearchStats(filteredResults)
  }, [filteredResults])

  // Suggestions de recherche
  useEffect(() => {
    if (filters.query) {
      const newSuggestions = getSearchSuggestions(searchData, filters.query)
      setSuggestions(newSuggestions)
    } else {
      setSuggestions([])
    }
  }, [filters.query, searchData])

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      query: "",
      dateDebut: "",
      dateFin: "",
      categorie: "tous",
      statut: "tous",
      priorite: "tous",
      typeDetention: "tous",
      lieuDetention: "tous",
      opj: "tous",
      juge: "tous",
    })
  }

  const getTypeBadge = (type: string) => {
    const variants = {
      pv: "bg-blue-600 text-white",
      dossier: "bg-green-600 text-white",
      detenu: "bg-orange-600 text-white",
      decision: "bg-purple-600 text-white",
      jugement: "bg-red-600 text-white",
    }
    return variants[type as keyof typeof variants] || variants.pv
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
      en_attente_decision: "bg-yellow-600 text-white",
      a_juger: "bg-orange-600 text-white",
      juge: "bg-green-600 text-white",
      detention_provisoire: "bg-red-600 text-white",
      garde_a_vue: "bg-blue-600 text-white",
      libre: "bg-green-600 text-white",
      validee: "bg-green-600 text-white",
    }
    return variants[statut as keyof typeof variants] || variants.en_attente_decision
  }

  const getTypeIcon = (type: string) => {
    const icons = {
      pv: FileText,
      dossier: FileText,
      detenu: Users,
      decision: Gavel,
      jugement: Building,
    }
    return icons[type as keyof typeof icons] || FileText
  }

  return (
    <PermissionGuard resource="recherche" action="read">
      <div className="min-h-screen bg-slate-900">
        <Sidebar />

        <div className="md:ml-64 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Recherche Avancée</h1>
            <p className="text-slate-400">Recherche unifiée dans tous les éléments du système judiciaire</p>
          </div>

          {/* Barre de recherche principale */}
          <Card className="bg-slate-800 border-slate-700 mb-6">
            <CardContent className="p-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Rechercher dans tous les éléments (PV, dossiers, détenus, décisions...)..."
                  value={filters.query}
                  onChange={(e) => handleFilterChange("query", e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 text-lg h-12"
                />
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-slate-400 mb-2">Suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                        onClick={() => handleFilterChange("query", suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Filtres avancés */}
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Date début</label>
                  <Input
                    type="date"
                    value={filters.dateDebut}
                    onChange={(e) => handleFilterChange("dateDebut", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Date fin</label>
                  <Input
                    type="date"
                    value={filters.dateFin}
                    onChange={(e) => handleFilterChange("dateFin", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Catégorie</label>
                  <Select value={filters.categorie} onValueChange={(value) => handleFilterChange("categorie", value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="tous">Toutes</SelectItem>
                      <SelectItem value="Vol">Vol</SelectItem>
                      <SelectItem value="Trafic">Trafic</SelectItem>
                      <SelectItem value="Agression">Agression</SelectItem>
                      <SelectItem value="Fraude">Fraude</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Priorité</label>
                  <Select value={filters.priorite} onValueChange={(value) => handleFilterChange("priorite", value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="tous">Toutes</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                      <SelectItem value="haute">Haute</SelectItem>
                      <SelectItem value="normale">Normale</SelectItem>
                      <SelectItem value="faible">Faible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Type détention</label>
                  <Select
                    value={filters.typeDetention}
                    onValueChange={(value) => handleFilterChange("typeDetention", value)}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="tous">Tous</SelectItem>
                      <SelectItem value="garde_a_vue">Garde à vue</SelectItem>
                      <SelectItem value="detention_provisoire">Détention provisoire</SelectItem>
                      <SelectItem value="libre">Libre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Lieu détention</label>
                  <Select
                    value={filters.lieuDetention}
                    onValueChange={(value) => handleFilterChange("lieuDetention", value)}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="tous">Tous</SelectItem>
                      <SelectItem value="Commissariat Central">Commissariat Central</SelectItem>
                      <SelectItem value="Brigade Nord">Brigade Nord</SelectItem>
                      <SelectItem value="Brigade Sud">Brigade Sud</SelectItem>
                      <SelectItem value="Maison d'arrêt A">Maison d'arrêt A</SelectItem>
                      <SelectItem value="Centre pénitentiaire B">Centre pénitentiaire B</SelectItem>
                      <SelectItem value="Prison centrale C">Prison centrale C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-slate-400">
                  {filteredResults.length} résultat{filteredResults.length > 1 ? "s" : ""} trouvé
                  {filteredResults.length > 1 ? "s" : ""}
                </div>
                <Button
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                  onClick={resetFilters}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-slate-800 border-slate-700 mb-6">
              <TabsTrigger value="resultats" className="data-[state=active]:bg-blue-600">
                <Search className="h-4 w-4 mr-2" />
                Résultats ({filteredResults.length})
              </TabsTrigger>
              <TabsTrigger value="statistiques" className="data-[state=active]:bg-blue-600">
                <BarChart3 className="h-4 w-4 mr-2" />
                Statistiques
              </TabsTrigger>
            </TabsList>

            <TabsContent value="resultats">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700">
                          <TableHead className="text-slate-300">Type</TableHead>
                          <TableHead className="text-slate-300">Numéro</TableHead>
                          <TableHead className="text-slate-300">Titre</TableHead>
                          <TableHead className="text-slate-300">Suspect/Détenu</TableHead>
                          <TableHead className="text-slate-300">Catégorie</TableHead>
                          <TableHead className="text-slate-300">Priorité</TableHead>
                          <TableHead className="text-slate-300">Statut</TableHead>
                          <TableHead className="text-slate-300">Date</TableHead>
                          <TableHead className="text-slate-300">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredResults.map((item) => {
                          const TypeIcon = getTypeIcon(item.type)
                          return (
                            <TableRow key={item.id} className="border-slate-700 hover:bg-slate-700/50">
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <TypeIcon className="h-4 w-4 text-slate-400" />
                                  <Badge className={getTypeBadge(item.type)}>{item.type.toUpperCase()}</Badge>
                                </div>
                              </TableCell>
                              <TableCell className="text-slate-200 font-mono">{item.numero}</TableCell>
                              <TableCell className="text-slate-200">
                                <div>
                                  <p className="font-medium">{item.titre}</p>
                                  {item.description && (
                                    <p className="text-xs text-slate-400 truncate max-w-xs">{item.description}</p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-slate-200">
                                {item.suspect && (
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-slate-400" />
                                    <div>
                                      <p className="font-medium">
                                        {item.suspect.prenom} {item.suspect.nom}
                                      </p>
                                      <p className="text-xs text-slate-400">{item.suspect.age} ans</p>
                                    </div>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-slate-300">{item.categorie}</TableCell>
                              <TableCell>
                                {item.priorite && (
                                  <Badge className={getPriorityBadge(item.priorite)}>{item.priorite}</Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {item.statut && (
                                  <Badge className={getStatusBadge(item.statut)}>{item.statut.replace("_", " ")}</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-slate-300">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(item.date).toLocaleDateString("fr-FR")}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-blue-400 hover:text-blue-300 hover:bg-slate-700"
                                      onClick={() => setSelectedItem(item)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle className="text-white flex items-center gap-2">
                                        <TypeIcon className="h-5 w-5" />
                                        {selectedItem?.titre}
                                      </DialogTitle>
                                    </DialogHeader>
                                    {selectedItem && (
                                      <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <label className="text-sm text-slate-400">Type:</label>
                                            <div className="mt-1">
                                              <Badge className={getTypeBadge(selectedItem.type)}>
                                                {selectedItem.type.toUpperCase()}
                                              </Badge>
                                            </div>
                                          </div>
                                          <div>
                                            <label className="text-sm text-slate-400">Numéro:</label>
                                            <p className="text-slate-200 font-mono">{selectedItem.numero}</p>
                                          </div>
                                          <div>
                                            <label className="text-sm text-slate-400">Catégorie:</label>
                                            <p className="text-slate-200">{selectedItem.categorie}</p>
                                          </div>
                                          <div>
                                            <label className="text-sm text-slate-400">Date:</label>
                                            <p className="text-slate-200">
                                              {new Date(selectedItem.date).toLocaleDateString("fr-FR")}
                                            </p>
                                          </div>
                                          {selectedItem.priorite && (
                                            <div>
                                              <label className="text-sm text-slate-400">Priorité:</label>
                                              <div className="mt-1">
                                                <Badge className={getPriorityBadge(selectedItem.priorite)}>
                                                  {selectedItem.priorite}
                                                </Badge>
                                              </div>
                                            </div>
                                          )}
                                          {selectedItem.statut && (
                                            <div>
                                              <label className="text-sm text-slate-400">Statut:</label>
                                              <div className="mt-1">
                                                <Badge className={getStatusBadge(selectedItem.statut)}>
                                                  {selectedItem.statut.replace("_", " ")}
                                                </Badge>
                                              </div>
                                            </div>
                                          )}
                                        </div>

                                        {selectedItem.description && (
                                          <div>
                                            <label className="text-sm text-slate-400">Description:</label>
                                            <p className="text-slate-200 bg-slate-700 p-3 rounded mt-1">
                                              {selectedItem.description}
                                            </p>
                                          </div>
                                        )}

                                        {selectedItem.suspect && (
                                          <div>
                                            <label className="text-sm text-slate-400">Suspect/Détenu:</label>
                                            <div className="bg-slate-700 p-3 rounded mt-1">
                                              <p className="text-slate-200">
                                                <strong>
                                                  {selectedItem.suspect.prenom} {selectedItem.suspect.nom}
                                                </strong>{" "}
                                                - {selectedItem.suspect.age} ans
                                              </p>
                                              {selectedItem.typeDetention && (
                                                <p className="text-sm text-slate-400 mt-1">
                                                  Type de détention: {selectedItem.typeDetention.replace("_", " ")}
                                                </p>
                                              )}
                                              {selectedItem.lieuDetention && (
                                                <p className="text-sm text-slate-400">
                                                  Lieu: {selectedItem.lieuDetention}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        )}

                                        {selectedItem.opj && (
                                          <div>
                                            <label className="text-sm text-slate-400">OPJ:</label>
                                            <p className="text-slate-200">{selectedItem.opj}</p>
                                          </div>
                                        )}

                                        {selectedItem.juge && (
                                          <div>
                                            <label className="text-sm text-slate-400">Juge:</label>
                                            <p className="text-slate-200">{selectedItem.juge}</p>
                                          </div>
                                        )}

                                        {selectedItem.tags && selectedItem.tags.length > 0 && (
                                          <div>
                                            <label className="text-sm text-slate-400">Tags:</label>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                              {selectedItem.tags.map((tag, index) => (
                                                <Badge
                                                  key={index}
                                                  variant="outline"
                                                  className="border-slate-600 text-slate-300"
                                                >
                                                  {tag}
                                                </Badge>
                                              ))}
                                            </div>
                                          </div>
                                        )}
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

              {filteredResults.length === 0 && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg mb-2">Aucun résultat trouvé</p>
                  <p className="text-slate-500">Essayez de modifier vos critères de recherche</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="statistiques">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Total
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-blue-400">{searchStats.total}</p>
                    <p className="text-sm text-slate-400">éléments trouvés</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Par Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(searchStats.parType).map(([type, count]) => (
                        <div key={type} className="flex justify-between items-center">
                          <span className="text-slate-300 capitalize">{type}</span>
                          <Badge className={getTypeBadge(type)}>{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Par Catégorie</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(searchStats.parCategorie).map(([categorie, count]) => (
                        <div key={categorie} className="flex justify-between items-center">
                          <span className="text-slate-300">{categorie}</span>
                          <Badge variant="outline" className="border-slate-600 text-slate-300">
                            {count}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Par Priorité</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(searchStats.parPriorite).map(([priorite, count]) => (
                        <div key={priorite} className="flex justify-between items-center">
                          <span className="text-slate-300 capitalize">{priorite}</span>
                          <Badge className={getPriorityBadge(priorite)}>{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Répartition par Statut</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(searchStats.parStatut).map(([statut, count]) => (
                      <div key={statut} className="flex justify-between items-center p-3 bg-slate-700 rounded">
                        <span className="text-slate-300">{statut.replace("_", " ")}</span>
                        <Badge className={getStatusBadge(statut)}>{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PermissionGuard>
  )
}
