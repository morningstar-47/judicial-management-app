"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Scale, AlertTriangle, User, Shield } from "lucide-react"
import {
  authenticateUser,
  setCurrentUser,
  getDefaultRoute,
  DEMO_USERS,
  getRoleDisplayName,
  getRoleBadgeColor,
} from "@/lib/auth"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const user = authenticateUser(username, password)

      if (user) {
        setCurrentUser(user)
        const defaultRoute = getDefaultRoute(user.role)
        router.push(defaultRoute)
      } else {
        setError("Identifiants incorrects. Veuillez vérifier vos informations de connexion.")
      }
    } catch (error) {
      setError("Une erreur est survenue lors de la connexion.")
    }

    setIsLoading(false)
  }

  const handleQuickLogin = (demoUser: (typeof DEMO_USERS)[0]) => {
    setCurrentUser(demoUser)
    const defaultRoute = getDefaultRoute(demoUser.role)
    router.push(defaultRoute)
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Scale className="h-16 w-16 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Système de Gestion Judiciaire</h1>
          <p className="text-slate-400">Connectez-vous pour accéder à votre espace</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-700">
            <TabsTrigger value="login" className="data-[state=active]:bg-blue-600">
              Connexion
            </TabsTrigger>
            <TabsTrigger value="demo" className="data-[state=active]:bg-blue-600">
              Comptes de démonstration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-white">Connexion</CardTitle>
                <CardDescription className="text-slate-400">
                  Entrez vos identifiants pour accéder au système
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-slate-200">
                      Nom d'utilisateur
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      placeholder="Entrez votre nom d'utilisateur"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-200">
                      Mot de passe
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      placeholder="Entrez votre mot de passe"
                      required
                    />
                  </div>

                  {error && (
                    <Alert className="bg-red-900/50 border-red-700">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      <AlertDescription className="text-red-200">{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? "Connexion..." : "Se connecter"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demo">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Comptes de Démonstration
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Cliquez sur un profil pour vous connecter directement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {DEMO_USERS.map((user) => (
                    <Card
                      key={user.id}
                      className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 transition-colors cursor-pointer"
                      onClick={() => handleQuickLogin(user)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-medium text-white">
                                {user.prenom} {user.nom}
                              </h3>
                              <p className="text-sm text-slate-400">{user.email}</p>
                            </div>
                          </div>
                          <Badge className={getRoleBadgeColor(user.role)}>{getRoleDisplayName(user.role)}</Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Identifiant:</span>
                            <span className="text-blue-400 font-mono">{user.username}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Mot de passe:</span>
                            <span className="text-blue-400 font-mono">{user.password}</span>
                          </div>
                          {user.unite && (
                            <div className="flex justify-between">
                              <span className="text-slate-400">Unité:</span>
                              <span className="text-slate-300">{user.unite}</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-600">
                          <p className="text-xs text-slate-400">Permissions principales:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {user.permissions.slice(0, 3).map((perm, index) => (
                              <Badge key={index} variant="outline" className="border-slate-600 text-slate-400 text-xs">
                                {perm.resource}
                              </Badge>
                            ))}
                            {user.permissions.length > 3 && (
                              <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                                +{user.permissions.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
                  <h4 className="text-sm font-medium text-slate-200 mb-2">Description des rôles :</h4>
                  <div className="space-y-2 text-sm text-slate-400">
                    <div>
                      <strong className="text-purple-400">Administrateur :</strong> Gestion complète du système
                    </div>
                    <div>
                      <strong className="text-green-400">Greffier :</strong> Gestion des dossiers de prisonniers
                    </div>
                    <div>
                      <strong className="text-blue-400">Superviseur :</strong> Accès aux statistiques et audit
                    </div>
                    <div>
                      <strong className="text-orange-400">Police (OPJ) :</strong> Création/modification de PV uniquement
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
