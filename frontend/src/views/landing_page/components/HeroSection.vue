<template>
  <section
    id="home"
    class="relative bg-gradient-to-br from-ong-background to-white py-20 overflow-hidden"
  >
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <!-- Conteúdo -->
        <div class="space-y-6 animate-fade-in text-center md:text-left">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl leading-tight font-black text-ong-text">
            Transformando Vidas,
            <span class="text-ong-primary block sm:inline"> Construindo Esperança</span>
          </h1>
          <p class="text-base sm:text-lg text-ong-text/80 leading-relaxed font-light">
            Há mais de 10 anos, trabalhamos incansavelmente para criar mudanças positivas 
            em comunidades ao redor do mundo através de educação, saúde e desenvolvimento sustentável.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
            <button class="btn-primary group">
              Faça a Diferença
              <ArrowRight class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button class="btn-secondary">
              Conheça Nossos Projetos
            </button>
          </div>

          <!-- Estatísticas -->
          <div class="flex flex-wrap gap-8 pt-8 justify-center md:justify-start">
            <div class="text-center min-w-[100px]">
              <div class="text-2xl sm:text-3xl font-heading text-ong-primary">50K+</div>
              <div class="text-sm text-ong-text/70">Vidas Impactadas</div>
            </div>
            <div class="text-center min-w-[100px]">
              <div class="text-2xl sm:text-3xl font-heading text-ong-primary">150+</div>
              <div class="text-sm text-ong-text/70">Projetos Ativos</div>
            </div>
            <div class="text-center min-w-[100px]">
              <div class="text-2xl sm:text-3xl font-heading text-ong-primary">25</div>
              <div class="text-sm text-ong-text/70">Países</div>
            </div>
          </div>
        </div>

        <!-- Imagem -->
        <div class="relative animate-scale-in w-full">
          <div class="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Crianças sorrindo em projeto educacional"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-ong-primary/20 to-transparent"></div>
          </div>

          <!-- Cartão flutuante -->
          <div
            class="absolute left-1/2 bottom-[-1.5rem] sm:left-auto sm:bottom-[-1.5rem] sm:-left-6 transform -translate-x-1/2 sm:translate-x-0 bg-white p-4 sm:p-6 rounded-xl shadow-xl w-64"
          >
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-ong-primary rounded-full flex items-center justify-center">
                <span class="text-white font-heading text-xl">💝</span>
              </div>
              <div>
                <div class="font-heading text-ong-text text-base sm:text-lg">R$ 125.430</div>
                <div class="text-sm text-ong-text/70">Arrecadado este mês</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ArrowRight } from 'lucide-vue-next'
</script>
