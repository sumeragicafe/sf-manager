<template>
  <div class="p-6">
    <!-- Breadcrumb -->
    <nav class="text-sm text-gray-600 mb-6">
      <ol class="flex gap-2 items-center">
        <li><RouterLink to="/staff" class="text-blue-600 hover:underline">Dashboard</RouterLink></li>
        <li>/</li>
        <li>Eventos</li>
      </ol>
    </nav>

    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Eventos</h1>
        <p class="text-gray-500">Gerencie seus eventos</p>
      </div>
      <button class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" @click="openCreateModal">
        <Plus class="w-4 h-4" /> Adicionar Evento
      </button>
    </div>

    <!-- Search & Filters -->
    <div class="mb-6 flex gap-4">
      <div class="relative w-full">
        <Search class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar por nome, local ou descrição..."
          class="w-full pl-10 pr-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
        />
      </div>
      <button class="border px-4 py-2 rounded hover:bg-gray-100">Filtros</button>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto bg-white border rounded-md shadow-sm">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-100">
          <tr class="text-left">
            <th class="p-3">Nome</th>
            <th class="p-3">Local</th>
            <th class="p-3">Início</th>
            <th class="p-3">Fim</th>
            <th class="p-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="5" class="p-4 text-gray-500">Carregando eventos...</td>
          </tr>
          <tr v-else-if="filteredEvents.length === 0">
            <td colspan="5" class="p-4 text-gray-500">Nenhum evento encontrado.</td>
          </tr>
          <tr
            v-for="event in currentEvents"
            :key="event.id"
            class="border-t hover:bg-gray-50"
          >
            <td class="p-3 font-medium text-gray-800">{{ event.name }}</td>
            <td class="p-3">{{ event.place }}</td>
            <td class="p-3 text-gray-600">{{ formatDateTime(event.start_at) }}</td>
            <td class="p-3 text-gray-600">{{ formatDateTime(event.end_at) }}</td>
            <td class="p-3 text-right">
              <div class="flex justify-end gap-1">
                <button class="p-1 hover:text-yellow-600" @click="startEdit(event)"><Edit class="w-4 h-4" /></button>
                <button class="p-1 hover:text-red-600" @click="deleteEvent(event.id)"><Trash2 class="w-4 h-4" /></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination summary & controls -->
    <div class="mt-6 flex justify-between items-center text-sm text-gray-500">
      <div>
        Mostrando {{ startIndex + 1 }} a {{ Math.min(endIndex, filteredEvents.length) }} de {{ filteredEvents.length }} eventos
      </div>
      <div class="flex gap-1">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-3 py-1 border rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          @click="currentPage = page"
          :class="[
            'px-3 py-1 border rounded',
            currentPage === page ? 'bg-blue-600 text-white' : ''
          ]"
        >
          {{ page }}
        </button>
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 border rounded disabled:opacity-50"
        >
          Próximo
        </button>
      </div>
    </div>
  </div>
  
  <!-- Modal: Adicionar Evento -->
  <div
    v-if="isModalOpen"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white p-6 rounded-md w-full max-w-2xl shadow-lg">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">{{ isEditing ? 'Editar Evento' : 'Adicionar Evento' }}</h2>
        <button @click="closeModal" aria-label="Fechar" class="text-gray-500 hover:text-gray-700">✕</button>
      </div>

      <form @submit.prevent="isEditing ? saveEdit() : createEvent()">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Nome</label>
            <input v-model="newEvent.name" type="text" class="border p-2 rounded w-full" required />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Local</label>
            <input v-model="newEvent.place" type="text" class="border p-2 rounded w-full" required />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Dia</label>
            <input v-model="newEvent.date" type="date" class="border p-2 rounded w-full" required />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Início</label>
              <input v-model="newEvent.start_time" type="time" class="border p-2 rounded w-full" required />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Fim</label>
              <input v-model="newEvent.end_time" type="time" class="border p-2 rounded w-full" required />
            </div>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm text-gray-600 mb-1">Descrição</label>
            <textarea v-model="newEvent.description" class="border p-2 rounded w-full" rows="3" required></textarea>
          </div>
        </div>

        <p v-if="errors.submit" class="text-sm text-red-600 mt-4">{{ errors.submit }}</p>

        <div class="mt-6 flex justify-end gap-2">
          <button type="button" @click="closeModal" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancelar</button>
          <button type="submit" class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">{{ isEditing ? 'Salvar' : 'Adicionar' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { showToast } from "@/utils/uiAlerts/toast";
