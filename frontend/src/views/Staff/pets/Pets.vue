<script setup>
import { ref, computed } from 'vue';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-vue-next';

const searchTerm = ref('');
const currentPage = ref(1);
const selectedAnimal = ref(null);
const isModalOpen = ref(false);
const itemsPerPage = 10;

const allAnimals = ref([
  { id: 1, name: 'Bella', type: 'Cão', breed: 'Labrador', age: '2 anos', status: 'Disponível', vaccinated: true, castrated: true, gender: 'Fêmea', weight: '25kg', dateAdded: '2024-01-15' },
  { id: 2, name: 'Miau', type: 'Gato', breed: 'SRD', age: '1 ano', status: 'Em processo', vaccinated: true, castrated: false, gender: 'Macho', weight: '4kg', dateAdded: '2024-01-20' },
  { id: 3, name: 'Thor', type: 'Cão', breed: 'Pastor Alemão', age: '3 anos', status: 'Adotado', vaccinated: true, castrated: true, gender: 'Macho', weight: '35kg', dateAdded: '2024-01-10' },
  { id: 4, name: 'Luna', type: 'Gato', breed: 'Persa', age: '2 anos', status: 'Disponível', vaccinated: true, castrated: true, gender: 'Fêmea', weight: '3.5kg', dateAdded: '2024-01-25' },
]);

const filteredAnimals = computed(() => {
  const term = searchTerm.value.toLowerCase();
  return allAnimals.value.filter(animal =>
    animal.name.toLowerCase().includes(term) ||
    animal.breed.toLowerCase().includes(term) ||
    animal.type.toLowerCase().includes(term)
  );
});

const totalPages = computed(() => Math.ceil(filteredAnimals.value.length / itemsPerPage));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() => startIndex.value + itemsPerPage);
const currentAnimals = computed(() =>
  filteredAnimals.value.slice(startIndex.value, endIndex.value)
);

function getStatusColor(status) {
  switch (status) {
    case 'Disponível': return 'bg-green-100 text-green-800';
    case 'Em processo': return 'bg-yellow-100 text-yellow-800';
    case 'Adotado': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

function handleViewAnimal(animal) {
  selectedAnimal.value = animal;
  isModalOpen.value = true;
}

function handleCloseModal() {
  isModalOpen.value = false;
  selectedAnimal.value = null;
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-heading text-ong-text">Animais em Adoção</h1>
        <p class="text-muted-foreground mt-2">Gerencie todos os animais disponíveis para adoção</p>
      </div>
      <button class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        <Plus class="w-4 h-4" /> Adicionar Animal
      </button>
    </div>

    <!-- Filtro -->
    <div class="mb-6 flex gap-4">
      <div class="relative w-full">
        <Search class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar por nome, raça ou tipo..."
          class="w-full pl-10 pr-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
        />
      </div>
      <button class="border px-4 py-2 rounded hover:bg-gray-100">Filtros</button>
    </div>

    <!-- Tabela -->
    <div class="overflow-x-auto bg-white border rounded-md shadow-sm">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-100">
          <tr class="text-left">
            <th class="p-3">Nome</th>
            <th class="p-3">Tipo/Raça</th>
            <th class="p-3">Idade</th>
            <th class="p-3">Sexo</th>
            <th class="p-3">Peso</th>
            <th class="p-3">Status</th>
            <th class="p-3">Saúde</th>
            <th class="p-3">Data</th>
            <th class="p-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="animal in currentAnimals"
            :key="animal.id"
            class="border-t hover:bg-gray-50"
          >
            <td class="p-3 font-medium text-gray-800">{{ animal.name }}</td>
            <td class="p-3">
              <div>{{ animal.type }}</div>
              <div class="text-xs text-gray-500">{{ animal.breed }}</div>
            </td>
            <td class="p-3">{{ animal.age }}</td>
            <td class="p-3">{{ animal.gender }}</td>
            <td class="p-3">{{ animal.weight }}</td>
            <td class="p-3">
              <span :class="getStatusColor(animal.status)" class="px-2 py-0.5 text-xs rounded-full font-semibold">
                {{ animal.status }}
              </span>
            </td>
            <td class="p-3">
              <span class="text-xs px-2 py-0.5 rounded-full mr-1"
                :class="animal.vaccinated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                {{ animal.vaccinated ? 'Vacinado' : 'Não vacinado' }}
              </span>
              <span class="text-xs px-2 py-0.5 rounded-full"
                :class="animal.castrated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                {{ animal.castrated ? 'Castrado' : 'Não castrado' }}
              </span>
            </td>
            <td class="p-3 text-gray-500">{{ formatDate(animal.dateAdded) }}</td>
            <td class="p-3 text-right">
              <div class="flex justify-end gap-1">
                <button @click="handleViewAnimal(animal)" class="p-1 hover:text-blue-600"><Eye class="w-4 h-4" /></button>
                <button class="p-1 hover:text-yellow-600"><Edit class="w-4 h-4" /></button>
                <button class="p-1 hover:text-red-600"><Trash2 class="w-4 h-4" /></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginação -->
    <div class="mt-6 flex justify-between items-center text-sm text-gray-500">
      <div>
        Mostrando {{ startIndex + 1 }} a {{ Math.min(endIndex, filteredAnimals.length) }} de {{ filteredAnimals.length }} animais
      </div>
      <div class="flex gap-1">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-3 py-1 border rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          @click="currentPage = page"
          :class="[
            'px-3 py-1 border rounded',
            currentPage === page ? 'bg-blue-600 text-white' : ''
          ]"
        >
          {{ page }}
        </button>
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 border rounded disabled:opacity-50"
        >
          Próximo
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
        <h2 class="text-lg font-bold mb-4">Detalhes de {{ selectedAnimal.name }}</h2>
        <p><strong>Tipo:</strong> {{ selectedAnimal.type }}</p>
        <p><strong>Raça:</strong> {{ selectedAnimal.breed }}</p>
        <p><strong>Idade:</strong> {{ selectedAnimal.age }}</p>
        <p><strong>Peso:</strong> {{ selectedAnimal.weight }}</p>
        <p><strong>Status:</strong> {{ selectedAnimal.status }}</p>
        <div class="mt-4 text-right">
          <button @click="handleCloseModal" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Fechar</button>
        </div>
      </div>
    </div>
  </div>
</template>
