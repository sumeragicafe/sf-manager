<script setup>
import { ref, reactive, watch } from 'vue';
import { X } from 'lucide-vue-next';
import PetVaccineTab from '@/views/Staff/pets/components/PetVaccineTab.vue';
import PetMediaTab from '@/views/Staff/pets/components/PetMediaTab.vue';
import PetMediaCarousel from '@/views/Staff/pets/components/PetMediaCarousel.vue';

const props = defineProps({
  isOpen: Boolean,
  animal: Object
});
const emit = defineEmits(['close', 'update']);

const tabs = ['Visão Geral', 'Adotantes', 'Vacinas', 'Fatos', 'Mídias'];

const activeTab = ref('Visão Geral');

const isEditing = ref(false);
const editableAnimal = reactive({});

function formatDateDDMMYYYY(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d)) return null;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}


watch(isEditing, (editing) => {
  if (editing) {
    // Copia os valores atuais do animal
    Object.assign(editableAnimal, props.animal);

    // Inicializa o checkbox se não existir
    if (editableAnimal.isBirthDateEstimated === undefined) {
      editableAnimal.isBirthDateEstimated = false;
    }

    // Converte birthDate para YYYY-MM-DD para o input date
    if (editableAnimal.birthDate) {
      const d = new Date(editableAnimal.birthDate);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      editableAnimal.birthDate = `${yyyy}-${mm}-${dd}`;
    }
  }
});


// Opções dos selects
const speciesOptions = ['Cachorro', 'Gato', 'Ave', 'Outro'];
const breedOptions = ['SRD', 'Poodle', 'Bulldog', 'Persa', 'Siamês'];
const genderOptions = ['Fêmea', 'Macho'];
const sizeOptions = ['Pequeno', 'Médio', 'Grande'];
const statusOptions = ['Disponível', 'Não Disponível', 'Adotado'];

function closeModal() {
  isEditing.value = false;
  emit('close');
}

function toggleEdit() {
  if (isEditing.value) {
    // Salvar alterações
    emit('update', { ...editableAnimal });
  }
  isEditing.value = !isEditing.value;
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
        <PetMediaCarousel :pet-id="animal.id" class="mb-4" />

        <!-- Nome -->
        <div v-if="!isEditing">
          <h2 class="text-2xl font-heading text-ong-text">{{ animal.name }}</h2>
          <p class="text-muted-foreground">{{ animal.species }} • {{ animal.breed }}</p>
        </div>
        <div v-else class="w-full">
          <label class="text-sm font-semibold" for="name">Nome do Animal:</label>
          <input v-model="editableAnimal.name" name="name" class="w-full px-2 py-1 border rounded mb-2" />

          <label class="text-sm font-semibold" for="species">Espécie:</label>
          <select v-model="editableAnimal.species" class="w-full px-2 py-1 border rounded mb-2">
            <option v-for="opt in speciesOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>

          <label class="text-sm font-semibold" for="breed">Raça:</label>
          <select v-model="editableAnimal.breed" class="w-full px-2 py-1 border rounded mb-2">
            <option v-for="opt in breedOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </div>

        <!-- Notas -->
        <div class="mt-4 text-sm w-full">
          <span class="font-semibold">Notas:</span>
          <div v-if="!isEditing">
            <p class="text-ong-text">{{ animal.notes }}</p>
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
            <span>Idade:</span> {{ animal.age ? `${animal.age} anos`: 'Não informada'}}
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
            <p v-if="!isEditing" class="text-ong-text">{{ animal.birthDate ? formatDateDDMMYYYY(animal.birthDate) : 'Desconhecida' }}</p>
            <input v-else v-model="editableAnimal.birthDate" type="date" class="px-2 py-1 border rounded" />
          </div>
          <div v-else class="w-1/2 flex flex-col mb-4">
            <span class="font-semibold">Data de Nascimento:</span>
            <p class="text-ong-text">Desconhecida</p>
          </div>


          <div class="w-1/2 flex flex-col mb-4">
            <span class="font-semibold">Sexo:</span>
            <p v-if="!isEditing" class="text-ong-text">{{ animal.gender }}</p>
            <select v-else v-model="editableAnimal.gender" class="px-2 py-1 border rounded">
              <option v-for="opt in genderOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </div>

          <div class="w-1/2 flex flex-col mb-4">
            <span class="font-semibold">Porte:</span>
            <p v-if="!isEditing" class="text-ong-text">{{ animal.size }}</p>
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
              :class="animal.castrated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
            >
              {{ animal.castrated ? 'Castrado' : 'Não castrado' }}
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
              @click="toggleEdit"
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
          <div v-if="activeTab === 'Visão Geral'" class="space-y-6">
            ...
          </div>
          <div v-else-if="activeTab === 'Mídias'">
            <PetMediaTab :pet-id="animal.id" />
          </div>
          <div v-else-if="activeTab === 'Vacinas'">
            <PetVaccineTab :pet-id="animal.id" />
          </div>
          <div v-else class="text-muted-foreground">
            Conteúdo de {{ activeTab }} em construção...
          </div>
        </div>

        
      </div>
    </div>
  </div>
</template>
