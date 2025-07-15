export type UserRole = "administrateur" | "greffier" | "superviseur" | "police"

export interface User {
  id: string
  username: string
  password: string
  role: UserRole
  nom: string
  prenom: string
  email: string
  unite?: string
  permissions: Permission[]
}

export interface Permission {
  resource: string
  actions: string[]
}

// Définition des permissions par rôle
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  administrateur: [
    { resource: "dashboard", actions: ["read"] },
    { resource: "recherche", actions: ["read"] },
    { resource: "dossiers", actions: ["read", "create", "update", "delete"] },
    { resource: "pv", actions: ["read", "create", "update", "delete"] },
    { resource: "opj", actions: ["read", "create", "update", "delete"] },
    { resource: "juges", actions: ["read", "create", "update", "delete"] },
    { resource: "prisonniers", actions: ["read", "create", "update", "delete"] },
    { resource: "parametres", actions: ["read", "update"] },
    { resource: "audit", actions: ["read"] },
    { resource: "statistiques", actions: ["read"] },
  ],
  greffier: [
    { resource: "dashboard", actions: ["read"] },
    { resource: "juges", actions: ["read"] },
    { resource: "prisonniers", actions: ["read", "create", "update", "delete"] },
    { resource: "parametres", actions: ["read"] },
  ],
  superviseur: [
    { resource: "dashboard", actions: ["read"] },
    { resource: "recherche", actions: ["read"] },
    { resource: "dossiers", actions: ["read"] },
    { resource: "pv", actions: ["read"] },
    { resource: "opj", actions: ["read"] },
    { resource: "juges", actions: ["read"] },
    { resource: "prisonniers", actions: ["read"] },
    { resource: "audit", actions: ["read"] },
    { resource: "statistiques", actions: ["read"] },
  ],
  police: [
    { resource: "dashboard", actions: ["read"] },
    { resource: "pv", actions: ["read", "create", "update"] },
    { resource: "dossiers", actions: ["read"] },
    { resource: "parametres", actions: ["read"] },
  ],
}

// Comptes de démonstration
export const DEMO_USERS: User[] = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    role: "administrateur",
    nom: "Dupont",
    prenom: "Michel",
    email: "admin@justice.fr",
    permissions: ROLE_PERMISSIONS.administrateur,
  },
  {
    id: "2",
    username: "greffier1",
    password: "greffier123",
    role: "greffier",
    nom: "Martin",
    prenom: "Sophie",
    email: "greffier@justice.fr",
    permissions: ROLE_PERMISSIONS.greffier,
  },
  {
    id: "3",
    username: "superviseur1",
    password: "super123",
    role: "superviseur",
    nom: "Bernard",
    prenom: "Pierre",
    email: "superviseur@justice.fr",
    permissions: ROLE_PERMISSIONS.superviseur,
  },
  {
    id: "4",
    username: "opj1",
    password: "password123",
    role: "police",
    nom: "Leroy",
    prenom: "Jean",
    email: "opj@police.fr",
    unite: "Unité Centrale",
    permissions: ROLE_PERMISSIONS.police,
  },
]

// Fonctions utilitaires
export function authenticateUser(username: string, password: string): User | null {
  const user = DEMO_USERS.find((u) => u.username === username && u.password === password)
  return user || null
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const userData = localStorage.getItem("currentUser")
  return userData ? JSON.parse(userData) : null
}

export function setCurrentUser(user: User): void {
  if (typeof window === "undefined") return
  localStorage.setItem("currentUser", JSON.stringify(user))
  localStorage.setItem("isAuthenticated", "true")
  localStorage.setItem("userRole", user.role)
}

export function logout(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("currentUser")
  localStorage.removeItem("isAuthenticated")
  localStorage.removeItem("userRole")
}

export function hasPermission(resource: string, action: string): boolean {
  const user = getCurrentUser()
  if (!user) return false

  const permission = user.permissions.find((p) => p.resource === resource)
  return permission ? permission.actions.includes(action) : false
}

export function getDefaultRoute(role: UserRole): string {
  switch (role) {
    case "administrateur":
      return "/dashboard"
    case "greffier":
      return "/detenus" // Redirection vers la gestion des détenus
    case "superviseur":
      return "/dashboard"
    case "police":
      return "/pv"
    default:
      return "/dashboard"
  }
}

export function getRoleDisplayName(role: UserRole): string {
  const names = {
    administrateur: "Administrateur",
    greffier: "Greffier",
    superviseur: "Superviseur",
    police: "OPJ",
    // police: "Officier de Police Judiciaire",
  }
  return names[role]
}

export function getRoleBadgeColor(role: UserRole): string {
  const colors = {
    administrateur: "bg-purple-600 text-white",
    greffier: "bg-green-600 text-white",
    superviseur: "bg-blue-600 text-white",
    police: "bg-orange-600 text-white",
  }
  return colors[role]
}
