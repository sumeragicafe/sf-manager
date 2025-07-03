<template>
  <section class="bg-ong-background py-16 px-4">
    <div class="container">
      <h2 class="text-3xl font-heading text-center text-ong-text mb-12">Parceiros:</h2>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-fade-in"
      >
        <div
          v-for="(partner, index) in partners"
          :key="index"
          class="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center transition hover:shadow-lg"
        >
          <div class="w-full h-24 bg-muted rounded-lg flex items-center justify-center overflow-hidden mb-4">
            <img
              :src="partner.image"
              :alt="`Logo de ${partner.name}`"
              class="object-contain max-h-full max-w-full"
            />
          </div>
          <p class="text-sm text-muted-foreground font-body">
            parceiro desde {{ partner.since }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const partners = [
  {
    name: 'Parceiro 1',
    image: '/imagens/parceiro1.png',
    since: 2023
  },
  {
    name: 'Parceiro 2',
    image: '/imagens/parceiro2.png',
    since: 2023
  },
  {
    name: 'Parceiro 3',
    image: '/imagens/parceiro3.png',
    since: 2024
  },
  {
    name: 'Parceiro 4',
    image: '/imagens/parceiro4.png',
    since: 2022
  }
];
</script>
