<script setup>
import { onMounted, ref, watch } from 'vue';
import { Plus, Edit, Trash2, Syringe } from 'lucide-vue-next';
import BaseButton from '@/components/BaseButton.vue';
import Pagination from '@/components/Pagination.vue';
import { showToast } from '@/utils/uiAlerts/toast';
import { showConfirm } from '@/utils/uiAlerts/confirm';
import CreatePetVaccineModal from '@/views/Staff/pets/components/CreatePetVaccineModal.vue';


const props = defineProps({ petId: String });

// Estado
const loading = ref(false);
const vaccines = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(20);
const search = ref(null);

// Modal
const modalOpen = ref(false);
const isEditing = ref(false);
const formData = ref({ vaccineId: '', applicationDate: '', applicator: '' });

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

function newVaccine() {
  isEditing.value = false;
  formData.value = { vaccineId: '', applicationDate: '', applicator: '' };
  modalOpen.value = true;
}

function editVaccine(vaccine) {
  isEditing.value = true;
  formData.value = { ...vaccine }; // preenche com dados existentes
  modalOpen.value = true;
}


// Deletar
async function deleteVaccine(id) {
  const confirmed = await showConfirm({title: 'Tem certeza?', text: 'Essa ação irá excluir o registro de vacinação.'});

  if (!confirmed) return;
  
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

// Callback do modal
async function handleSaved() {
  showToast({ icon: 'success', title: 'Vacina salva com sucesso!' });
  modalOpen.value = false;
  await fetchVaccines();
}

onMounted(fetchVaccines);

watch([page, pageSize, search], fetchVaccines);
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <BaseButton :icon="Plus" variant="primary" @click="newVaccine">
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
                <BaseButton :icon="Edit" variant="default" @click="editVaccine(v)" />
                <BaseButton :icon="Trash2" variant="danger" @click="deleteVaccine(v.id)" />
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

    <!-- Modal -->
    <CreatePetVaccineModal
      :isOpen="modalOpen"
      :petId="petId"
      :isEditing="isEditing"
      :formData="formData"
      @close="modalOpen = false"
      @saved="handleSaved"
    />

  </div>
</template>
