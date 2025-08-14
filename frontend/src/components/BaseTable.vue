<script setup lang="ts">
import { ref, computed, watch, defineProps, defineEmits } from 'vue'

interface Column {
  label: string
  key: string
  sortable?: boolean
  width?: string // exemplo: "w-24"
}

const props = defineProps<{
  columns: Column[]
  data: Record<string, any>[]
  totalItems: number
  pageSize: number
  currentPage: number
}>();

const emit = defineEmits<{
  (e: 'update:page', page: number): void
  (e: 'update:pageSize', size: number): void
  (e: 'sort-change', payload: { key: string; direction: 'asc' | 'desc' | null }): void
}>();

// Estado interno para ordenação
const sortKey = ref<string | null>(null)
const sortDirection = ref<'asc' | 'desc' | null>(null)

function changeSort(column: Column) {
  if (!column.sortable) return
  if (sortKey.value !== column.key) {
    sortKey.value = column.key
    sortDirection.value = 'asc'
  } else if (sortDirection.value === 'asc') {
    sortDirection.value = 'desc'
  } else {
    sortKey.value = null
    sortDirection.value = null
  }
  emit('sort-change', { key: sortKey.value!, direction: sortDirection.value! })
}

// Computar total de páginas
const totalPages = computed(() => Math.ceil(props.totalItems / props.pageSize))

// Funções para mudar página
function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return
  emit('update:page', page)
}

function onPageSizeChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const size = Number(target.value)
  emit('update:pageSize', size)
  emit('update:page', 1) // resetar página ao mudar tamanho
}
</script>

<template>
  <div class="overflow-x-auto border border-border rounded-lg bg-card text-card-foreground">
    <table class="min-w-full divide-y divide-border">
      <thead class="bg-muted text-muted-foreground select-none">
        <tr>
          <th v-for="col in columns" :key="col.key" :class="['px-4 py-2 text-left', col.width || '']">
            <button
              v-if="col.sortable"
              @click="changeSort(col)"
              class="flex items-center gap-1 font-semibold hover:text-primary focus:outline-none"
              type="button"
            >
              {{ col.label }}
              <span v-if="sortKey === col.key">
                <svg v-if="sortDirection === 'asc'" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/>
                </svg>
                <svg v-else-if="sortDirection === 'desc'" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </span>
            </button>
            <span v-else class="font-semibold">{{ col.label }}</span>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-border bg-background">
        <tr v-for="(row, i) in data" :key="i" class="hover:bg-muted cursor-default">
          <td v-for="col in columns" :key="col.key" class="px-4 py-2 whitespace-nowrap">
            {{ row[col.key] }}
          </td>
        </tr>
        <tr v-if="data.length === 0">
          <td :colspan="columns.length" class="text-center p-4 text-muted-foreground">
            Nenhum registro encontrado.
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Paginação -->
  <div class="flex justify-between items-center mt-3 font-semibold text-sm text-muted-foreground select-none">
    <div>
      Página {{ currentPage }} de {{ totalPages }}
    </div>
    <div class="flex items-center gap-2">
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage <= 1"
        class="px-2 py-1 rounded border border-border hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Anterior
      </button>
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage >= totalPages"
        class="px-2 py-1 rounded border border-border hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Próxima
      </button>

      <select
        @change="onPageSizeChange"
        :value="pageSize"
        class="border border-border rounded px-2 py-1 bg-background text-foreground"
      >
        <option value="5">5 / página</option>
        <option value="10">10 / página</option>
        <option value="25">25 / página</option>
        <option value="50">50 / página</option>
      </select>
    </div>
  </div>
</template>
