<template>
    <div class="container mx-auto px-4 py-8">
        <div class="text-start mb-8">
            <h1 class="text-ong-text mb-4">Eventos</h1>
        </div>
        <EventsHighlight class="mb-8"></EventsHighlight>
        <EventsCalendar />
    </div>
</template>

<script setup>
import EventsCalendar from './components/EventsCalendar.vue';
import EventsHighlight from './components/EventsHighlight.vue';
</script>
