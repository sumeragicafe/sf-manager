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
import MissionSection from '@/views/Landing/nossa-historia/components/MissionSection.vue'
import CarouselSection from '@/views/Landing/nossa-historia/components/CarouselSection.vue'
import ActivitiesSection from '@/views/Landing/nossa-historia/components/ActivitiesSection.vue'
</script>
