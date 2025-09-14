<script setup>
import { ref, watch } from 'vue';
import MediaGrid from '@/views/Staff/media/components/MediaGrid.vue';
import MediaModal from '@/views/Staff/media/components/MediaModal.vue';

const props = defineProps({
  petId: String
});

// Estado das mídias
const items = ref([]);
const loading = ref(false);

// Modal
const modalOpen = ref(false);
const currentMedia = ref(null);
const modalIndex = ref(0);

// Funções do modal
function openModal(item, index) {
  currentMedia.value = item;
  modalIndex.value = index;
  modalOpen.value = true;
}

function prevMedia() {
  if (modalIndex.value > 0) {
    modalIndex.value--;
    currentMedia.value = items.value[modalIndex.value];
  }
}

function nextMedia() {
  if (modalIndex.value < items.value.length - 1) {
    modalIndex.value++;
    currentMedia.value = items.value[modalIndex.value];
  }
}

// Funções para rename, delete, download (podem chamar endpoints da API)
function renameItem(item, newName) {
  console.log('Renomear', item, newName);
}

function deleteMedia(item) {
  console.log('Deletar', item);
}

function downloadMedia(item) {
  console.log('Download', item);
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

// Buscar mídias usando fetch
async function fetchMedia() {
  if (!props.petId) return;
  loading.value = true;

  try {
    const response = await fetch(`/api/animal/${props.petId}/media`);
    if (!response.ok) throw new Error('Erro ao buscar mídias');

    const data = await response.json();
    console.log('data.items:', data.items);

    items.value = (data.items || []).map(item => ({
        ...item.media,
        type: item.type,
    }));
    console.log('items.value:', items.value);


  } catch (err) {
    console.error(err);
    items.value = [];
  } finally {
    loading.value = false;
  }
}

watch(() => props.petId, fetchMedia, { immediate: true });
</script>

<template>
  <div>
    <p v-if="loading">Carregando...</p>

    <template v-else>
        <MediaGrid
        v-if="items && items.length > 0"
        :items="items"
        @open-modal="openModal"
        />

        <p v-else>Nenhuma mídia encontrada.</p>
    </template>

    <MediaModal
        :open="modalOpen"
        :item="currentMedia"
        :disable-prev="modalIndex === 0"
        :disable-next="modalIndex === (items.value ? items.value.length - 1 : 0)"
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
