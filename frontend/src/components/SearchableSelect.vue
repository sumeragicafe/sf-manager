<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Selecione...' }
});
const emit = defineEmits(['update:modelValue']);

const search = ref('');
const isOpen = ref(false);

// Garante que options seja sempre um array
const normalizedOptions = computed(() => {
  if (!Array.isArray(props.options)) return [];
  // Garante que cada item tenha { id, name }
  return props.options.map(o => ({
    id: o.id,
    name: o.name ?? String(o)
  }));
});

// Filtra baseado no termo de busca
const filteredOptions = computed(() => {
  const term = search.value.toLowerCase();
  if (!term) return normalizedOptions.value;
  return normalizedOptions.value.filter(opt => opt.name.toLowerCase().includes(term));
});

// Seleciona opção
function selectOption(option) {
  emit('update:modelValue', option.id);
  search.value = option.name;
  isOpen.value = false;
}

// Atualiza search quando modelValue muda
watch(() => props.modelValue, (val) => {
  const selected = normalizedOptions.value.find(o => o.id === val);
  if (selected) search.value = selected.name;
  else search.value = '';
});

// Blur com delay para permitir clique
function handleBlur() {
  setTimeout(() => {
    isOpen.value = false;
  }, 150);
}
</script>

<template>
  <div class="relative w-full">
    <input
      type="text"
      v-model="search"
      :placeholder="placeholder"
      @focus="isOpen = true"
      @blur="handleBlur"
      class="w-full px-2 py-1 border rounded"
    />
    <ul
      v-if="isOpen && (filteredOptions.length || search.value)"
      class="absolute z-10 w-full bg-white border rounded shadow max-h-40 overflow-auto mt-1"
    >
      <li
        v-for="opt in filteredOptions"
        :key="opt.id"
        @mousedown.prevent="selectOption(opt)"
        class="px-2 py-1 hover:bg-gray-100 cursor-pointer"
      >
        {{ opt.name }}
      </li>
      <li v-if="filteredOptions.length === 0" class="px-2 py-1 text-gray-400">
        Nenhuma opção encontrada
      </li>
    </ul>
  </div>
</template>
