<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-heading font-bold text-ong-text">Biblioteca de Mídia</h1>
        <p class="text-muted-foreground mt-2">Gerencie imagens e arquivos</p>
      </div>
    </div>

      <!-- Botão de Upload -->
      <div class="flex items-center gap-2">
        <input 
          ref="fileInput" 
          type="file" 
          class="hidden" 
          @change="handleFileChange"
          multiple
        />
          <BaseButton
            :icon="Upload"
            :onClick="triggerFileInput"
            text="Upload"
            variant="primary"
          />
      </div>

    <Pagination
      :total="total"
      :page="page"
      :pageSize="pageSize"
      :view="{
        label: 'Visualização',
        value: view,
        options: [
          { label: 'Grade', value: 'grid' },
          { label: 'Lista', value: 'list' }
        ]
      }"
      :search="search"
      :filter="{
        label: 'Tipo',
        value: filter,
        options: [
          { label: 'Todos', value: 'all' },
          { label: 'Imagens', value: 'image' },
          { label: 'Vídeos', value: 'video' },
          { label: 'Documentos', value: 'document' }
        ]
      }"
      @change-view="val => { view = val }"
      @change-filter="val => { filter = val; page = 1 }"
      @update:page="val => { page = val }"
      @update:pageSize="val => { perPage = val; page = 1 }"
      @update:search="val => {search = val}"
    />


    <!-- <MediaToolbar
      :per-page="pageSize"
      :view="view"
      :filter="filter"
      @change-search="val => { search = val; page = 1; fetchMedia() }"
      @change-per-page="changePerPage"
      @change-view="val => view = val"
      @change-filter="val => filter = val"
      @upload="uploadFile"
    /> -->

    <MediaGrid
      v-if="view === 'grid'"
      :items="items"
      @open-modal="openModal"
    />

    <MediaList
      v-else
      :items="items"
      @open-modal="openModal"
    />

    <MediaModal
      :open="modalOpen"
      :item="currentMedia"
      :disable-prev="modalIndex === 0"
      :disable-next="modalIndex === items.length - 1"
      @close="modalOpen = false"
      @prev="prevMedia"
      @next="nextMedia"
      @rename="renameItem"
      @delete="deleteMedia"
      @download="downloadMedia"
      @togglePublic="togglePublic"
    />

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import {Upload} from "lucide-vue-next"
import MediaGrid from '@/views/Staff/media/components/MediaGrid.vue'
import MediaList from '@/views/Staff/media/components/MediaList.vue'
import MediaModal from '@/views/Staff/media/components/MediaModal.vue'
import BaseButton from '@/components/BaseButton.vue'
import Pagination from '@/components/Pagination.vue'
import Swal from 'sweetalert2'
import { showConfirm } from '@/utils/uiAlerts/confirm'
import { showToast } from '@/utils/uiAlerts/toast'

// Pagination
const items = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(20);

// Options & Filters
const view = ref('grid');
const filter = ref('all');
const search = ref(null);

// Modal
const modalOpen = ref(false)
const currentMedia = ref(null)
const modalIndex = ref(null)

const fileInput = ref(null);

async function fetchMedia() {
  const params = new URLSearchParams({
    page: page.value,
    pageSize: pageSize.value,
    type: filter.value,
    search: search.value || ''
  })
  const res = await fetch(`/api/media?${params.toString()}`)
  const json = await res.json()
  items.value = json.items
  page.value = json.page
  total.value = json.total

  console.log(`Page value: ${page.value}, items value: ${items.value}, page value: ${page.value}`);
}

onMounted(fetchMedia)
watch([page, pageSize, filter, search], () => {
  fetchMedia()
})

// Modal
function openModal(item) {
  modalIndex.value = items.value.findIndex(i => i.id === item.id)
  currentMedia.value = item
  modalOpen.value = true
  carregarArquivo(items.value[modalIndex.value])
}

function prevMedia() {
  if (modalIndex.value > 0) modalIndex.value--
  currentMedia.value = items.value[modalIndex.value]
  carregarArquivo(items.value[modalIndex.value])
}
function nextMedia() {
  if (modalIndex.value < items.value.length - 1) modalIndex.value++
  currentMedia.value = items.value[modalIndex.value]
  carregarArquivo(items.value[modalIndex.value])
}

// Actions
async function downloadMedia(media) {
  const res = await fetch(`/api/media/download/${media.id}`)
  if (!res.ok) return
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = media.fileName
  a.click()
  URL.revokeObjectURL(url)
}

