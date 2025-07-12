<template>
  <div class="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
    <div class="text-4xl mb-4">{{ icon }}</div>
    <h3 class="font-bold text-lg text-ong-text">{{ title }}</h3>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  icon: String
})
</script>
