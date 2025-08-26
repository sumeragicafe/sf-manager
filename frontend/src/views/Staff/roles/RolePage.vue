<script setup>
/* ──────────────── IMPORTS ──────────────── */
import { ref, reactive, onMounted, computed } from 'vue';
import { Key, Shield, Settings, Users, Edit, Trash2, Plus, Search } from 'lucide-vue-next';
import BaseButton from '@/components/BaseButton.vue';
import { showConfirm } from '@/utils/uiAlerts/confirm.js';


/* ──────────────── STATE ──────────────── */
const roles = ref([]);
const allPermissions = ref([]);
const selectedRole = ref(null);
const selectedPermissions = ref([]);

const isRoleDialogOpen = ref(false);
const isPermissionDialogOpen = ref(false);

const formValues = reactive({ name: '', description: '' });
const formErrors = reactive({ name: '', description: '' });

const filters = reactive({ search: '', roleType: 'all', permissionCount: 'all' });

/* ──────────────── UTILS ──────────────── */
function togglePermission(id) {
  const index = selectedPermissions.value.indexOf(id);
  if (index === -1) selectedPermissions.value.push(id);
  else selectedPermissions.value.splice(index, 1);
}

function resetForm() {
  formValues.name = '';
  formValues.description = '';
  formErrors.name = '';
  formErrors.description = '';
  selectedRole.value = null;
}

/* ──────────────── MODALS & ACTIONS ──────────────── */

function openRoleDialog() {
  resetForm();
  isRoleDialogOpen.value = true;
}

function openPermissionDialog(role) {
  selectedRole.value = role;
  selectedPermissions.value = role.permissions.map(p => p.id);
  isPermissionDialogOpen.value = true;
}

function closePermissionDialog() {
  selectedRole.value = null;
  isPermissionDialogOpen.value = false;
}

function handleEditRole(role) {
  selectedRole.value = role;
  formValues.name = role.name;
  formValues.description = role.description;
  isRoleDialogOpen.value = true;
}


/* ──────────────── API CALLS ──────────────── */

async function fetchRoles() {
  const res = await fetch('/api/role');
  const data = await res.json();
  roles.value = data.map(role => ({
    ...role,
    permissions: Array.isArray(role.permissions) ? role.permissions : []
  }));
}

async function fetchPermissions() {
  const res = await fetch('/api/permission');
  allPermissions.value = await res.json();
}

function handleCreateRole() {
  formErrors.name = '';
  formErrors.description = '';

  if (!formValues.name.trim()) {
    formErrors.name = 'Nome obrigatório';
    return;
  }
  if (!formValues.description.trim()) {
    formErrors.description = 'Descrição obrigatória';
    return;
  }

  const method = selectedRole.value ? 'PUT' : 'POST';
  const url = selectedRole.value ? `/api/role/${selectedRole.value.id}` : '/api/role';

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: formValues.name,
      description: formValues.description,
      permissionIds: selectedPermissions.value
    })
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        if (data?.error?.includes('Cargo já existe')) {
          formErrors.name = 'Já existe um cargo com este nome';
        }
        return;
      }

      fetchRoles();
      isRoleDialogOpen.value = false;
      resetForm();
    })
    .catch(err => {
      console.error('Erro ao criar cargo:', err);
    });
}


function savePermissions() {
  fetch(`/api/role/${selectedRole.value.id}/add-permission`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ permissionIds: selectedPermissions.value })
  }).then(() => {
    fetchRoles();
    closePermissionDialog();
  });
}

async function deleteRole(role) {

  const confirmed = await showConfirm({
    title: 'Excluir cargo',
    text: `Tem certeza que deseja excluir ${role.name}?`,
    icon: 'warning',
    confirmButtonText: 'Excluir',
    cancelButtonText: 'Cancelar',
  });

  if (confirmed) {
    fetch(`/api/role/${role.id}`, { method: 'DELETE' }).then(() => fetchRoles());
  }
}


/* ──────────────── COMPUTED ──────────────── */
const groupedPermissions = computed(() => {
  const groups = {};
  allPermissions.value.forEach(p => {
    const [group] = p.name.split('.');
    if (!groups[group]) groups[group] = [];
    groups[group].push(p);
  });
  return groups;
});



