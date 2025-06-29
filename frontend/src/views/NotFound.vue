<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-4">404</h1>
      <p class="text-xl text-gray-600 mb-8">Oops! Página não encontrada</p>
      <RouterLink to="/" class="btn-primary group">
        Voltar para a Home
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { onMounted, watch } from 'vue'

const route = useRoute()

onMounted(() => {
  console.error(
    '404 Error: Usuário tentou acessar uma rota inexistente:',
    route.path
  )
})

watch(
  () => route.path,
  (newPath) => {
    console.error('404 Error: Caminho alterado para:', newPath)
  }
)
</script>
