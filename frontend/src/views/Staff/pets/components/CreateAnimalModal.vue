<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { X } from 'lucide-vue-next';
import { v4 as uuidv4 } from 'uuid';
import SearchableSelect from '@/components/SearchableSelect.vue';

const props = defineProps({
  isOpen: Boolean
});
const emit = defineEmits(['close', 'created']);

const isSubmitting = ref(false);
const editableAnimal = reactive({
  name: '',
  speciesId: null,
  breedId: null,
  gender: '',
  size: '',
  status: '',
  isCastrated: false,
  notes: '',
  entryDate: new Date().toISOString().split('T')[0],
  isBirthDateEstimated: false,
  birthDate: '',
  imageFile: null
});

const speciesOptions = ref([]);
const breedOptions = ref([]);
const genderOptions = ['F', 'M'];
const sizeOptions = ['Pequeno', 'Médio', 'Grande'];
const statusOptions = ['Disponível', 'Não Disponível', 'Adotado'];

onMounted(async () => {
  try {
    const speciesRes = await fetch('/api/species');
    const speciesData = await speciesRes.json();
    speciesOptions.value = speciesData.items; // <-- somente o array

    const breedRes = await fetch('/api/breed?pageSize=200');
    const breedData = await breedRes.json();
    breedOptions.value = breedData.items; // <-- somente o array
  } catch (err) {
    console.error('Erro ao buscar opções:', err);
  }
});

watch(() => editableAnimal.speciesId, async (newSpeciesId) => {
  if (!newSpeciesId) {
    breedOptions.value = [];
    return;
  }

  try {
    const params = new URLSearchParams({
      speciesId: String(newSpeciesId),
      pageSize: '200',
    });

    const res = await fetch(`/api/breed/species/${editableAnimal.newSpeciesId}?pageSize=200`);
    const data = await res.json();
    breedOptions.value = data.items; // somente o array
  } catch (err) {
    console.error('Erro ao buscar raças filtradas:', err);
  }
});



function closeModal() {
  emit('close');
  Object.assign(editableAnimal, {
    name: '',
    speciesId: null,
    breedId: null,
    gender: '',
    size: '',
    status: '',
    isCastrated: false,
    notes: '',
    entryDate: new Date().toISOString().split('T')[0],
    isBirthDateEstimated: false,
    birthDate: '',
    imageFile: null
  });
}

async function createAnimal() {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    console.log("➡️ Iniciando criação de animal...");
    console.log("📦 Dados enviados:", {
      name: editableAnimal.name,
      speciesId: editableAnimal.speciesId,
      breedId: editableAnimal.breedId,
      gender: editableAnimal.gender,
      size: editableAnimal.size,
      status: editableAnimal.status,
      isCastrated: editableAnimal.isCastrated,
      notes: editableAnimal.notes,
      entryDate: editableAnimal.entryDate,
      isBirthDateEstimated: editableAnimal.isBirthDateEstimated,
      birthDate: editableAnimal.birthDate || null
    });

    // Criar animal (backend gera o UUID)
    const res = await fetch('/api/animal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editableAnimal.name,
        speciesId: editableAnimal.speciesId,
        breedId: editableAnimal.breedId,
        gender: editableAnimal.gender,
        size: editableAnimal.size,
        status: editableAnimal.status,
        isCastrated: editableAnimal.isCastrated,
        notes: editableAnimal.notes,
        entryDate: editableAnimal.entryDate,
        isBirthDateEstimated: editableAnimal.isBirthDateEstimated,
        birthDate: editableAnimal.birthDate || null
      })
    });

    console.log("📡 Resposta do backend (create animal):", res);

    if (!res.ok) {
      console.error("❌ Erro ao criar animal:", res.status, res.statusText);
      throw new Error('Erro ao criar animal');
    }

    const createdAnimal = await res.json();
    console.log("✅ Animal criado com sucesso:", createdAnimal);

    const animalId = createdAnimal.animalProps.id;
    console.log("🆔 ID do animal criado:", animalId);

    // Se houver imagem, enviar vinculada ao animalId retornado
    if (editableAnimal.imageFile) {
      console.log("📸 Enviando imagem vinculada ao animal:", animalId);

      const formData = new FormData();
      formData.append('type', 'image');
      formData.append('file', editableAnimal.imageFile);

      console.log("📦 FormData preparado para upload:", formData);

      const mediaRes = await fetch(`/api/animal/${animalId}/media/upload`, {
        method: 'POST',
        body: formData
      });

      console.log("📡 Resposta do backend (upload media):", mediaRes);

      if (!mediaRes.ok) {
        console.error("❌ Erro ao enviar imagem:", mediaRes.status, mediaRes.statusText);
        throw new Error('Erro ao enviar imagem');
      }

      const uploadedMedia = await mediaRes.json();
      console.log("✅ Imagem enviada com sucesso:", uploadedMedia);
    } else {
      console.log("ℹ️ Nenhuma imagem foi selecionada para upload.");
    }

    emit('created', animalId);
    console.log("📢 Evento 'created' emitido com ID:", animalId);

    closeModal();
    console.log("✅ Modal fechado.");
  } catch (err) {
    console.error("💥 Erro capturado no createAnimal:", err);
    alert('Erro ao criar animal');
  } finally {
    isSubmitting.value = false;
    console.log("🔄 Finalizando createAnimal, isSubmitting = false");
  }
}



