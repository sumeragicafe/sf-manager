<script setup>
import { RouterView } from 'vue-router'

function toggleTheme() {
  document.documentElement.classList.toggle('dark')
}
</script>

<template>
  <div class="min-h-screen bg-ong-background text-ong-text">
    <!-- <button @click="toggleTheme"
      class="px-4 py-2 bg-ong-primary text-white rounded hover:opacity-90 transition">
      Alternar tema
    </button> -->

    <RouterView />
  </div>
</template>
