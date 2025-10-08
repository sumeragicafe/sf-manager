<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-vue-next';
import PetModal from '@/views/Staff/pets/components/PetModal.vue';
import CreateAnimalModal from '@/views/Staff/pets/components/CreateAnimalModal.vue';
import Pagination from '@/components/Pagination.vue';

const selectedAnimal = ref(null);
const isViewModalOpen = ref(false); // modal de visualização
const isAddModalOpen = ref(false);  // modal de criação

const totalItems = ref(0);

const loading = ref(false);
const animals = ref([]);

const total = ref(0);
const page = ref(1);
const pageSize = ref(20);
const search = ref(null);

const statusFilter = ref('all');
const genderFilter = ref('all');
const speciesFilter = ref('all');
const dateFrom = ref(null);
const dateTo = ref(null);


// watch([page, pageSize, search, statusFilter, genderFilter, speciesFilter, dateFrom, dateTo], fetchAnimals);
watch(
  [page, pageSize, search, statusFilter, genderFilter, speciesFilter, dateFrom, dateTo],
  fetchAnimals,
    { immediate: true, deep: true }
);


// Fetch animais
async function fetchAnimals() {
  try {
    const filters = {};
    if (search.value) filters.search = search.value;

    if (statusFilter.value !== 'all') filters.status = statusFilter.value;
    if (genderFilter.value !== 'all') filters.gender = genderFilter.value;
    if (speciesFilter.value !== 'all') filters.speciesId = speciesFilter.value;

    // Filtros de datas (já suportados por buildWhere)
    if (dateFrom.value || dateTo.value) {
      filters.dateFrom = dateFrom.value;
      filters.dateTo = dateTo.value;
      filters.dateFields = ['entryDate']; // campo do modelo
    }



    const params = new URLSearchParams({
      page: page.value.toString(),
      pageSize: pageSize.value.toString(),
      filters: JSON.stringify(filters),
    });

    const url = `/api/animal?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Erro: ${res.status}`);
    const data = await res.json();

    total.value = data.total;
    page.value = data.page;
    pageSize.value = data.pageSize;

    animals.value = data.items.map(animal => ({
      id: animal.id,
      name: animal.name,
      species: animal.species,
      breed: animal.breed,
      age: animal.birthDate? calcularIdadeFormatada(animal.birthDate) : null,
      status: animal.status,
      vaccinated: animal.isVaccinated ?? false,
      isCastrated: animal.isCastrated ?? false,
      size: animal.size,
      gender: animal.gender,
      entryDate: animal.entryDate,
      notes: animal.notes,
      birthDate: animal.birthDate,
      isBirthDateEstimated: animal.isBirthDateEstimated
    }));

    totalItems.value = data.total;
  } catch (err) {
    console.error('Erro ao carregar animais:', err);
  }
}

function calcularIdadeFormatada(dataNasc) {
  const hoje = new Date();
  const nasc = new Date(dataNasc);

  let anos = hoje.getFullYear() - nasc.getFullYear();
  let meses = hoje.getMonth() - nasc.getMonth();
  let dias = hoje.getDate() - nasc.getDate();

  if (dias < 0) {
    meses--;
    const ultimoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
    dias += ultimoMes.getDate();
  }

  if (meses < 0) {
    anos--;
    meses += 12;
  }

  if (anos >= 1) {
    return `${anos} ano${anos > 1 ? 's' : ''}`;
  } else if (meses >= 1) {
    return `${meses} mês${meses > 1 ? 'es' : ''}`;
  } else {
    return `${dias} dia${dias > 1 ? 's' : ''}`;
  }
}

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

// Ações
function handleViewAnimal(animal) {
  selectedAnimal.value = animal;
  isViewModalOpen.value = true;
}

function handleCloseViewModal() {
  isViewModalOpen.value = false;
  selectedAnimal.value = null;
}

// Abrir modal de criação
function handleOpenAddModal() {
  isAddModalOpen.value = true;
}

// Após criar um animal, atualizar lista
function handleAnimalCreated() {
  isAddModalOpen.value = false;
  fetchAnimals(); 
}

// Inicial
onMounted(() => {
  fetchAnimals();
});


</script>




