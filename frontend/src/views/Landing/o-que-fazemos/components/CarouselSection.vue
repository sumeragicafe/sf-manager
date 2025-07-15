<template>
  <div class="relative w-full max-w-6xl mx-auto overflow-hidden">
    <!-- Slides -->
    <div class="relative w-full h-64 sm:h-[480px]">
      <transition-group name="fade" mode="out-in" tag="div" class="relative w-full h-full">
        <img
          v-for="(img, index) in images"
          v-show="currentIndex === index"
          :key="img"
          :src="img"
          class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out"
          alt="Slide"
        />
      </transition-group>
    </div>

    <!-- Indicadores -->
    <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
      <button
        v-for="(img, index) in images"
        :key="index"
        @click="goTo(index)"
        class="h-[3px] w-[30px] bg-white/60 rounded transition-all duration-300"
        :class="{
          'bg-ong-primary opacity-100': currentIndex === index,
          'opacity-50': currentIndex !== index
        }"
      />
    </div>

    <!-- Botão anterior -->
    <button
      @click="prev"
      class="absolute left-0 top-0 bottom-0 z-10 flex items-center justify-center w-[15%] text-white hover:opacity-90 transition"
    >
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.75 19.5L8.25 12l7.5-7.5" />
      </svg>
    </button>

    <!-- Botão próximo -->
    <button
      @click="next"
      class="absolute right-0 top-0 bottom-0 z-10 flex items-center justify-center w-[15%] text-white hover:opacity-90 transition"
    >
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const images = [
  'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=1170&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1444212477490-ca407925329e?q=80&w=1528&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1700408273757-b3e190a2dfa2?q=80&w=687&auto=format&fit=crop'
]

const currentIndex = ref(0)

function next() {
  currentIndex.value = (currentIndex.value + 1) % images.length
}

function prev() {
  currentIndex.value = (currentIndex.value - 1 + images.length) % images.length
}

function goTo(index) {
  currentIndex.value = index
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
