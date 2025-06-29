<template>
  <header class="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 rounded-xl">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center space-x-2">
          <div class="w-10 h-10 bg-ong-primary rounded-full flex items-center justify-center">
            <Heart class="w-6 h-6 text-white" />
          </div>
          <h4 class="text-2xl font-heading text-ong-text ">ONG São Francisco</h4>
        </div>

        <!-- Navegação Desktop -->
        <nav class="hidden md:flex space-x-8">
          <a
            v-for="item in navItems"
            :key="item.name"
            :href="item.href"
            class="text-ong-text hover:text-ong-primary transition-colors duration-300 font-medium"
          >
            {{ item.name }}
          </a>
        </nav>

        <!-- Botões CTA (Desktop) -->
        <div class="hidden md:flex space-x-4">
          <button class="btn-secondary">Voluntário</button>
          <button class="btn-primary">Doar Agora</button>
        </div>

        <!-- Botão menu mobile -->
        <button class="md:hidden p-2" @click="isMenuOpen = !isMenuOpen">
          <component
            :is="isMenuOpen ? X : Menu"
            class="w-6 h-6 text-ong-text"
          />
        </button>
      </div>

      <!-- Menu mobile -->
      <div v-if="isMenuOpen" class="md:hidden py-4 animate-fade-in">
        <nav class="flex flex-col space-y-4">
          <a
            v-for="item in navItems"
            :key="item.name"
            :href="item.href"
            class="text-ong-text hover:text-ong-primary transition-colors duration-300 font-medium py-2"
            @click="isMenuOpen = false"
          >
            {{ item.name }}
          </a>
          <div class="flex flex-col space-y-2 pt-4">
            <button class="btn-secondary">Voluntário</button>
            <button class="btn-primary">Doar Agora</button>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { Menu, X, Heart } from 'lucide-vue-next'

const isMenuOpen = ref(false)

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'Nossa Causa', href: '#mission' },
  { name: 'Projetos', href: '#projects' },
  { name: 'Impacto', href: '#impact' },
  { name: 'Eventos', href: '#events' },
  { name: 'Parcerias', href: '#partners' }
]
</script>
