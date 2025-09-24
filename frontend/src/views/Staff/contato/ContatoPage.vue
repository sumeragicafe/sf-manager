<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-heading font-bold text-ong-text">Contatos</h1>
        <p class="text-muted-foreground mt-2">Mensagens enviadas pelo formulário de contato</p>
      </div>
    </div>

    <!-- Toolbar: search + filters -->
    <div class="flex flex-col md:flex-row gap-3 items-start md:items-center mb-4">
      <div class="relative max-w-md w-full">
        <input v-model="search" type="text" placeholder="Buscar por nome, e-mail ou assunto..."
               class="pl-3 pr-3 py-2 w-full text-sm rounded-md border border-border focus:ring-ring focus:outline-none bg-background text-foreground" />
      </div>
      <div class="flex items-center gap-2">
        <select v-model="readFilter" class="px-3 py-2 text-sm rounded-md border border-border bg-white">
          <option :value="undefined">Todos</option>
          <option :value="false">Não lidos</option>
          <option :value="true">Lidos</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto bg-card rounded-lg shadow-sm animate-fade-in">
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
              <span :class="['px-2 py-0.5 text-xs rounded-full font-semibold', msg.read ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800']">
                {{ msg.read ? 'Lido' : 'Não lido' }}
              </span>
            </td>
            <td class="px-4 py-3 text-center">
              <div class="flex justify-center gap-2">
                <button @click="openView(msg)" class="text-sm px-3 py-1 border rounded-md text-ong-primary hover:bg-ong-primary/10">Visualizar</button>
                <button @click="toggleRead(msg)" class="text-sm px-3 py-1 border rounded-md text-gray-700 hover:bg-gray-100">{{ msg.read ? 'Marcar não lido' : 'Marcar lido' }}</button>
                <button @click="removeMessage(msg)" class="text-sm px-3 py-1 border rounded-md text-red-600 hover:bg-red-50">Excluir</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between mt-4">
      <div class="text-sm text-muted-foreground">Total: {{ total }}</div>
      <div class="flex items-center gap-2">
        <button @click="prevPage" :disabled="page === 1" class="px-3 py-1 border rounded">Anterior</button>
        <span class="text-sm">Página {{ page }}</span>
        <button @click="nextPage" :disabled="page * pageSize >= total" class="px-3 py-1 border rounded">Próxima</button>
      </div>
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
import { formatarData } from '@/utils/format/index.js'

const items = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const search = ref('')
const readFilter = ref()

const showModal = ref(false)
const selected = ref(null)

async function load() {
  const params = new URLSearchParams({
    page: String(page.value),
    pageSize: String(pageSize.value)
  })
  if (search.value) params.set('search', search.value)
  if (typeof readFilter.value === 'boolean') params.set('read', String(readFilter.value))

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
    // optimistically mark as read
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

function prevPage() {
  if (page.value > 1) {
    page.value--
    load()
  }
}

function nextPage() {
  if (page.value * pageSize.value < total.value) {
    page.value++
    load()
  }
}

watch([search, readFilter], () => {
  page.value = 1
  load()
})

onMounted(load)
</script>
