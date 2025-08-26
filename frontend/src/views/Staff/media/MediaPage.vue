<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-heading font-bold text-ong-text">Biblioteca de Mídia</h1>
        <p class="text-muted-foreground mt-2">Gerencie imagens e arquivos</p>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="flex flex-col md:flex-row justify-end md:items-center gap-4">
      <div class="flex gap-2">
        <select
        v-model="perPage"
        class="border border-border rounded-md px-3 py-1 bg-card text-card-foreground shadow-sm"
      >
        <option :value="8">8 por página</option>
        <option :value="16">16 por página</option>
        <option :value="32">32 por página</option>
        <option :value="64">64 por página</option>
      </select>
        <button
          @click="selectFile"
          class="px-4 py-2 rounded-lg bg-ong-primary text-white font-semibold shadow-sm hover:bg-ong-accent transition"
        >
          Upload de Arquivos
        </button>
        <input type="file" ref="fileInput" class="hidden" @change="onFileChange" />

        <select
          v-model="view"
          class="border border-border rounded-md px-3 py-1 bg-card text-card-foreground shadow-sm"
        >
          <option value="grid">Grade</option>
          <option value="list">Lista</option>
        </select>
        <select
          v-model="filter"
          class="border border-border rounded-md px-3 py-1 bg-card text-card-foreground shadow-sm"
        >
          <option value="all">Todos</option>
          <option value="image">Imagens</option>
          <option value="video">Vídeos</option>
          <option value="document">Documentos</option>
        </select>
      </div>
    </div>

    <!-- Conteúdo em Grade -->
    <div v-if="view === 'grid'"  class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-4 mt-4">
      <div
        v-for="item in paginatedItems"
        :key="item.id"
        class="relative rounded-lg border border-border bg-card text-card-foreground p-2 flex flex-col items-center shadow-sm hover:shadow-md transition"
      >
        <!-- Botões no topo -->
        <div class="absolute top-2 right-2 flex gap-1">
          <button
            @click="abrirModal(item)"
            class="p-1 rounded-sm bg-background hover:bg-muted transition"
          >
            <Eye class="w-4 h-4" />
          </button>

          <div class="relative">
            <button
              @click="toggleDropdown(item.id)"
              class="p-1 rounded-sm bg-background hover:bg-muted transition"
            >
              <MoreVertical class="w-4 h-4" />
            </button>

            <div
              v-if="dropdownOpen === item.id"
              class="absolute right-0 mt-1 w-32 bg-card border border-border rounded shadow-md z-10"
            >
              <!-- Renomear -->
              <button
                class="block w-full px-3 py-1 text-sm hover:bg-muted"
                @click="() => {
                  const novoNome = prompt('Novo nome do arquivo:', item.fileName)
                  if (novoNome) renomearItem(item.id, novoNome)
                  toggleDropdown(null)
                }"
              >
                Renomear
              </button>

              <!-- Baixar -->
              <button
                class="block w-full px-3 py-1 text-sm hover:bg-muted"
                @click="() => { baixarItem(item); toggleDropdown(null) }"
              >
                Baixar
              </button>

              <!-- Excluir -->
              <button
                class="block w-full px-3 py-1 text-sm text-red-500 hover:bg-muted"
                @click="() => { excluirItem(item.id); toggleDropdown(null) }"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>

        <!-- Ícone central -->
        <div class="w-full aspect-square flex items-center justify-center bg-muted rounded-md overflow-hidden">
          <div class="text-muted-foreground text-6xl">
            <div v-if="item.mimeType.includes('pdf')"><File /></div>
            <div v-else-if="item.mimeType.startsWith('image/')"><FileImage /></div>
            <div v-else-if="item.mimeType.startsWith('video/')"><FileVideo /></div>
            <div v-else><File /></div>
          </div>
        </div>

        <!-- Nome do arquivo -->
        <p class="text-sm mt-2 truncate text-center w-full">{{ item.fileName }}</p>
      </div>
    </div>

    <!-- Conteúdo em Lista -->
    <div v-else class="divide-y divide-border rounded-lg border border-border bg-card shadow-sm mt-4">
      <div
        v-for="item in paginatedItems"
        :key="item.id"
        class="flex items-center p-2 gap-4 animate-fade-in hover:bg-muted/30 transition"
      >
        <img v-if="item.mimeType.startsWith('image/')" :src="item.src" class="h-16 w-16 object-cover rounded" />
        <video v-else-if="item.mimeType.startsWith('video/')" controls class="h-16 w-16 rounded">
          <source :src="item.src" :type="item.mimeType" />
        </video>
        <div v-else class="h-16 w-16 flex items-center justify-center bg-muted text-muted-foreground rounded">
          <File />
        </div>
        <div>
          <p class="font-medium">{{ item.fileName }}</p>
          <p class="text-xs capitalize text-muted-foreground">{{ item.mimeType }}</p>
        </div>
      </div>
    </div>

    <!-- Paginação -->
    <div class="flex justify-center items-center gap-3 mt-4">
      <button
        class="px-3 py-1 border border-border rounded-md bg-ong-secondary text-foreground hover:bg-ong-accent hover:text-white transition disabled:opacity-50"
        :disabled="page === 1"
        @click="page--"
      >
        Anterior
      </button>
      <span class="text-sm">Página {{ page }} de {{ totalPages }}</span>
      <button
        class="px-3 py-1 border border-border rounded-md bg-ong-secondary text-foreground hover:bg-ong-accent hover:text-white transition disabled:opacity-50"
        :disabled="page === totalPages"
        @click="page++"
      >
        Próxima
      </button>
    </div>

    <!-- Modal -->
    <div v-if="modalOpen" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-[80vw] max-w-8xl h-[90vh] relative shadow-lg flex flex-col">
        <!-- Cabeçalho do modal -->
        <div class="flex justify-between items-center mb-4 bg-card rounded-t-lg">
          <!-- Info do arquivo -->
          <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <p class="font-heading font-bold text-lg text-ong-text truncate max-w-xs sm:max-w-sm">
              {{ modalItem?.fileName || 'Sem nome' }}
            </p>
          </div>

          <!-- Botão fechar -->
          <button 
            @click="modalOpen = false"
            aria-label="Fechar modal"
          >
            <X/>
          </button>
        </div>

        <!-- Área principal -->
        <div class="flex-1 flex flex-col">
          <!-- Frame da mídia -->
          <div class="flex-1 border rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden relative">
            <!-- IMAGE -->
            <div v-if="modalItem?.mimeType.startsWith('image/')" class="w-full h-full flex items-center justify-center overflow-auto">
              <img 
                :src="modalItem.src" 
                alt="Imagem no modal"
                class="object-contain transition-transform duration-200"
                :style="{ transform: `scale(${zoom}) translate(${translateX}px, ${translateY}px)` }"
              />
              <!-- Controles de Zoom -->
              <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-white/80 rounded-lg shadow px-3 py-2">
                <button @click="zoomIn" aria-label="Aumentar zoom"><Plus /></button>
                <button @click="resetZoom" aria-label="Restaurar zoom"><RefreshCcw /></button>
                <button @click="zoomOut" aria-label="Diminuir zoom"><Minus /></button>
              </div>
            </div>
            <!-- PDF -->
            <div v-else-if="modalItem?.mimeType.startsWith('application/pdf')" class="w-full h-full flex items-center justify-center">
              <iframe
                v-if="modalItem.src"
                :src="modalItem.src"
                class="w-full h-full"
                frameborder="0"
              ></iframe>
            </div>

            <!-- VIDEO -->
            <div v-else-if="modalItem?.mimeType.startsWith('video/')" class="w-full h-full flex items-center justify-center">
              <video controls class="max-h-full max-w-full object-contain">
                <source :src="modalItem.src" :type="modalItem.mimeType" />
                Seu navegador não suporta o elemento de vídeo.
              </video>
            </div>
            <div v-else class="flex items-center justify-center">
              <p class="text-lg font-medium">{{ modalItem?.fileName || 'Arquivo não suportado' }}</p>
            </div>
          </div>

          <!-- Área dos botões de ação -->
          <div class="mt-4 flex justify-end gap-3 items-center">
            <span class="text-sm text-muted-foreground">
              <b>Tipo de Arquivo:</b> {{ modalItem?.mimeType || 'Desconhecido' }}
            </span>
            <button 
              class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              @click="baixarItem(modalItem)"
            >
              Download
            </button>
            <button 
              class="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              @click="editarNome()"
            >
              Editar
            </button>
            <button 
              class="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              @click="handleDelete"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>

      <!-- Botão Anterior -->
      <button 
        class="absolute top-1/2 left-16 -translate-y-1/2 bg-white/70 hover:bg-white p-4 rounded-full shadow-md transition"
        @click="prevItem"
        :disabled="modalIndex === 0"
        aria-label="Arquivo anterior"
      >
        <ChevronLeft class="w-6 h-6 text-gray-700" />
      </button>

      <!-- Botão Próximo -->
      <button 
        class="absolute top-1/2 right-16 -translate-y-1/2 bg-white/70 hover:bg-white p-4 rounded-full shadow-md transition"
        @click="nextItem"
        :disabled="modalIndex === filteredItems.length - 1"
        aria-label="Próximo arquivo"
      >
        <ChevronRight class="w-6 h-6 text-gray-700" />
      </button>
    </div>


  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { Eye, MoreVertical, File, FileImage, FileVideo, RefreshCcw, Plus, Minus,ChevronRight, ChevronLeft, X  } from 'lucide-vue-next'

