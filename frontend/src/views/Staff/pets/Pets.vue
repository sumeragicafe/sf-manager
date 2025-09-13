<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-vue-next';
import PetModal from '@/views/Staff/pets/components/PetModal.vue';

const searchTerm = ref('');
const currentPage = ref(1);
const selectedAnimal = ref(null);
const isModalOpen = ref(false);
const itemsPerPage = 10;

const allAnimals = ref([]);
const totalItems = ref(0);

async function fetchAnimals(page = 1, pageSize = itemsPerPage) {
  try {
    const url = `/api/animal?page=${page}&pageSize=${pageSize}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error(`Erro: ${res.status}`);
    const data = await res.json();

    allAnimals.value = data.items.map(animal => ({
      id: animal.id,
      name: animal.name,
      type: animal.speciesId === 1 ? 'Cão' : 'Gato', // exemplo de mapping
      breed: animal.breedId ? `Raça #${animal.breedId}` : 'SRD',
      age: animal.birthDate ? calcularIdade(animal.birthDate) : 'Não informada',
      status: animal.status,
      vaccinated: animal.isVaccinated ?? false,
      castrated: animal.isCastrated ?? false,
      gender: animal.gender === 'F' ? 'Fêmea' : 'Macho',
      weight: animal.weight ? `${animal.weight}kg` : '-',
      dateAdded: animal.entryDate
    }));

    totalItems.value = data.total;
  } catch (err) {
    console.error('Erro ao carregar animais:', err);
  }
}

function calcularIdade(dataNasc) {
  const hoje = new Date();
  const nasc = new Date(dataNasc);
  let anos = hoje.getFullYear() - nasc.getFullYear();
  let meses = hoje.getMonth() - nasc.getMonth();
  if (meses < 0 || (meses === 0 && hoje.getDate() < nasc.getDate())) {
    anos--;
    meses += 12;
  }
  if (anos > 0) return `${anos} ano${anos > 1 ? 's' : ''}`;
  return `${meses} mes${meses > 1 ? 'es' : ''}`;
}

const filteredAnimals = computed(() => {
  const term = searchTerm.value.toLowerCase();
  return allAnimals.value.filter(animal =>
    animal.name.toLowerCase().includes(term) ||
    animal.breed.toLowerCase().includes(term) ||
    animal.type.toLowerCase().includes(term)
  );
});

const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));
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

// Buscar animais na carga inicial
onMounted(() => {
  fetchAnimals(currentPage.value, itemsPerPage);
});

// Recarregar sempre que mudar a página
watch(currentPage, (page) => {
  fetchAnimals(page, itemsPerPage);
});
</script>



<template>
  <div class="container py-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-heading text-ong-text">Animais em Adoção</h1>
        <p class="text-muted-foreground mt-2">Gerencie todos os animais disponíveis para adoção</p>
      </div>
      <button class="flex items-center gap-2 px-4 py-2 bg-ong-primary text-white rounded-lg shadow hover:bg-ong-accent transition">
        <Plus class="w-4 h-4" /> Adicionar Animal
      </button>
    </div>

    <!-- Filtro -->
    <div class="mb-6 flex gap-4">
      <div class="relative w-full">
        <Search class="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar por nome, raça ou tipo..."
          class="w-full pl-10 pr-4 py-2 border rounded-md focus:ring focus:ring-ong-primary focus:border-ong-primary"
        />
      </div>
      <button class="border px-4 py-2 rounded-lg hover:bg-muted">Filtros</button>
    </div>

    <!-- Tabela -->
    <div class="overflow-x-auto bg-card border rounded-lg shadow animate-fade-in">
      <table class="min-w-full text-sm">
        <thead class="bg-muted">
          <tr class="text-left text-foreground">
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
            class="border-t hover:bg-ong-background/60 transition"
          >
            <td class="p-3 font-medium text-foreground">{{ animal.name }}</td>
            <td class="p-3">
              <div>{{ animal.type }}</div>
              <div class="text-xs text-muted-foreground">{{ animal.breed }}</div>
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
            <td class="p-3 text-muted-foreground">{{ formatDate(animal.dateAdded) }}</td>
            <td class="p-3 text-right">
              <div class="flex justify-end gap-2">
                <button @click="handleViewAnimal(animal)" class="p-1 hover:text-ong-primary"><Eye class="w-4 h-4" /></button>
                <button class="p-1 hover:text-yellow-600"><Edit class="w-4 h-4" /></button>
                <button class="p-1 hover:text-red-600"><Trash2 class="w-4 h-4" /></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginação -->
    <div class="mt-6 flex justify-between items-center text-sm text-muted-foreground">
      <div>
        Mostrando {{ startIndex + 1 }} a {{ Math.min(endIndex, filteredAnimals.length) }} de {{ filteredAnimals.length }} animais
      </div>
      <div class="flex gap-1">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-3 py-1 border rounded-lg disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          @click="currentPage = page"
          :class="[
            'px-3 py-1 border rounded-lg',
            currentPage === page ? 'bg-ong-primary text-white' : 'hover:bg-muted'
          ]"
        >
          {{ page }}
        </button>
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 border rounded-lg disabled:opacity-50"
        >
          Próximo
        </button>
      </div>
    </div>

    <!-- Modal -->
    <PetModal
      :isOpen="isModalOpen"
      :animal="selectedAnimal"
      @close="handleCloseModal"
    />
  </div>
</template>
