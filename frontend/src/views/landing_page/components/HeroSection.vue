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
            Resgatando Vidas,
            <span class="text-ong-primary block sm:inline"> Criando Esperança</span>
          </h1>
          <p class="text-base sm:text-lg text-ong-text/80 leading-relaxed font-light">
            Há mais de X anos, trabalhamos incansavelmente para criar mudanças positivas 
            na vida de diversos animais, promovendo a saúde e prosperidade.
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
              <div class="text-2xl sm:text-3xl font-heading text-ong-primary">1K+</div>
              <div class="text-sm text-ong-text/70">Animais Resgatados</div>
            </div>
            <div class="text-center min-w-[100px]">
              <div class="text-2xl sm:text-3xl font-heading text-ong-primary">150+</div>
              <div class="text-sm text-ong-text/70">Eventos Realizados</div>
            </div>
            <div class="text-center min-w-[100px]">
              <div class="text-2xl sm:text-3xl font-heading text-ong-primary">25</div>
              <div class="text-sm text-ong-text/70">Voluntários</div>
            </div>
          </div>
        </div>

        <!-- Imagem -->
        <div class="relative animate-scale-in w-full">
          <div class="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1586178759683-87401d05f7d0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Filhotes de cachorro olhando para a câmera"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-ong-primary/20 to-transparent"></div>
          </div>

          <!-- Cartão flutuante -->
          <!-- Cartão flutuante -->
          <div
            class="absolute left-1/2 bottom-[-1.5rem] sm:left-[-5%] sm:bottom-[-1.5rem] transform -translate-x-1/2 sm:translate-x-0 bg-white p-4 sm:p-6 rounded-xl shadow-xl w-64"
          >

            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-ong-primary rounded-full flex items-center justify-center">
                <span class="text-white font-heading text-xl">🐾</span>
              </div>
              <div>
                <div class="font-heading text-ong-text text-base sm:text-lg">47</div>
                <div class="text-sm text-ong-text/70">Animais resgatados</div>
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
