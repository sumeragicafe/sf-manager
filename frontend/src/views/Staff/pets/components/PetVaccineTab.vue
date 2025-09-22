<script setup>
import { onMounted, ref, watch } from 'vue';
import { Plus, Edit, Trash2, Syringe } from 'lucide-vue-next';
import BaseButton from '@/components/BaseButton.vue';
import Pagination from '@/components/Pagination.vue';
import { showToast } from '@/utils/uiAlerts/toast';

const props = defineProps({ petId: String });

// Estado
const loading = ref(false);
const vaccines = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(20);
const search = ref(null);

// Modal (criar/editar)
const modalOpen = ref(false);
const form = ref({ vaccineId: '', applicationDate: '', applicator: '' });
const editingId = ref(null);

// Buscar vacinas aplicadas
async function fetchVaccines() {
  if (!props.petId) return;
  loading.value = true;

  try {
    const filters = {};
    if (search.value) filters.search = search.value;

    const params = new URLSearchParams({
      page: page.value.toString(),
      pageSize: pageSize.value.toString(),
      filters: JSON.stringify(filters),
    });

    const res = await fetch(`/api/animal/${props.petId}/vaccines?${params.toString()}`);
    if (!res.ok) throw new Error('Erro ao buscar vacinas');

    const json = await res.json();
    vaccines.value = json.items || [];
    total.value = json.total;
    page.value = json.page;
  } catch (err) {
    console.error(err);
    vaccines.value = [];
  } finally {
    loading.value = false;
  }
}

// Salvar (create/update)
async function saveVaccine() {
  try {
    const method = editingId.value ? 'PUT' : 'POST';
    const url = editingId.value
      ? `/api/animal/${props.petId}/vaccines/${editingId.value}`
      : `/api/animal/${props.petId}/vaccines`;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    });

    if (!res.ok) throw new Error('Erro ao salvar vacina');

    showToast({ icon: 'success', title: 'Vacina salva com sucesso!' });
    modalOpen.value = false;
    form.value = { vaccineId: '', applicationDate: '', applicator: '' };
    editingId.value = null;
    await fetchVaccines();
  } catch (err) {
    console.error(err);
    showToast({ icon: 'error', title: 'Erro ao salvar vacina' });
  }
}

// Editar
function editVaccine(vaccine) {
  form.value = {
    vaccineId: vaccine.vaccineId,
    applicationDate: vaccine.applicationDate?.split('T')[0],
    applicator: vaccine.applicator || '',
  };
  editingId.value = vaccine.id;
  modalOpen.value = true;
}

// Deletar
async function deleteVaccine(id) {
  if (!confirm('Tem certeza que deseja excluir esta vacina?')) return;
  try {
    const res = await fetch(`/api/animal/vaccines/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao deletar vacina');

    showToast({ icon: 'success', title: 'Vacina excluída!' });
    await fetchVaccines();
  } catch (err) {
    console.error(err);
    showToast({ icon: 'error', title: 'Erro ao excluir vacina' });
  }
}

onMounted(fetchVaccines);

watch([page, pageSize, search], () => {
  fetchVaccines();
});
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <BaseButton :icon="Plus" variant="primary" @click="modalOpen = true">
        Nova Vacina
      </BaseButton>
    </div>

       <!-- Paginação -->
    <Pagination
      :total="total"
      :page="page"
      :pageSize="pageSize"
      :search="search"
      @update:page="val => { page = val }"
      @update:pageSize="val => { pageSize = val; page = 1 }"
      @update:search="val => { search = val }"
    />

    <!-- Tabela de Vacinas -->
    <div class="overflow-x-auto bg-card rounded-lg shadow-sm animate-fade-in">
      <table class="w-full table-auto text-sm">
        <thead class="text-muted-foreground bg-ong-popover uppercase text-xs">
          <tr>
            <th class="px-4 py-3 text-left">Vacina ID</th>
            <th class="px-4 py-3 text-left">Data de Aplicação</th>
            <th class="px-4 py-3 text-left">Aplicador</th>
            <th class="px-4 py-3 text-center">Ações</th>
          </tr>
        </thead>
        <tbody class="text-card-foreground">
          <tr
            v-for="v in vaccines"
            :key="v.id"
            class="border-t hover:bg-gray-50 transition-colors"
          >
            <td class="px-4 py-3 flex items-center gap-2">
              <div class="w-8 h-8 bg-ong-primary/10 rounded-full flex items-center justify-center">
                <Syringe class="h-4 w-4 text-ong-primary" />
              </div>
              {{ v.vaccine.name }}
            </td>
            <td class="px-4 py-3">{{ new Date(v.applicationDate).toLocaleDateString() }}</td>
            <td class="px-4 py-3">{{ v.applicator || "-" }}</td>
            <td class="px-4 py-3 text-center">
              <div class="flex justify-center gap-2">
                <BaseButton
                  :icon="Edit"
                  variant="default"
                  @click="editVaccine(v)"
                />
                <BaseButton
                  :icon="Trash2"
                  variant="danger"
                  @click="deleteVaccine(v.id)"
                />
              </div>
            </td>
          </tr>
          <tr v-if="vaccines.length === 0">
            <td colspan="4" class="text-center py-3 text-muted-foreground">
              Nenhuma vacina encontrada
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Criar/Editar -->
    <div
      v-if="modalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-4 rounded shadow-md w-96">
        <h2 class="text-lg mb-2 font-semibold">
          {{ editingId ? 'Editar Vacina' : 'Nova Vacina' }}
        </h2>
        <form @submit.prevent="saveVaccine" class="space-y-3">
          <div>
            <label class="block text-sm font-medium">Vacina</label>
            <input
              v-model="form.vaccineId"
              type="number"
              class="w-full border px-2 py-1 rounded"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium">Data de Aplicação</label>
            <input
              v-model="form.applicationDate"
              type="date"
              class="w-full border px-2 py-1 rounded"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium">Aplicador</label>
            <input
              v-model="form.applicator"
              type="text"
              class="w-full border px-2 py-1 rounded"
            />
          </div>

          <div class="flex justify-end gap-2 mt-4">
            <button
              type="button"
              class="px-3 py-1 bg-gray-300 rounded"
              @click="modalOpen = false"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
