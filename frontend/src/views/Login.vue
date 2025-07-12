<template>
  <div class="min-h-screen grid md:grid-cols-2 bg-ong-background font-body">
    
    <!-- Lado Esquerdo: Imagem com arte -->
    <div class="relative hidden md:block h-screen">
      <img
        src="https://images.unsplash.com/photo-1663377561763-7ded59e09b9e?q=80&w=682&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Cachorro adotado com carinho"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-ong-primary/20 backdrop-blur-sm"></div>

      <!-- Texto inspirador sobreposto -->
      <div class="absolute bottom-12 left-12 text-white space-y-2 max-w-xs">
        <h3 class="text-2xl font-heading font-bold drop-shadow">Doe amor, salve vidas</h3>
        <p class="text-sm drop-shadow">
          Cada doação ajuda um animal a encontrar um lar cheio de carinho. Junte-se a nós nessa missão.
        </p>
      </div>
    </div>

    <!-- Lado Direito: Formulário -->
    <div class="flex items-center justify-center px-6 sm:px-12 py-12 animate-fade-in">
        <div class="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-lg">
            
            <div class="text-md">
                <RouterLink to="/" class="btn flex gap-2">
                    <ArrowLeft class="w-5 h-5" />
                    Sair
                </RouterLink>
            </div>
            <div class="text-center">
            <h2 class="text-3xl font-bold text-ong-text font-heading">Bem-vindo de volta!</h2>
            <p class="text-sm text-ong-text/70">Acesse sua conta para continuar ajudando.</p>
            </div>

            <form @submit.prevent class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-ong-text" for="email">Email</label>
                <input
                id="email"
                type="email"
                required
                class="mt-1 block w-full px-4 py-2 border border-input rounded-md shadow-sm focus:ring-ong-primary focus:border-ong-primary outline-none transition"
                placeholder="voce@exemplo.com"
                />
            </div>

            <div>
                <label class="block text-sm font-medium text-ong-text" for="password">Senha</label>
                <input
                id="password"
                type="password"
                required
                class="mt-1 block w-full px-4 py-2 border border-input rounded-md shadow-sm focus:ring-ong-primary focus:border-ong-primary outline-none transition"
                placeholder="••••••••"
                />
            </div>

            <div class="flex items-center justify-between text-sm">
                <label class="flex items-center gap-2 text-ong-text/80">
                <input type="checkbox" class="accent-ong-primary" />
                Lembrar-me
                </label>
                <a href="#" class="text-ong-primary hover:underline">Esqueceu a senha?</a>
            </div>

            <button
                type="submit"
                class="w-full bg-ong-primary text-white py-2 px-4 rounded-md hover:bg-ong-accent transition-transform duration-200 transform hover:scale-105"
            >
                Entrar
            </button>
            </form>

            <div class="text-center text-sm text-ong-text/70">
            Caso não tenha acesso, solicite ao administrador.
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft } from 'lucide-vue-next'
import { RouterLink } from 'vue-router';
// Nenhum script necessário por enquanto
</script>
