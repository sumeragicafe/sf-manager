<script setup>
import {ref} from 'vue';
import { X } from 'lucide-vue-next';

const props = defineProps({
  isOpen: Boolean,
  animal: Object
});
const emit = defineEmits(['close']);

const tabs = ['Visão Geral', 'Eventos', 'Adotantes', 'Fatos'];
const activeTab = ref('Visão Geral');

function closeModal() {
  emit('close');
}
</script>

<template>
  <div
    v-if="isOpen && animal"
    class="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fade-in"
  >
    <div
      class="bg-card rounded-2xl shadow-xl max-w-5xl w-full h-[90vh] flex overflow-hidden animate-scale-in"
    >
      <!-- Coluna da esquerda -->
      <div class="w-1/3 bg-ong-background p-6 flex flex-col items-center border-r overflow-y-auto">
        <img
          src="https://placekitten.com/400/400"
          alt="Animal"
          class="w-full h-64 object-cover rounded-lg shadow mb-4"
        />
        <h2 class="text-2xl font-heading text-ong-text">{{ animal.name }}</h2>
        <p class="text-muted-foreground">{{ animal.type }} • {{ animal.breed }}</p>

        <div class="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="font-semibold">Idade:</span>
            <p class="text-ong-text">{{ animal.age }}</p>
          </div>
          <div>
            <span class="font-semibold">Sexo:</span>
            <p class="text-ong-text">{{ animal.gender }}</p>
          </div>
          <div>
            <span class="font-semibold">Peso:</span>
            <p class="text-ong-text">{{ animal.weight }}</p>
          </div>
          <div>
            <span class="font-semibold">Status:</span>
            <p
              class="inline-block mt-1 px-2 py-0.5 text-xs rounded-full font-semibold bg-green-100 text-green-800"
            >
              {{ animal.status }}
            </p>
          </div>
        </div>

        <div class="mt-4 flex gap-2">
          <span
            class="px-2 py-0.5 text-xs rounded-full font-semibold"
            :class="animal.vaccinated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
          >
            {{ animal.vaccinated ? 'Vacinado' : 'Não vacinado' }}
          </span>
          <span
            class="px-2 py-0.5 text-xs rounded-full font-semibold"
            :class="animal.castrated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
          >
            {{ animal.castrated ? 'Castrado' : 'Não castrado' }}
          </span>
        </div>

        <div class="mt-6 w-full flex flex-col gap-2">
          <button class="px-4 py-2 bg-ong-primary text-white rounded-lg shadow hover:bg-ong-accent transition">
            Editar Animal
          </button>
          <button class="px-4 py-2 border rounded-lg hover:bg-muted">Compartilhar</button>
        </div>
      </div>

      <!-- Coluna da direita -->
      <div class="w-2/3 flex flex-col">
        <!-- Header -->
        <div class="flex justify-between items-center border-b px-6 py-4">
          <h3 class="text-lg font-heading text-ong-text">Detalhes do Animal</h3>
          <button @click="closeModal" class="hover:text-red-500 transition">
            <X class="w-6 h-6" />
          </button>
        </div>

        <!-- Tabs -->
        <div class="flex border-b px-6">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-4 py-2 text-sm font-semibold transition',
              activeTab === tab
                ? 'border-b-2 border-ong-primary text-ong-primary'
                : 'text-muted-foreground hover:text-foreground'
            ]"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Conteúdo -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- Visão Geral -->
          <div v-if="activeTab === 'Visão Geral'" class="space-y-6">
            <div class="border rounded-lg p-4 bg-background">
              <h4 class="font-heading text-lg mb-2">👥 Interessados Recentes</h4>
              <div class="space-y-2">
                <div class="flex justify-between border-b pb-2">
                  <div>
                    <p class="font-semibold">Ana Costa</p>
                    <p class="text-sm text-muted-foreground">ana@email.com</p>
                  </div>
                  <span class="text-sm text-muted-foreground">18/02/2024</span>
                </div>
                <div class="flex justify-between">
                  <div>
                    <p class="font-semibold">Pedro Lima</p>
                    <p class="text-sm text-muted-foreground">pedro@email.com</p>
                  </div>
                  <span class="text-sm text-muted-foreground">16/02/2024</span>
                </div>
              </div>
            </div>

            <div class="border rounded-lg p-4 bg-background">
              <h4 class="font-heading text-lg mb-2">📅 Próximos Eventos</h4>
              <p class="text-muted-foreground">Nenhum evento programado</p>
            </div>
          </div>

          <!-- Outros Tabs -->
          <div v-else class="text-muted-foreground">
            Conteúdo de {{ activeTab }} em construção...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
