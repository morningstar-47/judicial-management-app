"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Settings,
  User,
  Bell,
  Shield,
  Database,
  Save,
  Download,
  Upload,
  Plus,
  X,
  AlertTriangle,
  CheckCircle,
  Info,
  Key,
  Mail,
  Phone,
} from "lucide-react"
import Sidebar from "@/components/layout/sidebar"

interface UserSettings {
  nom: string
  prenom: string
  email: string
  telephone: string
  matricule: string
  grade: string
  unite: string
  specialisation: string
}

interface AppSettings {
  theme: "dark" | "light" | "auto"
  language: "fr" | "en"
  notifications: {
    email: boolean
    push: boolean
    urgentOnly: boolean
  }
  autoSave: boolean
  autoLogout: number
}

interface SystemSettings {
  backupFrequency: "daily" | "weekly" | "monthly"
  logLevel: "error" | "warning" | "info" | "debug"
  maxFileSize: number
  sessionTimeout: number
}

export default function ParametresPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profil")
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [categories, setCategories] = useState(["Vol", "Agression", "Trafic", "Fraude", "Vandalisme"])
  const [newCategory, setNewCategory] = useState("")

  const [userSettings, setUserSettings] = useState<UserSettings>({
    nom: "Martin",
    prenom: "Jean",
    email: "j.martin@police.fr",
    telephone: "01.23.45.67.89",
    matricule: "OPJ001",
    grade: "Capitaine",
    unite: "Unité Centrale",
    specialisation: "Crimes financiers",
  })

  const [appSettings, setAppSettings] = useState<AppSettings>({
    theme: "dark",
    language: "fr",
    notifications: {
      email: true,
      push: true,
      urgentOnly: false,
    },
    autoSave: true,
    autoLogout: 30,
  })

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    backupFrequency: "daily",
    logLevel: "info",
    maxFileSize: 10,
    sessionTimeout: 60,
  })

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/")
    }

    // Charger les paramètres depuis localStorage
    const savedUserSettings = localStorage.getItem("userSettings")
    const savedAppSettings = localStorage.getItem("appSettings")
    const savedSystemSettings = localStorage.getItem("systemSettings")

    if (savedUserSettings) {
      setUserSettings(JSON.parse(savedUserSettings))
    }
    if (savedAppSettings) {
      setAppSettings(JSON.parse(savedAppSettings))
    }
    if (savedSystemSettings) {
      setSystemSettings(JSON.parse(savedSystemSettings))
    }
  }, [router])

  const handleSave = async (type: "user" | "app" | "system") => {
    setSaveStatus("saving")

    try {
      // Simuler une sauvegarde
      await new Promise((resolve) => setTimeout(resolve, 1000))

      switch (type) {
        case "user":
          localStorage.setItem("userSettings", JSON.stringify(userSettings))
          break
        case "app":
          localStorage.setItem("appSettings", JSON.stringify(appSettings))
          break
        case "system":
          localStorage.setItem("systemSettings", JSON.stringify(systemSettings))
          break
      }

      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch (error) {
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 3000)
    }
  }

  const handleExportSettings = () => {
    const settings = {
      user: userSettings,
      app: appSettings,
      system: systemSettings,
      categories,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `parametres-sgj-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target?.result as string)
        if (settings.user) setUserSettings(settings.user)
        if (settings.app) setAppSettings(settings.app)
        if (settings.system) setSystemSettings(settings.system)
        if (settings.categories) setCategories(settings.categories)
        setSaveStatus("saved")
        setTimeout(() => setSaveStatus("idle"), 2000)
      } catch (error) {
        setSaveStatus("error")
        setTimeout(() => setSaveStatus("idle"), 3000)
      }
    }
    reader.readAsText(file)
  }

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()])
      setNewCategory("")
    }
  }

  const removeCategory = (category: string) => {
    setCategories(categories.filter((c) => c !== category))
  }

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case "saving":
        return <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent" />
      case "saved":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      default:
        return <Save className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar />

      <div className="md:ml-64 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Paramètres</h1>
          <p className="text-slate-400">Configuration de l'application et de votre profil</p>
        </div>

        {/* Status de sauvegarde */}
        {saveStatus !== "idle" && (
          <Alert
            className={`mb-6 ${saveStatus === "error" ? "bg-red-900/50 border-red-700" : "bg-green-900/50 border-green-700"}`}
          >
            <div className="flex items-center gap-2">
              {getSaveStatusIcon()}
              <AlertDescription className={saveStatus === "error" ? "text-red-200" : "text-green-200"}>
                {saveStatus === "saving" && "Sauvegarde en cours..."}
                {saveStatus === "saved" && "Paramètres sauvegardés avec succès"}
                {saveStatus === "error" && "Erreur lors de la sauvegarde"}
              </AlertDescription>
            </div>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-800 border-slate-700 mb-6">
            <TabsTrigger value="profil" className="data-[state=active]:bg-blue-600">
              <User className="h-4 w-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="application" className="data-[state=active]:bg-blue-600">
              <Settings className="h-4 w-4 mr-2" />
              Application
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-600">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="securite" className="data-[state=active]:bg-blue-600">
              <Shield className="h-4 w-4 mr-2" />
              Sécurité
            </TabsTrigger>
            <TabsTrigger value="systeme" className="data-[state=active]:bg-blue-600">
              <Database className="h-4 w-4 mr-2" />
              Système
            </TabsTrigger>
          </TabsList>

          {/* Onglet Profil */}
          <TabsContent value="profil">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Informations Personnelles</CardTitle>
                  <CardDescription className="text-slate-400">
                    Modifiez vos informations personnelles et professionnelles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nom" className="text-slate-200">
                        Nom
                      </Label>
                      <Input
                        id="nom"
                        value={userSettings.nom}
                        onChange={(e) => setUserSettings({ ...userSettings, nom: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prenom" className="text-slate-200">
                        Prénom
                      </Label>
                      <Input
                        id="prenom"
                        value={userSettings.prenom}
                        onChange={(e) => setUserSettings({ ...userSettings, prenom: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-200">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        value={userSettings.email}
                        onChange={(e) => setUserSettings({ ...userSettings, email: e.target.value })}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telephone" className="text-slate-200">
                      Téléphone
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="telephone"
                        value={userSettings.telephone}
                        onChange={(e) => setUserSettings({ ...userSettings, telephone: e.target.value })}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <Button onClick={() => handleSave("user")} className="w-full bg-blue-600 hover:bg-blue-700">
                    {getSaveStatusIcon()}
                    <span className="ml-2">Sauvegarder le profil</span>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Informations Professionnelles</CardTitle>
                  <CardDescription className="text-slate-400">Vos informations de service</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="matricule" className="text-slate-200">
                      Matricule
                    </Label>
                    <Input
                      id="matricule"
                      value={userSettings.matricule}
                      onChange={(e) => setUserSettings({ ...userSettings, matricule: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grade" className="text-slate-200">
                      Grade
                    </Label>
                    <Select
                      value={userSettings.grade}
                      onValueChange={(value) => setUserSettings({ ...userSettings, grade: value })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="Brigadier">Brigadier</SelectItem>
                        <SelectItem value="Sergent">Sergent</SelectItem>
                        <SelectItem value="Lieutenant">Lieutenant</SelectItem>
                        <SelectItem value="Capitaine">Capitaine</SelectItem>
                        <SelectItem value="Commandant">Commandant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unite" className="text-slate-200">
                      Unité
                    </Label>
                    <Input
                      id="unite"
                      value={userSettings.unite}
                      onChange={(e) => setUserSettings({ ...userSettings, unite: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialisation" className="text-slate-200">
                      Spécialisation
                    </Label>
                    <Textarea
                      id="specialisation"
                      value={userSettings.specialisation}
                      onChange={(e) => setUserSettings({ ...userSettings, specialisation: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Application */}
          <TabsContent value="application">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Apparence</CardTitle>
                  <CardDescription className="text-slate-400">
                    Personnalisez l'apparence de l'application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200">Thème</Label>
                    <Select
                      value={appSettings.theme}
                      onValueChange={(value: "dark" | "light" | "auto") =>
                        setAppSettings({ ...appSettings, theme: value })
                      }
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="dark">Sombre</SelectItem>
                        <SelectItem value="light">Clair</SelectItem>
                        <SelectItem value="auto">Automatique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200">Langue</Label>
                    <Select
                      value={appSettings.language}
                      onValueChange={(value: "fr" | "en") => setAppSettings({ ...appSettings, language: value })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="bg-slate-700" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-slate-200">Sauvegarde automatique</Label>
                        <p className="text-sm text-slate-400">Sauvegarder automatiquement les modifications</p>
                      </div>
                      <Switch
                        checked={appSettings.autoSave}
                        onCheckedChange={(checked) => setAppSettings({ ...appSettings, autoSave: checked })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-200">Déconnexion automatique (minutes)</Label>
                      <Select
                        value={appSettings.autoLogout.toString()}
                        onValueChange={(value) =>
                          setAppSettings({ ...appSettings, autoLogout: Number.parseInt(value) })
                        }
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 heure</SelectItem>
                          <SelectItem value="120">2 heures</SelectItem>
                          <SelectItem value="0">Jamais</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button onClick={() => handleSave("app")} className="w-full bg-blue-600 hover:bg-blue-700">
                    {getSaveStatusIcon()}
                    <span className="ml-2">Sauvegarder</span>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Catégories de PV</CardTitle>
                  <CardDescription className="text-slate-400">
                    Gérez les catégories disponibles pour les PV
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Nouvelle catégorie"
                      className="bg-slate-700 border-slate-600 text-white"
                      onKeyPress={(e) => e.key === "Enter" && addCategory()}
                    />
                    <Button onClick={addCategory} size="sm" className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200">Catégories existantes</Label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Badge key={category} variant="outline" className="border-slate-600 text-slate-300">
                          {category}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCategory(category)}
                            className="ml-2 h-auto p-0 text-red-400 hover:text-red-300"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Notifications */}
          <TabsContent value="notifications">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Préférences de Notifications</CardTitle>
                <CardDescription className="text-slate-400">
                  Configurez comment vous souhaitez être notifié
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-slate-200">Notifications par email</Label>
                      <p className="text-sm text-slate-400">Recevoir les notifications par email</p>
                    </div>
                    <Switch
                      checked={appSettings.notifications.email}
                      onCheckedChange={(checked) =>
                        setAppSettings({
                          ...appSettings,
                          notifications: { ...appSettings.notifications, email: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-slate-200">Notifications push</Label>
                      <p className="text-sm text-slate-400">Recevoir les notifications dans le navigateur</p>
                    </div>
                    <Switch
                      checked={appSettings.notifications.push}
                      onCheckedChange={(checked) =>
                        setAppSettings({
                          ...appSettings,
                          notifications: { ...appSettings.notifications, push: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-slate-200">Uniquement les urgences</Label>
                      <p className="text-sm text-slate-400">Ne notifier que pour les PV urgents</p>
                    </div>
                    <Switch
                      checked={appSettings.notifications.urgentOnly}
                      onCheckedChange={(checked) =>
                        setAppSettings({
                          ...appSettings,
                          notifications: { ...appSettings.notifications, urgentOnly: checked },
                        })
                      }
                    />
                  </div>
                </div>

                <Button onClick={() => handleSave("app")} className="bg-blue-600 hover:bg-blue-700">
                  {getSaveStatusIcon()}
                  <span className="ml-2">Sauvegarder les notifications</span>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Sécurité */}
          <TabsContent value="securite">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Mot de passe</CardTitle>
                  <CardDescription className="text-slate-400">Modifiez votre mot de passe</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-slate-200">
                      Mot de passe actuel
                    </Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="currentPassword"
                        type="password"
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-slate-200">
                      Nouveau mot de passe
                    </Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="newPassword"
                        type="password"
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-slate-200">
                      Confirmer le mot de passe
                    </Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    <Key className="h-4 w-4 mr-2" />
                    Changer le mot de passe
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Sessions actives</CardTitle>
                  <CardDescription className="text-slate-400">Gérez vos sessions de connexion</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-slate-200">Session actuelle</p>
                        <p className="text-xs text-slate-400">Chrome sur Windows • Maintenant</p>
                      </div>
                      <Badge className="bg-green-600 text-white">Actuelle</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-slate-200">Firefox sur Windows</p>
                        <p className="text-xs text-slate-400">Il y a 2 heures</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                        Déconnecter
                      </Button>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
                  >
                    Déconnecter toutes les sessions
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Système */}
          <TabsContent value="systeme">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Sauvegarde et Restauration</CardTitle>
                  <CardDescription className="text-slate-400">Gérez vos données et paramètres</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200">Fréquence de sauvegarde</Label>
                    <Select
                      value={systemSettings.backupFrequency}
                      onValueChange={(value: "daily" | "weekly" | "monthly") =>
                        setSystemSettings({ ...systemSettings, backupFrequency: value })
                      }
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="daily">Quotidienne</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        <SelectItem value="monthly">Mensuelle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Button onClick={handleExportSettings} className="w-full bg-green-600 hover:bg-green-700">
                      <Download className="h-4 w-4 mr-2" />
                      Exporter les paramètres
                    </Button>

                    <div className="relative">
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportSettings}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button
                        variant="outline"
                        className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Importer les paramètres
                      </Button>
                    </div>
                  </div>

                  <Button onClick={() => handleSave("system")} className="w-full bg-blue-600 hover:bg-blue-700">
                    {getSaveStatusIcon()}
                    <span className="ml-2">Sauvegarder</span>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Configuration Système</CardTitle>
                  <CardDescription className="text-slate-400">Paramètres avancés du système</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200">Niveau de logs</Label>
                    <Select
                      value={systemSettings.logLevel}
                      onValueChange={(value: "error" | "warning" | "info" | "debug") =>
                        setSystemSettings({ ...systemSettings, logLevel: value })
                      }
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="error">Erreurs uniquement</SelectItem>
                        <SelectItem value="warning">Avertissements</SelectItem>
                        <SelectItem value="info">Informations</SelectItem>
                        <SelectItem value="debug">Debug</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200">Taille max des fichiers (MB)</Label>
                    <Input
                      type="number"
                      value={systemSettings.maxFileSize}
                      onChange={(e) =>
                        setSystemSettings({ ...systemSettings, maxFileSize: Number.parseInt(e.target.value) || 10 })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200">Timeout de session (minutes)</Label>
                    <Input
                      type="number"
                      value={systemSettings.sessionTimeout}
                      onChange={(e) =>
                        setSystemSettings({ ...systemSettings, sessionTimeout: Number.parseInt(e.target.value) || 60 })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <Alert className="bg-yellow-900/50 border-yellow-700">
                    <Info className="h-4 w-4 text-yellow-400" />
                    <AlertDescription className="text-yellow-200">
                      Les modifications système nécessitent un redémarrage de l'application.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
