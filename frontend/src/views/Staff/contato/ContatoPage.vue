<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-heading font-bold text-ong-text">Contatos</h1>
        <p class="text-muted-foreground mt-2">Mensagens enviadas pelo formulário de contato</p>
      </div>
    </div>

    <!-- Pagination (toolbar + filtros + busca) -->
    <Pagination
      :total="total"
      :page="page"
      :pageSize="pageSize"
      :search="search"
      :filters="[
        {
          label: 'Status',
          value: readFilter,
          options: [
            { label: 'Todos', value: undefined },
            { label: 'Não lidos', value: false },
            { label: 'Lidos', value: true }
          ]
        }
      ]"
      @update:page="val => { page = val }"
      @update:pageSize="val => { pageSize = val; page = 1 }"
      @update:search="val => { search = val; page = 1 }"
      @update:dynamic-filter="({ label, value }) => {
        if (label === 'Status') readFilter = value;
        page = 1;
        load();
      }"
    />

    <!-- Table -->
    <div class="overflow-x-auto bg-card rounded-lg shadow-sm mt-4 animate-fade-in">
      <table class="w-full table-auto text-sm">
        <thead class="text-muted-foreground bg-ong-popover uppercase text-xs">
          <tr>
            <th class="px-4 py-3 text-left">Nome</th>
            <th class="px-4 py-3 text-left">Email</th>
            <th class="px-4 py-3 text-left">Assunto</th>
            <th class="px-4 py-3 text-left">Mensagem</th>
            <th class="px-4 py-3 text-left">Data</th>
            <th class="px-4 py-3 text-left">Status</th>
            <th class="px-4 py-3 text-center">Ações</th>
          </tr>
        </thead>
        <tbody class="text-card-foreground">
          <tr v-for="msg in items" :key="msg.id" class="border-t hover:bg-gray-50 transition-colors">
            <td class="px-4 py-3">{{ msg.name }}</td>
            <td class="px-4 py-3">{{ msg.email }}</td>
            <td class="px-4 py-3">{{ msg.subject }}</td>
            <td class="px-4 py-3">
              <span class="block max-w-[360px] truncate">{{ msg.message }}</span>
            </td>
            <td class="px-4 py-3">{{ formatarData(msg.createdAt) }}</td>
            <td class="px-4 py-3">
              <span
                :class="['px-2 py-0.5 text-xs rounded-full font-semibold',
                msg.read ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800']">
                {{ msg.read ? 'Lido' : 'Não lido' }}
              </span>
            </td>
            <td class="px-4 py-3 text-center">
              <div class="flex justify-center gap-2">
                <button @click="openView(msg)" class="text-sm px-3 py-1 border rounded-md text-ong-primary hover:bg-ong-primary/10">Visualizar</button>
                <button @click="toggleRead(msg)" class="text-sm px-3 py-1 border rounded-md text-gray-700 hover:bg-gray-100">
                  {{ msg.read ? 'Marcar não lido' : 'Marcar lido' }}
                </button>
                <button @click="removeMessage(msg)" class="text-sm px-3 py-1 border rounded-md text-red-600 hover:bg-red-50">Excluir</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-xl animate-scale-in">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-ong-text">Mensagem</h2>
          <button @click="showModal = false" class="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>
        <div v-if="selected">
          <div class="mb-2 text-sm text-muted-foreground">{{ selected.name }} • {{ selected.email }}</div>
          <div class="font-medium mb-1">Assunto: {{ selected.subject }}</div>
          <div class="whitespace-pre-wrap break-words text-sm">{{ selected.message }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Pagination from '@/components/Pagination.vue'
import { formatarData } from '@/utils/format/index.js'

const items = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(20);
const search = ref('');
const readFilter = ref('Todos')

const showModal = ref(false)
const selected = ref(null)

async function load() {
  const filters = {}
  if (typeof readFilter.value === 'boolean') filters.read = readFilter.value
  if (search.value) filters.search = search.value

  const params = new URLSearchParams({
    page: String(page.value),
    pageSize: String(pageSize.value),
    filters: JSON.stringify(filters)
  })

  const res = await fetch(`/api/contact?${params.toString()}`)
  if (!res.ok) return
  const data = await res.json()
  items.value = data.items
  total.value = data.total
}

function openView(msg) {
  selected.value = msg
  showModal.value = true
  if (!msg.read) {
    msg.read = true
    fetch(`/api/contact/${msg.id}/read`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: true })
    })
  }
}

async function toggleRead(msg) {
  const newVal = !msg.read
  msg.read = newVal
  await fetch(`/api/contact/${msg.id}/read`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ read: newVal })
  })
}

async function removeMessage(msg) {
  if (!confirm('Excluir esta mensagem?')) return
  await fetch(`/api/contact/${msg.id}`, { method: 'DELETE' })
  await load()
}

watch([page, pageSize, search, readFilter], () => load(), { deep: true })
onMounted(load)
</script>
