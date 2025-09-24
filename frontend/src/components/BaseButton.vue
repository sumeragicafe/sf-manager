<template>
  <button
    @click="onClick"
    :class="[
      'flex items-center justify-center transition-colors duration-200 border font-medium',
      baseStyle,
      variantClasses
    ]"
    :type="type"
  >
    <component :is="icon" class="w-4 h-4" v-if="icon" />
    <span v-if="text">{{ text }}</span>
  </button>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  icon: [Object, Function],
  text: String,
  onClick: Function,
  type: {
    type: String,
    default: 'button',
  },
  variant: {
    type: String,
    default: 'danger',
  },
});

const baseStyle = computed(() => {
  return props.text
    ? 'px-3 py-1.5 rounded-md text-sm gap-1'
    : 'w-8 h-8 p-1 rounded-md'; // Ícone apenas → quadrado
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return `
        bg-ong-primary text-white border-ong-primary
        hover:bg-ong-primary/80
        focus:outline-none
      `;
    case 'secondary':
      return `
        bg-ong-secondary text-white border-ong-secondary
        hover:bg-transparent hover:text-ong-secondary
        focus:outline-none
      `;
    case 'danger':
    case 'destructive':
      return `
        bg-destructive text-white border-destructive
        hover:bg-transparent hover:text-destructive
        focus:outline-none
      `;
    case 'warning':
      return `
        bg-yellow-400 text-white border-yellow-400
        hover:bg-transparent hover:text-yellow-400
        focus:outline-none
      `;
    default:
      return `
        bg-gray-200 text-gray-800 border-gray-200
        hover:bg-transparent hover:text-gray-800
        focus:outline-none
      `;
  }
});
</script>
