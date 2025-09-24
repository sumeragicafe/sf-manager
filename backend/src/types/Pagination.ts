export interface PaginationOptions {
  page: number;
  pageSize: number;
  search?: string;       // termo de busca simples (full-text ou like)
  filters?: Record<string, any>; // ex: { status: "active", category: "tech" }
  sortBy?: string;       // campo de ordenação
  sortOrder?: 'asc' | 'desc'; // direção
  includeRelations?: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;

  // Propriedades adicionais para facilitar a navegação e debug
  totalPages?: number;        // número total de páginas
  hasNext?: boolean;          // existe próxima página?
  hasPrevious?: boolean;      // existe página anterior?
  appliedFilters?: Record<string, any>; // filtros que foram aplicados
  sortBy?: string;            // campo usado para ordenação
  sortOrder?: 'asc' | 'desc'; // direção da ordenação
}
