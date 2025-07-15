"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Plus, X, Save, Star, Calendar, Filter, Info } from "lucide-react"
import type { SearchQuery, SearchFilter, SavedSearch } from "@/lib/search-utils"
import { getSavedSearches, saveSearch, deleteSavedSearch, updateLastUsed } from "@/lib/search-utils"

interface AdvancedSearchProps {
  onSearch: (query: SearchQuery) => void
  searchableFields: Array<{
    key: string
    label: string
    type: "text" | "number" | "date" | "select"
    options?: string[]
  }>
  onReset?: () => void
}

export default function AdvancedSearch({ onSearch, searchableFields, onReset }: AdvancedSearchProps) {
  const [query, setQuery] = useState<SearchQuery>({
    fullText: "",
    filters: [],
    dateRange: undefined,
    sortBy: "",
    sortOrder: "asc",
  })

  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [searchName, setSearchName] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    setSavedSearches(getSavedSearches())
  }, [])

  const handleFullTextChange = (value: string) => {
    setQuery((prev) => ({ ...prev, fullText: value }))
  }

  const addFilter = () => {
    const newFilter: SearchFilter = {
      field: searchableFields[0]?.key || "",
      operator: "contains",
      value: "",
      logic: "AND",
    }
    setQuery((prev) => ({
      ...prev,
      filters: [...prev.filters, newFilter],
    }))
  }

  const updateFilter = (index: number, updates: Partial<SearchFilter>) => {
    setQuery((prev) => ({
      ...prev,
      filters: prev.filters.map((filter, i) => (i === index ? { ...filter, ...updates } : filter)),
    }))
  }

  const removeFilter = (index: number) => {
    setQuery((prev) => ({
      ...prev,
      filters: prev.filters.filter((_, i) => i !== index),
    }))
  }

  const handleSearch = () => {
    onSearch(query)
  }

  const handleReset = () => {
    setQuery({
      fullText: "",
      filters: [],
      dateRange: undefined,
      sortBy: "",
      sortOrder: "asc",
    })
    onReset?.()
  }

  const handleSaveSearch = () => {
    if (searchName.trim()) {
      saveSearch({
        name: searchName.trim(),
        query: query,
      })
      setSavedSearches(getSavedSearches())
      setSearchName("")
      setSaveDialogOpen(false)
    }
  }

  const loadSavedSearch = (savedSearch: SavedSearch) => {
    setQuery(savedSearch.query)
    updateLastUsed(savedSearch.id)
    setSavedSearches(getSavedSearches())
    onSearch(savedSearch.query)
  }

  const deleteSaved = (id: string) => {
    deleteSavedSearch(id)
    setSavedSearches(getSavedSearches())
  }

  const getFieldType = (fieldKey: string) => {
    return searchableFields.find((f) => f.key === fieldKey)?.type || "text"
  }

  const getFieldOptions = (fieldKey: string) => {
    return searchableFields.find((f) => f.key === fieldKey)?.options || []
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Search className="h-5 w-5" />
            Recherche Avancée
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-slate-400 hover:text-white"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showAdvanced ? "Masquer" : "Filtres"}
            </Button>
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <Save className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Sauvegarder la recherche</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="searchName" className="text-slate-200">
                      Nom de la recherche
                    </Label>
                    <Input
                      id="searchName"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Ex: PV urgents cette semaine"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setSaveDialogOpen(false)} className="text-slate-400">
                      Annuler
                    </Button>
                    <Button onClick={handleSaveSearch} className="bg-blue-600 hover:bg-blue-700">
                      Sauvegarder
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Recherche full-text */}
        <div className="space-y-2">
          <Label className="text-slate-200">Recherche textuelle</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={query.fullText}
              onChange={(e) => handleFullTextChange(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              placeholder='Ex: "vol aggravé" -mineur +urgent'
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Info className="h-3 w-3" />
            <span>Utilisez "guillemets" pour recherche exacte, - pour exclure, + pour inclure</span>
          </div>
        </div>

        {/* Recherches sauvegardées */}
        {savedSearches.length > 0 && (
          <div className="space-y-2">
            <Label className="text-slate-200">Recherches sauvegardées</Label>
            <div className="flex flex-wrap gap-2">
              {savedSearches.slice(0, 5).map((savedSearch) => (
                <div key={savedSearch.id} className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadSavedSearch(savedSearch)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                  >
                    <Star className="h-3 w-3 mr-1" />
                    {savedSearch.name}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSaved(savedSearch.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-slate-700 p-1 h-auto"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filtres avancés */}
        {showAdvanced && (
          <>
            <Separator className="bg-slate-700" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-slate-200">Filtres personnalisés</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addFilter}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un filtre
                </Button>
              </div>

              {query.filters.map((filter, index) => (
                <Card key={index} className="bg-slate-700/50 border-slate-600">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                      {/* Logique */}
                      {index > 0 && (
                        <Select
                          value={filter.logic}
                          onValueChange={(value: "AND" | "OR") => updateFilter(index, { logic: value })}
                        >
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            <SelectItem value="AND">ET</SelectItem>
                            <SelectItem value="OR">OU</SelectItem>
                          </SelectContent>
                        </Select>
                      )}

                      {/* Champ */}
                      <Select value={filter.field} onValueChange={(value) => updateFilter(index, { field: value })}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Champ" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          {searchableFields.map((field) => (
                            <SelectItem key={field.key} value={field.key}>
                              {field.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Opérateur */}
                      <Select
                        value={filter.operator}
                        onValueChange={(value: any) => updateFilter(index, { operator: value })}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="contains">Contient</SelectItem>
                          <SelectItem value="equals">Égal à</SelectItem>
                          <SelectItem value="startsWith">Commence par</SelectItem>
                          <SelectItem value="endsWith">Finit par</SelectItem>
                          {getFieldType(filter.field) === "number" && <SelectItem value="between">Entre</SelectItem>}
                          {getFieldOptions(filter.field).length > 0 && (
                            <>
                              <SelectItem value="in">Dans la liste</SelectItem>
                              <SelectItem value="not_in">Pas dans la liste</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>

                      {/* Valeur */}
                      <div className="flex-1">
                        {getFieldType(filter.field) === "select" ? (
                          <Select value={filter.value} onValueChange={(value) => updateFilter(index, { value })}>
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue placeholder="Valeur" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              {getFieldOptions(filter.field).map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : getFieldType(filter.field) === "date" ? (
                          <Input
                            type="date"
                            value={filter.value}
                            onChange={(e) => updateFilter(index, { value: e.target.value })}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        ) : (
                          <Input
                            type={getFieldType(filter.field) === "number" ? "number" : "text"}
                            value={filter.value}
                            onChange={(e) => updateFilter(index, { value: e.target.value })}
                            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                            placeholder="Valeur"
                          />
                        )}
                      </div>

                      {/* Supprimer */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFilter(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Plage de dates */}
              <div className="space-y-3">
                <Label className="text-slate-200">Plage de dates</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Select
                    value={query.dateRange?.field || ""}
                    onValueChange={(value) =>
                      setQuery((prev) => ({
                        ...prev,
                        dateRange: value ? { field: value } : undefined,
                      }))
                    }
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Champ de date" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {searchableFields
                        .filter((field) => field.type === "date")
                        .map((field) => (
                          <SelectItem key={field.key} value={field.key}>
                            {field.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="date"
                      value={query.dateRange?.from || ""}
                      onChange={(e) =>
                        setQuery((prev) => ({
                          ...prev,
                          dateRange: prev.dateRange ? { ...prev.dateRange, from: e.target.value } : undefined,
                        }))
                      }
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                      placeholder="Date de début"
                      disabled={!query.dateRange?.field}
                    />
                  </div>

                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="date"
                      value={query.dateRange?.to || ""}
                      onChange={(e) =>
                        setQuery((prev) => ({
                          ...prev,
                          dateRange: prev.dateRange ? { ...prev.dateRange, to: e.target.value } : undefined,
                        }))
                      }
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                      placeholder="Date de fin"
                      disabled={!query.dateRange?.field}
                    />
                  </div>
                </div>
              </div>

              {/* Tri */}
              <div className="space-y-3">
                <Label className="text-slate-200">Tri des résultats</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Select
                    value={query.sortBy || ""}
                    onValueChange={(value) => setQuery((prev) => ({ ...prev, sortBy: value }))}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {searchableFields.map((field) => (
                        <SelectItem key={field.key} value={field.key}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={query.sortOrder || "asc"}
                    onValueChange={(value: "asc" | "desc") => setQuery((prev) => ({ ...prev, sortOrder: value }))}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="asc">Croissant</SelectItem>
                      <SelectItem value="desc">Décroissant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-700">
          <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </Button>

          <Button
            variant="outline"
            onClick={handleReset}
            className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
          >
            Réinitialiser
          </Button>

          {/* Résumé de la recherche */}
          {(query.fullText || query.filters.length > 0 || query.dateRange?.field) && (
            <div className="flex items-center gap-2 ml-auto">
              <Badge variant="outline" className="border-slate-600 text-slate-300">
                {[
                  query.fullText && "Texte",
                  query.filters.length > 0 && `${query.filters.length} filtre(s)`,
                  query.dateRange?.field && "Dates",
                ]
                  .filter(Boolean)
                  .join(" + ")}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