const items = ref([])
const filter = ref('all')
const view = ref('grid')
const page = ref(1)
const perPage = 8

const modalItem = ref(null)
const modalOpen = ref(false)
const dropdownOpen = ref(null)
const fileInput = ref(null)
const modalIndex = ref(null)


const zoom = ref(1)
const translateX = ref(0)
const translateY = ref(0)

function zoomIn() {
  zoom.value = Math.min(zoom.value + 0.2, 5) // até 5x
}
function zoomOut() {
  zoom.value = Math.max(zoom.value - 0.2, 0.5) // até 0.5x
}
function resetZoom() {
  zoom.value = 1
  translateX.value = 0
  translateY.value = 0
}


function nextItem() {
  if (modalIndex.value === null) return
  const next = (modalIndex.value + 1) % filteredItems.value.length
  modalIndex.value = next
  carregarArquivo(filteredItems.value[next])
}

function prevItem() {
  if (modalIndex.value === null) return
  const prev =
    (modalIndex.value - 1 + filteredItems.value.length) %
    filteredItems.value.length
  modalIndex.value = prev
  carregarArquivo(filteredItems.value[prev])
}

async function editarNome(item) {
  const { value: novoNome } = await Swal.fire({
    title: 'Renomear arquivo',
    html: `
      <input id="swal-input1" class="swal2-input" placeholder="Novo nome" value="${item.fileName}">
    `,
    showCancelButton: true,
    confirmButtonText: 'Salvar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const input = document.getElementById('swal-input1')
      return input.value
    }
  })

  if (novoNome) {
    renomearItem(item.id, novoNome)
    Swal.fire('Salvo!', 'O nome do arquivo foi atualizado.', 'success')
  }
}

