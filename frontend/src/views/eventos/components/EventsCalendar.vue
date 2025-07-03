<template>
  <div class="bg-white rounded-2xl p-6 shadow-lg">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-2xl font-bold text-ong-text">
        {{ months[currentMonth] }} {{ currentYear }}
      </h3>
      <div class="flex gap-2">
        <button @click="prevMonth" class="p-2 rounded-lg hover:bg-gray-100 transition-colors text-ong-text">
          <ChevronLeft size="20" />
        </button>
        <button @click="nextMonth" class="p-2 rounded-lg hover:bg-gray-100 transition-colors text-ong-text">
          <ChevronRight size="20" />
        </button>
      </div>
    </div>

    <div class="grid grid-cols-7 gap-0 mb-2">
      <div v-for="day in weekDays" :key="day" class="h-12 flex items-center justify-center border border-gray-200 bg-gray-50">
        <span class="text-sm font-medium text-ong-text/70">{{ day }}</span>
      </div>
    </div>

    <div class="grid grid-cols-7 gap-0 rounded-lg overflow-hidden">
      <div v-for="(cell, index) in calendarCells" :key="index"
           class="h-16 border border-gray-200 p-2 relative bg-white hover:bg-gray-50 transition-colors cursor-pointer">
        <span v-if="cell.day" class="text-ong-text text-sm font-medium">{{ cell.day }}</span>
        <div v-if="cell.event"
             :class="['absolute bottom-1 left-1 right-1 h-2 rounded', getEventColor(cell.event.type)]"
             :title="cell.event.title"></div>
      </div>
    </div>

    <div class="mt-6 flex flex-wrap gap-4 text-sm">
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 bg-ong-primary rounded"></div>
        <span class="text-ong-text">Feira de adoção</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 bg-green-500 rounded"></div>
        <span class="text-ong-text">Arrecadação</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 bg-blue-500 rounded"></div>
        <span class="text-ong-text">Voluntários</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

const currentMonth = ref(4);
const currentYear = ref(2025);

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const events = [
  { date: 10, title: 'Feira de adoção', type: 'adoption' },
  { date: 15, title: 'Voluntários', type: 'volunteer' },
  { date: 23, title: 'Arrecadação', type: 'fundraising' },
  { date: 28, title: 'Feira de adoção', type: 'adoption' }
];

const getEventColor = (type) => {
  return {
    adoption: 'bg-ong-primary',
    fundraising: 'bg-green-500',
    volunteer: 'bg-blue-500'
  }[type] || 'bg-ong-secondary';
};

const nextMonth = () => {
  currentMonth.value = (currentMonth.value + 1) % 12;
};

const prevMonth = () => {
  currentMonth.value = (currentMonth.value - 1 + 12) % 12;
};

const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

const calendarCells = computed(() => {
  const daysInMonth = getDaysInMonth(currentMonth.value, currentYear.value);
  const firstDay = getFirstDayOfMonth(currentMonth.value, currentYear.value);
  const cells = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push({});
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const event = events.find(e => e.date === day);
    cells.push({ day, event });
  }

  return cells;
});
</script>
