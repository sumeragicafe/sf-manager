<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { Search, Plus, Edit, Trash2, Shield, Settings, Users, Key, Filter, X } from 'lucide-vue-next'

interface Permission {
  id: number
  name: string
  description: string
}

interface Role {
  id: number
  name: string
  description: string
  permissions: Permission[]
}

interface FilterState {
  search: string
  roleType: string
  permissionCount: string
}

// Mock: dados estáticos
const roles = ref<Role[]>([
  {
    id: 1,
    name: 'Administrador',
    description: 'Acesso completo ao sistema',
    permissions: [
      { id: 1, name: 'users.create', description: 'Criar usuários' },
      { id: 2, name: 'users.read', description: 'Visualizar usuários' },
      { id: 3, name: 'users.update', description: 'Editar usuários' },
      { id: 4, name: 'users.delete', description: 'Excluir usuários' },
      { id: 5, name: 'roles.manage', description: 'Gerenciar cargos' },
      { id: 6, name: 'animals.manage', description: 'Gerenciar animais' },
      { id: 7, name: 'events.manage', description: 'Gerenciar eventos' },
    ]
  },
  {
    id: 2,
    name: 'Moderador',
    description: 'Gerenciamento de conteúdo e eventos',
    permissions: [
      { id: 2, name: 'users.read', description: 'Visualizar usuários' },
      { id: 6, name: 'animals.manage', description: 'Gerenciar animais' },
      { id: 7, name: 'events.manage', description: 'Gerenciar eventos' },
      { id: 8, name: 'adopters.manage', description: 'Gerenciar adotantes' },
    ]
  },
  {
    id: 3,
    name: 'Voluntário',
    description: 'Acesso básico para voluntários',
    permissions: [
      { id: 2, name: 'users.read', description: 'Visualizar usuários' },
      { id: 9, name: 'events.view', description: 'Visualizar eventos' },
      { id: 10, name: 'animals.view', description: 'Visualizar animais' },
    ]
  }
])

const allPermissions = ref<Permission[]>([
  { id: 1, name: 'users.create', description: 'Criar usuários' },
  { id: 2, name: 'users.read', description: 'Visualizar usuários' },
  { id: 3, name: 'users.update', description: 'Editar usuários' },
  { id: 4, name: 'users.delete', description: 'Excluir usuários' },
  { id: 5, name: 'roles.manage', description: 'Gerenciar cargos' },
  { id: 6, name: 'animals.manage', description: 'Gerenciar animais' },
  { id: 7, name: 'events.manage', description: 'Gerenciar eventos' },
  { id: 8, name: 'adopters.manage', description: 'Gerenciar adotantes' },
  { id: 9, name: 'events.view', description: 'Visualizar eventos' },
  { id: 10, name: 'animals.view', description: 'Visualizar animais' },
  { id: 11, name: 'contacts.manage', description: 'Gerenciar contatos' },
  { id: 12, name: 'settings.manage', description: 'Gerenciar configurações' },
])

const filters = reactive<FilterState>({
  search: '',
  roleType: 'all',
  permissionCount: 'all',
})

const selectedRole = ref<Role | null>(null)
const isRoleDialogOpen = ref(false)
const isPermissionDialogOpen = ref(false)

const filteredRoles = computed(() => {
  return roles.value.filter(role => {
    const searchLower = filters.search.toLowerCase()
    const matchesSearch = role.name.toLowerCase().includes(searchLower) || role.description.toLowerCase().includes(searchLower)

    const matchesRoleType =
      filters.roleType === 'all' ||
      (filters.roleType === 'admin' && role.name.toLowerCase().includes('administrador')) ||
      (filters.roleType === 'moderador' && role.name.toLowerCase().includes('moderador')) ||
      (filters.roleType === 'voluntario' && role.name.toLowerCase().includes('voluntário'))

    const pcLen = role.permissions.length
    const matchesPermissionCount =
      filters.permissionCount === 'all' ||
      (filters.permissionCount === 'high' && pcLen >= 5) ||
      (filters.permissionCount === 'medium' && pcLen >= 3 && pcLen < 5) ||
      (filters.permissionCount === 'low' && pcLen < 3)

    return matchesSearch && matchesRoleType && matchesPermissionCount
  })
})

