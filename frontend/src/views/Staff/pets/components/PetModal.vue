<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { X } from 'lucide-vue-next';
import PetVaccineTab from '@/views/Staff/pets/components/PetVaccineTab.vue';
import PetMediaTab from '@/views/Staff/pets/components/PetMediaTab.vue';
import PetFactsTab from '@/views/Staff/pets/components/PetFactsTab.vue';
import PetMediaCarousel from '@/views/Staff/pets/components/PetMediaCarousel.vue';
import SearchableSelect from '@/components/SearchableSelect.vue';
import { showToast } from '@/utils/uiAlerts/toast';
import { showConfirm } from '@/utils/uiAlerts/confirm';

const props = defineProps({
  isOpen: Boolean,
  animal: Object
});
const emit = defineEmits(['close', 'update']);
const tabs = ['Visão Geral', 'Adotantes', 'Vacinas', 'Fatos', 'Mídias'];
const activeTab = ref('Visão Geral');
const isEditing = ref(false);
const editableAnimal = reactive({});
const hasChanged = ref(false);


// Opções dos selects
const speciesOptions = ref([]);
const breedOptions = ref([]);
const genderOptions = [
  { label: 'Macho', value: 'M' },
  { label: 'Fêmea', value: 'F' }
];
const sizeOptions = ['Pequeno', 'Médio', 'Grande'];
const statusOptions = ['Disponível', 'Não Disponível', 'Adotado'];


function formatDateDDMMYYYY(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d)) return null;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}


onMounted(async () => {
  console.log("editableAnimal ", editableAnimal);
  console.log("props.animal ", props.animal);

  console.log(speciesOptions.value);
});

watch(
  () => props.animal,
  async(animal) => {
    if (!animal) return;
    Object.assign(editableAnimal, animal);


    await fetchSpecies();
    await fetchBreeds(editableAnimal.species.id);

    // Normaliza IDs
    editableAnimal.speciesId = animal.species?.id ?? null;
    editableAnimal.breedId   = animal.breed?.id ?? null;

    // Normaliza data
    if (animal.birthDate) {
      const d = new Date(animal.birthDate);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      editableAnimal.birthDate = `${yyyy}-${mm}-${dd}`;
    }

    // Flag de data estimada
    if (editableAnimal.isBirthDateEstimated === undefined) {
      editableAnimal.isBirthDateEstimated = false;
    }
  },
  { immediate: true }
);

watch(
  () => editableAnimal.speciesId,
  (newSpeciesId) => {
    if (newSpeciesId) fetchBreeds(newSpeciesId);
  }
);

function closeModal() {
  isEditing.value = false;
  if(hasChanged.value){
    emit('refresh');
    hasChanged.value = false;
  }
  emit('close');
}

function toggleEdit() {
  isEditing.value = true;
}


