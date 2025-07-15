// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import {
//   Save,
//   ArrowLeft,
//   Plus,
//   X,
//   Calendar,
//   MapPin,
//   User,
//   Phone,
//   Heart,
//   AlertTriangle,
//   FileText,
//   Activity,
// } from "lucide-react"
// import Sidebar from "@/components/layout/sidebar"
// import PermissionGuard from "@/components/auth/permission-guard"
// import { getCurrentUser } from "@/utils/auth"

// export default function NouveauDetenuPage() {
//   const router = useRouter()
//   const [activeTab, setActiveTab] = useState("identite")
//   const [formData, setFormData] = useState({
//     // Identité
//     nom: "",
//     prenom: "",
//     dateNaissance: "",
//     lieuNaissance: "",
//     nationalite: "Française",
//     profession: "",
//     situationFamiliale: "Célibataire",
//     nombreEnfants: 0,

//     // Contact d'urgence
//     contactNom: "",
//     contactTelephone: "",
//     contactRelation: "",

//     // Incarcération
//     numeroEcrou: "",
//     dateIncarceration: new Date().toISOString().split("T")[0],
//     motifIncarceration: "",
//     typeDetention: "preventive",
//     quartier: "",
//     cellule: "",
//     regime: "ferme",
//     categorie: "C",
//     dangerosité: "faible",

//     // Condamnation
//     tribunal: "",
//     dateJugement: "",
//     peine: "",
//     dureeDetention: "",
//     datePrevueLiberation: "",

//     // Santé
//     etatSante: "bon",
//     traitementMedical: "",
//     allergies: "",
//     handicaps: "",

//     // Comportement et activités
//     comportement: "bon",
//     activites: [] as string[],
//     formation: "",
//     travail: "",
//     observations: "",
//   })

//   const [antecedents, setAntecedents] = useState<string[]>([])
//   const [newAntecedent, setNewAntecedent] = useState("")

//   useEffect(() => {
//     // Générer un numéro d'écrou automatique
//     const year = new Date().getFullYear()
//     const number = Math.floor(Math.random() * 1000)
//       .toString()
//       .padStart(3, "0")
//     setFormData((prev) => ({ ...prev, numeroEcrou: `ECR-${year}-${number}` }))
//   }, [])

//   const handleInputChange = (field: string, value: any) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   const handleSave = () => {
//     console.log("Sauvegarde du détenu:", {
//       ...formData,
//       antecedents,
//     })
//     router.push("/detenus")
//   }

//   const addAntecedent = () => {
//     if (newAntecedent.trim()) {
//       setAntecedents([...antecedents, newAntecedent.trim()])
//       setNewAntecedent("")
//     }
//   }

//   const removeAntecedent = (index: number) => {
//     setAntecedents(antecedents.filter((_, i) => i !== index))
//   }

//   const activitesDisponibles = [
//     "Sport",
//     "Lecture",
//     "Bibliothèque",
//     "Atelier menuiserie",
//     "Atelier mécanique",
//     "Cuisine",
//     "Jardinage",
//     "Informatique",
//     "Musique",
//     "Peinture",
//     "Théâtre",
//     "Formation professionnelle",
//   ]

//   const toggleActivite = (activite: string) => {
//     const currentActivites = formData.activites
//     if (currentActivites.includes(activite)) {
//       handleInputChange(
//         "activites",
//         currentActivites.filter((a) => a !== activite),
//       )
//     } else {
//       handleInputChange("activites", [...currentActivites, activite])
//     }
//   }

//   return (
//     <PermissionGuard resource="prisonniers" action="create">
//       <div className="min-h-screen bg-slate-900">
//         <Sidebar />

//         <div className="md:ml-64 p-6">
//           <div className="mb-8">
//             <div className="flex items-center gap-4 mb-4">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => router.back()}
//                 className="text-slate-400 hover:text-white hover:bg-slate-700"
//               >
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Retour
//               </Button>
//             </div>
//             <h1 className="text-3xl font-bold text-white mb-2">Nouveau Détenu</h1>
//             <p className="text-slate-400">Enregistrement d'un nouveau détenu dans le système pénitentiaire</p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//             {/* Formulaire principal */}
//             <div className="lg:col-span-3">
//               <Tabs value={activeTab} onValueChange={setActiveTab}>
//                 <TabsList className="bg-slate-800 border-slate-700 mb-6">
//                   <TabsTrigger value="identite" className="data-[state=active]:bg-blue-600">
//                     <User className="h-4 w-4 mr-2" />
//                     Identité
//                   </TabsTrigger>
//                   <TabsTrigger value="incarceration" className="data-[state=active]:bg-blue-600">
//                     <MapPin className="h-4 w-4 mr-2" />
//                     Incarcération
//                   </TabsTrigger>
//                   <TabsTrigger value="judiciaire" className="data-[state=active]:bg-blue-600">
//                     <FileText className="h-4 w-4 mr-2" />
//                     Judiciaire
//                   </TabsTrigger>
//                   <TabsTrigger value="sante" className="data-[state=active]:bg-blue-600">
//                     <Heart className="h-4 w-4 mr-2" />
//                     Santé
//                   </TabsTrigger>
//                   <TabsTrigger value="activites" className="data-[state=active]:bg-blue-600">
//                     <Activity className="h-4 w-4 mr-2" />
//                     Activités
//                   </TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="identite">
//                   <Card className="bg-slate-800 border-slate-700">
//                     <CardHeader>
//                       <CardTitle className="text-white">Informations Personnelles</CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="nom" className="text-slate-200">
//                             Nom *
//                           </Label>
//                           <Input
//                             id="nom"
//                             value={formData.nom}
//                             onChange={(e) => handleInputChange("nom", e.target.value)}
//                             className="bg-slate-700 border-slate-600 text-white"
//                             required
//                           />
//                         </div>

