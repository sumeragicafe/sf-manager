<script setup>
import { ref, watch } from 'vue'
import { X, Calendar, Users, Heart, FileText, Edit, Share } from 'lucide-vue-next'

const props = defineProps({
  animal: Object,
  isOpen: Boolean
})

const emit = defineEmits(['close'])
const activeTab = ref('overview')

watch(() => props.isOpen, (val) => {
  if (!val) activeTab.value = 'overview'
})

const mockEvents = [
  { id: 1, title: 'Feira de Adoção - Shopping Center', date: '2024-02-20', status: 'Participou' },
  { id: 2, title: 'Campanha de Vacinação', date: '2024-02-15', status: 'Participou' },
  { id: 3, title: 'Evento de Castração', date: '2024-01-30', status: 'Participou' }
]

const mockAdopters = [
  { id: 1, name: 'Maria Silva', email: 'maria@email.com', phone: '(11) 99999-9999', status: 'Em análise', date: '2024-02-18' },
  { id: 2, name: 'João Santos', email: 'joao@email.com', phone: '(11) 88888-8888', status: 'Aprovado', date: '2024-02-16' },
]

const mockInterested = [
  { id: 1, name: 'Ana Costa', email: 'ana@email.com', phone: '(11) 77777-7777', date: '2024-02-19' },
  { id: 2, name: 'Pedro Lima', email: 'pedro@email.com', phone: '(11) 66666-6666', date: '2024-02-17' },
]

const mockFacts = [
  { id: 1, text: 'Esse animal foi encontrado em estado de abandono na região central da cidade', date: '2024-01-15' },
  { id: 2, text: 'Passou por cirurgia de castração com sucesso', date: '2024-01-30' },
  { id: 3, text: 'Muito sociável com outros animais e crianças', date: '2024-02-01' },
  { id: 4, text: 'Completou ciclo de vacinação', date: '2024-02-10' }
]