function updateFilter(key: keyof FilterState, value: string) {
  filters[key] = value
}

function clearAllFilters() {
  filters.search = ''
  filters.roleType = 'all'
  filters.permissionCount = 'all'
}

function getActiveFiltersCount() {
  let count = 0
  if (filters.search) count++
  if (filters.roleType !== 'all') count++
  if (filters.permissionCount !== 'all') count++
  return count
}

function getRoleIcon(roleName: string) {
  switch (roleName.toLowerCase()) {
    case 'administrador':
      return 'shield'
    case 'moderador':
      return 'settings'
    case 'voluntário':
      return 'users'
    default:
      return 'key'
  }
}

// 👇 Substituição do formulário com controle manual
const formValues = reactive({
  name: '',
  description: ''
})

const formErrors = reactive({
  name: '',
  description: ''
})

function validateForm(): boolean {
  formErrors.name = formValues.name.trim() ? '' : 'Nome do cargo é obrigatório'
  formErrors.description = formValues.description.trim() ? '' : 'Descrição é obrigatória'
  return !formErrors.name && !formErrors.description
}

function resetForm() {
  formValues.name = ''
  formValues.description = ''
  formErrors.name = ''
  formErrors.description = ''
}

function setValues(values: { name: string; description: string }) {
  formValues.name = values.name
  formValues.description = values.description
}

function handleCreateRole() {
  if (!validateForm()) return

  if (selectedRole.value) {
    // Editando
    const index = roles.value.findIndex(r => r.id === selectedRole.value!.id)
    if (index !== -1) {
      roles.value[index].name = formValues.name
      roles.value[index].description = formValues.description
    }
  } else {
    // Criando novo cargo
    const newRole: Role = {
      id: roles.value.length + 1,
      name: formValues.name,
      description: formValues.description,
      permissions: []
    }
    roles.value.push(newRole)
  }

  isRoleDialogOpen.value = false
  resetForm()
  selectedRole.value = null
}

function handleEditRole(role: Role) {
  selectedRole.value = role
  setValues({ name: role.name, description: role.description })
  isRoleDialogOpen.value = true
}

function handleManagePermissions(role: Role) {
  selectedRole.value = role
  isPermissionDialogOpen.value = true
}

// 👇 Controle de permissões
const selectedPermissions = ref<number[]>([])

watch(selectedRole, newRole => {
  selectedPermissions.value = newRole ? newRole.permissions.map(p => p.id) : []
})

function togglePermission(permissionId: number) {
  const index = selectedPermissions.value.indexOf(permissionId)
  if (index === -1) {
    selectedPermissions.value.push(permissionId)
  } else {
    selectedPermissions.value.splice(index, 1)
  }
}

function savePermissions() {
  if (selectedRole.value) {
    const updatedPermissions = allPermissions.value.filter(p => selectedPermissions.value.includes(p.id))
    const roleIndex = roles.value.findIndex(r => r.id === selectedRole.value!.id)
    if (roleIndex !== -1) {
      roles.value[roleIndex].permissions = updatedPermissions
    }
  }
  isPermissionDialogOpen.value = false
}
</script>


