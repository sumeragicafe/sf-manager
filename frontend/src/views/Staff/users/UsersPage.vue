<template>
  <div class="container">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-heading font-bold text-ong-text">Usuários</h1>
        <p class="text-muted-foreground mt-2">Gerencie usuários e suas permissões de acesso</p>
      </div>
      <button class="flex items-center gap-2 px-4 py-2 bg-ong-primary text-white rounded-lg hover:bg-ong-accent transition">
        <Plus class="w-4 h-4" />
        Adicionar Usuário
      </button>
    </div>

    <!-- Search -->
    <div class="mb-6">
      <div class="relative max-w-md">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar por nome, email ou cargo..."
          class="pl-10 pr-4 py-2 w-full text-sm rounded-md border border-border focus:ring-ring focus:outline-none bg-background text-foreground"
        />
      </div>
    </div>

    <!-- Tabela de Usuários -->
    <div class="overflow-x-auto bg-card rounded-lg shadow-sm animate-fade-in">
      <table class="w-full table-auto text-sm">
        <thead class="text-muted-foreground bg-muted uppercase text-xs">
          <tr>
            <th class="px-4 py-3 text-left">Nome</th>
            <th class="px-4 py-3 text-left">Email</th>
            <th class="px-4 py-3 text-left">Cargo</th>
            <th class="px-4 py-3 text-left">Status</th>
            <th class="px-4 py-3 text-left">Último Acesso</th>
            <th class="px-4 py-3 text-left">Criado em</th>
            <th class="px-4 py-3 text-left">Permissões</th>
            <th class="px-4 py-3 text-center">Ações</th>
          </tr>
        </thead>
        <tbody class="text-card-foreground">
          <tr
            v-for="user in filteredUsers"
            :key="user.id"
            class="border-t hover:bg-muted transition-colors"
          >
            <td class="px-4 py-3 flex items-center gap-2">
              <div class="w-8 h-8 bg-ong-primary/10 rounded-full flex items-center justify-center">
                <User class="h-4 w-4 text-ong-primary" />
              </div>
              {{ user.name }}
            </td>
            <td class="px-4 py-3">{{ user.email }}</td>
            <td class="px-4 py-3">
              <span
                :class="[
                  'px-2 py-0.5 text-xs rounded-full font-semibold inline-flex items-center gap-1',
                  getRoleColor(user.role)
                ]"
              >
                <Shield class="w-3 h-3" />
                {{ user.role }}
              </span>
            </td>
            <td class="px-4 py-3">
              <span
                :class="[
                  'px-2 py-0.5 text-xs rounded-full font-semibold',
                  getStatusColor(user.status)
                ]"
              >
                {{ user.status }}
              </span>
            </td>
            <td class="px-4 py-3">{{ user.lastLogin }}</td>
            <td class="px-4 py-3">{{ user.createdAt }}</td>
            <td class="px-4 py-3">
              <div class="flex flex-wrap gap-1">
                <span
                  v-if="user.permissions.includes('all')"
                  class="border text-xs px-2 py-0.5 rounded text-muted-foreground"
                >
                  Todas as permissões
                </span>
                <span
                  v-else
                  v-for="permission in user.permissions"
                  :key="permission"
                  class="border text-xs px-2 py-0.5 rounded text-muted-foreground"
                >
                  {{ permission }}
                </span>
              </div>
            </td>
            <td class="px-4 py-3 text-center">
              <div class="flex justify-center gap-2">
                <button class="text-sm px-3 py-1 border rounded-md hover:bg-muted flex items-center gap-1">
                  <Edit class="w-3 h-3" />
                  Editar
                </button>
                <button class="text-sm px-3 py-1 border rounded-md hover:bg-muted flex items-center gap-1">
                  <Shield class="w-3 h-3" />
                  Permissões
                </button>
                <button class="text-sm px-3 py-1 border rounded-md text-destructive hover:text-destructive-foreground">
                  <Trash2 class="w-3 h-3" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Shield,
  User
} from 'lucide-vue-next'

const searchTerm = ref('')

const users = ref([
  {
    id: 1,
    name: 'Maria Silva',
    email: 'maria@ong.com',
    role: 'Administrador',
    status: 'Ativo',
    lastLogin: '2024-01-15 10:30',
    createdAt: '2023-06-15',
    permissions: ['all']
  },
  {
    id: 2,
    name: 'João Santos',
    email: 'joao@ong.com',
    role: 'Moderador',
    status: 'Ativo',
    lastLogin: '2024-01-14 16:20',
    createdAt: '2023-08-22',
    permissions: ['events', 'animals', 'adopters']
  },
  {
    id: 3,
    name: 'Ana Costa',
    email: 'ana@ong.com',
    role: 'Voluntário',
    status: 'Ativo',
    lastLogin: '2024-01-13 09:45',
    createdAt: '2023-11-10',
    permissions: ['events']
  },
  {
    id: 4,
    name: 'Pedro Lima',
    email: 'pedro@ong.com',
    role: 'Voluntário',
    status: 'Inativo',
    lastLogin: '2023-12-20 14:30',
    createdAt: '2023-09-05',
    permissions: ['animals']
  }
])

const filteredUsers = computed(() => {
  const term = searchTerm.value.toLowerCase()
  return users.value.filter(user =>
    user.name.toLowerCase().includes(term) ||
    user.email.toLowerCase().includes(term) ||
    user.role.toLowerCase().includes(term)
  )
})

function getRoleColor(role) {
  switch (role) {
    case 'Administrador':
      return 'bg-red-100 text-red-800'
    case 'Moderador':
      return 'bg-blue-100 text-blue-800'
    case 'Voluntário':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getStatusColor(status) {
  switch (status) {
    case 'Ativo':
      return 'bg-green-100 text-green-800'
    case 'Inativo':
      return 'bg-gray-100 text-gray-800'
    case 'Suspenso':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>
