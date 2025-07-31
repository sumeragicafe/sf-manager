<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-heading font-bold text-ong-text">Usuários</h1>
        <p class="text-muted-foreground mt-2">Gerencie usuários e suas permissões de acesso</p>
      </div>

      <BaseButton
        :icon="Plus"
        text="Adicionar Usuário"
        :onClick="() => showAddUserModal = true"
        variant="primary"
      />

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
                  <BaseButton
                    :icon="RectangleEllipsis"
                    v-if="hasPermission('user.change_password')"
                    :onClick="() => openChangePasswordModal(user)"
                    variant="warning"
                  >
                  </BaseButton>
                  <BaseButton
                    v-if="hasPermission('user.update')"
                    :icon="Edit"
                    :onClick="() => openEditModal(user)"
                    variant="default"
                  />
                 <BaseButton
                    v-if="hasPermission('user.delete')"
                    :icon="Trash2"
                    :onClick="() => openDeleteModal(user)"
                    variant="danger"
                  />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  
<ChangeUserPasswordModal
  :open="passwordModalOpen"
  :user="selectedUser"
  @close="passwordModalOpen = false"
/>
  
<!-- Modal de Edição -->
<div
  v-if="modalEditOpen"
  class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
>
  <div class="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl animate-fade-in">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-ong-text">Editar Usuário</h2>
      <button @click="modalEditOpen = false" class="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
    </div>

    <form @submit.prevent="submitEditUser">
      <div class="space-y-4">
        <!-- Nome + username -->
        <div class="flex gap-4">
          <div class="w-2/3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input
              v-model="selectedUser.name"
              type="text"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-ong-primary"
              required
            />
          </div>

          <div class="w-1/3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
            <input
              v-model="selectedUser.username"
              type="text"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-ong-primary"
              required
            />
          </div>
        </div>

        <!-- Email + senha -->
        <div class="flex gap-4">
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="selectedUser.email"
              type="email"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-ong-primary"
              required
            />
          </div>

          <!-- <div class="w-1/2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Senha (opcional)</label>
            <input
              v-model="selectedUser.password"
              type="password"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-ong-primary"
              placeholder="Deixe em branco para não alterar"
            />
          </div> -->
        </div>

        <!-- Cargo -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
          <select
            v-model="selectedUser.roleId"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-ong-primary"
            required
          >
            <option disabled value="">Selecione um papel</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Botões -->
      <div class="mt-6 flex justify-end gap-2">
        <BaseButton
          text="Cancelar"
          :onClick="() => modalEditOpen = false"
          variant="default"
        />
        <button
          type="submit"
          class="px-4 py-2 bg-ong-primary text-white rounded-md hover:bg-ong-accent"
        >
          Salvar
        </button>
      </div>
    </form>
  </div>
</div>


<div
  v-if="showAddUserModal"
  class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 "