async function saveAnimal() {
  try {
    const { id } = props.animal;

    const response = await fetch(`/api/animal/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editableAnimal)
    });

    if (!response.ok) {
      throw new Error('Falha ao atualizar o animal');
    }

    const data = await response.json();

    // Atualiza o pai com o animal retornado pelo backend
    showToast({ icon: 'success', title: 'Animal atualizado com sucesso!' });
    emit('update', data.updatedAnimal);

    Object.assign(editableAnimal, data.animal);

    isEditing.value = false;

    hasChanged.value = true;
  } catch (err) {
    console.error('Erro ao atualizar animal:', err);
    alert('Erro ao salvar alterações do animal.');
  }
}

async function fetchSpecies() {
  try {
    const res = await fetch('/api/species');
    if (!res.ok) throw new Error('Erro ao buscar espécies');
    const data = await res.json();
    console.log('API /species retornou:', data);

    speciesOptions.value = data.items; 
    console.log(speciesOptions.value);
  } catch (err) {
    console.error(err);
  }
}

// Buscar raças conforme a espécie
async function fetchBreeds(speciesId) {
  if (!speciesId) return;
  try {
    const res = await fetch(`/api/breed/species/${speciesId}`);
    if (!res.ok) throw new Error('Erro ao buscar raças');
    const data = await res.json();

    breedOptions.value = data.items; 
    console.log(breedOptions.value);
  } catch (err) {
    console.error(err);
  }
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
      <div class="w-1/3 bg-ong-background p-6 flex flex-col border-r overflow-y-auto">
        <PetMediaCarousel :pet-id="animal.id" class="mb-4" />

        <!-- Nome -->
        <div v-if="!isEditing" class="">
          <h2 class="text-2xl font-heading text-ong-text">{{ editableAnimal.name }}</h2>
          <p class="text-muted-foreground">{{ editableAnimal.species.name }} • {{ editableAnimal.breed.name }}</p>
        </div>
        <div v-else class="w-full">
          <label class="text-sm font-semibold" for="name">Nome do Animal:</label>
          <input v-model="editableAnimal.name" name="name" class="w-full px-2 py-1 border rounded mb-2" />

          <label class="text-sm font-semibold" for="species">Espécie:</label>
          <SearchableSelect
            v-model="editableAnimal.speciesId"
            :options="speciesOptions"
            placeholder="Selecione a espécie"
          />

          <label class="text-sm font-semibold">Raça:</label>
          <SearchableSelect
            v-model="editableAnimal.breedId"
            :options="breedOptions"
            placeholder="Selecione a raça"
          />

        </div>
        <!-- Notas -->
        <div class="mt-4 text-sm w-full">
          <span class="font-semibold">Notas:</span>
          <div v-if="!isEditing">
            <p class="text-ong-text">{{ editableAnimal.notes }}</p>
          </div>
          <div v-else>
            <textarea
              v-model="editableAnimal.notes"
              rows="3"
              class="w-full px-2 py-1 border rounded"
            />
          </div>
        </div>

        <!-- Idade -->
        <div v-if="!isEditing" class="mt-4 text-sm w-full">
          <span class="font-semibold">Idade:</span>

          <p class="text-ong-text">
            <span>Idade:</span> {{ editableAnimal.age ? `${editableAnimal.age} anos`: 'Não informada'}}
          </p>

        
         
        </div>

        <!-- Outros atributos -->
        <div class="mt-4 flex flex-wrap justify-around text-sm w-full">

          <div class="w-full flex flex-col mb-2">
             <label v-if="isEditing" class="flex items-center gap-2 mb-1 text-sm">
              <input type="checkbox" v-model="editableAnimal.isBirthDateEstimated" />
              Data de nascimento estimada?
            </label>
          </div>

          <div v-if="editableAnimal.isBirthDateEstimated" class="w-1/2 flex flex-col mb-4">
            <span class="font-semibold">Data de Nascimento:</span>
            <p v-if="!isEditing" class="text-ong-text">{{ editableAnimal.birthDate ? formatDateDDMMYYYY(editableAnimal.birthDate) : 'Desconhecida' }}</p>
            <input v-else v-model="editableAnimal.birthDate" type="date" class="px-2 py-1 border rounded" />
          </div>
          <div v-else class="w-1/2 flex flex-col mb-4">
            <span class="font-semibold">Data de Nascimento:</span>
            <p class="text-ong-text">Desconhecida</p>
          </div>


          <div class="w-1/2 flex flex-col mb-4">
            <span class="font-semibold">Sexo:</span>
            <p v-if="!isEditing" class="text-ong-text">{{ editableAnimal.gender }}</p>

             <select v-else v-model="editableAnimal.gender" class="px-2 py-1 border rounded">
              <option v-for="opt in genderOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>

          <div class="w-1/2 flex flex-col mb-4">
            <span class="font-semibold">Porte:</span>
            <p v-if="!isEditing" class="text-ong-text">{{ editableAnimal.size }}</p>
            <select v-else v-model="editableAnimal.size" class="px-2 py-1 border rounded">
              <option v-for="opt in sizeOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </div>

          <div class="w-1/2 flex flex-col mb-4">
            <span class="font-semibold">Status:</span>
            <p
              v-if="!isEditing"
              class="inline-block mt-1 px-2 py-0.5 text-xs rounded-full font-semibold bg-green-100 text-green-800"
            >
              {{ animal.status }}
            </p>
            <select v-else v-model="editableAnimal.status" class="px-2 py-1 border rounded">
              <option v-for="opt in statusOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </div>
        </div>

        <!-- Vacinação / Castração -->
        <div class="mt-4 flex gap-2 flex-wrap">
          <template v-if="!isEditing">
            <span
              class="px-2 py-0.5 text-xs rounded-full font-semibold"
              :class="animal.vaccinated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
            >
              {{ animal.vaccinated ? 'Vacinado' : 'Não vacinado' }}
            </span>
            <span
              class="px-2 py-0.5 text-xs rounded-full font-semibold"
              :class="animal.isCastrated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
            >
              {{ animal.isCastrated ? 'Castrado' : 'Não castrado' }}
            </span>
          </template>
          <template v-else>
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="editableAnimal.vaccinated" />
              Vacinado
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="editableAnimal.castrated" />
              Castrado
            </label>
          </template>
        </div>

        <!-- Botões -->
        <div class="mt-6 w-full flex flex-col gap-2">
          <!-- Editar -->
          <button
            v-if="!isEditing"
            @click="toggleEdit"
            class="px-4 py-2 bg-ong-primary text-white rounded-lg shadow hover:bg-ong-accent transition w-full"
          >
            Editar Animal
          </button>

          <!-- Cancelar / Salvar -->
          <div v-else class="flex gap-2 w-full">
            <button
              @click="closeModal"
              class="px-4 py-2 flex-1 bg-ong-background border text-ong-text rounded-lg hover:bg-ong-secondary/50 transition"
            >
              Cancelar
            </button>

            <button
              @click="saveAnimal"
              class="px-4 py-2 flex-1 bg-ong-primary text-white rounded-lg hover:bg-ong-accent transition"
            >
              Salvar
            </button>
          </div>

          <!-- Compartilhar -->
          <button class="px-4 py-2 border rounded-lg hover:bg-muted w-full">Compartilhar</button>
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
          <div v-if="activeTab === 'Visão Geral'" class="space-y-6">Fatos
            ...
          </div>
          <div v-else-if="activeTab === 'Mídias'">
            <PetMediaTab :pet-id="animal.id" />
          </div>
          <div v-else-if="activeTab === 'Vacinas'"> 
            <PetVaccineTab :pet-id="animal.id" />
          </div>
          <div v-else-if="activeTab === 'Fatos'"> 
            <PetFactsTab :pet-id="animal.id" />
          </div>
          <div v-else class="text-muted-foreground">
            Conteúdo de {{ activeTab }} em construção...
          </div>
        </div>

        
      </div>
    </div>
  </div>
</template>