import { Search, Plus, Edit, Trash2 } from 'lucide-vue-next';

const events = ref([]);
const loading = ref(true);
const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const errors = ref({});
const searchTerm = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

const newEvent = ref({
  name: "",
  description: "",
  place: "",
  date: "",
  start_time: "",
  end_time: "",
});

const resetForm = () => {
  newEvent.value = { name: "", description: "", place: "", date: "", start_time: "", end_time: "" };
  errors.value = {};
  isEditing.value = false;
  editingId.value = null;
};

const closeModal = () => {
  isModalOpen.value = false;
  resetForm();
};

const openCreateModal = () => {
  resetForm();
  isEditing.value = false;
  isModalOpen.value = true;
};

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
    const start_at = combineDateAndTime(newEvent.value.date, newEvent.value.start_time);
    const end_at = combineDateAndTime(newEvent.value.date, newEvent.value.end_time);

    const res = await fetch("/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: newEvent.value.name,
        place: newEvent.value.place,
        description: newEvent.value.description,
        start_at,
        end_at,
      }),
    });

    if (!res.ok) {
      let message = 'Erro ao criar evento';
      try {
        const result = await res.json();
        message = result.message || result.error || message;
      } catch (e) {
        const text = await res.text();
        if (text) message = text;
      }
      throw new Error(message);
    }

    const createdEvent = await res.json();
    events.value.push(createdEvent);
    showToast({ icon: 'success', title: 'Evento criado com sucesso' });
    closeModal();
  } catch (err) {
    console.error(err);
    errors.value = { submit: err.message || 'Erro ao criar evento' };
    showToast({ icon: 'error', title: 'Erro ao criar evento', description: err.message });
  }
};

const deleteEvent = async (id) => {
  if (!confirm("Tem certeza que deseja excluir este evento?")) return;
  try {
    const res = await fetch("/api/event", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id }),
    });

    if (!res.ok) throw new Error("Erro ao deletar evento");

    events.value = events.value.filter((e) => e.id !== id);
    showToast({ icon: 'success', title: 'Evento excluído' });
  } catch (err) {
    console.error(err);
    showToast({ icon: 'error', title: 'Erro ao excluir evento' });
  }
};

const formatDateTime = (date) => new Date(date).toLocaleString('pt-BR');

function combineDateAndTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return "";
  return `${dateStr}T${timeStr}`; // browser will send as local time
}

function timeFromDateStr(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// filtering & pagination
const filteredEvents = computed(() => {
  const term = searchTerm.value.toLowerCase();
  return events.value.filter(e =>
    (e.name || '').toLowerCase().includes(term) ||
    (e.place || '').toLowerCase().includes(term) ||
    (e.description || '').toLowerCase().includes(term)
  );
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredEvents.value.length / itemsPerPage)));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() => startIndex.value + itemsPerPage);
const currentEvents = computed(() => filteredEvents.value.slice(startIndex.value, endIndex.value));

onMounted(fetchEvents);

// Edit flow
const startEdit = (event) => {
  isEditing.value = true;
  editingId.value = event.id;
  newEvent.value = {
    name: event.name || "",
    description: event.description || "",
    place: event.place || "",
    date: event.start_at ? String(event.start_at).slice(0,10) : "",
    start_time: timeFromDateStr(event.start_at),
    end_time: timeFromDateStr(event.end_at),
  };
  isModalOpen.value = true;
};

const saveEdit = async () => {
  try {
    const res = await fetch(`/api/event/${editingId.value}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: newEvent.value.name,
        place: newEvent.value.place,
        description: newEvent.value.description,
        start_at: combineDateAndTime(newEvent.value.date, newEvent.value.start_time),
        end_at: combineDateAndTime(newEvent.value.date, newEvent.value.end_time),
      }),
    });

    if (!res.ok) {
      let message = 'Erro ao salvar alterações';
      try {
        const result = await res.json();
        message = result.message || result.error || message;
      } catch (e) {
        const text = await res.text();
        if (text) message = text;
      }
      throw new Error(message);
    }

    const updated = await res.json();
    const idx = events.value.findIndex(e => e.id === editingId.value);
    if (idx !== -1) events.value[idx] = updated;
    showToast({ icon: 'success', title: 'Evento atualizado' });
    closeModal();
  } catch (err) {
    console.error(err);
    showToast({ icon: 'error', title: 'Erro ao atualizar evento', description: err.message });
  }
};
</script>
