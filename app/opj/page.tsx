"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Trash2, Eye, Shield, Phone, Mail } from "lucide-react"
import Sidebar from "@/components/layout/sidebar"

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
  {
    id: "4",
    nom: "Leroy",
    prenom: "Sophie",
    matricule: "OPJ004",
    grade: "Brigadier",
    unite: "Unité Territoriale",
    specialisation: "Violences conjugales",
    telephone: "01.23.45.67.92",
    email: "s.leroy@police.fr",
    statut: "actif",
  },
]

export default function OPJPage() {
  const router = useRouter()
  const [opjs, setOpjs] = useState<OPJ[]>(mockOPJs)
  const [searchTerm, setSearchTerm] = useState("")
  const [uniteFilter, setUniteFilter] = useState("tous")
  const [statutFilter, setStatutFilter] = useState("tous")

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [router])

  const getStatutBadge = (statut: string) => {
    const variants = {
      actif: "bg-green-600 text-white",
      inactif: "bg-red-600 text-white",
      conge: "bg-yellow-600 text-white",
    }
    return variants[statut as keyof typeof variants] || variants.actif
  }

  const getGradeBadge = (grade: string) => {
    const variants = {
      Capitaine: "bg-purple-600 text-white",
      Lieutenant: "bg-blue-600 text-white",
      Sergent: "bg-orange-600 text-white",
      Brigadier: "bg-gray-600 text-white",
    }
    return variants[grade as keyof typeof variants] || variants.Brigadier
  }

  const filteredOPJs = opjs.filter((opj) => {
    const matchesSearch =
      opj.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opj.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opj.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opj.unite.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesUnite = uniteFilter === "tous" || opj.unite === uniteFilter
    const matchesStatut = statutFilter === "tous" || opj.statut === statutFilter

    return matchesSearch && matchesUnite && matchesStatut
  })

  const unites = [...new Set(opjs.map((opj) => opj.unite))]

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar />

      <div className="md:ml-64 p-6">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Officiers de Police Judiciaire</h1>
              <p className="text-slate-400">Gestion des OPJ et de leurs affectations</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouvel OPJ
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total OPJ</p>
                  <p className="text-2xl font-bold text-white">{opjs.length}</p>
                </div>
                <Shield className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Actifs</p>
                  <p className="text-2xl font-bold text-green-400">
                    {opjs.filter((opj) => opj.statut === "actif").length}
                  </p>
                </div>
                <div className="w-3 h-3 bg-green-400 rounded-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">En congé</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {opjs.filter((opj) => opj.statut === "conge").length}
                  </p>
                </div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Unités</p>
                  <p className="text-2xl font-bold text-white">{unites.length}</p>
                </div>
                <div className="w-3 h-3 bg-blue-400 rounded-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Rechercher un OPJ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              <Select value={uniteFilter} onValueChange={setUniteFilter}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Unité" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="tous">Toutes les unités</SelectItem>
                  {unites.map((unite) => (
                    <SelectItem key={unite} value={unite}>
                      {unite}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statutFilter} onValueChange={setStatutFilter}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="tous">Tous les statuts</SelectItem>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="conge">En congé</SelectItem>
                  <SelectItem value="inactif">Inactif</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent">
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* OPJ Table */}
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
                    <TableHead className="text-slate-300">Contact</TableHead>
                    <TableHead className="text-slate-300">Statut</TableHead>
                    <TableHead className="text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOPJs.map((opj) => (
                    <TableRow key={opj.id} className="border-slate-700 hover:bg-slate-700/50">
                      <TableCell className="text-slate-200 font-mono">{opj.matricule}</TableCell>
                      <TableCell className="text-slate-200">
                        <div>
                          <p className="font-medium">
                            {opj.prenom} {opj.nom}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getGradeBadge(opj.grade)}>{opj.grade}</Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">{opj.unite}</TableCell>
                      <TableCell className="text-slate-300">{opj.specialisation}</TableCell>
                      <TableCell className="text-slate-300">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <Phone className="h-3 w-3" />
                            {opj.telephone}
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Mail className="h-3 w-3" />
                            {opj.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatutBadge(opj.statut)}>{opj.statut}</Badge>
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

        {filteredOPJs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">Aucun OPJ trouvé avec ces critères.</p>
          </div>
        )}
      </div>
    </div>
  )
}