//                         <div className="space-y-2">
//                           <Label htmlFor="prenom" className="text-slate-200">
//                             Prénom *
//                           </Label>
//                           <Input
//                             id="prenom"
//                             value={formData.prenom}
//                             onChange={(e) => handleInputChange("prenom", e.target.value)}
//                             className="bg-slate-700 border-slate-600 text-white"
//                             required
//                           />
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="dateNaissance" className="text-slate-200">
//                             Date de naissance *
//                           </Label>
//                           <Input
//                             id="dateNaissance"
//                             type="date"
//                             value={formData.dateNaissance}
//                             onChange={(e) => handleInputChange("dateNaissance", e.target.value)}
//                             className="bg-slate-700 border-slate-600 text-white"
//                             required
//                           />
//                         </div>

//                         <div className="space-y-2">
//                           <Label htmlFor="lieuNaissance" className="text-slate-200">
//                             Lieu de naissance *
//                           </Label>
//                           <Input
//                             id="lieuNaissance"
//                             value={formData.lieuNaissance}
//                             onChange={(e) => handleInputChange("lieuNaissance", e.target.value)}
//                             className="bg-slate-700 border-slate-600 text-white"
//                             required
//                           />
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="nationalite" className="text-slate-200">
//                             Nationalité
//                           </Label>
//                           <Input
//                             id="nationalite"
//                             value={formData.nationalite}
//                             onChange={(e) => handleInputChange("nationalite", e.target.value)}
//                             className="bg-slate-700 border-slate-600 text-white"
//                           />
//                         </div>

//                         <div className="space-y-2">
//                           <Label htmlFor="profession" className="text-slate-200">
//                             Profession
//                           </Label>
//                           <Input
//                             id="profession"
//                             value={formData.profession}
//                             onChange={(e) => handleInputChange("profession", e.target.value)}
//                             className="bg-slate-700 border-slate-600 text-white"
//                           />
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="situationFamiliale" className="text-slate-200">
//                             Situation familiale
//                           </Label>
//                           <Select
//                             value={formData.situationFamiliale}
//                             onValueChange={(value) => handleInputChange("situationFamiliale", value)}
//                           >
//                             <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent className="bg-slate-700 border-slate-600">
//                               <SelectItem value="Célibataire">Célibataire</SelectItem>
//                               <SelectItem value="Marié">Marié(e)</SelectItem>
//                               <SelectItem value="Divorcé">Divorcé(e)</SelectItem>
//                               <SelectItem value="Veuf">Veuf/Veuve</SelectItem>
//                               <SelectItem value="Concubinage">Concubinage</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>

//                         <div className="space-y-2">
//                           <Label htmlFor="nombreEnfants" className="text-slate-200">
//                             Nombre d'enfants
//                           </Label>
//                           <Input
//                             id="nombreEnfants"
//                             type="number"
//                             min="0"
//                             value={formData.nombreEnfants}
//                             onChange={(e) => handleInputChange("nombreEnfants", Number.parseInt(e.target.value) || 0)}
//                             className="bg-slate-700 border-slate-600 text-white"
//                           />
//                         </div>
//                       </div>

//                       <Separator className="bg-slate-700" />

//                       <div>
//                         <h3 className="text-lg font-medium text-white mb-4">Contact d'urgence</h3>
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                           <div className="space-y-2">
//                             <Label htmlFor="contactNom" className="text-slate-200">
//                               Nom du contact
//                             </Label>
//                             <Input
//                               id="contactNom"
//                               value={formData.contactNom}
//                               onChange={(e) => handleInputChange("contactNom", e.target.value)}
//                               className="bg-slate-700 border-slate-600 text-white"
//                             />
//                           </div>

//                           <div className="space-y-2">
//                             <Label htmlFor="contactTelephone" className="text-slate-200">
//                               Téléphone
//                             </Label>
//                             <div className="relative">
//                               <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
//                               <Input
//                                 id="contactTelephone"
//                                 value={formData.contactTelephone}
//                                 onChange={(e) => handleInputChange("contactTelephone", e.target.value)}
//                                 className="pl-10 bg-slate-700 border-slate-600 text-white"
//                               />
//                             </div>
//                           </div>

//                           <div className="space-y-2">
//                             <Label htmlFor="contactRelation" className="text-slate-200">
//                               Relation
//                             </Label>
//                             <Select
//                               value={formData.contactRelation}
//                               onValueChange={(value) => handleInputChange("contactRelation", value)}
//                             >
//                               <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
//                                 <SelectValue placeholder="Sélectionner" />
//                               </SelectTrigger>
//                               <SelectContent className="bg-slate-700 border-slate-600">
//                                 <SelectItem value="Époux/Épouse">Époux/Épouse</SelectItem>
//                                 <SelectItem value="Père">Père</SelectItem>
//                                 <SelectItem value="Mère">Mère</SelectItem>
//                                 <SelectItem value="Frère">Frère</SelectItem>
//                                 <SelectItem value="Sœur">Sœur</SelectItem>
//                                 <SelectItem value="Enfant">Enfant</SelectItem>
//                                 <SelectItem value="Ami">Ami(e)</SelectItem>
//                                 <SelectItem value="Autre">Autre</SelectItem>
//                               </SelectContent>
//                             </Select>
//                           </div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>

//                 <TabsContent value="incarceration">
//                   <Card className="bg-slate-800 border-slate-700">
//                     <CardHeader>
//                       <CardTitle className="text-white">Détails de l'Incarcération</CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="numeroEcrou" className="text-slate-200">
//                             Numéro d'écrou *
//                           </Label>
//                           <Input
//                             id="numeroEcrou"
//                             value={formData.numeroEcrou}
//                             onChange={(e) => handleInputChange("numeroEcrou", e.target.value)}
//                             className="bg-slate-700 border-slate-600 text-white font-mono"
//                             required
//                           />
//                         </div>