>
    <div class="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl  animate-fade-in">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-ong-text">Adicionar Usuário</h2>
        <button @click="showAddUserModal = false" class="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
      </div>

      <form @submit.prevent="submitAddUser">
        <div class="space-y-4">

          <!-- Nome + username -->
          <div class="flex gap-4">
            <div class="w-2/3">
              <label class="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
              <input
                v-model="newUser.name"
                type="text"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-ong-primary"
                required
              />
            </div>

            <div class="w-1/3">
              <label class="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
              <input
                v-model="newUser.username"
                type="text"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-ong-primary"
                required
              />
            </div>
          </div>

          <!-- Email + senha -->
          <div class="flex gap-4">
            <div class="w-1/2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                v-model="newUser.email"
                type="email"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-ong-primary"
                required
              />
            </div>

            <div class="w-1/2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input
                v-model="newUser.password"
                type="password"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-ong-primary"
                required
              />
            </div>
          </div>

          <!-- Cargo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
            <select
              v-model="newUser.role"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-ong-primary"
              required
            >
              <option value="" disabled selected>Selecione um cargo</option>
              <option v-for="role in roles" :key="role.id" :value="role.id">
                {{ role.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Botões -->
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
/* ──────────────── IMPORTS ──────────────── */
import { ref, computed, onMounted, watch } from 'vue';
import { Search, Plus, Edit, Trash2, Shield, RectangleEllipsis, User } from 'lucide-vue-next';

import BaseButton from '@/components/BaseButton.vue';

import { verifyPermission } from '@/composables';
import { formatarData } from '@/utils/format/index.js';
import { showToast } from '@/utils/uiAlerts/toast';
import { showConfirm } from '@/utils/uiAlerts/confirm.js';
import ChangeUserPasswordModal from '@/views/Staff/users/components/ChangeUserPasswordModal.vue'

/* ──────────────── STATE ──────────────── */
const searchTerm = ref('');
const users = ref([]);
const roles = ref([]);
const showAddUserModal = ref(false);
const passwordModalOpen = ref(false)
const modalEditOpen = ref(false);
const modalDeleteOpen = ref(false);
const selectedUser = ref({
  id: '',
  name: '',
  email: '',
  roleId: '',
  role: {}
});
const newUser = ref({
  name: '',
  username: '',
  email: '',
  password: '',
  role: ''
});
const hasPermission = verifyPermission();

/* ──────────────── COMPUTED ──────────────── */
const filteredUsers = computed(() => {
  const term = searchTerm.value.toLowerCase();
  return (users.value || []).filter(user => {
    const name = user?.name?.toLowerCase() || '';
    const email = user?.email?.toLowerCase() || '';
    return name.includes(term) || email.includes(term);
  });
});

/* ──────────────── UTILS ──────────────── */
function getRoleColor(role) {
  switch (role) {
    case 'Administrador': return 'bg-red-100 text-red-800';
    case 'Moderador':     return 'bg-blue-100 text-blue-800';
    case 'Voluntário':    return 'bg-green-100 text-green-800';
    default:              return 'bg-gray-100 text-gray-800';
  }
}

function resetForm() {
  newUser.value = {
    name: '',
    username: '',
    email: '',
    password: '',
    profilePictureUrl: ''
  };
}

/* ──────────────── MODALS & ACTIONS ──────────────── */
function openEditModal(user) {
  modalEditOpen.value = true;

  console.log('user recebido:', user);
  
  selectedUser.value = {
    ...user,
    roleId: user.roleId || user.role?.id || '',
  };
  console.log('selectedUser montado:', selectedUser.value);
}

async function openDeleteModal(user) {
  selectedUser.value = { ...user };

  const confirmed = await showConfirm({
    title: 'Excluir usuário',
    text: `Tem certeza que deseja excluir ${user.name}?`,
    icon: 'warning',
    confirmButtonText: 'Excluir',
    cancelButtonText: 'Cancelar',
  });

  if (confirmed) {
    await deleteUser(); // chama sua função de exclusão real
  }
}

function openChangePasswordModal(user) {
  selectedUser.value = { ...user };
  passwordModalOpen.value = true;
}




/* ──────────────── API CALLS ──────────────── */
async function fetchUsers() {
  try {
    const response = await fetch('/api/user/list');
    if (!response.ok) throw new Error('Erro ao buscar usuários');

    const data = await response.json();

    // Transforma role em roleId diretamente
    return data.map(user => ({
      ...user,
      roleId: user.roleId || '',
    }));

  } catch (error) {
    console.error('Erro na requisição:', error);
    return [];
  }
}

async function fetchAllRoles() {
  try {
    const response = await fetch('/api/role');
    if (!response.ok) throw new Error('Erro ao buscar cargos');
    return await response.json();
  } catch (error) {
    console.error('Erro na requisição:', error);
    return [];
  }
}

async function submitAddUser() {
  try {
    const response = await fetch('/api/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser.value)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao registrar usuário');
    }

    const created = await response.json();
    users.value = await fetchUsers();
    showAddUserModal.value = false;
    resetForm();

    showToast({
      icon: 'success',
      title: 'Usuário criado com sucesso!',
      description: 'Um e-mail será enviado para o mesmo.',
      timer: 3000,
    });
  } catch (error) {
    console.error('Erro ao adicionar usuário:', error);
  }
}

async function submitEditUser() {
  try {
    const user = selectedUser.value;

    const response = await fetch(`/api/user/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: user.name,
        email: user.email,
        roleId: user.roleId,
        username: user.username
        // Inclua aqui outros campos editáveis, se necessário
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao atualizar usuário');
    }

    const updated = await response.json();
    users.value = await fetchUsers();
    modalEditOpen.value = false;

    showToast({
      icon: 'success',
      title: 'Usuário atualizado com sucesso!',
      description: 'As alterações foram salvas.',
      timer: 3000,
    });

  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    alert(error.message || 'Erro ao tentar atualizar o usuário');
  }
}

async function deleteUser() {
  const userId = selectedUser.value.id;

  try {
    console.log('Deletando usuário:', userId);

    const response = await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // Adicione token se necessário
        // 'Authorization': `Bearer ${token}`,
      }
    });

    const data = await response.json();

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao deletar usuário');
    }

    // Remove da lista local
    users.value = users.value.filter(u => u.id !== userId);
    modalDeleteOpen.value = false;

    showToast({
      icon: 'success',
      title: data.message,
      timer: 3000,
    });

  } catch (error) {
    console.error('Erro ao deletar usuário:', error.message);
     showToast({
      icon: 'erros',
      title: "Um erro ocorreu, verifique os logs",
      timer: 3000,
    });
  }
}




/* ──────────────── WATCHERS & MOUNT ──────────────── */
// watch(showAddUserModal, async (opened) => {
//   if (opened) {
//     roles.value = await fetchAllRoles();
//   }
// });

onMounted(async () => {
  users.value = await fetchUsers();

  roles.value = await fetchAllRoles();
  
});
</script>
