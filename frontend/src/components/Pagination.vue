<script setup>
import { computed, ref, watch, onMounted, nextTick } from "vue";
import { ChevronLeft, ChevronRight, ChevronsRight, ChevronsLeft, Search, Filter } from "lucide-vue-next";

const props = defineProps({
  total: { type: Number, required: true },
  page: { type: Number, default: 1 },
  pageSize: { type: Number, default: 20 },
  pageSizes: { type: Array, default: () => [20, 30, 50, 100, 200] },
  showPageSize: { type: Boolean, default: true },
  compact: { type: Boolean, default: false },

  search: { type: String, default: undefined },
  view: { type: Object, default: undefined },
  filter: { type: Object, default: undefined },
  filters: { type: Object, default: () => ({}) },
  modelValue: { type: Object, default: () => ({}) },
});

const emit = defineEmits([
  "update:page",
  "update:pageSize",
  "update:modelValue",
  "change-view",
  "change-filter",
  "update:search"
]);

// Paginação
const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.total / props.pageSize))
);
const hasPrev = computed(() => props.page > 1);
const hasNext = computed(() => props.page < totalPages.value);

const pageButtons = computed(() => {
  const totalBtn = 5;
  let start = Math.max(1, props.page - Math.floor(totalBtn / 2));
  let end = Math.min(totalPages.value, start + totalBtn - 1);
  start = Math.max(1, end - totalBtn + 1);

  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
});

function changePage(newPage) {
  if (newPage >= 1 && newPage <= totalPages.value) {
    emit("update:page", newPage);
  }
}
function changePageSize(e) {
  emit("update:pageSize", parseInt(e.target.value));
}
function updateFilter(key, value) {
  emit("update:modelValue", { ...props.modelValue, [key]: value });
}

// Search
const localSearch = ref(props.search || "");
watch(localSearch, val => emit("update:search", val));

// View & Filter
const localView = ref(props.view?.value);
const localFilter = ref(props.filter?.value);
watch(localView, val => emit("change-view", val));
watch(localFilter, val => emit("change-filter", val));

// Responsividade dinâmica
const containerRef = ref(null);
const filtersRef = ref(null);
const useDropdown = ref(false);
const showFiltersDropdown = ref(false);
const shouldUseDropdown = ref(false);

const checkSpace = () => {
  if (!containerRef.value || !filtersRef.value) return;
  const containerWidth = containerRef.value.offsetWidth;
  const filtersWidth = filtersRef.value.offsetWidth;
  useDropdown.value = filtersWidth > containerWidth - 500; // 150px reservado para paginação e pageSize

   // Só atualiza se for diferente do estado atual
  if (shouldUseDropdown !== useDropdown.value) {
    requestAnimationFrame(() => {
      useDropdown.value = shouldUseDropdown;
    });
  }
};

onMounted(() => {
  nextTick(() => {
    checkSpace();
    const ro = new ResizeObserver(checkSpace);
    if (containerRef.value) ro.observe(containerRef.value);
  });
});
</script>

