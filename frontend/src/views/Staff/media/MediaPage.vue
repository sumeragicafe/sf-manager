<template>
  <div class="p-6 space-y-6 bg-background text-foreground font-body">
    <!-- Toolbar -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold font-heading text-ong-text">Biblioteca de Mídia</h1>
      <div class="flex space-x-2">
        <button
          @click="openDialog"
          class="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition"
        >
          Upload de Arquivos
        </button>
        <select v-model="view" class="border border-border rounded px-2 py-1 bg-card text-card-foreground">
          <option value="grid">Grade</option>
          <option value="list">Lista</option>
        </select>
        <select v-model="filter" class="border border-border rounded px-2 py-1 bg-card text-card-foreground">
          <option value="all">Todos</option>
          <option value="image">Imagens</option>
          <option value="video">Vídeos</option>
          <option value="document">Documentos</option>
        </select>
      </div>
    </div>

    <!-- Conteúdo -->
    <div v-if="view === 'grid'" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="item in paginatedItems"
        :key="item.id"
        class="rounded-lg border border-border bg-card text-card-foreground p-2 flex flex-col shadow-sm animate-fade-in"
      >
        <img v-if="item.type === 'image'" :src="item.url" class="h-32 object-cover rounded-md" />
        <video v-else-if="item.type === 'video'" controls class="h-32 rounded-md">
          <source :src="item.url" type="video/mp4" />
        </video>
        <div v-else class="h-32 flex items-center justify-center bg-muted text-muted-foreground rounded-md">
          📄 {{ item.name }}
        </div>
        <p class="mt-2 text-sm truncate">{{ item.name }}</p>
      </div>
    </div>

    <div v-else class="divide-y divide-border rounded-lg border border-border bg-card shadow-sm">
      <div
        v-for="item in paginatedItems"
        :key="item.id"
        class="flex items-center p-2 space-x-4 animate-fade-in"
      >
        <img v-if="item.type === 'image'" :src="item.url" class="h-16 w-16 object-cover rounded" />
        <video v-else-if="item.type === 'video'" controls class="h-16 w-16 rounded">
          <source :src="item.url" type="video/mp4" />
        </video>
        <div v-else class="h-16 w-16 flex items-center justify-center bg-muted text-muted-foreground rounded">
          📄
        </div>
        <div>
          <p class="font-medium">{{ item.name }}</p>
          <p class="text-xs capitalize text-muted-foreground">{{ item.type }}</p>
        </div>
      </div>
    </div>

    <!-- Paginação -->
    <div class="flex justify-center space-x-2 mt-4">
      <button
        class="px-3 py-1 border border-border rounded bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50"
        :disabled="page === 1"
        @click="page--"
      >
        Anterior
      </button>
      <span class="text-sm">Página {{ page }} de {{ totalPages }}</span>
      <button
        class="px-3 py-1 border border-border rounded bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50"
        :disabled="page === totalPages"
        @click="page++"
      >
        Próxima
      </button>
    </div>

    <!-- Diálogo de Upload -->
    <div
      v-if="isDialogOpen"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div class="bg-card text-card-foreground rounded-lg shadow-lg p-6 w-96 animate-scale-in">
        <h2 class="text-lg font-bold mb-4">Upload de Arquivos</h2>
        <input
          type="file"
          multiple
          @change="handleFileSelect"
          class="mb-4 text-sm file:mr-3 file:rounded file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
        />
        <div v-for="upload in uploads" :key="upload.name" class="mb-3">
          <p class="text-sm">{{ upload.name }} - {{ upload.progress }}%</p>
          <div class="w-full bg-muted rounded h-2 overflow-hidden">
            <div
              class="bg-accent h-2 transition-all"
              :style="{ width: upload.progress + '%' }"
            ></div>
          </div>
        </div>
        <div class="flex justify-end mt-4">
          <button
            @click="closeDialog"
            class="px-4 py-2 rounded bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

type MediaItem = {
  id: number
  name: string
  type: 'image' | 'video' | 'document'
  url: string
}

type UploadProgress = {
  name: string
  progress: number
}

const allItems = ref<MediaItem[]>([
  { id: 1, name: 'Paisagem', type: 'image', url: 'https://via.placeholder.com/300' },
  { id: 2, name: 'Apresentação', type: 'document', url: '' },
  { id: 3, name: 'Vídeo de Exemplo', type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 4, name: 'Foto de Perfil', type: 'image', url: 'https://via.placeholder.com/300' }
])

const view = ref<'grid' | 'list'>('grid')
const filter = ref<'all' | 'image' | 'video' | 'document'>('all')
const page = ref(1)
const itemsPerPage = 8

const filteredItems = computed(() => {
  if (filter.value === 'all') return allItems.value
  return allItems.value.filter(item => item.type === filter.value)
})

const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage))

const paginatedItems = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  return filteredItems.value.slice(start, start + itemsPerPage)
})

const isDialogOpen = ref(false)
const uploads = ref<UploadProgress[]>([])

function openDialog() {
  isDialogOpen.value = true
}

function closeDialog() {
  isDialogOpen.value = false
}

function handleFileSelect(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (!files) return

  Array.from(files).forEach(file => {
    const upload: UploadProgress = { name: file.name, progress: 0 }
    uploads.value.push(upload)

    const interval = setInterval(() => {
      if (upload.progress >= 100) {
        clearInterval(interval)
        allItems.value.unshift({
          id: Date.now(),
          name: file.name,
          type: file.type.startsWith('image') ? 'image'
               : file.type.startsWith('video') ? 'video'
               : 'document',
          url: file.type.startsWith('image') ? URL.createObjectURL(file) : ''
        })
      } else {
        upload.progress += 10
      }
    }, 200)
  })
}
</script>
