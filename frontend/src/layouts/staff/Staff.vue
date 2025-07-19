<template>
  <div class="min-h-screen bg-ong-background relative">
    <!-- Botão mobile -->
    <div class="lg:hidden fixed top-4 left-4 z-50">
      <button
        @click="sidebarOpen = true"
        class="p-2 rounded-lg bg-white shadow-lg text-ong-text hover:bg-gray-50"
      >
        <Menu size="20"></Menu>
      </button>
    </div>

    <!-- Sidebar Offcanvas -->
    <Sidebar :isOpen="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Overlay -->
    <transition name="fade">
      <div
        v-if="sidebarOpen"
        class="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
        @click="sidebarOpen = false"
      ></div>
    </transition>

    <!-- Conteúdo principal -->
    <div class="lg:ml-64 transition-all duration-300">
      <div class="p-6 lg:p-8">
        <RouterView></RouterView>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Menu } from 'lucide-vue-next';

import Sidebar from '@/layouts/staff/components/Sidebar.vue';

const sidebarOpen = ref(false);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
