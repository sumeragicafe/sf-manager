<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  petId: {
    type: String,
    required: true
  }
});

const images = ref([]);
const currentIndex = ref(0);
const loading = ref(true);
const error = ref(null);

async function fetchImages() {
  try {
    loading.value = true;

    // Monta a URL com query params usando URL
    const url = new URL(`/api/animal/${props.petId}/media`, window.location.origin);
    url.searchParams.append('page', '1');
    url.searchParams.append('pageSize', '20');
    url.searchParams.append('filters', JSON.stringify({ isPublic: true }));

    // Fetch nativo
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Erro ao carregar imagens');

    const data = await res.json();

    console.log(data);

    images.value = data.items
      .map(item => `/api/media/view/${item.media.id}`);
  } catch (e) {
    error.value = 'Erro ao carregar imagens.';
    console.error(e);
  } finally {
    loading.value = false;
  }
}

function prev() {
  if (images.value.length === 0) return;
  currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length;
}

function next() {
  if (images.value.length === 0) return;
  currentIndex.value = (currentIndex.value + 1) % images.value.length;
}

onMounted(fetchImages);
</script>

<template>
  <div class="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
    <div v-if="loading" class="text-gray-500">Carregando...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="images.length === 0" class="text-gray-500">Nenhuma imagem pública</div>
    <div v-else class="w-full h-full relative">
      <img
        :src="images[currentIndex]"
        alt="Animal"
        class="w-full h-full object-cover transition duration-500"
      />

      <!-- Botão Prev -->
      <button
        @click="prev"
        class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition"
      >
        ‹
      </button>

      <!-- Botão Next -->
      <button
        @click="next"
        class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition"
      >
        ›
      </button>

      <!-- Indicadores -->
      <div class="absolute bottom-2 w-full flex justify-center gap-1">
        <span
          v-for="(img, i) in images"
          :key="i"
          class="w-2 h-2 rounded-full"
          :class="i === currentIndex ? 'bg-white' : 'bg-white/50'"
        />
      </div>
    </div>
  </div>
</template>
