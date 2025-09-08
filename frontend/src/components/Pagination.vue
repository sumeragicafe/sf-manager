<template>
  <div class="flex justify-center items-center gap-3 mt-4">
    <button @click="$emit('prev')" :disabled="page === 1" class="px-3 py-1 border rounded-md bg-ong-secondary text-foreground hover:bg-ong-accent hover:text-white transition disabled:opacity-50">Anterior</button>
    <span class="text-sm">Página {{ page }} de {{ totalPages }}</span>
    <button @click="$emit('next')" :disabled="page === totalPages" class="px-3 py-1 border rounded-md bg-ong-secondary text-foreground hover:bg-ong-accent hover:text-white transition disabled:opacity-50">Próxima</button>
  </div>
</template>

<script setup>
const props = defineProps({ page: Number, totalPages: Number })
const emit = defineEmits(['prev','next'])
</script>
