<!-- EventCard.vue -->
<template>
  <div
    class="rounded-lg border-2 transition-all duration-300 hover:shadow-md cursor-pointer"
    :class="[
      getEventColor(isNext),
      isHighlighted
        ? 'py-4 px-4 ring-2 ring-ong-primary ring-offset-2'
        : 'py-2 px-4'
    ]"
    @click="onClick"
  >
    <div class="flex justify-between items-start mb-2">
      <p :class="['font-bold', isHighlighted ? 'text-2xl' : 'text-xl']">
        {{ event.title }}
      </p>
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
  isNext: {
    type: Boolean,
    default: false
  },
  onClick: Function
});

const getEventColor = (isNext) => {
  if(isNext){
    return 'border-ong-secondary bg-ong-secondary/10';
  }else{
    return 'border-blue-500 bg-blue-50';
  }
};
</script>
