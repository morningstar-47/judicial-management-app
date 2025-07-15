export interface SearchFilter {
  field: string
  operator: "equals" | "contains" | "startsWith" | "endsWith" | "between" | "in" | "not_in"
  value: any
  logic?: "AND" | "OR"
}

export interface SearchQuery {
  fullText?: string
  filters: SearchFilter[]
  dateRange?: {
    field: string
    from?: string
    to?: string
  }
  sortBy?: string
  sortOrder?: "asc" | "desc"
  limit?: number
}

export interface SavedSearch {
  id: string
  name: string
  query: SearchQuery
  createdAt: string
  lastUsed: string
}

// Fonction de recherche full-text
export function performFullTextSearch<T extends Record<string, any>>(data: T[], query: SearchQuery): T[] {
  let results = [...data]

  // Recherche full-text
  if (query.fullText && query.fullText.trim()) {
    const searchTerms = query.fullText
      .toLowerCase()
      .split(" ")
      .filter((term) => term.length > 0)

    results = results.filter((item) => {
      const searchableText = Object.values(item)
        .filter((value) => typeof value === "string" || typeof value === "number")
        .join(" ")
        .toLowerCase()

      // Recherche avec opérateurs
      return searchTerms.every((term) => {
        if (term.startsWith('"') && term.endsWith('"')) {
          // Recherche exacte
          const exactTerm = term.slice(1, -1)
          return searchableText.includes(exactTerm)
        } else if (term.startsWith("-")) {
          // Exclusion
          const excludeTerm = term.slice(1)
          return !searchableText.includes(excludeTerm)
        } else {
          // Recherche normale
          return searchableText.includes(term)
        }
      })
    })
  }

  // Application des filtres
  if (query.filters.length > 0) {
    results = applyFilters(results, query.filters)
  }

  // Filtre par plage de dates
  if (query.dateRange && query.dateRange.field) {
    results = applyDateRangeFilter(results, query.dateRange)
  }

  // Tri
  if (query.sortBy) {
    results = sortResults(results, query.sortBy, query.sortOrder || "asc")
  }

  // Limite
  if (query.limit) {
    results = results.slice(0, query.limit)
  }

  return results
}

function applyFilters<T extends Record<string, any>>(data: T[], filters: SearchFilter[]): T[] {
  return data.filter((item) => {
    let result = true
    let orResults: boolean[] = []

    for (const filter of filters) {
      const fieldValue = getNestedValue(item, filter.field)
      const filterResult = evaluateFilter(fieldValue, filter)

      if (filter.logic === "OR") {
        orResults.push(filterResult)
      } else {
        // AND par défaut
        if (orResults.length > 0) {
          // Traiter les résultats OR précédents
          result = result && orResults.some((r) => r)
          orResults = []
        }
        result = result && filterResult
      }
    }

    // Traiter les derniers résultats OR
    if (orResults.length > 0) {
      result = result && orResults.some((r) => r)
    }

    return result
  })
}

function evaluateFilter(fieldValue: any, filter: SearchFilter): boolean {
  const { operator, value } = filter

  switch (operator) {
    case "equals":
      return fieldValue === value
    case "contains":
      return String(fieldValue).toLowerCase().includes(String(value).toLowerCase())
    case "startsWith":
      return String(fieldValue).toLowerCase().startsWith(String(value).toLowerCase())
    case "endsWith":
      return String(fieldValue).toLowerCase().endsWith(String(value).toLowerCase())
    case "between":
      return fieldValue >= value.min && fieldValue <= value.max
    case "in":
      return Array.isArray(value) && value.includes(fieldValue)
    case "not_in":
      return Array.isArray(value) && !value.includes(fieldValue)
    default:
      return true
  }
}

function applyDateRangeFilter<T extends Record<string, any>>(
  data: T[],
  dateRange: { field: string; from?: string; to?: string },
): T[] {
  return data.filter((item) => {
    const dateValue = new Date(getNestedValue(item, dateRange.field))

    if (dateRange.from && dateValue < new Date(dateRange.from)) {
      return false
    }

    if (dateRange.to && dateValue > new Date(dateRange.to)) {
      return false
    }

    return true
  })
}

function sortResults<T extends Record<string, any>>(data: T[], sortBy: string, sortOrder: "asc" | "desc"): T[] {
  return [...data].sort((a, b) => {
    const aValue = getNestedValue(a, sortBy)
    const bValue = getNestedValue(b, sortBy)

    let comparison = 0
    if (aValue < bValue) comparison = -1
    if (aValue > bValue) comparison = 1

    return sortOrder === "desc" ? -comparison : comparison
  })
}

function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((current, key) => current?.[key], obj)
}

// Gestion des recherches sauvegardées
export function getSavedSearches(): SavedSearch[] {
  if (typeof window === "undefined") return []
  const saved = localStorage.getItem("savedSearches")
  return saved ? JSON.parse(saved) : []
}

export function saveSearch(search: Omit<SavedSearch, "id" | "createdAt" | "lastUsed">): void {
  if (typeof window === "undefined") return

  const savedSearches = getSavedSearches()
  const newSearch: SavedSearch = {
    ...search,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    lastUsed: new Date().toISOString(),
  }

  savedSearches.push(newSearch)
  localStorage.setItem("savedSearches", JSON.stringify(savedSearches))
}

export function deleteSavedSearch(id: string): void {
  if (typeof window === "undefined") return

  const savedSearches = getSavedSearches()
  const filtered = savedSearches.filter((search) => search.id !== id)
  localStorage.setItem("savedSearches", JSON.stringify(filtered))
}

export function updateLastUsed(id: string): void {
  if (typeof window === "undefined") return

  const savedSearches = getSavedSearches()
  const updated = savedSearches.map((search) =>
    search.id === id ? { ...search, lastUsed: new Date().toISOString() } : search,
  )
  localStorage.setItem("savedSearches", JSON.stringify(updated))
}