/* === Pan com arrastar === */
let isDragging = false
let startX, startY

function startDrag(e) {
  isDragging = true
  startX = e.clientX - translateX.value
  startY = e.clientY - translateY.value
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

function onDrag(e) {
  if (!isDragging) return
  translateX.value = e.clientX - startX
  translateY.value = e.clientY - startY
}

function stopDrag() {
  isDragging = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}


function toggleDropdown(id) {
  dropdownOpen.value = dropdownOpen.value === id ? null : id
}

/* === Abrir modal === */
function abrirModal(item) {
  const index = filteredItems.value.findIndex(i => i.id === item.id)
  if (index === -1) return
  modalIndex.value = index
  carregarArquivo(filteredItems.value[modalIndex.value])
}

async function carregarArquivo(item) {
  try {
    const res = await fetch(`/api/media/${item.id}`)
    const file = await res.json()

    let src = ''
    if (file.mimeType.startsWith('image/') || file.mimeType.startsWith('video/')) {
      const base64 = btoa(
        new Uint8Array(file.data.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      )
      src = `data:${file.mimeType};base64,${base64}`
    }else if (file.mimeType.startsWith('application/pdf')) {
      // PDF via fetch + blob
      const pdfRes = await fetch(`/api/media/view/${item.id}`)
      if (!pdfRes.ok) throw new Error('Erro ao carregar PDF')
      const blob = await pdfRes.blob()
      src = URL.createObjectURL(blob)
    }

    modalItem.value = { ...file, src }
    modalOpen.value = true

    // 🔄 resetar zoom/posicionamento ao trocar
    resetZoom()
  } catch (err) {
    console.error('Erro ao abrir arquivo:', err)
  }
}

/* === Upload === */
function selectFile() {
  fileInput.value.click()
}
function onFileChange(e) {
  const file = e.target.files[0]
  if (file) uploadFile(file)
}
async function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch('/api/media', { method: 'POST', body: formData })
  if (!res.ok) {
    console.error('Erro no upload:', await res.json())
    return
  }
  const newFile = await res.json()
  items.value.unshift(newFile)
}

/* === Excluir === */
async function excluirItem(id) {
  if (!confirm('Deseja realmente excluir este arquivo?')) return
  const res = await fetch(`/api/media/${id}`, { method: 'DELETE' })
  if (res.ok) {
    items.value = items.value.filter(i => i.id !== id)
  } else {
    console.error('Erro ao excluir:', await res.json())
  }
}

/* === Renomear === */
async function renomearItem(id, novoNome) {
  const res = await fetch(`/api/media/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName: novoNome }),
  })
  if (res.ok) {
    const updated = await res.json()
    const idx = items.value.findIndex(i => i.id === id)
    if (idx !== -1) items.value[idx] = updated
  } else {
    console.error('Erro ao renomear:', await res.json())
  }
}

/* === Download === */
async function baixarItem(item) {
  const res = await fetch(`/api/media/download/${item.id}`);
  if (!res.ok) {
    console.error("Erro ao baixar");
    return;
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = item.fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}


/* === Filtro === */
const filteredItems = computed(() => {
  if (filter.value === 'all') return items.value
  if (filter.value === 'document') {
    return items.value.filter(i => !i.mimeType.startsWith('image/') && !i.mimeType.startsWith('video/'))
  }
  return items.value.filter(i => i.mimeType.startsWith(filter.value + '/'))
})

/* === Paginação === */
const totalPages = computed(() => Math.ceil(filteredItems.value.length / perPage))
const paginatedItems = computed(() => {
  const start = (page.value - 1) * perPage
  return filteredItems.value.slice(start, start + perPage)
})

/* === Carregar lista === */
async function carregarMidia() {
  const res = await fetch(`/api/media?page=${page.value}&pageSize=${perPage}`)
  const json = await res.json()
  items.value = json.items
}
onMounted(carregarMidia)

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

</script>
