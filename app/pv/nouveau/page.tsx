"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Send, ArrowLeft, Upload, X, Calendar, MapPin, AlertTriangle } from "lucide-react"
import Sidebar from "@/components/layout/sidebar"

export default function NouveauPVPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    titre: "",
    lieu: "",
    date: "",
    heure: "",
    description: "",
    categorie: "",
    priorite: "normale",
    statut: "brouillon",
    temoins: "",
    preuves: "",
  })
  const [attachments, setAttachments] = useState<string[]>([])

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
    console.log("Sauvegarde du PV:", formData)
    router.push("/pv")
  }

  const handleSubmit = () => {
    // Logique de transmission
    console.log("Transmission du PV:", formData)
    router.push("/pv")
  }

  const addAttachment = () => {
    const fileName = `Document_${Date.now()}.pdf`
    setAttachments((prev) => [...prev, fileName])
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
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
          <h1 className="text-3xl font-bold text-white mb-2">Nouveau Procès-Verbal</h1>
          <p className="text-slate-400">Création d'un nouveau procès-verbal</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Informations Générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="titre" className="text-slate-200">
                      Titre du PV *
                    </Label>
                    <Input
                      id="titre"
                      value={formData.titre}
                      onChange={(e) => handleInputChange("titre", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      placeholder="Ex: Vol à main armée - Banque Centrale"
                      required
                    />
                  </div>

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
                        <SelectItem value="vandalisme">Vandalisme</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lieu" className="text-slate-200">
                      Lieu *
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="lieu"
                        value={formData.lieu}
                        onChange={(e) => handleInputChange("lieu", e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                        placeholder="Adresse complète"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-slate-200">
                      Date *
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="heure" className="text-slate-200">
                      Heure
                    </Label>
                    <Input
                      id="heure"
                      type="time"
                      value={formData.heure}
                      onChange={(e) => handleInputChange("heure", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
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
                    placeholder="Décrivez les faits de manière détaillée..."
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Evidence and Witnesses */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Preuves et Témoins</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="preuves" className="text-slate-200">
                    Preuves collectées
                  </Label>
                  <Textarea
                    id="preuves"
                    value={formData.preuves}
                    onChange={(e) => handleInputChange("preuves", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    placeholder="Listez les preuves collectées (objets, photos, etc.)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temoins" className="text-slate-200">
                    Témoins
                  </Label>
                  <Textarea
                    id="temoins"
                    value={formData.temoins}
                    onChange={(e) => handleInputChange("temoins", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    placeholder="Informations sur les témoins (nom, contact, déclaration)"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200">Pièces jointes</Label>
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addAttachment}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Ajouter un fichier
                    </Button>

                    {attachments.length > 0 && (
                      <div className="space-y-2">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-slate-700 rounded">
                            <span className="text-sm text-slate-300">{file}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeAttachment(index)}
                              className="text-red-400 hover:text-red-300 hover:bg-slate-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status and Priority */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Statut et Priorité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-200">Priorité</Label>
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
                  {formData.priorite === "urgente" && (
                    <div className="flex items-center gap-2 p-2 bg-red-900/20 border border-red-700 rounded">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      <span className="text-sm text-red-200">Priorité urgente sélectionnée</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200">Statut</Label>
                  <Select value={formData.statut} onValueChange={(value) => handleInputChange("statut", value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="brouillon">Brouillon</SelectItem>
                      <SelectItem value="en_cours">En cours</SelectItem>
                      <SelectItem value="pret">Prêt à transmettre</SelectItem>
                    </SelectContent>
                  </Select>
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
                  Sauvegarder
                </Button>

                <Button
                  onClick={handleSubmit}
                  variant="outline"
                  className="w-full border-green-600 text-green-400 hover:bg-green-600 hover:text-white bg-transparent"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Transmettre au Parquet
                </Button>
              </CardContent>
            </Card>

            {/* Info */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-sm text-slate-400 space-y-2">
                  <p>
                    <strong className="text-slate-300">Créé par:</strong> Officier OPJ1
                  </p>
                  <p>
                    <strong className="text-slate-300">Unité:</strong> Unité Centrale
                  </p>
                  <p>
                    <strong className="text-slate-300">Date:</strong> {new Date().toLocaleDateString("fr-FR")}
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
