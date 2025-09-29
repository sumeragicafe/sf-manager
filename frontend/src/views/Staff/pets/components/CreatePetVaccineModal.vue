<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import SearchableSelect from '@/components/SearchableSelect.vue';

const props = defineProps({
  isOpen: Boolean,
  petId: { type: String, required: true },
  isEditing: { type: Boolean, default: false },
  formData: { type: Object, required: true }
});
const emit = defineEmits(['close', 'saved']);

const vaccineOptions = ref([]);
const localForm = reactive({ ...props.formData });

// Atualiza localForm sempre que formData mudar
watch(
  () => [props.isOpen, props.formData],
  ([isOpen, formData]) => {
    if (isOpen && formData) {
      Object.assign(localForm, {
        id: formData.id ?? null,
        vaccineId: formData.vaccineId ?? '',
        applicationDate: formData.applicationDate
          ? formData.applicationDate.split('T')[0]
          : '',
        applicator: formData.applicator ?? ''
      });
    }
  },
  { immediate: true, deep: true }
);

// Buscar opções de vacinas
onMounted(async () => {
  try {
    const res = await fetch('/api/vaccine?pageSize=200');
    const data = await res.json();
    vaccineOptions.value = (data.items || []).map(v => ({
      id: v.id,
      name: v.name ?? v.label ?? v.title ?? `Vacina ${v.id}`
    }));
  } catch (err) {
    console.error('Erro ao carregar vacinas:', err);
  }
});

// Salvar (create/update)
async function saveVaccine() {
  try {
    const method = props.isEditing ? 'PUT' : 'POST';
    const url = props.isEditing
      ? `/api/animal/${props.petId}/vaccines/${localForm.id}`
      : `/api/animal/${props.petId}/vaccines`;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(localForm),
    });

    if (!res.ok) throw new Error('Erro ao salvar vacina');

    const saved = await res.json();
    emit('saved', saved);
  } catch (err) {
    console.error(err);
    alert('Erro ao salvar vacina');
  }
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 class="text-lg font-semibold mb-4">
        {{ isEditing ? 'Editar Vacina' : 'Nova Vacina' }}
      </h2>

      <form @submit.prevent="saveVaccine" class="space-y-4">
        <div>
          <label class="block text-sm font-medium">Vacina</label>
          <SearchableSelect
            v-model="localForm.vaccineId"
            :options="vaccineOptions"
            placeholder="Selecione a vacina"
          />
        </div>

        <div>
          <label class="block text-sm font-medium">Data de Aplicação</label>
          <input
            v-model="localForm.applicationDate"
            type="date"
            class="w-full border px-2 py-1 rounded"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium">Aplicador</label>
          <input
            v-model="localForm.applicator"
            type="text"
            class="w-full border px-2 py-1 rounded"
          />
        </div>

        <div class="flex justify-end gap-2">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 rounded-lg border bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Cancelar
          </button>

          <button
            type="submit"
            class="px-4 py-2 rounded-lg border bg-ong-primary text-white hover:bg-ong-primary/90"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