<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-heading font-bold text-ong-text">Cargos &amp; Permissões</h1>
        <p class="text-ong-text/70 mt-2">Configure cargos e suas permissões de acesso</p>
      </div>

      <!-- Dialog para criar/editar cargo -->
      <button
        class="btn-primary flex items-center gap-2"
        @click="() => { selectedRole = null; resetForm(); isRoleDialogOpen = true; }"
      >
        <Plus class="h-4 w-4" />
        Novo Cargo
      </button>

      <Dialog v-model:open="isRoleDialogOpen">
        <DialogContent class="bg-ong-background">
          <DialogHeader>
            <DialogTitle>{{ selectedRole ? 'Editar Cargo' : 'Criar Novo Cargo' }}</DialogTitle>
          </DialogHeader>

         <form @submit.prevent="handleCreateRole" class="space-y-4">
            <div>
                <label class="block mb-1" for="name">Nome do Cargo</label>
                <input
                id="name"
                v-model="formValues.name"
                type="text"
                placeholder="Ex: Moderador"
                class="input"
                />
                <p v-if="formErrors.name" class="text-destructive text-sm mt-1">{{ formErrors.name }}</p>
            </div>
            <div>
                <label class="block mb-1" for="description">Descrição</label>
                <input
                id="description"
                v-model="formValues.description"
                type="text"
                placeholder="Descreva as responsabilidades do cargo"
                class="input"
                />
                <p v-if="formErrors.description" class="text-destructive text-sm mt-1">{{ formErrors.description }}</p>
            </div>

            <div class="flex justify-end gap-2">
                <button type="button" class="btn-outline" @click="isRoleDialogOpen = false">Cancelar</button>
                <button type="submit" class="btn-primary">{{ selectedRole ? 'Salvar' : 'Criar' }}</button>
            </div>
            </form>


        </DialogContent>
      </Dialog>
    </div>

    <!-- Filtros -->
    <div class="mb-6 space-y-4">
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Busca -->
        <div class="relative flex-1">
          <Search class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            v-model="filters.search"
            placeholder="Buscar por cargo ou descrição..."
            class="input pl-10"
            type="search"
          />
        </div>

        <!-- Tipo de Cargo -->
        <select v-model="filters.roleType" class="select w-full sm:w-[180px]">
          <option value="all">Todos os tipos</option>
          <option value="admin">Administrador</option>
          <option value="moderador">Moderador</option>
          <option value="voluntario">Voluntário</option>
        </select>

        <!-- Nível de acesso -->
        <select v-model="filters.permissionCount" class="select w-full sm:w-[180px]">
          <option value="all">Todos os níveis</option>
          <option value="high">Alto (5+ permissões)</option>
          <option value="medium">Médio (3-4 permissões)</option>
          <option value="low">Baixo (1-2 permissões)</option>
        </select>

        <!-- Menu de filtros avançados -->
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button class="btn-outline relative flex items-center gap-2">
              <Filter class="h-4 w-4" />
              Filtros
              <span
                v-if="getActiveFiltersCount() > 0"
                class="badge ml-2 h-5 w-5 rounded-full p-0 text-xs"
              >{{ getActiveFiltersCount() }}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-56">
            <DropdownMenuLabel>Filtros Avançados</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="clearAllFilters">
              <X class="h-4 w-4 mr-2" />
              Limpar todos os filtros
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <!-- Filtros ativos exibidos -->
      <div v-if="getActiveFiltersCount() > 0" class="flex flex-wrap gap-2">
        <span
          v-if="filters.search"
          class="badge-secondary gap-1 flex items-center cursor-pointer"
          @click="filters.search = ''"
        >
          Busca: "{{ filters.search }}"
          <X class="h-3 w-3" />
        </span>
        <span
          v-if="filters.roleType !== 'all'"
          class="badge-secondary gap-1 flex items-center cursor-pointer"
          @click="filters.roleType = 'all'"
        >
          Tipo:
          {{ filters.roleType === 'admin' ? 'Administrador' : filters.roleType === 'moderador' ? 'Moderador' : 'Voluntário' }}
          <X class="h-3 w-3" />
        </span>
        <span
          v-if="filters.permissionCount !== 'all'"
          class="badge-secondary gap-1 flex items-center cursor-pointer"
          @click="filters.permissionCount = 'all'"
        >
          Nível:
          {{ filters.permissionCount === 'high' ? 'Alto' : filters.permissionCount === 'medium' ? 'Médio' : 'Baixo' }}
          <X class="h-3 w-3" />
        </span>
      </div>
    </div>

    <!-- Resumo -->
    <p class="text-sm text-ong-text/70 mb-4">
      Mostrando {{ filteredRoles.length }} de {{ roles.length }} cargos
    </p>

    <!-- Tabela de cargos -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Shield class="h-5 w-5" />
          Cargos Cadastrados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <table class="table-auto w-full border-collapse border border-border">
          <thead>
            <tr class="border-b border-border">
              <th class="p-2 text-left">Cargo</th>
              <th class="p-2 text-left text-ong-text/70">Descrição</th>
              <th class="p-2 text-left">Permissões</th>
              <th class="p-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredRoles.length === 0" class="text-center text-ong-text/70">
              <td colspan="4" class="py-8">Nenhum cargo encontrado com os filtros aplicados</td>
            </tr>
            <tr v-for="role in filteredRoles" :key="role.id" class="border-b border-border">
              <td class="p-2 flex items-center gap-2 font-medium">
                <component :is="{
                  shield: Shield,
                  settings: Settings,
                  users: Users,
                  key: Key
                }[getRoleIcon(role.name)]" class="h-4 w-4" :class="{
                  shield: 'text-red-600',
                  settings: 'text-blue-600',
                  users: 'text-green-600',
                  key: 'text-gray-600'
                }[getRoleIcon(role.name)]" />
                {{ role.name }}
              </td>
              <td class="p-2 text-ong-text/70">{{ role.description }}</td>
              <td class="p-2">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="permission in role.permissions.slice(0, 3)"
                    :key="permission.id"
                    class="badge-outline text-xs"
                  >
                    {{ permission.name }}
                  </span>
                  <span
                    v-if="role.permissions.length > 3"
                    class="badge-outline text-xs"
                  >
                    +{{ role.permissions.length - 3 }} mais
                  </span>
                </div>
              </td>
              <td class="p-2">
                <div class="flex gap-2">
                  <button
                    class="btn-outline btn-sm flex items-center gap-1"
                    @click="handleManagePermissions(role)"
                    title="Permissões"
                  >
                    <Key class="h-3 w-3" />
                    Permissões
                  </button>
                  <button
                    class="btn-outline btn-sm flex items-center gap-1"
                    @click="handleEditRole(role)"
                    title="Editar"
                  >
                    <Edit class="h-3 w-3" />
                    Editar
                  </button>
                  <button
                    class="btn-outline btn-sm text-red-600 hover:text-red-700 flex items-center justify-center"
                    title="Excluir"
                    
                  >
                    <Trash2 class="h-3 w-3" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>

    <!-- Dialog para gerenciar permissões -->
    <Dialog v-model:open="isPermissionDialogOpen">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2">
            <Key class="h-5 w-5" />
            Gerenciar Permissões - {{ selectedRole?.name }}
          </DialogTitle>
        </DialogHeader>

        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            <div
              v-for="permission in allPermissions"
              :key="permission.id"
              class="flex items-start space-x-3 p-3 border rounded-lg"
            >
              <input
                type="checkbox"
                :id="'perm-' + permission.id"
                :checked="selectedPermissions.includes(permission.id)"
                @change="togglePermission(permission.id)"
                class="checkbox mt-1"
              />
              <label :for="'perm-' + permission.id" class="flex-1 cursor-pointer select-none">
                <div class="font-medium text-sm">{{ permission.name }}</div>
                <div class="text-xs text-ong-text/70">{{ permission.description }}</div>
              </label>
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <button class="btn-outline" @click="isPermissionDialogOpen = false">Cancelar</button>
            <button class="btn-primary" @click="savePermissions">Salvar</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