/* ──────────────── WATCHERS & MOUNT ──────────────── */
onMounted(() => {
  fetchRoles();
  fetchPermissions();
  isRoleDialogOpen.value = false;
  isPermissionDialogOpen.value = false;
  selectedRole.value = null;
})


</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-ong-text">Cargos & Permissões</h1>
        <p class="text-muted-foreground mt-2">Gerencie os cargos do sistema</p>
      </div>
      <BaseButton :icon="Plus" text="Novo Cargo" @click="openRoleDialog" variant="primary" />
    </div>

    <div class="mb-6">
      <div class="relative max-w-md">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          v-model="filters.search"
          type="text"
          placeholder="Buscar por nome ou descrição..."
          class="pl-10 pr-4 py-2 w-full text-sm rounded-md border border-border focus:ring focus:outline-none bg-background text-foreground"
        />
      </div>
    </div>

    <div class="overflow-x-auto bg-card rounded-lg shadow-sm">
      <table class="w-full table-auto text-sm">
        <thead class="text-muted-foreground bg-ong-popover uppercase text-xs">
          <tr>
            <th class="px-4 py-3 text-left">Cargo</th>
            <th class="px-4 py-3 text-left">Descrição</th>
            <th class="px-4 py-3 text-left">Permissões</th>
            <th class="px-4 py-3 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="role in roles" :key="role.id" class="border-t hover:bg-gray-50">
            <td class="p-3 flex items-center gap-2">
              <component :is="{administrador: Shield, moderador: Settings, voluntário: Users}[role.name.toLowerCase()] || Key" class="w-4 h-4 text-gray-500" />
              {{ role.name }}
            </td>
            <td class="p-3">{{ role.description }}</td>
            <td class="p-3">
              <span v-for="p in role.permissions.slice(0, 2)" :key="p.id" class="badge-outline text-xs mr-1">{{ p.name }}</span>
              <span v-if="role.permissions.length > 2" class="text-xs text-gray-500">+{{ role.permissions.length - 2 }} mais</span>
              <span v-if="role.permissions.length <= 0" class="text-xs text-gray-500">Nenhuma permissão associada</span>
            </td>
            <td class="p-3 flex gap-2">
              <BaseButton :icon="Key" @click="openPermissionDialog(role)" variant="default" />
              <BaseButton :icon="Edit" @click="handleEditRole(role)" variant="warning" />
              <BaseButton :icon="Trash2" @click="deleteRole(role)" variant="danger" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de Permissões -->
    <div v-if="isPermissionDialogOpen && selectedRole" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded w-full max-w-3xl space-y-4">
        <h2 class="text-lg font-semibold">Gerenciar Permissões - {{ selectedRole.name }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          <div v-for="(permissions, group) in groupedPermissions" :key="group">
            <h3 class="font-bold text-sm mb-2">{{ group }}</h3>
            <div v-for="p in permissions" :key="p.id" class="flex items-center gap-2 mb-1">
              <input type="checkbox" :id="'perm-' + p.id" :checked="selectedPermissions.includes(p.id)" @change="togglePermission(p.id)" />
              <label :for="'perm-' + p.id" class="text-sm">{{ p.name }}</label>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button class="btn-outline px-4 py-2" @click="closePermissionDialog">Cancelar</button>
          <button class="btn-primary px-4 py-2" @click="savePermissions">Salvar</button>
        </div>
      </div>
    </div>

    <!-- Modal CreateRole-->
    <div v-if="isRoleDialogOpen" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded w-full max-w-md space-y-4">
        <h2 class="text-lg font-semibold">
          {{ selectedRole ? 'Editar Cargo' : 'Novo Cargo' }}
        </h2>
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nome</label>
            <input
              v-model="formValues.name"
              type="text"
              class="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <p v-if="formErrors.name" class="text-red-500 text-xs mt-1">{{ formErrors.name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              v-model="formValues.description"
              class="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm"
            ></textarea>
            <p v-if="formErrors.description" class="text-red-500 text-xs mt-1">{{ formErrors.description }}</p>
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button class="btn-outline px-4 py-2" @click="isRoleDialogOpen = false">Cancelar</button>
          <button class="btn-primary px-4 py-2" @click="handleCreateRole">Salvar</button>
        </div>
      </div>
    </div>


  </div>
</template>