//                         <div className="space-y-2">
//                           <Label htmlFor="dateIncarceration" className="text-slate-200">
//                             Date d'incarcération *
//                           </Label>
//                           <div className="relative">
//                             <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
//                             <Input
//                               id="dateIncarceration"
//                               type="date"
//                               value={formData.dateIncarceration}
//                               onChange={(e) => handleInputChange("dateIncarceration", e.target.value)}
//                               className="pl-10 bg-slate-700 border-slate-600 text-white"
//                               required
//                             />
//                           </div>
//                         </div>
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="motifIncarceration" className="text-slate-200">
//                           Motif d'incarcération *
//                         </Label>
//                         <Textarea
//                           id="motifIncarceration"
//                           value={formData.motifIncarceration}
//                           onChange={(e) => handleInputChange("motifIncarceration", e.target.value)}
//                           className="bg-slate-700 border-slate-600 text-white"
//                           placeholder="Décrivez le motif de l'incarcération..."
//                           required
//                         />
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="typeDetention" className="text-slate-200">
//                             Type de détention
//                           </Label>
//                           <Select
//                             value={formData.typeDetention}
//                             onValueChange={(value) => handleInputChange("typeDetention", value)}
//                           >
//                             <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent className="bg-slate-700 border-slate-600">
//                               <SelectItem value="preventive">Préventive</SelectItem>
//                               <SelectItem value="definitive">Définitive</SelectItem>
//                               <SelectItem value="correction">Correction</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>

//                         <div className="space-y-2">
//                           <Label htmlFor="regime" className="text-slate-200">
//                             Régime de détention
//                           </Label>
//                           <Select value={formData.regime} onValueChange={(value) => handleInputChange("regime", value)}>
//                             <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent className="bg-slate-700 border-slate-600">
//                               <SelectItem value="ferme">Fermé</SelectItem>
//                               <SelectItem value="semi_liberte">Semi-liberté</SelectItem>
//                               <SelectItem value="ouvert">Ouvert</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>

//                         <div className="space-y-2">
//                           <Label htmlFor="categorie" className="text-slate-200">
//                             Catégorie pénale
//                           </Label>
//                           <Select
//                             value={formData.categorie}
//                             onValueChange={(value) => handleInputChange("categorie", value)}
//                           >
//                             <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent className="bg-slate-700 border-slate-600">
//                               <SelectItem value="A">Catégorie A</SelectItem>
//                               <SelectItem value="B">Catégorie B</SelectItem>
//                               <SelectItem value="C">Catégorie C</SelectItem>
//                               <SelectItem value="D">Catégorie D</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="quartier" className="text-slate-200">
//                             Quartier *
//                           </Label>
//                           <Select
//                             value={formData.quartier}
//                             onValueChange={(value) => handleInputChange("quartier", value)}
//                           >
//                             <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
//                               <SelectValue placeholder="Sélectionner" />
//                             </SelectTrigger>
//                             <SelectContent className="bg-slate-700 border-slate-600">
//                               <SelectItem value="Quartier A">Quartier A</SelectItem>
//                               <SelectItem value="Quartier B">Quartier B</SelectItem>
//                               <SelectItem value="Quartier C">Quartier C</SelectItem>
//                               <SelectItem value="Quartier D">Quartier D</SelectItem>
//                               <SelectItem value="Isolement">Isolement</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>

//                         <div className="space-y-2">
//                           <Label htmlFor="cellule" className="text-slate-200">
//                             Cellule *
//                           </Label>
//                           <Input
//                             id="cellule"
//                             value={formData.cellule}
//                             onChange={(e) => handleInputChange("cellule", e.target.value)}
//                             className="bg-slate-700 border-slate-600 text-white font-mono"
//                             placeholder="Ex: A-101"
//                             required
//                           />
//                         </div>

//                         <div className="space-y-2">
//                           <Label htmlFor="dangerosité" className="text-slate-200">
//                             Niveau de dangerosité
//                           </Label>
//                           <Select
//                             value={formData.dangerosité}
//                             onValueChange={(value) => handleInputChange("dangerosité", value)}
//                           >
//                             <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent className="bg-slate-700 border-slate-600">
//                               <SelectItem value="faible">Faible</SelectItem>
//                               <SelectItem value="moyenne">Moyenne</SelectItem>
//                               <SelectItem value="elevee">Élevée</SelectItem>
//                               <SelectItem value="maximale">Maximale</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>

//                 <TabsContent value="judiciaire">
//                   <div className="space-y-6">
//                     <Card className="bg-slate-800 border-slate-700">
//                       <CardHeader>
//                         <CardTitle className="text-white">Condamnation</CardTitle>
//                       </CardHeader>
//                       <CardContent className="space-y-4">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <div className="space-y-2">
//                             <Label htmlFor="tribunal" className="text-slate-200">
//                               Tribunal
//                             </Label>
//                             <Input
//                               id="tribunal"
//                               value={formData.tribunal}
//                               onChange={(e) => handleInputChange("tribunal", e.target.value)}
//                               className="bg-slate-700 border-slate-600 text-white"
//                               placeholder="Ex: TGI Paris"
//                             />
//                           </div>

//                           <div className="space-y-2">
//                             <Label htmlFor="dateJugement" className="text-slate-200">
//                               Date de jugement
//                             </Label>
//                             <Input
//                               id="dateJugement"
//                               type="date"
//                               value={formData.dateJugement}
//                               onChange={(e) => handleInputChange("dateJugement", e.target.value)}
//                               className="bg-slate-700 border-slate-600 text-white"
//                             />
//                           </div>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <div className="space-y-2">
//                             <Label htmlFor="peine" className="text-slate-200">
//                               Peine prononcée
//                             </Label>
//                             <Input
//                               id="peine"
//                               value={formData.peine}
//                               onChange={(e) => handleInputChange("peine", e.target.value)}
//                               className="bg-slate-700 border-slate-600 text-white"
//                               placeholder="Ex: 2 ans ferme"
//                             />
//                           </div>

