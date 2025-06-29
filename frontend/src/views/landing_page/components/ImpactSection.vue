<template>
  <section id="impact" class="py-20 bg-gradient-to-br from-ong-background to-ong-secondary/30">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-ong-text mb-6">Nosso Impacto em Números</h2>
        <p class="text-lg text-ong-text/80">
          Cada número representa vidas transformadas e comunidades fortalecidas 
          através do trabalho dedicado de nossa equipe e voluntários.
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="(stat, index) in impactStats"
          :key="stat.label"
          class="text-center p-8 bg-white rounded-2xl shadow-lg card-hover animate-fade-in"
          :style="{ animationDelay: `${index * 0.2}s` }"
        >
          <div class="text-5xl font-heading text-ong-primary mb-4">{{ stat.number }}</div>
          <h4 class="text-ong-text mb-3">{{ stat.label }}</h4>
          <p class="text-ong-text/70 text-sm">{{ stat.description }}</p>
        </div>
      </div>

      <!-- Testimonial Carousel -->
      <div class="mt-20 max-w-4xl mx-auto">
        <div class="relative bg-white p-12 rounded-3xl shadow-xl text-center overflow-hidden">
          <!-- Navigation Arrows -->
          <button
            @click="prevTestimonial"
            class="absolute left-4 top-1/2 -translate-y-1/2 bg-ong-primary/10 hover:bg-ong-primary/20 text-ong-primary p-3 rounded-full transition-all duration-300 z-10"
          >
            <ChevronLeft :size="24" />
          </button>
          <button
            @click="nextTestimonial"
            class="absolute right-4 top-1/2 -translate-y-1/2 bg-ong-primary/10 hover:bg-ong-primary/20 text-ong-primary p-3 rounded-full transition-all duration-300 z-10"
          >
            <ChevronRight :size="24" />
          </button>

          <!-- Testimonial Content -->
          <div class="transition-all duration-500 ease-in-out">
            <div class="w-20 h-20 bg-ong-primary rounded-full mx-auto mb-6 overflow-hidden">
              <img
                :src="current.image"
                :alt="current.author"
                class="w-full h-full object-cover transition-all duration-500"
              />
            </div>
            <blockquote class="text-xl text-ong-text/80 italic mb-6 min-h-[120px] flex items-center justify-center">
              "{{ current.quote }}"
            </blockquote>
            <cite class="text-ong-primary font-heading text-lg">
              {{ current.author }}, {{ current.role }}
            </cite>
          </div>

          <!-- Indicators -->
          <div class="flex justify-center gap-2 mt-8">
            <button
              v-for="(_, index) in testimonials"
              :key="index"
              @click="currentTestimonial = index"
              :class="[
                'w-3 h-3 rounded-full transition-all duration-300',
                index === currentTestimonial ? 'bg-ong-primary' : 'bg-ong-primary/30'
              ]"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  image: string;
}

const currentTestimonial = ref(0);

const impactStats = [
  {
    number: '52,847',
    label: 'Crianças Educadas',
    description: 'Através de nossos programas educacionais',
  },
  {
    number: '1.2M',
    label: 'Refeições Servidas',
    description: 'Combatendo a fome em comunidades carentes',
  },
  {
    number: '340',
    label: 'Casas Construídas',
    description: 'Proporcionando moradia digna para famílias',
  },
  {
    number: '98%',
    label: 'Taxa de Sucesso',
    description: 'Dos nossos projetos atingem seus objetivos',
  },
];

const testimonials: Testimonial[] = [
  {
    quote:
      'A Hope Foundation mudou completamente a vida da nossa comunidade. Meus filhos agora têm acesso à educação de qualidade e nossa família tem um lar digno. Somos eternamente gratos.',
    author: 'Maria Silva',
    role: 'Beneficiária - São Paulo',
    image:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  },
  {
    quote:
      'Graças ao programa de capacitação profissional, consegui abrir minha própria padaria. Hoje posso sustentar minha família com dignidade e ainda gero empregos para outros da comunidade.',
    author: 'João Santos',
    role: 'Empreendedor - Rio de Janeiro',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  },
  {
    quote:
      'O trabalho voluntário aqui me transformou como pessoa. Ver o impacto direto na vida das famílias me motiva a continuar ajudando cada vez mais. É uma experiência única e gratificante.',
    author: 'Ana Costa',
    role: 'Voluntária - Minas Gerais',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  },
];

const current = computed(() => testimonials[currentTestimonial.value]);

const nextTestimonial = () => {
  currentTestimonial.value = (currentTestimonial.value + 1) % testimonials.length;
};

const prevTestimonial = () => {
  currentTestimonial.value =
    (currentTestimonial.value - 1 + testimonials.length) % testimonials.length;
};

let interval: ReturnType<typeof setInterval>;

onMounted(() => {
  interval = setInterval(nextTestimonial, 6000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>
