<template>
  <div class="animate-fade-in">
    <h2 class="text-2xl sm:text-3xl font-heading font-bold mb-8 text-center">Que atividades realizamos?</h2>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <ActivityCard
        title="Adoção e Lar Temporário"
        icon="🐾"
      />
      <ActivityCard
        title="Resgate e Cuidado"
        icon="🚑"
      />
      <ActivityCard
        title="Acompanhamento e Apoio Pós-Adoção"
        icon="📋"
      />
    </div>
  </div>
</template>

<script setup>
import ActivityCard from './ActivityCard.vue'
</script>
