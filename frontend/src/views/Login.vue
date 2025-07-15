<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft } from 'lucide-vue-next';

const router = useRouter();

const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');

async function login() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await fetch('/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      errorMessage.value = err.message || 'Falha no login';
      loading.value = false;
      return;
    }

    const data = await response.json();
    localStorage.setItem('token', data.token); // <- ajuste aqui se o backend retornar outro nome
    router.push('/staff');
  } catch (error) {
    errorMessage.value = 'Erro ao conectar com o servidor';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen grid md:grid-cols-2 bg-ong-background font-body">
    <!-- Imagem -->
    <div class="relative hidden md:block h-screen">
      <img
        src="https://images.unsplash.com/photo-1663377561763-7ded59e09b9e?q=80&w=682&auto=format&fit=crop"
        alt="Cachorro adotado com carinho"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-ong-primary/20 backdrop-blur-sm"></div>
      <div class="absolute bottom-12 left-12 text-white space-y-2 max-w-xs">
        <h3 class="text-2xl font-heading font-bold drop-shadow">Doe amor, salve vidas</h3>
        <p class="text-sm drop-shadow">
          Cada doação ajuda um animal a encontrar um lar cheio de carinho. Junte-se a nós nessa missão.
        </p>
      </div>
    </div>

    <!-- Formulário -->
    <div class="flex items-center justify-center px-6 sm:px-12 py-12 animate-fade-in">
      <div class="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-lg">
        <div class="text-md">
          <RouterLink to="/" class="btn flex gap-2">
            <ArrowLeft class="w-5 h-5" /> Sair
          </RouterLink>
        </div>
        <div class="text-center">
          <h2 class="text-3xl font-bold text-ong-text font-heading">Bem-vindo de volta!</h2>
          <p class="text-sm text-ong-text/70">Acesse sua conta para continuar ajudando.</p>
        </div>

        <form @submit.prevent="login" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-ong-text" for="email">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="mt-1 block w-full px-4 py-2 border border-input rounded-md shadow-sm focus:ring-ong-primary focus:border-ong-primary"
              placeholder="voce@exemplo.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-ong-text" for="password">Senha</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="mt-1 block w-full px-4 py-2 border border-input rounded-md shadow-sm focus:ring-ong-primary focus:border-ong-primary"
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
            :disabled="loading"
            class="w-full bg-ong-primary text-white py-2 px-4 rounded-md hover:bg-ong-accent transition-transform duration-200 transform hover:scale-105"
          >
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>

          <p v-if="errorMessage" class="text-sm text-red-600 mt-2">{{ errorMessage }}</p>
        </form>

        <div class="text-center text-sm text-ong-text/70">
          Caso não tenha acesso, solicite ao administrador.
        </div>
      </div>
    </div>
  </div>
</template>
