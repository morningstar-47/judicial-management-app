export type UserRole = "administrateur" | "greffier" | "superviseur" | "police" | "commandant" | "juge"

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
    { resource: "centres", actions: ["read", "create", "update", "delete"] },
    { resource: "decisions", actions: ["read", "create", "update", "delete"] },
    { resource: "parametres", actions: ["read", "update"] },
    { resource: "audit", actions: ["read"] },
    { resource: "statistiques", actions: ["read"] },
  ],
  commandant: [
    { resource: "dashboard", actions: ["read"] },
    { resource: "pv", actions: ["read", "create", "update"] },
    { resource: "decisions", actions: ["read", "create", "update"] },
    { resource: "prisonniers", actions: ["read", "create", "update"] },
    { resource: "dossiers", actions: ["read"] },
    { resource: "opj", actions: ["read"] },
    { resource: "parametres", actions: ["read"] },
  ],
  juge: [
    { resource: "dashboard", actions: ["read"] },
    { resource: "recherche", actions: ["read"] },
    { resource: "dossiers", actions: ["read", "update"] },
    { resource: "pv", actions: ["read"] },
    { resource: "decisions", actions: ["read", "create", "update"] },
    { resource: "prisonniers", actions: ["read", "update"] },
    { resource: "centres", actions: ["read", "update"] },
    { resource: "jugements", actions: ["read", "create", "update"] },
    { resource: "parametres", actions: ["read"] },
  ],
  greffier: [
    { resource: "dashboard", actions: ["read"] },
    { resource: "juges", actions: ["read"] },
    { resource: "prisonniers", actions: ["read", "create", "update", "delete"] },
    { resource: "centres", actions: ["read"] },
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
    { resource: "centres", actions: ["read"] },
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
  {
    id: "5",
    username: "commandant1",
    password: "cmd123",
    role: "commandant",
    nom: "Rousseau",
    prenom: "Paul",
    email: "commandant@police.fr",
    unite: "Brigade Centrale",
    permissions: ROLE_PERMISSIONS.commandant,
  },
  {
    id: "6",
    username: "juge1",
    password: "juge123",
    role: "juge",
    nom: "Moreau",
    prenom: "Catherine",
    email: "juge@justice.fr",
    unite: "TGI Paris",
    permissions: ROLE_PERMISSIONS.juge,
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
      return "/detenus"
    case "superviseur":
      return "/dashboard"
    case "police":
      return "/pv"
    case "commandant":
      return "/decisions"
    case "juge":
      return "/jugements"
    default:
      return "/dashboard"
  }
}

export function getRoleDisplayName(role: UserRole): string {
  const names = {
    administrateur: "Administrateur",
    greffier: "Greffier",
    superviseur: "Superviseur",
    police: "Officier de Police Judiciaire",
    commandant: "Commandant de Brigade",
    juge: "Juge",
  }
  return names[role]
}

export function getRoleBadgeColor(role: UserRole): string {
  const colors = {
    administrateur: "bg-purple-600 text-white",
    greffier: "bg-green-600 text-white",
    superviseur: "bg-blue-600 text-white",
    police: "bg-orange-600 text-white",
    commandant: "bg-red-600 text-white",
    juge: "bg-indigo-600 text-white",
  }
  return colors[role]
}
