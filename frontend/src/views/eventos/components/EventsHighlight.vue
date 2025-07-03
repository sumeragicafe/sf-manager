<template>
  <div class="bg-white rounded-2xl p-6 shadow-lg h-full">
    <div class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-300">
      
      <!-- Próximo Evento -->
      <div class="pr-0 md:pr-6 pb-6 md:pb-0">
        <h5 class="text-ngo-text mb-4 flex items-center gap-2">
          <Calendar size="24" />
          Próximo Evento
        </h5>
        <EventCard :event="nextEvent" :isHighlighted="true" />
      </div>

      <!-- Outros Eventos -->
      <div class="pl-0 md:pl-6 pt-6 md:pt-0">
        <h5 class="text-ngo-text mb-6 flex items-center gap-2">
          <Calendar size="24" />
          Outros Eventos
        </h5>

        <div class="space-y-4 max-h-96 overflow-y-auto">
          <EventCard
            v-for="event in upcomingEvents"
            :key="event.id"
            :event="event"
          />
        </div>

        <button class="w-full mt-4 btn-secondary">
          Ver Todos os Eventos
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { Calendar } from 'lucide-vue-next';
import EventCard from './EventCard.vue';

const Events = [
    {
        id: '1',
        title: 'Feira de adoção',
        date: '10/05/2025',
        time: '13:00 - 16:00',
        description: 'Encontre seu melhor amigo de quatro patas! Venha para nossa feira de adoção e mude uma vida - a sua e a deles!',
        location: 'Parque Central',
        type: 'adoption'
    },
    {
        id: '2',
        title: 'Encontro de arrecadação',
        date: '23/05/2025',
        time: '14:00 - 17:00',
        description: 'Evento para arrecadação de fundos e doações para manutenção do abrigo.',
        location: 'Centro Comunitário',
        type: 'fundraising'
    },
    {
        id: '3',
        title: 'Dia do Voluntário',
        date: '15/06/2025',
        time: '09:00 - 16:00',
        description: 'Venha conhecer nosso trabalho e se tornar um voluntário.',
        location: 'Sede da ONG',
        type: 'volunteer'
    },
    {
        id: '4',
        title: 'Workshop de Cuidados',
        date: '30/06/2025',
        time: '10:00 - 12:00',
        description: 'Aprenda como cuidar melhor dos animais de estimação.',
        location: 'Auditório Municipal',
        type: 'volunteer'
    }
];

const nextEvent = Events[0];
const upcomingEvents = Events.slice(1);

</script>