async function togglePublic(item) {
  console.log(item);
  try {
    const res = await fetch(`/api/media/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublic: item.isPublic })
    });

    if (!res.ok) throw new Error('Erro ao atualizar visibilidade');

    const updated = await res.json();
    item.isPublic = updated.isPublic; // garante que o estado local esteja correto
  } catch (err) {
    console.error('Falha ao alterar visibilidade:', err);
    alert('Não foi possível alterar a visibilidade do arquivo.');
    // Reverter o checkbox se falhar
    item.isPublic = !item.isPublic;
  }
}


async function carregarArquivo(item) {
  try {
    const res = await fetch(`/api/media/${item.id}`)
    const file = await res.json()
    let src = '', content = null

    if (file.mimeType.startsWith('image/') || file.mimeType.startsWith('video/')) {
      const base64 = btoa(new Uint8Array(file.data.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
      src = `data:${file.mimeType};base64,${base64}`
    } else if (file.mimeType.startsWith('application/pdf')) {
      const pdfRes = await fetch(`/api/media/view/${item.id}`)
      const blob = await pdfRes.blob()
      src = URL.createObjectURL(blob)
    } else if (file.mimeType.startsWith('text/') || file.mimeType === 'application/json') {
      const decoder = new TextDecoder('utf-8')
      content = decoder.decode(new Uint8Array(file.data.data))
      if (file.mimeType === 'application/json') {
        try { content = JSON.stringify(JSON.parse(content), null, 2) } catch {}
      }
    }

    currentMedia.value = { ...file, src, content }
    modalOpen.value = true
    resetZoom()
  } catch (err) {
    console.error('Erro ao abrir arquivo:', err)
  }
}

async function renameMedia(media) {
  const { value: name } = await Swal.fire({
    title: 'Renomear arquivo',
    input: 'text',
    inputValue: media.fileName
  })
  if (!name) return
  const res = await fetch(`/api/media/${media.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName: name })
  })
  if (res.ok) {
    await fetchMedia()
    Swal.fire('Salvo!', 'Nome atualizado.', 'success')
  }
}

async function renameItem(item) {
  console.log(item);
  const { value: novoNome } = await Swal.fire({
    title: `<h2 class="font-heading text-2xl font-bold text-ong-text">Renomear arquivo</h2>`,
    html: `
      <input 
        id="swal-input1" 
        class="swal2-input w-[50vh] mt-4 rounded-2xl border border-ong-text bg-ong-background text-ong-text text-base px-4 py-2 focus:ring-2 focus:ring-ong-primary focus:border-ong-primary transition-all" 
        placeholder="Novo nome" 
        value="${item.fileName}"
      >
    `,
    showCancelButton: true,
    confirmButtonText: 'Salvar',
    cancelButtonText: 'Cancelar',
    focusConfirm: false,
    customClass: {
      popup: 'rounded-2xl shadow-lg bg-ong-background text-ong-text animate-scale-in',
      confirmButton: 'bg-ong-primary text-white font-bold px-4 py-2 rounded-xl hover:bg-ong-accent transition-all',
      cancelButton: 'bg-ong-secondary text-ong-text px-4 py-2 rounded-xl hover:text-ong-secondary transition-all',
    },
    preConfirm: () => document.getElementById('swal-input1').value
  })

  if (novoNome) {
    await renameMedia(item.id, novoNome);
    Swal.fire({
      icon: 'success',
      title: 'Salvo!',
      text: 'O nome do arquivo foi atualizado.',
      customClass: {
        popup: 'rounded-2xl shadow-md bg-ong-background text-ong-text animate-fade-in',
        confirmButton: 'bg-ong-primary text-white px-4 py-2 rounded-xl'
      },
      timer: 2000,
      showConfirmButton: false
    });
  }
};

async function deleteMedia(media) {
  const confirmed = await showConfirm({ text: 'Deseja excluir este arquivo?' })
  if (!confirmed) return
  const res = await fetch(`/api/media/${media.id}`, { method: 'DELETE' })
  if (res.ok) { await fetchMedia(); Swal.fire('Excluído!', '', 'success') }
}

// Upload
async function handleFileChange(event) {
  const files = event.target.files;
  if (!files.length) return;

  for (const file of files) {
    await uploadFile(file); // chama sua função existente
  }

  event.target.value = ''; // limpa para permitir upload do mesmo arquivo novamente
}

async function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch('/api/media', { method: 'POST', body: formData })
  if (res.ok) { await fetchMedia(); showToast({ icon: 'success', title: 'Arquivo enviado!' }) }
}

function triggerFileInput() {
  if (fileInput.value) {
    fileInput.value.click();
  }
}

</script>