<template>
  <div ref="containerRef" class="flex flex-col gap-4 mt-4 p-3 bg-card rounded-xl shadow-sm">

    <div class="flex items-center justify-between flex-wrap gap-4">

      <!-- Page Size + Search -->
      <div class="flex gap-2 items-center flex-wrap">
        <div v-if="showPageSize" class="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Mostrar:</span>
          <select
            class="border rounded-md px-2 py-1 bg-background text-foreground"
            :value="pageSize"
            @change="changePageSize"
          >
            <option v-for="size in pageSizes" :key="size" :value="size">{{ size }}</option>
          </select>
        </div>

        <div v-if="search !== undefined" class="flex items-center gap-2 border rounded-md px-2 py-1 bg-background text-foreground w-full sm:w-auto">
          <Search class="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            v-model="localSearch"
            placeholder="Pesquisar..."
            class="border-none outline-none bg-transparent w-full text-sm"
          />
        </div>
      </div>

      <!-- Filters + View -->
      <div ref="filtersRef" class="flex flex-wrap gap-2 items-center">
        <template v-if="!useDropdown && !props.compact">
          <!-- VIEW -->
          <div v-if="view" class="flex items-center text-sm">
            <label v-if="view.label" class="text-muted-foreground me-1">{{ view.label }}:</label>
            <select v-model="localView" class="border border-border rounded-md px-3 py-1 bg-background text-foreground shadow-sm">
              <option v-for="opt in view.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>

          <!-- FILTER -->
          <div v-if="filter" class="flex items-center text-sm">
            <label v-if="filter.label" class="text-muted-foreground me-1">{{ filter.label }}:</label>
            <select v-model="localFilter" class="border border-border rounded-md px-3 py-1 bg-background text-foreground shadow-sm">
              <option v-for="opt in filter.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>

          <!-- FILTROS EXTRAS -->
          <div v-if="Object.keys(filters).length" class="flex flex-wrap gap-2 items-center">
            <div v-for="(options, key) in filters" :key="key" class="flex flex-col text-sm">
              <label class="text-muted-foreground mb-1">{{ key }}</label>
              <select v-if="Array.isArray(options)" class="border rounded-md px-2 py-1 bg-background text-foreground"
                :value="modelValue[key] || ''"
                @change="updateFilter(key, $event.target.value)"
              >
                <option value="">Todos</option>
                <option v-for="opt in options" :key="opt" :value="opt">{{ opt }}</option>
              </select>
              <input v-else-if="options==='text'" type="text" class="border rounded-md px-2 py-1 bg-background text-foreground"
                :value="modelValue[key]||''"
                @input="updateFilter(key,$event.target.value)"
              />
              <label v-else-if="options==='boolean'" class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" class="accent-primary" :checked="modelValue[key]||false"
                  @change="updateFilter(key,$event.target.checked)" />
                <span>{{ key }}</span>
              </label>
            </div>
          </div>
        </template>

        <!-- Dropdown quando não há espaço -->
        <div v-else-if="!props.compact" class="relative">
          <button @click="showFiltersDropdown = !showFiltersDropdown"
                  class="flex items-center gap-1 border px-3 py-1 rounded-md bg-background text-foreground shadow-sm text-sm">
            <Filter class="w-4 h-4" /> Filtros
          </button>
          <div v-if="showFiltersDropdown" class="absolute right-0 mt-1 bg-card p-3 rounded shadow-lg z-50 w-64">
            <!-- VIEW -->
            <div v-if="view" class="flex items-center gap-2 mb-2">
              <label v-if="view.label">{{ view.label }}:</label>
              <select v-model="localView" class="border rounded-md px-2 py-1 w-full">
                <option v-for="opt in view.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
            </div>

            <!-- FILTER -->
            <div v-if="filter" class="flex items-center gap-2 mb-2">
              <label v-if="filter.label">{{ filter.label }}:</label>
              <select v-model="localFilter" class="border rounded-md px-2 py-1 w-full">
                <option v-for="opt in filter.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
            </div>

            <!-- FILTROS EXTRAS -->
            <div v-for="(options,key) in filters" :key="key" class="flex flex-col gap-1 mb-2">
              <label>{{ key }}</label>
              <select v-if="Array.isArray(options)" class="border rounded-md px-2 py-1 w-full"
                      :value="modelValue[key]||''"
                      @change="updateFilter(key,$event.target.value)">
                <option value="">Todos</option>
                <option v-for="opt in options" :key="opt" :value="opt">{{ opt }}</option>
              </select>
              <input v-else-if="options==='text'" type="text" class="border rounded-md px-2 py-1 w-full"
                     :value="modelValue[key]||''"
                     @input="updateFilter(key,$event.target.value)" />
              <label v-else-if="options==='boolean'" class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" class="accent-primary" :checked="modelValue[key]||false"
                       @change="updateFilter(key,$event.target.checked)" />
                <span>{{ key }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Navegação de página -->
      <div class="flex items-center gap-2 flex-wrap">
        <button class="p-1 rounded-md bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition disabled:opacity-50"
                :disabled="page===1" @click="changePage(1)" title="Primeira página">
          <ChevronsLeft class="w-3 h-3"/>
        </button>
        <button class="p-1 rounded-md bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition disabled:opacity-50"
                :disabled="!hasPrev" @click="changePage(page-1)" title="Página anterior">
          <ChevronLeft class="w-3 h-3"/>
        </button>

        <div class="flex items-center gap-1">
          <button v-for="p in pageButtons" :key="p" @click="changePage(p)"
                  class="px-2 py-1 rounded-md text-sm transition"
                  :class="p===page ? 'bg-primary text-primary-foreground shadow'
                                   : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'">
            {{ p }}
          </button>
        </div>

        <button class="p-1 rounded-md bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition disabled:opacity-50"
                :disabled="!hasNext" @click="changePage(page+1)" title="Próxima página">
          <ChevronRight class="w-3 h-3"/>
        </button>

        <button class="p-1 rounded-md bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition disabled:opacity-50"
                :disabled="page===totalPages" @click="changePage(totalPages)" title="Última página">
          <ChevronsRight class="w-3 h-3"/>
        </button>
      </div>

      <div v-if="!useDropdown" class="text-sm text-muted-foreground">
        Página {{ page }} de {{ totalPages }} ({{ total }} resultados)
      </div>

    </div>
  </div>
</template>
