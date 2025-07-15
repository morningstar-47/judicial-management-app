"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Save, ArrowLeft, Plus, X, Calendar, MapPin, AlertTriangle, User, Gavel } from "lucide-react"
import Sidebar from "@/components/layout/sidebar"

export default function NouveauDossierPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    categorie: "",
    priorite: "normale",
    lieu: "",
    dateOuverture: new Date().toISOString().split("T")[0],
    opjResponsable: "",
    jugeInstructeur: "",
    montantPrejudice: "",
    observations: "",
  })

  const [pvAssocies, setPvAssocies] = useState<string[]>([])
  const [temoins, setTemoins] = useState<Array<{ nom: string; contact: string }>>([])
  const [newTemoin, setNewTemoin] = useState({ nom: "", contact: "" })

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // Logique de sauvegarde
    console.log("Sauvegarde du dossier:", {
      ...formData,
      pvAssocies,
      temoins,
    })
    router.push("/dossiers")
  }

  const addTemoin = () => {
    if (newTemoin.nom.trim() && newTemoin.contact.trim()) {
      setTemoins([...temoins, { ...newTemoin }])
      setNewTemoin({ nom: "", contact: "" })
    }
  }

  const removeTemoin = (index: number) => {
    setTemoins(temoins.filter((_, i) => i !== index))
  }

  const addPV = () => {
    const pvNumber = `PV-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`
    setPvAssocies([...pvAssocies, pvNumber])
  }

  const removePV = (pv: string) => {
    setPvAssocies(pvAssocies.filter((p) => p !== pv))
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar />

      <div className="md:ml-64 p-6">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Nouveau Dossier</h1>
          <p className="text-slate-400">Création d'un nouveau dossier d'enquête</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulaire principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations générales */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Informations Générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titre" className="text-slate-200">
                    Titre du dossier *
                  </Label>
                  <Input
                    id="titre"
                    value={formData.titre}
                    onChange={(e) => handleInputChange("titre", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    placeholder="Ex: Enquête sur trafic de stupéfiants - Quartier Nord"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-200">
                    Description détaillée *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-[120px]"
                    placeholder="Décrivez l'affaire de manière détaillée..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="categorie" className="text-slate-200">
                      Catégorie *
                    </Label>
                    <Select value={formData.categorie} onValueChange={(value) => handleInputChange("categorie", value)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="vol">Vol</SelectItem>
                        <SelectItem value="agression">Agression</SelectItem>
                        <SelectItem value="trafic">Trafic</SelectItem>
                        <SelectItem value="fraude">Fraude</SelectItem>
                        <SelectItem value="cybercriminalite">Cybercriminalité</SelectItem>
                        <SelectItem value="vandalisme">Vandalisme</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priorite" className="text-slate-200">
                      Priorité
                    </Label>
                    <Select value={formData.priorite} onValueChange={(value) => handleInputChange("priorite", value)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="faible">Faible</SelectItem>
                        <SelectItem value="normale">Normale</SelectItem>
                        <SelectItem value="haute">Haute</SelectItem>
                        <SelectItem value="urgente">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lieu" className="text-slate-200">
                      Lieu principal *
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="lieu"
                        value={formData.lieu}
                        onChange={(e) => handleInputChange("lieu", e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                        placeholder="Adresse ou zone géographique"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOuverture" className="text-slate-200">
                      Date d'ouverture *
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="dateOuverture"
                        type="date"
                        value={formData.dateOuverture}
                        onChange={(e) => handleInputChange("dateOuverture", e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="montantPrejudice" className="text-slate-200">
                    Montant du préjudice (€)
                  </Label>
                  <Input
                    id="montantPrejudice"
                    type="number"
                    value={formData.montantPrejudice}
                    onChange={(e) => handleInputChange("montantPrejudice", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    placeholder="0"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Affectations */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Affectations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="opjResponsable" className="text-slate-200">
                      OPJ Responsable *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Select
                        value={formData.opjResponsable}
                        onValueChange={(value) => handleInputChange("opjResponsable", value)}
                      >
                        <SelectTrigger className="pl-10 bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Sélectionner un OPJ" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="Capitaine Martin">Capitaine Martin</SelectItem>
                          <SelectItem value="Lieutenant Dubois">Lieutenant Dubois</SelectItem>
                          <SelectItem value="Sergent Moreau">Sergent Moreau</SelectItem>
                          <SelectItem value="Brigadier Leroy">Brigadier Leroy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jugeInstructeur" className="text-slate-200">
                      Juge d'instruction
                    </Label>
                    <div className="relative">
                      <Gavel className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Select
                        value={formData.jugeInstructeur}
                        onValueChange={(value) => handleInputChange("jugeInstructeur", value)}
                      >
                        <SelectTrigger className="pl-10 bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Sélectionner un juge" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="Juge Rousseau">Juge Rousseau</SelectItem>
                          <SelectItem value="Juge Bernard">Juge Bernard</SelectItem>
                          <SelectItem value="Juge Lefebvre">Juge Lefebvre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PV associés */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">PV Associés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button onClick={addPV} size="sm" className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Associer un PV
                  </Button>
                </div>

                {pvAssocies.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-slate-200">PV associés à ce dossier</Label>
                    <div className="flex flex-wrap gap-2">
                      {pvAssocies.map((pv) => (
                        <Badge key={pv} variant="outline" className="border-slate-600 text-slate-300">
                          {pv}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removePV(pv)}
                            className="ml-2 h-auto p-0 text-red-400 hover:text-red-300"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Témoins */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Témoins</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input
                    value={newTemoin.nom}
                    onChange={(e) => setNewTemoin({ ...newTemoin, nom: e.target.value })}
                    placeholder="Nom du témoin"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Input
                    value={newTemoin.contact}
                    onChange={(e) => setNewTemoin({ ...newTemoin, contact: e.target.value })}
                    placeholder="Contact (téléphone/email)"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Button onClick={addTemoin} size="sm" className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </div>

                {temoins.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-slate-200">Témoins enregistrés</Label>
                    <div className="space-y-2">
                      {temoins.map((temoin, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-slate-700 rounded">
                          <div>
                            <span className="text-sm text-slate-300 font-medium">{temoin.nom}</span>
                            <span className="text-sm text-slate-400 ml-2">({temoin.contact})</span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeTemoin(index)}
                            className="text-red-400 hover:text-red-300 hover:bg-slate-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Observations */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Observations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="observations" className="text-slate-200">
                    Notes et observations
                  </Label>
                  <Textarea
                    id="observations"
                    value={formData.observations}
                    onChange={(e) => handleInputChange("observations", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    placeholder="Notes supplémentaires, observations particulières..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Aperçu */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Aperçu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-slate-400 text-xs">Priorité</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {formData.priorite === "urgente" && <AlertTriangle className="h-4 w-4 text-red-400" />}
                    <Badge
                      className={
                        formData.priorite === "urgente"
                          ? "bg-red-600 text-white"
                          : formData.priorite === "haute"
                            ? "bg-orange-600 text-white"
                            : formData.priorite === "normale"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-600 text-white"
                      }
                    >
                      {formData.priorite}
                    </Badge>
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Catégorie:</span>
                    <span className="text-slate-300">{formData.categorie || "Non définie"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">PV associés:</span>
                    <span className="text-slate-300">{pvAssocies.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Témoins:</span>
                    <span className="text-slate-300">{temoins.length}</span>
                  </div>
                  {formData.montantPrejudice && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Préjudice:</span>
                      <span className="text-slate-300">
                        {Number(formData.montantPrejudice).toLocaleString("fr-FR")}€
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Créer le dossier
                </Button>
              </CardContent>
            </Card>

            {/* Informations */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-sm text-slate-400 space-y-2">
                  <p>
                    <strong className="text-slate-300">Créé par:</strong> Officier OPJ1
                  </p>
                  <p>
                    <strong className="text-slate-300">Date:</strong> {new Date().toLocaleDateString("fr-FR")}
                  </p>
                  <p>
                    <strong className="text-slate-300">Statut:</strong> Nouveau
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
