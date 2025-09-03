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
    <div 
      v-for="(cell, index) in calendarCells" 
      :key="index"
      :class="[
        'h-16 border border-gray-200 p-2 relative transition-colors cursor-pointer',
        isToday(cell.day) ? 'bg-orange-100 hover:bg-orange-200' : 'bg-white hover:bg-gray-50'
      ]"
    >
      <span 
        v-if="cell.day" 
        :class="[
          'text-sm font-medium',
          isToday(cell.day) ? 'text-orange-700 font-bold' : 'text-ong-text'
        ]"
      >
        {{ cell.day }}
      </span>

      <div v-if="cell.event"
          :class="['absolute bottom-1 left-1 right-1 h-2 rounded', getEventColor(cell.event)]"
          :title="cell.event.title"></div>
    </div>
  </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const events = ref([]);

const getEventColor = (event) => {
  if (event?.isNext) {
    return 'bg-ong-secondary'; // laranja só para o primeiro evento futuro
  }else{
    return 'bg-blue-300';
  }
};

const isToday = (day) => {
  if (!day) return false;
  return (
    day === today.getDate() &&
    currentMonth.value === today.getMonth() &&
    currentYear.value === today.getFullYear()
  );
};


const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value += 1;
  } else {
    currentMonth.value += 1;
  }
};

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value -= 1;
  } else {
    currentMonth.value -= 1;
  }
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
    const event = events.value.find(e => e.date === day);
    cells.push({ day, event });
  }

  return cells;
});

async function loadEventsForMonth(year, month) {
  try {
    const res = await fetch('/api/event');
    const data = await res.json();
    const filtered = (Array.isArray(data) ? data : [])
      .filter(e => {
        const d = new Date(e.start_at);
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .map(e => ({
        date: new Date(e.start_at).getDate(),
        fullDate: new Date(e.start_at),
        title: e.name,
        type: 'general',
        isNext: false
      }));
    events.value = filtered;

    const now = new Date();
    const futureEvents = filtered.filter(e => e.fullDate >= now);
    if (futureEvents.length > 0) {
      const firstEvent = futureEvents.sort((a, b) => a.fullDate - b.fullDate)[0];
      firstEvent.isNext = true;
    }

    console.log(events.value);

  } catch (err) {
    console.error('Erro ao carregar eventos (calendar):', err);
    events.value = [];
  }
}

onMounted(() => loadEventsForMonth(currentYear.value, currentMonth.value));
watch([currentMonth, currentYear], ([m], [y]) => loadEventsForMonth(currentYear.value, currentMonth.value));
</script>
