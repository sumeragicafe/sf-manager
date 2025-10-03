<script setup>
import { ref, watch } from 'vue';
import BaseButton from '@/components/BaseButton.vue';
import { showToast } from '@/utils/uiAlerts/toast';

const props = defineProps({
  isOpen: Boolean,
  petId: String,
  isEditing: Boolean,
  formData: Object,
});

const emit = defineEmits(['close', 'saved']);

const saving = ref(false);
const localData = ref({ text: '' });

// sempre que abrir modal, sincroniza dados
watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      localData.value = { ...props.formData };
    }
  }
);

async function save() {
  if (!props.petId) {
    showToast({ icon: 'error', title: 'Animal inválido' });
    return;
  }

  saving.value = true;

  try {
    let res;

    if (props.isEditing) {
      // Update
      res = await fetch(`/api/animal/fact/${localData.value.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: localData.value.text }),
      });
    } else {
      // Create
      res = await fetch(`/api/animal/${props.petId}/fact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: localData.value.text }),
      });
    }

    if (!res.ok) throw new Error('Erro ao salvar fato');

    await res.json();
    emit('saved');
  } catch (err) {
    console.error(err);
    showToast({ icon: 'error', title: 'Erro ao salvar fato' });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
  >
    <div
      class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 animate-fade-in"
    >
      <h2 class="text-lg font-semibold mb-4">
        {{ isEditing ? 'Editar Fato' : 'Novo Fato' }}
      </h2>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          v-model="localData.text"
          rows="4"
          class="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-ong-primary"
          placeholder="Digite aqui o fato sobre o animal..."
        />
      </div>

      <div class="flex justify-end gap-2 mt-6">
        <BaseButton variant="default" @click="emit('close')">Cancelar</BaseButton>
        <BaseButton
          variant="primary"
          :disabled="saving || !localData.text"
          @click="save"
        >
          {{ saving ? 'Salvando...' : 'Salvar' }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>