//                           <div className="space-y-2">
//                             <Label htmlFor="dureeDetention" className="text-slate-200">
//                               Durée de détention
//                             </Label>
//                             <Input
//                               id="dureeDetention"
//                               value={formData.dureeDetention}
//                               onChange={(e) => handleInputChange("dureeDetention", e.target.value)}
//                               className="bg-slate-700 border-slate-600 text-white"
//                               placeholder="Ex: 24 mois"
//                             />
//                           </div>
//                         </div>

//                         <div className="space-y-2">
//                           <Label htmlFor="datePrevueLiberation" className="text-slate-200">
//                             Date prévue de libération
//                           </Label>
//                           <Input
//                             id="datePrevueLiberation"
//                             type="date"
//                             value={formData.datePrevueLiberation}
//                             onChange={(e) => handleInputChange("datePrevueLiberation", e.target.value)}
//                             className="bg-slate-700 border-slate-600 text-white"
//                           />
//                         </div>
//                       </CardContent>
//                     </Card>

//                     <Card className="bg-slate-800 border-slate-700">
//                       <CardHeader>
//                         <CardTitle className="text-white">Antécédents</CardTitle>
//                       </CardHeader>
//                       <CardContent className="space-y-4">
//                         <div className="flex gap-2">
//                           <Input
//                             value={newAntecedent}
//                             onChange={(e) => setNewAntecedent(e.target.value)}
//                             placeholder="Ajouter un antécédent..."
//                             className="bg-slate-700 border-slate-600 text-white"
//                             onKeyPress={(e) => e.key === "Enter" && addAntecedent()}
//                           />
//                           <Button onClick={addAntecedent} size="sm" className="bg-green-600 hover:bg-green-700">
//                             <Plus className="h-4 w-4" />
//                           </Button>
//                         </div>

//                         {antecedents.length > 0 && (
//                           <div className="space-y-2">
//                             <Label className="text-slate-200">Antécédents enregistrés</Label>
//                             <div className="space-y-2">
//                               {antecedents.map((antecedent, index) => (
//                                 <div key={index} className="flex items-center justify-between p-2 bg-slate-700 rounded">
//                                   <span className="text-sm text-slate-300">{antecedent}</span>
//                                   <Button
//                                     size="sm"
//                                     variant="ghost"
//                                     onClick={() => removeAntecedent(index)}
//                                     className="text-red-400 hover:text-red-300 hover:bg-slate-600"
//                                   >
//                                     <X className="h-4 w-4" />
//                                   </Button>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </CardContent>
//                     </Card>
//                   </div>
//                 </TabsContent>

//                 <TabsContent value="sante">
//                   <Card className="bg-slate-800 border-slate-700">
//                     <CardHeader>
//                       <CardTitle className="text-white">État de Santé</CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="etatSante" className="text-slate-200">
//                             État de santé général
//                           </Label>
//                           <Select
//                             value={formData.etatSante}
//                             onValueChange={(value) => handleInputChange("etatSante", value)}
//                           >
//                             <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent className="bg-slate-700 border-slate-600">
//                               <SelectItem value="bon">Bon</SelectItem>
//                               <SelectItem value="moyen">Moyen</SelectItem>
//                               <SelectItem value="fragile">Fragile</SelectItem>
//                               <SelectItem value="critique">Critique</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>

//                         <div className="space-y-2">
//                           <Label htmlFor="comportement" className="text-slate-200">
//                             Comportement
//                           </Label>
//                           <Select
//                             value={formData.comportement}
//                             onValueChange={(value) => handleInputChange("comportement", value)}
//                           >
//                             <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent className="bg-slate-700 border-slate-600">
//                               <SelectItem value="excellent">Excellent</SelectItem>
//                               <SelectItem value="bon">Bon</SelectItem>
//                               <SelectItem value="moyen">Moyen</SelectItem>
//                               <SelectItem value="difficile">Difficile</SelectItem>
//                               <SelectItem value="dangereux">Dangereux</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="traitementMedical" className="text-slate-200">
//                           Traitement médical en cours
//                         </Label>
//                         <Textarea
//                           id="traitementMedical"
//                           value={formData.traitementMedical}
//                           onChange={(e) => handleInputChange("traitementMedical", e.target.value)}
//                           className="bg-slate-700 border-slate-600 text-white"
//                           placeholder="Décrivez les traitements médicaux..."
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="allergies" className="text-slate-200">
//                           Allergies connues
//                         </Label>
//                         <Textarea
//                           id="allergies"
//                           value={formData.allergies}
//                           onChange={(e) => handleInputChange("allergies", e.target.value)}
//                           className="bg-slate-700 border-slate-600 text-white"
//                           placeholder="Listez les allergies connues..."
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="handicaps" className="text-slate-200">
//                           Handicaps ou limitations
//                         </Label>
//                         <Textarea
//                           id="handicaps"
//                           value={formData.handicaps}
//                           onChange={(e) => handleInputChange("handicaps", e.target.value)}
//                           className="bg-slate-700 border-slate-600 text-white"
//                           placeholder="Décrivez les handicaps ou limitations..."
//                         />
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>

