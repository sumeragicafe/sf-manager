<script setup>
import { RouterView } from 'vue-router';
import Header from '@/layouts/landing/components/Header.vue';
import Footer from '@/layouts/landing/components/Footer.vue';

function toggleTheme() {
  document.documentElement.classList.toggle('dark')
}
</script>

<template>
  <div class="min-h-screen bg-ong-background text-ong-text">
    <Header></Header>
    <div class="bg-ong-background h-full">
      <RouterView />
    </div>
    <Footer></Footer>
  </div>
</template>
