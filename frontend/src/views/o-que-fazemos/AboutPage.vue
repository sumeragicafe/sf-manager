<template>
  <section class="bg-ong-background text-ong-text min-h-screen">
    <div class="container py-12 space-y-16">
      <MissionSection />
      <CarouselSection />
      <ActivitiesSection />
    </div>
  </section>
</template>

<script setup>
import MissionSection from './components/MissionSection.vue'
import CarouselSection from './components/CarouselSection.vue'
import ActivitiesSection from './components/ActivitiesSection.vue'
</script>