//                 <TabsContent value="activites">
//                   <div className="space-y-6">
//                     <Card className="bg-slate-800 border-slate-700">
//                       <CardHeader>
//                         <CardTitle className="text-white">Activités et Formation</CardTitle>
//                       </CardHeader>
//                       <CardContent className="space-y-4">
//                         <div className="space-y-2">
//                           <Label className="text-slate-200">Activités autorisées</Label>
//                           <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//                             {activitesDisponibles.map((activite) => (
//                               <div key={activite} className="flex items-center space-x-2">
//                                 <input
//                                   type="checkbox"
//                                   id={`activite-${activite}`}
//                                   checked={formData.activites.includes(activite)}
//                                   onChange={() => toggleActivite(activite)}
//                                   className="rounded border-slate-600 bg-slate-700 text-blue-600"
//                                 />
//                                 <Label
//                                   htmlFor={`activite-${activite}`}
//                                   className="text-sm text-slate-300 cursor-pointer"
//                                 >
//                                   {activite}
//                                 </Label>
//                               </div>
//                             ))}
//                           </div>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <div className="space-y-2">
//                             <Label htmlFor="formation" className="text-slate-200">
//                               Formation en cours
//                             </Label>
//                             <Input
//                               id="formation"
//                               value={formData.formation}
//                               onChange={(e) => handleInputChange("formation", e.target.value)}
//                               className="bg-slate-700 border-slate-600 text-white"
//                               placeholder="Ex: Électricité, Plomberie..."
//                             />
//                           </div>

//                           <div className="space-y-2">
//                             <Label htmlFor="travail" className="text-slate-200">
//                               Travail assigné
//                             </Label>
//                             <Input
//                               id="travail"
//                               value={formData.travail}
//                               onChange={(e) => handleInputChange("travail", e.target.value)}
//                               className="bg-slate-700 border-slate-600 text-white"
//                               placeholder="Ex: Atelier menuiserie, Cuisine..."
//                             />
//                           </div>
//                         </div>

//                         <div className="space-y-2">
//                           <Label htmlFor="observations" className="text-slate-200">
//                             Observations générales
//                           </Label>
//                           <Textarea
//                             id="observations"
//                             value={formData.observations}
//                             onChange={(e) => handleInputChange("observations", e.target.value)}
//                             className="bg-slate-700 border-slate-600 text-white"
//                             placeholder="Notes sur le comportement, l'adaptation, les incidents..."
//                             rows={4}
//                           />
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </div>
//                 </TabsContent>
//               </Tabs>
//             </div>

//             {/* Sidebar */}
//             <div className="space-y-6">
//               {/* Aperçu */}
//               <Card className="bg-slate-800 border-slate-700">
//                 <CardHeader>
//                   <CardTitle className="text-white">Aperçu</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-3">
//                   <div>
//                     <Label className="text-slate-400 text-xs">Numéro d'écrou</Label>
//                     <p className="text-slate-200 font-mono">{formData.numeroEcrou}</p>
//                   </div>

//                   <div>
//                     <Label className="text-slate-400 text-xs">Dangerosité</Label>
//                     <div className="flex items-center gap-2 mt-1">
//                       {formData.dangerosité === "maximale" && <AlertTriangle className="h-4 w-4 text-red-400" />}
//                       <Badge
//                         className={
//                           formData.dangerosité === "maximale"
//                             ? "bg-red-600 text-white"
//                             : formData.dangerosité === "elevee"
//                               ? "bg-orange-600 text-white"
//                               : formData.dangerosité === "moyenne"
//                                 ? "bg-yellow-600 text-white"
//                                 : "bg-green-600 text-white"
//                         }
//                       >
//                         {formData.dangerosité}
//                       </Badge>
//                     </div>
//                   </div>

//                   <Separator className="bg-slate-700" />

//                   <div className="space-y-2 text-sm">
//                     <div className="flex justify-between">
//                       <span className="text-slate-400">Type:</span>
//                       <span className="text-slate-300">{formData.typeDetention}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-slate-400">Quartier:</span>
//                       <span className="text-slate-300">{formData.quartier || "Non défini"}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-slate-400">Cellule:</span>
//                       <span className="text-slate-300">{formData.cellule || "Non définie"}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-slate-400">Activités:</span>
//                       <span className="text-slate-300">{formData.activites.length}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-slate-400">Antécédents:</span>
//                       <span className="text-slate-300">{antecedents.length}</span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Actions */}
//               <Card className="bg-slate-800 border-slate-700">
//                 <CardHeader>
//                   <CardTitle className="text-white">Actions</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-3">
//                   <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700">
//                     <Save className="h-4 w-4 mr-2" />
//                     Enregistrer le détenu
//                   </Button>
//                 </CardContent>
//               </Card>

//               {/* Informations */}
//               <Card className="bg-slate-800 border-slate-700">
//                 <CardContent className="pt-6">
//                   <div className="text-sm text-slate-400 space-y-2">
//                     <p>
//                       <strong className="text-slate-300">Créé par:</strong> {getCurrentUser()?.prenom}{" "}
//                       {getCurrentUser()?.nom}
//                     </p>
//                     <p>
//                       <strong className="text-slate-300">Date:</strong> {new Date().toLocaleDateString("fr-FR")}
//                     </p>
//                     <p>
//                       <strong className="text-slate-300">Statut:</strong> Nouveau
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     </PermissionGuard>
//   )
// }


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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Save,
  ArrowLeft,
  Plus,
  X,
  Calendar,
  MapPin,
  User,
  Phone,
  Heart,
  AlertTriangle,
  FileText,
  Activity,
} from "lucide-react"
import Sidebar from "@/components/layout/sidebar"
import PermissionGuard from "@/components/auth/permission-guard"
import { getCurrentUser } from "@/lib/auth"