function handleFileChange(event) {
  editableAnimal.imageFile = event.target.files[0] || null;
}
</script>

<template>
  <div
    v-if="props.isOpen"
    class="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fade-in"
  >
    <div class="bg-card rounded-2xl shadow-xl max-w-3xl w-full p-6 animate-scale-in overflow-y-auto max-h-[90vh]">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-heading">Adicionar Animal</h2>
        <button @click="closeModal"><X class="w-6 h-6" /></button>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block mb-1">Nome</label>
          <input v-model="editableAnimal.name" type="text" class="w-full px-2 py-1 border rounded" />
        </div>

        <div class="flex gap-2">
           <div class="flex-1">
            <label class="block mb-1">Espécie</label>
            <SearchableSelect
              v-model="editableAnimal.speciesId"
              :options="speciesOptions"
              placeholder="Selecione uma espécie"
            />

          </div>
          <div class="flex-1">
            <label class="block mb-1">Raça</label>
            <SearchableSelect
              v-model="editableAnimal.breedId"
              :options="breedOptions"
              placeholder="Selecione uma raça"
            />
          </div>
        </div>

        <div class="flex gap-2">
          <div class="flex-1">
            <label class="block mb-1">Sexo</label>
            <select v-model="editableAnimal.gender" class="w-full px-2 py-1 border rounded">
              <option v-for="g in genderOptions" :key="g" :value="g">{{ g }}</option>
            </select>
          </div>
          <div class="flex-1">
            <label class="block mb-1">Porte</label>
            <select v-model="editableAnimal.size" class="w-full px-2 py-1 border rounded">
              <option v-for="s in sizeOptions" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block mb-1">Status</label>
          <select v-model="editableAnimal.status" class="w-full px-2 py-1 border rounded">
            <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>

        <div class="flex gap-2 items-center">
          <input type="checkbox" v-model="editableAnimal.isCastrated" id="castrated" />
          <label for="castrated">Castrado</label>
        </div>

        <div>
          <label class="block mb-1">Notas</label>
          <textarea v-model="editableAnimal.notes" class="w-full px-2 py-1 border rounded" rows="3"></textarea>
        </div>

        <div>
          <label class="block mb-1">Data de Entrada</label>
          <input v-model="editableAnimal.entryDate" type="date" class="w-full px-2 py-1 border rounded" />
        </div>

        <div>
          <label class="block mb-1">Data de Nascimento Estimada?</label>
          <input type="checkbox" v-model="editableAnimal.isBirthDateEstimated" />
        </div>

        <div v-if="editableAnimal.isBirthDateEstimated">
          <label class="block mb-1">Data de Nascimento</label>
          <input v-model="editableAnimal.birthDate" type="date" class="w-full px-2 py-1 border rounded" />
        </div>

        <div>
          <label class="block mb-1">Imagem</label>
          <input type="file" @change="handleFileChange" accept="image/*" />
        </div>

        <div class="flex justify-end gap-2 mt-4">
          <button @click="closeModal" class="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
          <button
            @click="createAnimal"
            :disabled="isSubmitting"
            class="px-4 py-2 bg-ong-primary text-white rounded"
          >
            {{ isSubmitting ? 'Criando...' : 'Criar Animal' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
