<script setup>
import { onMounted, ref, watch } from 'vue';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-vue-next';
import BaseButton from '@/components/BaseButton.vue';
import Pagination from '@/components/Pagination.vue';
import { showToast } from '@/utils/uiAlerts/toast';
import { showConfirm } from '@/utils/uiAlerts/confirm';
import CreatePetFactModal from '@/views/Staff/pets/components/CreatePetFactModal.vue';

const props = defineProps({ petId: String });

// Estado
const loading = ref(false);
const facts = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(20);
const search = ref(null);

// Modal
const modalOpen = ref(false);
const isEditing = ref(false);
const formData = ref({ id: '', text: '' });

// Buscar fatos
async function fetchFacts() {
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

    const res = await fetch(`/api/animal/${props.petId}/fact?${params.toString()}`);
    if (!res.ok) throw new Error('Erro ao buscar fatos');

    const json = await res.json();
    facts.value = json.items || [];
    total.value = json.total;
    page.value = json.page;
  } catch (err) {
    console.error(err);
    facts.value = [];
  } finally {
    loading.value = false;
  }
}

function newFact() {
  isEditing.value = false;
  formData.value = { id: '', text: '' };
  modalOpen.value = true;
}

function editFact(fact) {
  isEditing.value = true;
  formData.value = { ...fact };
  modalOpen.value = true;
}

async function deleteFact(id) {
  const confirmed = await showConfirm({
    title: 'Tem certeza?',
    text: 'Essa ação irá excluir o fato do animal.',
  });

  if (!confirmed) return;

  try {
    const res = await fetch(`/api/animal/fact/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao deletar fato');

    showToast({ icon: 'success', title: 'Fato excluído!' });
    await fetchFacts();
  } catch (err) {
    console.error(err);
    showToast({ icon: 'error', title: 'Erro ao excluir fato' });
  }
}

async function handleSaved() {
  showToast({ icon: 'success', title: 'Fato salvo com sucesso!' });
  modalOpen.value = false;
  await fetchFacts();
}

onMounted(fetchFacts);
watch([page, pageSize, search], fetchFacts);
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <BaseButton :icon="Plus" variant="primary" @click="newFact">
        Novo Fato
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

    <!-- Tabela de Fatos -->
    <div class="overflow-x-auto bg-card rounded-lg shadow-sm animate-fade-in">
      <table class="w-full table-auto text-sm">
        <thead class="text-muted-foreground bg-ong-popover uppercase text-xs">
          <tr>
            <th class="px-4 py-3 text-left"></th>
            <th class="px-4 py-3 text-left">Descrição</th>
            <th class="px-4 py-3 text-left">Criado em</th>
            <th class="px-4 py-3 text-center">Ações</th>
          </tr>
        </thead>
        <tbody class="text-card-foreground">
          <tr
            v-for="f in facts"
            :key="f.id"
            class="border-t hover:bg-gray-50 transition-colors"
          >
            <td class="">
              <div class="w-8 h-8 bg-ong-primary/10 rounded-full flex items-center justify-center">
                <BookOpen class="h-4 w-4 text-ong-primary" />
              </div>
            </td>
            <td class="px-4 py-3 flex items-center gap-2">
              {{ f.text }}
            </td>
            <td class="px-4 py-3">{{ new Date(f.createdAt).toLocaleDateString() }}</td>
            <td class="px-4 py-3 text-center">
              <div class="flex justify-center gap-2">
                <BaseButton :icon="Edit" variant="default" @click="editFact(f)" />
                <BaseButton :icon="Trash2" variant="danger" @click="deleteFact(f.id)" />
              </div>
            </td>
          </tr>
          <tr v-if="facts.length === 0">
            <td colspan="3" class="text-center py-3 text-muted-foreground">
              Nenhum fato encontrado
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <CreatePetFactModal
      :isOpen="modalOpen"
      :petId="petId"
      :isEditing="isEditing"
      :formData="formData"
      @close="modalOpen = false"
      @saved="handleSaved"
    />
  </div>
</template>
