<!-- EventCard.vue -->
<template>
  <div
    class="p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md cursor-pointer"
    :class="[
      getEventColor(event.type),
      isHighlighted ? 'ring-2 ring-ong-primary ring-offset-2' : ''
    ]"
    @click="onClick"
  >
    <div class="flex justify-between items-start mb-2">
      <h4 :class="['font-semibold text-ong-text', isHighlighted ? 'text-xl' : '']">
        {{ event.title }}
      </h4>
      <span
        :class="[
          'text-ong-text/70 font-medium bg-white px-2 py-1 rounded',
          isHighlighted ? 'text-base' : 'text-sm'
        ]"
      >
        {{ event.date }}
      </span>
    </div>

    <div :class="['flex items-center gap-2 text-ong-text/70 mb-2', isHighlighted ? 'text-base' : 'text-sm']">
      <Clock :size="isHighlighted ? 20 : 16" />
      <span>{{ event.time }}</span>
    </div>

    <div
      v-if="event.location"
      :class="['flex items-center gap-2 text-ong-text/70 mb-3', isHighlighted ? 'text-base' : 'text-sm']"
    >
      <MapPin :size="isHighlighted ? 20 : 16" />
      <span>{{ event.location }}</span>
    </div>

    <p :class="['text-ong-text/80 leading-relaxed', isHighlighted ? 'text-base' : 'text-sm']">
      {{ event.description }}
    </p>
  </div>
</template>

<script setup>
import { Clock, MapPin } from 'lucide-vue-next';

const props = defineProps({
  event: Object,
  isHighlighted: {
    type: Boolean,
    default: false
  },
  onClick: Function
});

const getEventColor = (type) => {
  switch (type) {
    case 'adoption':
      return 'border-ong-primary bg-ong-primary/10';
    case 'fundraising':
      return 'border-green-500 bg-green-50';
    case 'volunteer':
      return 'border-blue-500 bg-blue-50';
    default:
      return 'border-ong-secondary bg-ong-secondary/10';
  }
};
</script>