function getStatusColor(status) {
  switch (status) {
    case 'Disponível': return 'bg-green-100 text-green-800';
    case 'Em processo': return 'bg-yellow-100 text-yellow-800';
    case 'Adotado': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-lg shadow-lg flex">

      <!-- Left: animal info -->
      <div class="w-1/3 bg-gray-50 p-6 border-r">
        <div class="aspect-square rounded-lg overflow-hidden bg-gray-200 mb-4">
          <img
            :src="`https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop`"
            :alt="animal.name"
            class="w-full h-full object-cover"
          />
        </div>

        <h2 class="text-2xl font-bold text-gray-800">{{ animal.name }}</h2>
        <p class="text-sm text-gray-600">{{ animal.type }} • {{ animal.breed }}</p>

        <div class="grid grid-cols-2 gap-2 text-sm mt-4">
          <div>
            <span class="text-gray-500">Idade:</span>
            <p class="font-medium">{{ animal.age }}</p>
          </div>
          <div>
            <span class="text-gray-500">Sexo:</span>
            <p class="font-medium">{{ animal.gender }}</p>
          </div>
          <div>
            <span class="text-gray-500">Peso:</span>
            <p class="font-medium">{{ animal.weight }}</p>
          </div>
          <div>
            <span class="text-gray-500">Status:</span>
            <span :class="['text-xs font-semibold px-2 py-0.5 rounded-full', getStatusColor(animal.status)]">
              {{ animal.status }}
            </span>
          </div>
        </div>

        <div class="mt-4">
          <p class="text-sm text-gray-500">Saúde:</p>
          <div class="flex flex-wrap gap-2 mt-1">
            <span :class="['text-xs px-2 py-0.5 rounded-full', animal.vaccinated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800']">
              {{ animal.vaccinated ? 'Vacinado' : 'Não vacinado' }}
            </span>
            <span :class="['text-xs px-2 py-0.5 rounded-full', animal.castrated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800']">
              {{ animal.castrated ? 'Castrado' : 'Não castrado' }}
            </span>
          </div>
        </div>

        <div class="pt-6 space-y-2">
          <button class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2">
            <Edit class="w-4 h-4" /> Editar Animal
          </button>
          <button class="w-full border py-2 px-4 rounded flex items-center justify-center gap-2">
            <Share class="w-4 h-4" /> Compartilhar
          </button>
        </div>
      </div>

      <!-- Right: Tabs -->
      <div class="flex-1 flex flex-col">
        <div class="flex items-center justify-between px-6 pt-6 pb-2">
          <h3 class="text-lg font-semibold">Detalhes do Animal</h3>
          <button @click="() => emit('close')" class="p-2 rounded hover:bg-gray-100">
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="px-6">
          <div class="flex border-b mb-4">
            <button :class="['flex-1 py-2 text-center', activeTab === 'overview' ? 'border-b-2 border-blue-600 text-blue-600' : '']" @click="activeTab = 'overview'">Visão Geral</button>
            <button :class="['flex-1 py-2 text-center', activeTab === 'events' ? 'border-b-2 border-blue-600 text-blue-600' : '']" @click="activeTab = 'events'">Eventos</button>
            <button :class="['flex-1 py-2 text-center', activeTab === 'adopters' ? 'border-b-2 border-blue-600 text-blue-600' : '']" @click="activeTab = 'adopters'">Adotantes</button>
            <button :class="['flex-1 py-2 text-center', activeTab === 'facts' ? 'border-b-2 border-blue-600 text-blue-600' : '']" @click="activeTab = 'facts'">Fatos</button>
          </div>

          <div v-if="activeTab === 'overview'" class="space-y-4">
            <div class="bg-gray-50 rounded p-4">
              <h4 class="font-medium text-gray-800 mb-2">Interessados Recentes</h4>
              <div v-for="person in mockInterested" :key="person.id" class="flex justify-between items-center text-sm border-b last:border-b-0 py-2">
                <div>
                  <p class="font-medium">{{ person.name }}</p>
                  <p class="text-xs text-gray-500">{{ person.email }}</p>
                </div>
                <div class="text-xs text-gray-400">{{ new Date(person.date).toLocaleDateString('pt-BR') }}</div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'events'" class="space-y-4">
            <div class="bg-gray-50 rounded p-4">
              <h4 class="font-medium text-gray-800 mb-2">Histórico de Eventos</h4>
              <div v-for="event in mockEvents" :key="event.id" class="flex justify-between items-center text-sm border-b last:border-b-0 py-2">
                <div>
                  <p class="font-medium">{{ event.title }}</p>
                  <p class="text-xs text-gray-500">{{ new Date(event.date).toLocaleDateString('pt-BR') }}</p>
                </div>
                <span class="text-xs bg-gray-200 px-2 py-0.5 rounded-full">{{ event.status }}</span>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'adopters'" class="space-y-4">
            <div class="bg-gray-50 rounded p-4">
              <h4 class="font-medium text-gray-800 mb-2">Adotantes</h4>
              <div v-for="adopter in mockAdopters" :key="adopter.id" class="text-sm border-b last:border-b-0 py-2">
                <div class="flex justify-between items-center">
                  <p class="font-medium">{{ adopter.name }}</p>
                  <span class="text-xs" :class="adopter.status === 'Aprovado' ? 'text-green-600' : adopter.status === 'Em análise' ? 'text-yellow-600' : 'text-red-600'">
                    {{ adopter.status }}
                  </span>
                </div>
                <p class="text-xs text-gray-500">{{ adopter.email }} • {{ adopter.phone }}</p>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'facts'" class="space-y-4">
            <div class="bg-gray-50 rounded p-4">
              <h4 class="font-medium text-gray-800 mb-2">Fatos e Observações</h4>
              <div v-for="fact in mockFacts" :key="fact.id" class="text-sm border-b last:border-b-0 py-2">
                <p>{{ fact.text }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ new Date(fact.date).toLocaleDateString('pt-BR') }}</p>
              </div>
              <button class="mt-3 w-full border text-sm py-2 px-4 rounded flex items-center justify-center gap-2">
                <FileText class="w-4 h-4" /> Adicionar Novo Fato
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
