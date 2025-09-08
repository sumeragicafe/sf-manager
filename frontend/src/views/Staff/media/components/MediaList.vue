<template>
  <div class="divide-y divide-border rounded-lg border border-border bg-card shadow-sm mt-4">
    <div v-if="items.length === 0" class="col-span-full flex justify-center">
      <div class="bg-card rounded-lg border p-4 w-full text-center">
        <p>Nenhum arquivo de mídia encontrado.</p>
      </div>
    </div>
    <div v-else v-for="item in items" :key="item.id" class="flex items-center p-2 gap-4 animate-fade-in hover:bg-muted/30 transition" @click="$emit('open-modal', item)">
      <img v-if="item.mimeType.startsWith('image/')" :src="`/api/media/view/${item.id}`" class="h-16 w-16 object-cover rounded" />
      <video v-else-if="item.mimeType.startsWith('video/')" controls class="h-16 w-16 rounded">
        <source :src="`/api/media/view/${item.id}`" :type="item.mimeType" />
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
</template>

<script setup>
const props = defineProps({ items: Array })
const emit = defineEmits(['open-modal'])
</script>
