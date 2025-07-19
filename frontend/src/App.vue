<script setup>
import { RouterView } from 'vue-router'

function toggleTheme() {
  document.documentElement.classList.toggle('dark')
}
</script>

<template>
  <RouterView/>
</template>
