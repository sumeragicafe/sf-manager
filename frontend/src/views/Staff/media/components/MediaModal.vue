<template>
  <div
    v-if="open"
    class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
  >
    <div
      class="bg-white rounded-xl p-6 w-[95vw] sm:w-[90vw] md:w-[80vw] lg:w-[70vw] max-w-6xl h-[90vh] sm:h-[85vh] relative shadow-lg flex flex-col"
    >
      <!-- Cabeçalho -->
      <div class="shrink-0 flex justify-between items-center mb-4 bg-card rounded-t-lg">
        <p class="font-heading font-bold text-lg text-ong-text truncate max-w-xs sm:max-w-sm">
          {{ item?.fileName || 'Sem nome' }}
        </p>
        <button @click="$emit('close')" aria-label="Fechar modal">
          <X />
        </button>
      </div>

      <!-- Área principal -->
      <div class="flex-1 min-h-0 flex flex-col">
        <div
          class="flex-1 min-h-0 border rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden relative"
        >
          <!-- IMAGE -->
          <div
            v-if="item?.mimeType?.startsWith('image/')"
            class="w-full h-full flex items-center justify-center overflow-auto"
          >
            <img
              :src="item.src"
              alt="Imagem no modal"
              class="max-w-full max-h-full object-contain transition-transform duration-200"
              :style="{ transform: `scale(${zoom}) translate(${translateX}px, ${translateY}px)` }"
            />
            <div
              class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-white/80 rounded-lg shadow px-3 py-2"
            >
              <button @click="zoomIn" aria-label="Aumentar zoom"><Plus /></button>
              <button @click="resetZoom" aria-label="Restaurar zoom"><RefreshCcw /></button>
              <button @click="zoomOut" aria-label="Diminuir zoom"><Minus /></button>
            </div>
          </div>

          <!-- PDF -->
          <div v-else-if="item?.mimeType?.startsWith('application/pdf')" class="w-full h-full">
            <iframe :src="item.src" class="w-full h-full" frameborder="0"></iframe>
          </div>

          <!-- VIDEO -->
          <div v-else-if="item?.mimeType?.startsWith('video/')" class="w-full h-full flex items-center justify-center">
            <video controls class="max-h-full max-w-full object-contain">
              <source :src="item.src" :type="item.mimeType" />
            </video>
          </div>

          <!-- TEXTO -->
          <div
            v-else-if="item?.mimeType?.startsWith('text/') || item?.mimeType?.includes('json')"
            class="w-full h-full flex flex-col p-4 overflow-auto"
          >
            <pre
              class="whitespace-pre-wrap text-sm font-mono text-gray-800"
            >{{ item.content || 'Carregando conteúdo do arquivo...' }}</pre>
          </div>

          <!-- OUTROS -->
          <div v-else class="flex items-center justify-center">
            <p class="text-lg font-medium">
              {{ item?.fileName || 'Arquivo não suportado' }}
            </p>
          </div>
        </div>

        <!-- Ações -->
        <div class="mt-4 shrink-0 flex justify-end gap-3 items-center border-t pt-3 bg-white">
          <span class="text-sm text-muted-foreground">
            <b>Tipo:</b> {{ item?.mimeType || 'Desconhecido' }}
          </span>
          <button class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300" @click="$emit('download', item)">Download</button>
          <button class="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600" @click="$emit('rename', item)">Renomear</button>
          <button class="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600" @click="$emit('delete', item)">Excluir</button>
        </div>
      </div>
    </div>

    <!-- Botão anterior -->
    <button
      class="absolute top-1/2 left-16 -translate-y-1/2 bg-white/70 hover:bg-white p-4 rounded-full shadow-md transition"
      @click="$emit('prev')"
      :disabled="disablePrev"
      aria-label="Anterior"
    >
      <ChevronLeft class="w-6 h-6 text-gray-700" />
    </button>

    <!-- Botão próximo -->
    <button
      class="absolute top-1/2 right-16 -translate-y-1/2 bg-white/70 hover:bg-white p-4 rounded-full shadow-md transition"
      @click="$emit('next')"
      :disabled="disableNext"
      aria-label="Próximo"
    >
      <ChevronRight class="w-6 h-6 text-gray-700" />
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { X, ChevronLeft, ChevronRight, Plus, Minus, RefreshCcw } from 'lucide-vue-next'

/* Props */
defineProps({
  open: Boolean,       // controla se modal está aberto
  item: Object,        // arquivo atual
  disablePrev: Boolean,
  disableNext: Boolean
})

/* Emits */
defineEmits(['close', 'next', 'prev', 'rename', 'delete', 'download'])

/* Zoom state */
const zoom = ref(1)
const translateX = ref(0)
const translateY = ref(0)

function zoomIn() { zoom.value = Math.min(zoom.value + 0.2, 5) }
function zoomOut() { zoom.value = Math.max(zoom.value - 0.2, 0.5) }
function resetZoom() {
  zoom.value = 1
  translateX.value = 0
  translateY.value = 0
}

</script>
