<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-heading font-bold text-ong-text">Usuários</h1>
        <p class="text-muted-foreground mt-2">Gerencie usuários e suas permissões de acesso</p>
      </div>
      <button @click="showAddUserModal = true" class="flex items-center gap-2 px-4 py-2 bg-ong-primary text-white rounded-lg hover:bg-ong-accent transition">
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
        <thead class="text-muted-foreground bg-ong-popover uppercase text-xs">
          <tr>
            <th class="px-4 py-3 text-left">Nome</th>
            <th class="px-4 py-3 text-left">Email</th>
            <th class="px-4 py-3 text-left">Cargo</th>
            <th class="px-4 py-3 text-left">Status</th>
            <th class="px-4 py-3 text-left">Último Acesso</th>
            <th class="px-4 py-3 text-left">Criado em</th>
            <th class="px-4 py-3 text-center">Ações</th>
          </tr>
        </thead>
        <tbody class="text-card-foreground">
          <tr
            v-for="user in filteredUsers"
            :key="user.id"
            class="border-t hover:bg-gray-50 transition-colors"
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
                  getRoleColor(user.role.name)
                ]"
              >
                <Shield class="w-3 h-3" />
                {{ user.role.name }}
              </span>
            </td>
            <td class="px-4 py-3">
              <span
                :class="{
                  'px-2 py-0.5 text-xs rounded-full font-semibold text-ong-accent': user.isActive,
                  'px-2 py-0.5 text-xs rounded-full font-semibold text-red-500': !user.isActive,
                }"
              >
                {{ user.isActive ? "Ativo" : "Desativado" }}
              </span>
            </td>
            <td class="px-4 py-3">{{ user.lastLoginAt? formatarData(user.lastLoginAt) : "Nunca entrou"  }}</td>
            <td class="px-4 py-3">{{ formatarData(user.createdAt)}}</td>
            <td class="px-4 py-3 text-center">
              <div class="flex justify-center gap-2">
                <button @click="openEditModal(user)" class="text-sm px-3 py-1 border rounded-md hover:bg-muted flex items-center gap-1">
                  <Edit class="w-3 h-3" />
                  Editar
                </button>
                <button class="text-sm px-3 py-1 border rounded-md hover:bg-muted flex items-center gap-1">
                  <Shield class="w-3 h-3" />
                  Permissões
                </button>
                <button @click="openDeleteModal(user)" class="text-sm px-3 py-1 border rounded-md text-destructive hover:text-destructive-foreground">
                  <Trash2 class="w-3 h-3" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>


  <!-- Modal de Edição -->
<div
  v-if="modalEditOpen"
  class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
>
  <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
    <h2 class="text-xl font-semibold mb-4">Editar Usuário</h2>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Nome</label>
        <input
          v-model="selectedUser.name"
          class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Email</label>
        <input
          v-model="selectedUser.email"
          class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
    </div>
    <div class="mt-6 flex justify-end gap-2">
      <button @click="modalEditOpen = false" class="px-4 py-2 bg-gray-200 rounded-md">Cancelar</button>
      <button @click="saveUserEdits" class="px-4 py-2 bg-ong-primary text-white rounded-md hover:bg-ong-accent">Salvar</button>
    </div>
  </div>
</div>

<!-- Modal de Confirmação de Exclusão -->
<div
  v-if="modalDeleteOpen"
  class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
>
  <div class="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
    <h2 class="text-lg font-semibold text-red-600">Confirmar Exclusão</h2>
    <p class="mt-2 text-sm text-gray-600">Deseja realmente excluir o usuário <strong>{{ selectedUser.name }}</strong>?</p>
    <div class="mt-6 flex justify-end gap-2">
      <button @click="modalDeleteOpen = false" class="px-4 py-2 bg-gray-200 rounded-md">Cancelar</button>
      <button @click="deleteUser" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Excluir</button>
    </div>
  </div>
</div>

<!-- Modal de Adição de Usuário -->
<div
  v-if="showAddUserModal"
  class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
