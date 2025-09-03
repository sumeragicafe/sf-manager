<template>
  <div class="bg-white rounded-2xl p-6 shadow-lg h-full">
    <div class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-300">
      
      <!-- Próximo Evento -->
      <div class="pr-0 md:pr-6 pb-6 md:pb-0">
        <h5 class="text-ong-text mb-4 flex items-center gap-2">
          <Calendar size="24" />
          Próximo Evento
        </h5>
        <EventCard v-if="nextEvent" :event="nextEvent" :isHighlighted="true" />
        <div v-else class="text-sm text-ong-text/70">Nenhum evento futuro cadastrado.</div>
      </div>

      <!-- Outros Eventos -->
      <div class="pl-0 md:pl-6 pt-6 md:pt-0">
        <h5 class="text-ong-text mb-6 flex items-center gap-2">
          <Calendar size="24" />
          Outros Eventos
        </h5>

        <div class="space-y-4 max-h-96 overflow-y-auto">
          <EventCard v-for="event in upcomingEvents" :key="event.id" :event="event" />
          <div v-if="!loading && upcomingEvents.length === 0" class="text-sm text-ong-text/70">
            Nenhum outro evento no momento.
          </div>
        </div>

        
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Calendar } from 'lucide-vue-next';
import EventCard from './EventCard.vue';

const events = ref([]);
const loading = ref(true);

function mapToCard(e) {
  const start = new Date(e.start_at);
  const end = new Date(e.end_at);
  const date = start.toLocaleDateString('pt-BR');
  const time = `${start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  return {
    id: e.id,
    title: e.name,
    date,
    time,
    description: e.description,
    location: e.place,
    type: 'general'
  };
}

const nextEvent = computed(() => events.value[0] || null);
const upcomingEvents = computed(() => events.value.slice(1));

onMounted(async () => {
  try {
    const res = await fetch('/api/event');
    const data = await res.json();
    const sorted = (Array.isArray(data) ? data : [])
      .sort((a, b) => new Date(a.start_at) - new Date(b.start_at));
    events.value = sorted.map(mapToCard);
  } catch (err) {
    console.error('Erro ao carregar eventos:', err);
  } finally {
    loading.value = false;
  }
});

</script>
