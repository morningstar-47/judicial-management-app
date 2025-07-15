"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Trash2, Eye, Gavel, Phone, Mail, Building } from "lucide-react"
import Sidebar from "@/components/layout/sidebar"

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

interface Prisonnier {
  id: string
  nom: string
  prenom: string
  dateNaissance: string
  numeroEcrou: string
  dateIncarceration: string
  motif: string
  statut: "detenu" | "libere" | "transfere"
  cellule: string
}

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
  {
    id: "3",
    nom: "Lefebvre",
    prenom: "Anne",
    fonction: "Juge des libertés",
    tribunal: "TGI Bobigny",
    specialite: "Détention provisoire",
    telephone: "01.48.95.35.00",
    email: "a.lefebvre@justice.fr",
    nbAffaires: 8,
  },
]

const mockPrisonniers: Prisonnier[] = [
  {
    id: "1",
    nom: "Dupont",
    prenom: "Marc",
    dateNaissance: "1985-03-15",
    numeroEcrou: "ECR-2024-001",
    dateIncarceration: "2024-01-10",
    motif: "Vol aggravé",
    statut: "detenu",
    cellule: "A-101",
  },
  {
    id: "2",
    nom: "Lemoine",
    prenom: "Sarah",
    dateNaissance: "1990-07-22",
    numeroEcrou: "ECR-2024-002",
    dateIncarceration: "2024-01-08",
    motif: "Trafic de stupéfiants",
    statut: "detenu",
    cellule: "B-205",
  },
  {
    id: "3",
    nom: "Garcia",
    prenom: "Antonio",
    dateNaissance: "1978-11-03",
    numeroEcrou: "ECR-2023-156",
    dateIncarceration: "2023-12-20",
    motif: "Agression",
    statut: "libere",
    cellule: "-",
  },
]

export default function JugesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"juges" | "prisonniers">("juges")
  const [juges] = useState<Juge[]>(mockJuges)
  const [prisonniers] = useState<Prisonnier[]>(mockPrisonniers)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [router])

  const getStatutBadge = (statut: string) => {
    const variants = {
      detenu: "bg-red-600 text-white",
      libere: "bg-green-600 text-white",
      transfere: "bg-blue-600 text-white",
    }
    return variants[statut as keyof typeof variants] || variants.detenu
  }

  const filteredJuges = juges.filter(
    (juge) =>
      juge.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      juge.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      juge.fonction.toLowerCase().includes(searchTerm.toLowerCase()) ||
      juge.tribunal.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredPrisonniers = prisonniers.filter(
    (prisonnier) =>
      prisonnier.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prisonnier.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prisonnier.numeroEcrou.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prisonnier.motif.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar />

      <div className="md:ml-64 p-6">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {activeTab === "juges" ? "Juges et Magistrats" : "Prisonniers"}
              </h1>
              <p className="text-slate-400">
                {activeTab === "juges"
                  ? "Gestion des magistrats et de leurs affectations"
                  : "Gestion des détenus et de leur statut"}
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              {activeTab === "juges" ? "Nouveau Juge" : "Nouveau Détenu"}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <Button
            variant={activeTab === "juges" ? "default" : "ghost"}
            onClick={() => setActiveTab("juges")}
            className={activeTab === "juges" ? "bg-blue-600" : "text-slate-400 hover:text-white hover:bg-slate-700"}
          >
            <Gavel className="h-4 w-4 mr-2" />
            Juges
          </Button>
          <Button
            variant={activeTab === "prisonniers" ? "default" : "ghost"}
            onClick={() => setActiveTab("prisonniers")}
            className={
              activeTab === "prisonniers" ? "bg-blue-600" : "text-slate-400 hover:text-white hover:bg-slate-700"
            }
          >
            <Building className="h-4 w-4 mr-2" />
            Prisonniers
          </Button>
        </div>

        {/* Search */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardContent className="p-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={`Rechercher ${activeTab === "juges" ? "un juge" : "un prisonnier"}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Juges Table */}
        {activeTab === "juges" && (
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
                      <TableHead className="text-slate-300">Contact</TableHead>
                      <TableHead className="text-slate-300">Affaires</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJuges.map((juge) => (
                      <TableRow key={juge.id} className="border-slate-700 hover:bg-slate-700/50">
                        <TableCell className="text-slate-200">
                          <div>
                            <p className="font-medium">
                              {juge.prenom} {juge.nom}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-purple-600 text-white">{juge.fonction}</Badge>
                        </TableCell>
                        <TableCell className="text-slate-300">{juge.tribunal}</TableCell>
                        <TableCell className="text-slate-300">{juge.specialite}</TableCell>
                        <TableCell className="text-slate-300">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs">
                              <Phone className="h-3 w-3" />
                              {juge.telephone}
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <Mail className="h-3 w-3" />
                              {juge.email}
                            </div>
                          </div>
                        </TableCell>
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
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                            >
                              <Trash2 className="h-4 w-4" />
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
        )}

        {/* Prisonniers Table */}
        {activeTab === "prisonniers" && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">N° Écrou</TableHead>
                      <TableHead className="text-slate-300">Nom</TableHead>
                      <TableHead className="text-slate-300">Date Naissance</TableHead>
                      <TableHead className="text-slate-300">Incarcération</TableHead>
                      <TableHead className="text-slate-300">Motif</TableHead>
                      <TableHead className="text-slate-300">Cellule</TableHead>
                      <TableHead className="text-slate-300">Statut</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPrisonniers.map((prisonnier) => (
                      <TableRow key={prisonnier.id} className="border-slate-700 hover:bg-slate-700/50">
                        <TableCell className="text-slate-200 font-mono">{prisonnier.numeroEcrou}</TableCell>
                        <TableCell className="text-slate-200">
                          <div>
                            <p className="font-medium">
                              {prisonnier.prenom} {prisonnier.nom}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {new Date(prisonnier.dateNaissance).toLocaleDateString("fr-FR")}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {new Date(prisonnier.dateIncarceration).toLocaleDateString("fr-FR")}
                        </TableCell>
                        <TableCell className="text-slate-300">{prisonnier.motif}</TableCell>
                        <TableCell className="text-slate-300 font-mono">{prisonnier.cellule}</TableCell>
                        <TableCell>
                          <Badge className={getStatutBadge(prisonnier.statut)}>{prisonnier.statut}</Badge>
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
                              <Trash2 className="h-4 w-4" />
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
        )}

        {((activeTab === "juges" && filteredJuges.length === 0) ||
          (activeTab === "prisonniers" && filteredPrisonniers.length === 0)) && (
          <div className="text-center py-12">
            <p className="text-slate-400">
              Aucun {activeTab === "juges" ? "juge" : "prisonnier"} trouvé avec ces critères.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