>
  <div class="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-ong-text">Adicionar Usuário</h2>
      <button @click="showAddUserModal = false" class="text-gray-500 hover:text-gray-700">&times;</button>
    </div>

    <form @submit.prevent="submitAddUser">
      <div class="space-y-4">
        <div>
          <label class="text-sm font-medium text-gray-700">Nome</label>
          <input
            v-model="newUser.name"
            type="text"
            class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-ong-primary"
            required
          />
        </div>

        <div>
          <label class="text-sm font-medium text-gray-700">Username</label>
          <input
            v-model="newUser.username"
            type="text"
            class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-ong-primary"
            required
          />
        </div>

        <div>
          <label class="text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="newUser.email"
            type="email"
            class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-ong-primary"
            required
          />
        </div>

        <div>
          <label class="text-sm font-medium text-gray-700">Senha</label>
          <input
            v-model="newUser.password"
            type="password"
            class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-ong-primary"
            required
          />
        </div>

        <!-- <div>
          <label class="text-sm font-medium text-gray-700">URL da Foto de Perfil</label>
          <input
            v-model="newUser.profilePictureUrl"
            type="text"
            class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-ong-primary"
          />
        </div> -->

        <div>
          <label class="text-sm font-medium text-gray-700">Cargo</label>
          <select
            v-model="newUser.role"
            class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-ong-primary"
            required
          >
            <option value="" disabled selected>Selecione um cargo</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
        </div>

      </div>

      <div class="mt-6 flex justify-end gap-2">
        <button
          type="button"
          @click="showAddUserModal = false"
          class="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-ong-primary text-white rounded-md hover:bg-ong-accent"
        >
          Adicionar
        </button>
      </div>
    </form>
  </div>
</div>

</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Shield,
  User
} from 'lucide-vue-next'

import {formatarData} from '../../../utils/format/index.js';

const searchTerm = ref('')


async function fetchUsers() {
  try {
    const response = await fetch('/api/user/list')
    if (!response.ok) {
      throw new Error('Erro ao buscar usuários')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erro na requisição:', error)
    return []
  }
}

async function fetchAllRoles(){
  try {
    const response = await fetch('/api/role');
    if (!response.ok) {
      throw new Error('Erro ao buscar usuários');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro na requisição:', error);
    return [];
  }
}

const filteredUsers = computed(() => {
  const term = searchTerm.value.toLowerCase()
  return users.value.filter(user =>
    user.name.toLowerCase().includes(term) ||
    user.email.toLowerCase().includes(term)
  )
})

function getRoleColor(role) {
  switch (role) {
    case 'Administrador':
      return 'bg-red-100 text-red-800'
    case 'MODERATOR':
      return 'bg-blue-100 text-blue-800'
    case 'Voluntário':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// modais
const modalEditOpen = ref(false)
const modalDeleteOpen = ref(false)
const selectedUser = ref({})

function openEditModal(user) {
  selectedUser.value = { ...user }
  modalEditOpen.value = true
}

function openDeleteModal(user) {
  selectedUser.value = { ...user }
  modalDeleteOpen.value = true
}

function saveUserEdits() {
  console.log('Salvando usuário:', selectedUser.value)
  // Aqui você faria uma requisição PUT/PATCH
  modalEditOpen.value = false
}

function deleteUser() {
  console.log('Deletando usuário:', selectedUser.value.id)
  // Aqui você faria uma requisição DELETE
  users.value = users.value.filter(u => u.id !== selectedUser.value.id)
  modalDeleteOpen.value = false
}

const showAddUserModal = ref(false)

const newUser = ref({
  name: '',
  username: '',
  email: '',
  password: '',
  role: ''
});

async function submitAddUser() {
  try {
    const response = await fetch('/api/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser.value)
    })

    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao registrar usuário');
    }


    const created = await response.json();
    users.value.push(created); // atualiza a lista

    showAddUserModal.value = false;
    resetForm()
  } catch (error) {
    console.error('Erro ao adicionar usuário:', error)
  }
}

function resetForm() {
  newUser.value = {
    name: '',
    username: '',
    email: '',
    password: '',
    profilePictureUrl: ''
  }
}

const users = ref([])
const roles = ref([]);


watch(showAddUserModal, async (opened) => {
  if (opened) {
    roles.value = await fetchAllRoles();
  }
});

onMounted(async () => {
  users.value = await fetchUsers()
})


</script>
