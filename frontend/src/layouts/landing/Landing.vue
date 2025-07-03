<script setup>
import { RouterView } from 'vue-router';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
function toggleTheme() {
  document.documentElement.classList.toggle('dark')
}
</script>

<template>
  <div class="min-h-screen bg-ong-background text-ong-text">
    <Header></Header>
    <RouterView />
    <Footer></Footer>
  </div>
</template>