export default function NouveauDetenuPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("identite")
  const [formData, setFormData] = useState({
    // Identité
    nom: "",
    prenom: "",
    dateNaissance: "",
    lieuNaissance: "",
    nationalite: "Française",
    profession: "",
    situationFamiliale: "Célibataire",
    nombreEnfants: 0,

    // Contact d'urgence
    contactNom: "",
    contactTelephone: "",
    contactRelation: "",

    // Incarcération
    numeroEcrou: "",
    dateIncarceration: new Date().toISOString().split("T")[0],
    motifIncarceration: "",
    typeDetention: "preventive",
    quartier: "",
    cellule: "",
    regime: "ferme",
    categorie: "C",
    dangerosité: "faible",

    // Condamnation
    tribunal: "",
    dateJugement: "",
    peine: "",
    dureeDetention: "",
    datePrevueLiberation: "",

    // Santé
    etatSante: "bon",
    traitementMedical: "",
    allergies: "",
    handicaps: "",

    // Comportement et activités
    comportement: "bon",
    activites: [] as string[],
    formation: "",
    travail: "",
    observations: "",
  })

  const [antecedents, setAntecedents] = useState<string[]>([])
  const [newAntecedent, setNewAntecedent] = useState("")

  useEffect(() => {
    // Générer un numéro d'écrou automatique
    const year = new Date().getFullYear()
    const number = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    setFormData((prev) => ({ ...prev, numeroEcrou: `ECR-${year}-${number}` }))
  }, [])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    console.log("Sauvegarde du détenu:", {
      ...formData,
      antecedents,
    })
    router.push("/detenus")
  }

  const addAntecedent = () => {
    if (newAntecedent.trim()) {
      setAntecedents([...antecedents, newAntecedent.trim()])
      setNewAntecedent("")
    }
  }

  const removeAntecedent = (index: number) => {
    setAntecedents(antecedents.filter((_, i) => i !== index))
  }

  const activitesDisponibles = [
    "Sport",
    "Lecture",
    "Bibliothèque",
    "Atelier menuiserie",
    "Atelier mécanique",
    "Cuisine",
    "Jardinage",
    "Informatique",
    "Musique",
    "Peinture",
    "Théâtre",
    "Formation professionnelle",
  ]

  const toggleActivite = (activite: string) => {
    const currentActivites = formData.activites
    if (currentActivites.includes(activite)) {
      handleInputChange(
        "activites",
        currentActivites.filter((a) => a !== activite),
      )
    } else {
      handleInputChange("activites", [...currentActivites, activite])
    }
  }

  return (
    <PermissionGuard resource="prisonniers" action="create">
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
            <h1 className="text-3xl font-bold text-white mb-2">Nouveau Détenu</h1>
            <p className="text-slate-400">Enregistrement d'un nouveau détenu dans le système pénitentiaire</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Formulaire principal */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-slate-800 border-slate-700 mb-6">
                  <TabsTrigger value="identite" className="data-[state=active]:bg-blue-600">
                    <User className="h-4 w-4 mr-2" />
                    Identité
                  </TabsTrigger>
                  <TabsTrigger value="incarceration" className="data-[state=active]:bg-blue-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    Incarcération
                  </TabsTrigger>
                  <TabsTrigger value="judiciaire" className="data-[state=active]:bg-blue-600">
                    <FileText className="h-4 w-4 mr-2" />
                    Judiciaire
                  </TabsTrigger>
                  <TabsTrigger value="sante" className="data-[state=active]:bg-blue-600">
                    <Heart className="h-4 w-4 mr-2" />
                    Santé
                  </TabsTrigger>
                  <TabsTrigger value="activites" className="data-[state=active]:bg-blue-600">
                    <Activity className="h-4 w-4 mr-2" />
                    Activités
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="identite">
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Informations Personnelles</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nom" className="text-slate-200">
                            Nom *
                          </Label>
                          <Input
                            id="nom"
                            value={formData.nom}
                            onChange={(e) => handleInputChange("nom", e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="prenom" className="text-slate-200">
                            Prénom *
                          </Label>
                          <Input
                            id="prenom"
                            value={formData.prenom}
                            onChange={(e) => handleInputChange("prenom", e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dateNaissance" className="text-slate-200">
                            Date de naissance *
                          </Label>
                          <Input
                            id="dateNaissance"
                            type="date"
                            value={formData.dateNaissance}
                            onChange={(e) => handleInputChange("dateNaissance", e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lieuNaissance" className="text-slate-200">
                            Lieu de naissance *
                          </Label>
                          <Input
                            id="lieuNaissance"
                            value={formData.lieuNaissance}
                            onChange={(e) => handleInputChange("lieuNaissance", e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nationalite" className="text-slate-200">
                            Nationalité
                          </Label>
                          <Input
                            id="nationalite"
                            value={formData.nationalite}
                            onChange={(e) => handleInputChange("nationalite", e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="profession" className="text-slate-200">
                            Profession
                          </Label>
                          <Input
                            id="profession"
                            value={formData.profession}
                            onChange={(e) => handleInputChange("profession", e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="situationFamiliale" className="text-slate-200">
                            Situation familiale
                          </Label>
                          <Select
                            value={formData.situationFamiliale}
                            onValueChange={(value) => handleInputChange("situationFamiliale", value)}
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              <SelectItem value="Célibataire">Célibataire</SelectItem>
                              <SelectItem value="Marié">Marié(e)</SelectItem>
                              <SelectItem value="Divorcé">Divorcé(e)</SelectItem>
                              <SelectItem value="Veuf">Veuf/Veuve</SelectItem>
                              <SelectItem value="Concubinage">Concubinage</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="nombreEnfants" className="text-slate-200">
                            Nombre d'enfants
                          </Label>
                          <Input
                            id="nombreEnfants"
                            type="number"
                            min="0"
                            value={formData.nombreEnfants}
                            onChange={(e) => handleInputChange("nombreEnfants", Number.parseInt(e.target.value) || 0)}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                      </div>

                      <Separator className="bg-slate-700" />

                      <div>
                        <h3 className="text-lg font-medium text-white mb-4">Contact d'urgence</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="contactNom" className="text-slate-200">
                              Nom du contact
                            </Label>
                            <Input
                              id="contactNom"
                              value={formData.contactNom}
                              onChange={(e) => handleInputChange("contactNom", e.target.value)}
                              className="bg-slate-700 border-slate-600 text-white"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="contactTelephone" className="text-slate-200">
                              Téléphone
                            </Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                              <Input
                                id="contactTelephone"
                                value={formData.contactTelephone}
                                onChange={(e) => handleInputChange("contactTelephone", e.target.value)}
                                className="pl-10 bg-slate-700 border-slate-600 text-white"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="contactRelation" className="text-slate-200">
                              Relation
                            </Label>
                            <Select
                              value={formData.contactRelation}
                              onValueChange={(value) => handleInputChange("contactRelation", value)}
                            >
                              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-700 border-slate-600">
                                <SelectItem value="Époux/Épouse">Époux/Épouse</SelectItem>
                                <SelectItem value="Père">Père</SelectItem>
                                <SelectItem value="Mère">Mère</SelectItem>
                                <SelectItem value="Frère">Frère</SelectItem>
                                <SelectItem value="Sœur">Sœur</SelectItem>
                                <SelectItem value="Enfant">Enfant</SelectItem>
                                <SelectItem value="Ami">Ami(e)</SelectItem>
                                <SelectItem value="Autre">Autre</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="incarceration">
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Détails de l'Incarcération</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="numeroEcrou" className="text-slate-200">
                            Numéro d'écrou *
                          </Label>
                          <Input
                            id="numeroEcrou"
                            value={formData.numeroEcrou}
                            onChange={(e) => handleInputChange("numeroEcrou", e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white font-mono"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dateIncarceration" className="text-slate-200">
                            Date d'incarcération *
                          </Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                              id="dateIncarceration"
                              type="date"
                              value={formData.dateIncarceration}
                              onChange={(e) => handleInputChange("dateIncarceration", e.target.value)}
                              className="pl-10 bg-slate-700 border-slate-600 text-white"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="motifIncarceration" className="text-slate-200">
                          Motif d'incarcération *
                        </Label>
                        <Textarea
                          id="motifIncarceration"
                          value={formData.motifIncarceration}
                          onChange={(e) => handleInputChange("motifIncarceration", e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Décrivez le motif de l'incarcération..."
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="typeDetention" className="text-slate-200">
                            Type de détention
                          </Label>
                          <Select
                            value={formData.typeDetention}
                            onValueChange={(value) => handleInputChange("typeDetention", value)}
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              <SelectItem value="preventive">Préventive</SelectItem>
                              <SelectItem value="definitive">Définitive</SelectItem>
                              <SelectItem value="correction">Correction</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="regime" className="text-slate-200">
                            Régime de détention
                          </Label>
                          <Select value={formData.regime} onValueChange={(value) => handleInputChange("regime", value)}>
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              <SelectItem value="ferme">Fermé</SelectItem>
                              <SelectItem value="semi_liberte">Semi-liberté</SelectItem>
                              <SelectItem value="ouvert">Ouvert</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="categorie" className="text-slate-200">
                            Catégorie pénale
                          </Label>
                          <Select
                            value={formData.categorie}
                            onValueChange={(value) => handleInputChange("categorie", value)}
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              <SelectItem value="A">Catégorie A</SelectItem>
                              <SelectItem value="B">Catégorie B</SelectItem>
                              <SelectItem value="C">Catégorie C</SelectItem>
                              <SelectItem value="D">Catégorie D</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="quartier" className="text-slate-200">
                            Quartier *
                          </Label>
                          <Select
                            value={formData.quartier}
                            onValueChange={(value) => handleInputChange("quartier", value)}
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              <SelectItem value="Quartier A">Quartier A</SelectItem>
                              <SelectItem value="Quartier B">Quartier B</SelectItem>
                              <SelectItem value="Quartier C">Quartier C</SelectItem>
                              <SelectItem value="Quartier D">Quartier D</SelectItem>
                              <SelectItem value="Isolement">Isolement</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cellule" className="text-slate-200">
                            Cellule *
                          </Label>
                          <Input
                            id="cellule"
                            value={formData.cellule}
                            onChange={(e) => handleInputChange("cellule", e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white font-mono"
                            placeholder="Ex: A-101"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dangerosité" className="text-slate-200">
                            Niveau de dangerosité
                          </Label>
                          <Select
                            value={formData.dangerosité}
                            onValueChange={(value) => handleInputChange("dangerosité", value)}
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              <SelectItem value="faible">Faible</SelectItem>
                              <SelectItem value="moyenne">Moyenne</SelectItem>
                              <SelectItem value="elevee">Élevée</SelectItem>
                              <SelectItem value="maximale">Maximale</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="judiciaire">
                  <div className="space-y-6">
                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white">Condamnation</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="tribunal" className="text-slate-200">
                              Tribunal
                            </Label>
                            <Input
                              id="tribunal"
                              value={formData.tribunal}
                              onChange={(e) => handleInputChange("tribunal", e.target.value)}
                              className="bg-slate-700 border-slate-600 text-white"
                              placeholder="Ex: TGI Paris"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="dateJugement" className="text-slate-200">
                              Date de jugement
                            </Label>
                            <Input
                              id="dateJugement"
                              type="date"
                              value={formData.dateJugement}
                              onChange={(e) => handleInputChange("dateJugement", e.target.value)}
                              className="bg-slate-700 border-slate-600 text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="peine" className="text-slate-200">
                              Peine prononcée
                            </Label>
                            <Input
                              id="peine"
                              value={formData.peine}
                              onChange={(e) => handleInputChange("peine", e.target.value)}
                              className="bg-slate-700 border-slate-600 text-white"
                              placeholder="Ex: 2 ans ferme"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="dureeDetention" className="text-slate-200">
                              Durée de détention
                            </Label>
                            <Input
                              id="dureeDetention"
                              value={formData.dureeDetention}
                              onChange={(e) => handleInputChange("dureeDetention", e.target.value)}
                              className="bg-slate-700 border-slate-600 text-white"
                              placeholder="Ex: 24 mois"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="datePrevueLiberation" className="text-slate-200">
                            Date prévue de libération
                          </Label>
                          <Input
                            id="datePrevueLiberation"
                            type="date"
                            value={formData.datePrevueLiberation}
                            onChange={(e) => handleInputChange("datePrevueLiberation", e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white">Antécédents</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            value={newAntecedent}
                            onChange={(e) => setNewAntecedent(e.target.value)}
                            placeholder="Ajouter un antécédent..."
                            className="bg-slate-700 border-slate-600 text-white"
                            onKeyPress={(e) => e.key === "Enter" && addAntecedent()}
                          />
                          <Button onClick={addAntecedent} size="sm" className="bg-green-600 hover:bg-green-700">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {antecedents.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-slate-200">Antécédents enregistrés</Label>
                            <div className="space-y-2">
                              {antecedents.map((antecedent, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-slate-700 rounded">
                                  <span className="text-sm text-slate-300">{antecedent}</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeAntecedent(index)}
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
                  </div>
                </TabsContent>

                <TabsContent value="sante">
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">État de Santé</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="etatSante" className="text-slate-200">
                            État de santé général
                          </Label>
                          <Select
                            value={formData.etatSante}
                            onValueChange={(value) => handleInputChange("etatSante", value)}
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              <SelectItem value="bon">Bon</SelectItem>
                              <SelectItem value="moyen">Moyen</SelectItem>
                              <SelectItem value="fragile">Fragile</SelectItem>
                              <SelectItem value="critique">Critique</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="comportement" className="text-slate-200">
                            Comportement
                          </Label>
                          <Select
                            value={formData.comportement}
                            onValueChange={(value) => handleInputChange("comportement", value)}
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              <SelectItem value="excellent">Excellent</SelectItem>
                              <SelectItem value="bon">Bon</SelectItem>
                              <SelectItem value="moyen">Moyen</SelectItem>
                              <SelectItem value="difficile">Difficile</SelectItem>
                              <SelectItem value="dangereux">Dangereux</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="traitementMedical" className="text-slate-200">
                          Traitement médical en cours
                        </Label>
                        <Textarea
                          id="traitementMedical"
                          value={formData.traitementMedical}
                          onChange={(e) => handleInputChange("traitementMedical", e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Décrivez les traitements médicaux..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="allergies" className="text-slate-200">
                          Allergies connues
                        </Label>
                        <Textarea
                          id="allergies"
                          value={formData.allergies}
                          onChange={(e) => handleInputChange("allergies", e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Listez les allergies connues..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="handicaps" className="text-slate-200">
                          Handicaps ou limitations
                        </Label>
                        <Textarea
                          id="handicaps"
                          value={formData.handicaps}
                          onChange={(e) => handleInputChange("handicaps", e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Décrivez les handicaps ou limitations..."
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activites">
                  <div className="space-y-6">
                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white">Activités et Formation</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-slate-200">Activités autorisées</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {activitesDisponibles.map((activite) => (
                              <div key={activite} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`activite-${activite}`}
                                  checked={formData.activites.includes(activite)}
                                  onChange={() => toggleActivite(activite)}
                                  className="rounded border-slate-600 bg-slate-700 text-blue-600"
                                />
                                <Label
                                  htmlFor={`activite-${activite}`}
                                  className="text-sm text-slate-300 cursor-pointer"
                                >
                                  {activite}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="formation" className="text-slate-200">
                              Formation en cours
                            </Label>
                            <Input
                              id="formation"
                              value={formData.formation}
                              onChange={(e) => handleInputChange("formation", e.target.value)}
                              className="bg-slate-700 border-slate-600 text-white"
                              placeholder="Ex: Électricité, Plomberie..."
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="travail" className="text-slate-200">
                              Travail assigné
                            </Label>
                            <Input
                              id="travail"
                              value={formData.travail}
                              onChange={(e) => handleInputChange("travail", e.target.value)}
                              className="bg-slate-700 border-slate-600 text-white"
                              placeholder="Ex: Atelier menuiserie, Cuisine..."
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="observations" className="text-slate-200">
                            Observations générales
                          </Label>
                          <Textarea
                            id="observations"
                            value={formData.observations}
                            onChange={(e) => handleInputChange("observations", e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                            placeholder="Notes sur le comportement, l'adaptation, les incidents..."
                            rows={4}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
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
                    <Label className="text-slate-400 text-xs">Numéro d'écrou</Label>
                    <p className="text-slate-200 font-mono">{formData.numeroEcrou}</p>
                  </div>

                  <div>
                    <Label className="text-slate-400 text-xs">Dangerosité</Label>
                    <div className="flex items-center gap-2 mt-1">
                      {formData.dangerosité === "maximale" && <AlertTriangle className="h-4 w-4 text-red-400" />}
                      <Badge
                        className={
                          formData.dangerosité === "maximale"
                            ? "bg-red-600 text-white"
                            : formData.dangerosité === "elevee"
                              ? "bg-orange-600 text-white"
                              : formData.dangerosité === "moyenne"
                                ? "bg-yellow-600 text-white"
                                : "bg-green-600 text-white"
                        }
                      >
                        {formData.dangerosité}
                      </Badge>
                    </div>
                  </div>

                  <Separator className="bg-slate-700" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type:</span>
                      <span className="text-slate-300">{formData.typeDetention}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Quartier:</span>
                      <span className="text-slate-300">{formData.quartier || "Non défini"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Cellule:</span>
                      <span className="text-slate-300">{formData.cellule || "Non définie"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Activités:</span>
                      <span className="text-slate-300">{formData.activites.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Antécédents:</span>
                      <span className="text-slate-300">{antecedents.length}</span>
                    </div>
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
                    Enregistrer le détenu
                  </Button>
                </CardContent>
              </Card>

              {/* Informations */}
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="pt-6">
                  <div className="text-sm text-slate-400 space-y-2">
                    <p>
                      <strong className="text-slate-300">Créé par:</strong> {getCurrentUser()?.prenom}{" "}
                      {getCurrentUser()?.nom}
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
    </PermissionGuard>
  )
}