<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-heading text-ong-text">Animais em Adoção</h1>
        <p class="text-muted-foreground mt-2">Gerencie todos os animais disponíveis para adoção</p>
      </div>
      <button
        @click="handleOpenAddModal"
        class="flex items-center gap-2 px-4 py-2 bg-ong-primary text-white rounded-lg shadow hover:bg-ong-accent transition"
      >
        <Plus class="w-4 h-4" /> Adicionar Animal
      </button>
    </div>

    <Pagination
      :total="total"
      :page="page"
      :pageSize="pageSize"
      :search="search"

      :filters="[
        {
          label: 'Status',
          value: statusFilter,
          options: [
            { label: 'Todos', value: 'all' },
            { label: 'Disponível', value: 'Disponível' },
            { label: 'Adotado', value: 'Adotado' },
            { label: 'Em processo', value: 'Em processo' }
          ]
        },
        {
          label: 'Sexo',
          value: genderFilter,
          options: [
            { label: 'Todos', value: 'all' },
            { label: 'Macho', value: 'M' },
            { label: 'Fêmea', value: 'F' }
          ]
        },
        {
          label: 'Espécie',
          value: speciesFilter,
          options: [
            { label: 'Todas', value: 'all' },
            { label: 'Cachorro', value: '1' },
            { label: 'Gato', value: '2' }
          ]
        }
      ]"

      :dateRange="{
        from: dateFrom,
        to: dateTo,
        onFromChange: val => { dateFrom.value = val; page.value = 1; },
        onToChange: val => { dateTo.value = val; page.value = 1; }
      }"

      @update:page="val => { page = val }"
      @update:pageSize="val => { pageSize = val; page = 1 }"
      @update:search="val => { search = val }"
      @update:dynamic-filter="({ label, value }) => {
        if (label === 'Status') statusFilter = value;
        else if (label === 'Sexo') genderFilter = value;
        else if (label === 'Espécie') speciesFilter = value;
        page = 1;
        fetchAnimals();
      }"

    />

    <!-- Tabela -->
    <div class="overflow-x-auto bg-card rounded-lg shadow-sm animate-fade-in mt-6">
      <table class="w-full table-auto text-sm">
        <thead class="text-muted-foreground bg-ong-popover uppercase text-xs">
          <tr>
            <th class="px-4 py-3 text-left">Nome</th>
            <th class="px-4 py-3 text-left">Tipo/Raça</th>
            <th class="px-4 py-3 text-left">Idade</th>
            <th class="px-4 py-3 text-left">Sexo</th>
            <th class="px-4 py-3 text-left">Status</th>
            <th class="px-4 py-3 text-left">Saúde</th>
            <th class="px-4 py-3 text-left">Data de Inclusão</th>
            <th class="px-4 py-3 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="animal in animals"
            :key="animal.id"
            class="border-t hover:bg-ong-background/60 transition"
          >
            <td class="p-3 font-medium text-foreground">{{ animal.name }}</td>
            <td class="p-3">
              <div>{{ animal.species.name }}</div>
              <div class="text-xs text-muted-foreground">{{ animal.breed.name }}</div>
            </td>
            <td class="p-3">{{ animal.age ?? 'Não informada'}}</td>
            <td class="p-3">{{ animal.gender == "M" ? "Macho" : "Fêmea" }}</td>
            <td class="p-3">
              <span :class="getStatusColor(animal.status)" class="px-2 py-0.5 text-xs rounded-full font-semibold">
                {{ animal.status }}
              </span>
            </td>
            <td class="p-3">
              <!-- <span class="text-xs px-2 py-0.5 rounded-full mr-1"
                :class="animal.vaccinated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                {{ animal.vaccinated ? 'Vacinado' : 'Não vacinado' }}
              </span> -->
              <span class="text-xs px-2 py-0.5 rounded-full"
                :class="animal.isCastrated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                {{ animal.isCastrated ? 'Castrado' : 'Não castrado' }}
              </span>
            </td>
            <td class="p-3 text-muted-foreground">{{ formatDate(animal.entryDate) }}</td>
            <td class="p-3 text-right">
              <div class="flex justify-end gap-2">
                <button @click="handleViewAnimal(animal)" class="p-1 hover:text-ong-primary"><Eye class="w-4 h-4" /></button>
                <button class="p-1 hover:text-red-600"><Trash2 class="w-4 h-4" /></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <PetModal
      :isOpen="isViewModalOpen"
      :animal="selectedAnimal"
      @close="handleCloseViewModal"
      @refresh="fetchAnimals"
    />

    <CreateAnimalModal
      :isOpen="isAddModalOpen"
      @close="() => isAddModalOpen = false"
      @created="handleAnimalCreated"
    />
  </div>
</template>
