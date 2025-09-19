<script setup>
import { onMounted, ref, watch } from 'vue';
import { verifyPermission } from '@/composables';
import { Search, Plus } from 'lucide-vue-next';
import Pagination from '@/components/Pagination.vue'
import MediaGrid from '@/views/Staff/media/components/MediaGrid.vue';
import MediaList from '@/views/Staff/media/components/MediaList.vue';
import MediaModal from '@/views/Staff/media/components/MediaModal.vue';
import BaseButton from '@/components/BaseButton.vue';

//import { showConfirm } from '@/utils/uiAlerts/confirm'
import { showToast } from '@/utils/uiAlerts/toast'


const props = defineProps({ petId: String });
const hasPermission = verifyPermission();

// Estado das mídias
const loading = ref(false);

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
const modalOpen = ref(false);
const currentMedia = ref(null);
const modalIndex = ref(0);

const fileInput = ref(null);

// Abrir modal
function openModal(item) {
  modalIndex.value = items.value.findIndex(i => i.id === item.id);
  currentMedia.value = item;
  modalOpen.value = true;
  carregarArquivo(items.value[modalIndex.value]);
}

// Navegação do modal
function prevMedia() {
  if (modalIndex.value > 0) {
    modalIndex.value--;
    currentMedia.value = items.value[modalIndex.value];
    carregarArquivo(items.value[modalIndex.value])
  }
}

function nextMedia() {
  if (modalIndex.value < items.value.length - 1) {
    modalIndex.value++;
    currentMedia.value = items.value[modalIndex.value];
    carregarArquivo(items.value[modalIndex.value])
  }
}

// Buscar mídias
async function fetchMedia() {
  if (!props.petId) return;
  //loading.value = true;

  try {
    // Cria objeto de filtros
    const filters = {};
    if (search.value) filters.search = search.value;
    if (filter.value && filter.value !== 'all') filters.type = filter.value;

    const params = new URLSearchParams({
      page: page.value.toString(),
      pageSize: pageSize.value.toString(),
      filters: JSON.stringify(filters)
    });

    const res = await fetch(`/api/animal/${props.petId}/media?${params.toString()}`);
    if (!res.ok) throw new Error('Erro ao buscar mídias');

    const json = await res.json();
    page.value = json.page;
    total.value = json.total;
    items.value = (json.items || []).map(item => ({
      ...item.media,
      type: item.type,
      src: `/api/media/view/${item.media.id}`
    }));
  } catch (err) {
    console.error(err);
    items.value = [];
  } finally {
    loading.value = false;
  }
}


// Upload
async function uploadMedia(file) {
  if (!props.petId || !file) return alert("Selecione um arquivo.");

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch(`/api/animal/${props.petId}/media/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Erro ao enviar mídia');

    const uploaded = await res.json();
    // items.value.unshift({
    //   ...uploaded.media,
    //   type: uploaded.type
    // });
    if (res.ok) { await fetchMedia(); showToast({ icon: 'success', title: 'Arquivo enviado!' }) }
  
  } catch (err) {
    console.error(err);
    alert('Falha ao enviar arquivo.');
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

async function handleFileChange(event) {
  const files = event.target.files;
  if (!files.length) return;

  for (const file of files) {
    await uploadMedia(file); // chama sua função existente
  }

  event.target.value = ''; // limpa para permitir upload do mesmo arquivo novamente
}

function triggerFileInput() {
  if (fileInput.value) {
    fileInput.value.click();
  }
}

onMounted(()=>{
  loading.value = true;
  fetchMedia();
})

watch([page, pageSize, filter, search], () => {
  fetchMedia();
})

</script>

<template>
  <div>
    <p v-if="loading">Carregando...</p>
    <template v-else>
      <!-- Navbar -->
      <div>
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
              :onClick="triggerFileInput"
              :icon="Plus"
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
          @update:pageSize="val => { pageSize = val; page = 1 }"
          @update:search="val => {search = val}"
        />
      </div>

      <!-- Grid de mídias -->
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

      <p v-else>Nenhuma mídia encontrada.</p>
    </template>

    <!-- Modal -->
    <MediaModal
      :open="modalOpen"
      :item="currentMedia"
      :disable-prev="modalIndex === 0"
      :disable-next="modalIndex === items.length - 1"
      @close="modalOpen = false"
      @prev="prevMedia"
      @next="nextMedia"
    />
  </div>
</template>
