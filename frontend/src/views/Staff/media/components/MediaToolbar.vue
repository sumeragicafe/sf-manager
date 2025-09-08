<template>
  <div class="flex flex-col md:flex-row justify-end md:items-center gap-4">
    <div class="flex gap-2">

      <input
        v-model="localSearch"
        @input="$emit('change-search', localSearch)"
        class="border rounded-md p-2"
        type="text"
        placeholder="Pesquisa"
      />

      <select v-model="localPerPage" @change="changePerPage" class="border border-border rounded-md px-3 py-1 bg-card text-card-foreground shadow-sm">
        <option :value="24">24 por página</option>
        <option :value="32">32 por página</option>
        <option :value="48">48 por página</option>
        <option :value="64">64 por página</option>
      </select>

      <input type="file" ref="fileInput" class="hidden" @change="onFileChange" />

      <select v-model="localView" @change="$emit('change-view', localView)" class="border border-border rounded-md px-3 py-1 bg-card text-card-foreground shadow-sm">
        <option value="grid">Grade</option>
        <option value="list">Lista</option>
      </select>

      <select v-model="localFilter" @change="$emit('change-filter', localFilter)" class="border border-border rounded-md px-3 py-1 bg-card text-card-foreground shadow-sm">
        <option value="all">Todos</option>
        <option value="image">Imagens</option>
        <option value="video">Vídeos</option>
        <option value="document">Documentos</option>
      </select>

      <button @click="triggerUpload" class="px-4 py-2 rounded-lg bg-ong-primary text-white font-semibold shadow-sm hover:bg-ong-accent transition">
        Upload de Arquivos
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({ perPage: Number, view: String, filter: String, search: String })
const emit = defineEmits(['change-per-page','change-view','change-filter','upload', 'change-search'])

const localSearch = ref(props.search)
const localPerPage = ref(props.perPage)
const localView = ref(props.view)
const localFilter = ref(props.filter)

watch(() => props.search, val => localSearch.value = val)
watch(() => props.perPage, val => localPerPage.value = val)
watch(() => props.view, val => localView.value = val)
watch(() => props.filter, val => localFilter.value = val)

function changePerPage() { emit('change-per-page', localPerPage.value) }
const fileInput = ref(null)
function triggerUpload() { fileInput.value.click() }
function onFileChange(e) { const file = e.target.files[0]; if (file) emit('upload', file) }
</script>
