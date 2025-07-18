export interface SearchFilters {
  query: string
  dateDebut?: string
  dateFin?: string
  categorie?: string
  statut?: string
  priorite?: string
  typeDetention?: string
  lieuDetention?: string
  opj?: string
  juge?: string
}

export interface SearchableItem {
  id: string
  type: "pv" | "dossier" | "detenu" | "decision" | "jugement"
  titre: string
  numero?: string
  description?: string
  categorie?: string
  statut?: string
  priorite?: string
  date: string
  opj?: string
  juge?: string
  suspect?: {
    nom: string
    prenom: string
    age: number
  }
  typeDetention?: string
  lieuDetention?: string
  tags?: string[]
}

// Fonction de recherche unifiée
export function searchItems(items: SearchableItem[], filters: SearchFilters): SearchableItem[] {
  return items.filter((item) => {
    // Recherche textuelle
    if (filters.query) {
      const query = filters.query.toLowerCase()
      const searchableText = [
        item.titre,
        item.numero,
        item.description,
        item.categorie,
        item.opj,
        item.juge,
        item.suspect?.nom,
        item.suspect?.prenom,
        ...(item.tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      if (!searchableText.includes(query)) {
        return false
      }
    }

    // Filtre par date
    if (filters.dateDebut) {
      const itemDate = new Date(item.date)
      const dateDebut = new Date(filters.dateDebut)
      if (itemDate < dateDebut) return false
    }

    if (filters.dateFin) {
      const itemDate = new Date(item.date)
      const dateFin = new Date(filters.dateFin)
      if (itemDate > dateFin) return false
    }

    // Filtres spécifiques
    if (filters.categorie && filters.categorie !== "tous" && item.categorie !== filters.categorie) {
      return false
    }

    if (filters.statut && filters.statut !== "tous" && item.statut !== filters.statut) {
      return false
    }

    if (filters.priorite && filters.priorite !== "tous" && item.priorite !== filters.priorite) {
      return false
    }

    if (filters.typeDetention && filters.typeDetention !== "tous" && item.typeDetention !== filters.typeDetention) {
      return false
    }

    if (filters.lieuDetention && filters.lieuDetention !== "tous" && item.lieuDetention !== filters.lieuDetention) {
      return false
    }

    if (filters.opj && filters.opj !== "tous" && item.opj !== filters.opj) {
      return false
    }

    if (filters.juge && filters.juge !== "tous" && item.juge !== filters.juge) {
      return false
    }

    return true
  })
}

// Fonction pour obtenir les suggestions de recherche
export function getSearchSuggestions(items: SearchableItem[], query: string): string[] {
  if (!query || query.length < 2) return []

  const suggestions = new Set<string>()
  const queryLower = query.toLowerCase()

  items.forEach((item) => {
    // Suggestions basées sur le titre
    if (item.titre.toLowerCase().includes(queryLower)) {
      suggestions.add(item.titre)
    }

    // Suggestions basées sur le numéro
    if (item.numero?.toLowerCase().includes(queryLower)) {
      suggestions.add(item.numero)
    }

    // Suggestions basées sur le suspect
    if (item.suspect) {
      const nomComplet = `${item.suspect.prenom} ${item.suspect.nom}`.toLowerCase()
      if (nomComplet.includes(queryLower)) {
        suggestions.add(`${item.suspect.prenom} ${item.suspect.nom}`)
      }
    }

    // Suggestions basées sur les tags
    item.tags?.forEach((tag) => {
      if (tag.toLowerCase().includes(queryLower)) {
        suggestions.add(tag)
      }
    })
  })

  return Array.from(suggestions).slice(0, 10)
}

// Fonction pour mettre en évidence les termes de recherche
export function highlightSearchTerms(text: string, query: string): string {
  if (!query) return text

  const regex = new RegExp(`(${query})`, "gi")
  return text.replace(regex, "<mark>$1</mark>")
}

// Fonction pour obtenir les statistiques de recherche
export function getSearchStats(items: SearchableItem[]) {
  const stats = {
    total: items.length,
    parType: {} as Record<string, number>,
    parCategorie: {} as Record<string, number>,
    parStatut: {} as Record<string, number>,
    parPriorite: {} as Record<string, number>,
  }

  items.forEach((item) => {
    // Par type
    stats.parType[item.type] = (stats.parType[item.type] || 0) + 1

    // Par catégorie
    if (item.categorie) {
      stats.parCategorie[item.categorie] = (stats.parCategorie[item.categorie] || 0) + 1
    }

    // Par statut
    if (item.statut) {
      stats.parStatut[item.statut] = (stats.parStatut[item.statut] || 0) + 1
    }

    // Par priorité
    if (item.priorite) {
      stats.parPriorite[item.priorite] = (stats.parPriorite[item.priorite] || 0) + 1
    }
  })

  return stats
}

// Données mockées pour la recherche
export const mockSearchData: SearchableItem[] = [
  {
    id: "1",
    type: "pv",
    numero: "PV-2024-001",
    titre: "Vol à main armée - Banque Centrale",
    description: "Vol à main armée perpétré dans une banque avec menaces et violence",
    categorie: "Vol",
    statut: "en_attente_decision",
    priorite: "urgente",
    date: "2024-01-15",
    opj: "Lieutenant Dubois",
    suspect: {
      nom: "Dupont",
      prenom: "Marc",
      age: 35,
    },
    typeDetention: "detention_provisoire",
    lieuDetention: "Maison d'arrêt A",
    tags: ["arme", "banque", "violence", "témoins"],
  },
  {
    id: "2",
    type: "pv",
    numero: "PV-2024-002",
    titre: "Trafic de stupéfiants - Quartier Nord",
    description: "Trafic de stupéfiants organisé avec plusieurs suspects interpellés",
    categorie: "Trafic",
    statut: "en_attente_decision",
    priorite: "haute",
    date: "2024-01-14",
    opj: "Capitaine Martin",
    suspect: {
      nom: "Garcia",
      prenom: "Antonio",
      age: 28,
    },
    typeDetention: "detention_provisoire",
    lieuDetention: "Centre pénitentiaire B",
    tags: ["drogue", "réseau", "saisie"],
  },
  {
    id: "3",
    type: "dossier",
    numero: "DOS-2024-001",
    titre: "Dossier Vol à main armée - Banque Centrale",
    description: "Dossier complet concernant le vol à main armée de la Banque Centrale",
    categorie: "Vol",
    statut: "a_juger",
    priorite: "urgente",
    date: "2024-01-15",
    opj: "Lieutenant Dubois",
    juge: "Juge Moreau",
    suspect: {
      nom: "Dupont",
      prenom: "Marc",
      age: 35,
    },
    typeDetention: "detention_provisoire",
    lieuDetention: "Maison d'arrêt A",
    tags: ["dossier", "complet", "prêt"],
  },
  {
    id: "4",
    type: "detenu",
    numero: "ECR-2024-001",
    titre: "Détenu Marc Dupont",
    description: "Détenu en attente de jugement pour vol à main armée",
    categorie: "Vol",
    statut: "detention_provisoire",
    priorite: "normale",
    date: "2024-01-15",
    suspect: {
      nom: "Dupont",
      prenom: "Marc",
      age: 35,
    },
    typeDetention: "detention_provisoire",
    lieuDetention: "Maison d'arrêt A",
    tags: ["écrou", "attente", "jugement"],
  },
  {
    id: "5",
    type: "decision",
    numero: "DEC-2024-001",
    titre: "Décision de mise en détention - Marc Dupont",
    description: "Décision du commandant de placer le suspect en détention provisoire",
    categorie: "Vol",
    statut: "validee",
    priorite: "urgente",
    date: "2024-01-15",
    opj: "Commandant Rousseau",
    suspect: {
      nom: "Dupont",
      prenom: "Marc",
      age: 35,
    },
    typeDetention: "detention_provisoire",
    lieuDetention: "Maison d'arrêt A",
    tags: ["décision", "commandant", "détention"],
  },
]
