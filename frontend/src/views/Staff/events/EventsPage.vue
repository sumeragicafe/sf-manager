<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Gerenciar Eventos</h1>

    <!-- Formulário de criação -->
    <form @submit.prevent="createEvent" class="mb-8 bg-white shadow-md rounded p-6">
      <h2 class="text-lg font-semibold mb-4">Novo Evento</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="newEvent.name" type="text" placeholder="Nome" class="border p-2 rounded w-full" required />
        <input v-model="newEvent.place" type="text" placeholder="Local" class="border p-2 rounded w-full" required />
        <input v-model="newEvent.start_at" type="datetime-local" class="border p-2 rounded w-full" required />
        <input v-model="newEvent.end_at" type="datetime-local" class="border p-2 rounded w-full" required />
        <textarea v-model="newEvent.description" placeholder="Descrição" class="border p-2 rounded col-span-full" rows="3" required></textarea>
      </div>
      <button type="submit" class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
        Criar Evento
      </button>
    </form>

    <!-- Lista de eventos -->
    <div>
      <h2 class="text-lg font-semibold mb-4">Lista de Eventos</h2>
      <div v-if="loading" class="text-gray-500">Carregando eventos...</div>
      <div v-else-if="events.length === 0" class="text-gray-500">Nenhum evento encontrado.</div>

      <ul class="space-y-4">
        <li v-for="event in events" :key="event.id" class="bg-white shadow p-4 rounded flex justify-between items-center">
          <div>
            <h3 class="text-xl font-bold">{{ event.name }}</h3>
            <p class="text-gray-600">{{ event.description }}</p>
            <p class="text-sm text-gray-500">📍 {{ event.place }}</p>
            <p class="text-sm text-gray-500">
              ⏳ {{ formatDate(event.start_at) }} - {{ formatDate(event.end_at) }}
            </p>
          </div>
          <button
            @click="deleteEvent(event.id)"
            class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Excluir
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const events = ref([]);
const loading = ref(true);

const newEvent = ref({
  name: "",
  description: "",
  place: "",
  start_at: "",
  end_at: "",
});

const fetchEvents = async () => {
  loading.value = true;
  try {
    const res = await fetch("/api/event");
    if (!res.ok) throw new Error(res.message);
    events.value = await res.json();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const createEvent = async () => {
  try {
    const res = await fetch("/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent.value),
    });

    if (!res.ok) {
      const result = await res.json();
      throw new Error(result.message);
    }

    const createdEvent = await res.json();
    events.value.push(createdEvent);

    newEvent.value = { name: "", description: "", place: "", start_at: "", end_at: "" };
  } catch (err) {
    console.error(err);
  }
};

const deleteEvent = async (id) => {
  if (!confirm("Tem certeza que deseja excluir este evento?")) return;
  try {
    const res = await fetch("/api/event", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) throw new Error("Erro ao deletar evento");

    events.value = events.value.filter((e) => e.id !== id);
  } catch (err) {
    console.error(err);
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleString("pt-BR");
};

onMounted(fetchEvents);
</script>
