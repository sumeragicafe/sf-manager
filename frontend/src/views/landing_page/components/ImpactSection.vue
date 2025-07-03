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
    number: '436',
    label: 'Cachorros Resgatados',
  },
  {
    number: '321',
    label: 'Gatos Resgatados',
  },
  {
    number: '531',
    label: 'Vacinas Aplicadas',
  },
  {
    number: '98%',
    label: 'Taxa de Sucesso',
  },
];

const testimonials: Testimonial[] = [
  {
    quote:
      'Adotar a Mel foi a melhor decisão da minha vida. Ela trouxe alegria e amor para nossa casa. Sou imensamente grata ao abrigo por nos conectar!',
    author: 'Carla Menezes',
    role: 'Adotante - São Paulo',
    image:
      'https://images.unsplash.com/photo-1601758003122-58e5f2b8e0c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    quote:
      'Resgatamos o Thor após anos vivendo nas ruas. Hoje ele é o mascote da família e nosso companheiro inseparável!',
    author: 'Lucas Amaral',
    role: 'Adotante - Curitiba',
    image:
      'https://images.unsplash.com/photo-1597589824694-19639a6a8c99?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    quote:
      'Ser voluntária no abrigo me mostrou o quanto os animais têm amor para dar. Cada adoção é uma vitória!',
    author: 'Fernanda Ribeiro',
    role: 'Voluntária - Porto Alegre',
    image:
      'https://images.unsplash.com/photo-1583337130417-3346a1e2a5f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80',
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
