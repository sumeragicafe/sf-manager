<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-heading font-bold text-ong-text">Pedidos de Adoção</h1>
        <p class="text-muted-foreground mt-2">Gerencie todos os pedidos de adoção recebidos</p>
      </div>
    </div>

    <!-- Search -->
    <div class="mb-6">
      <div class="relative max-w-md">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar por responsável, telefone ou animal..."
          class="pl-10 pr-4 py-2 w-full text-sm rounded-md border border-border focus:ring-ring focus:outline-none bg-background text-foreground"
        />
      </div>
    </div>

    <!-- Tabela de Pedidos de Adoção -->
    <div class="overflow-x-auto bg-card rounded-lg shadow-sm animate-fade-in">
      <table class="w-full table-auto text-sm">
        <thead class="text-muted-foreground bg-ong-popover uppercase text-xs">
          <tr>
            <th class="px-4 py-3 text-left">Animal</th>
            <th class="px-4 py-3 text-left">Responsável</th>
            <th class="px-4 py-3 text-left">Contato</th>
            <th class="px-4 py-3 text-left">Status</th>
            <th class="px-4 py-3 text-left">Data do Pedido</th>
            <th class="px-4 py-3 text-left">Revisado em</th>
            <th class="px-4 py-3 text-center">Ações</th>
          </tr>
        </thead>
        <tbody class="text-card-foreground">
          <tr
            v-for="request in filteredRequests"
            :key="request.id"
            class="border-t hover:bg-gray-50 transition-colors"
          >
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-ong-primary/10 rounded-full flex items-center justify-center">
                  <Heart class="h-4 w-4 text-ong-primary" />
                </div>
                <div>
                  <div class="font-medium text-ong-text">{{ request.animal?.name || 'Animal não encontrado' }}</div>
                  <div class="text-xs text-muted-foreground">{{ request.animal?.species }} - {{ request.animal?.breed }}</div>
                </div>
              </div>
            </td>
            <td class="px-4 py-3">
              <div class="font-medium">{{ request.responsibleName }}</div>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-1">
                <Phone class="w-3 h-3 text-muted-foreground" />
                {{ request.contactPhone }}
              </div>
            </td>
            <td class="px-4 py-3">
              <span
                :class="[
                  'px-2 py-0.5 text-xs rounded-full font-semibold inline-flex items-center gap-1',
                  getStatusColor(request.status)
                ]"
              >
                <component :is="getStatusIcon(request.status)" class="w-3 h-3" />
                {{ getStatusText(request.status) }}
              </span>
            </td>
            <td class="px-4 py-3">{{ formatarData(request.submittedAt) }}</td>
            <td class="px-4 py-3">{{ request.reviewedAt ? formatarData(request.reviewedAt) : "-" }}</td>
            <td class="px-4 py-3 text-center">
              <div class="flex justify-center gap-2">
                <button 
                  @click="openViewModal(request)" 
                  class="text-sm px-3 py-1 border rounded-md text-ong-primary hover:bg-ong-primary/10"
                >
                  <Eye class="w-3 h-3" />
                </button>
                <button 
                  v-if="request.status === 'pending'"
                  @click="openReviewModal(request)" 
                  class="text-sm px-3 py-1 border rounded-md text-ong-accent hover:bg-ong-accent/10"
                >
                  <CheckCircle class="w-3 h-3" />
                </button>
                <button 
                  v-if="request.status === 'approved' || request.status === 'rejected'"
                  @click="removeRequest(request)" 
                  class="text-sm px-3 py-1 border rounded-md text-red-600 hover:bg-red-50"
                >
                  <Trash2 class="w-3 h-3" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de Visualização -->
    <div
      v-if="showViewModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl animate-scale-in">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-ong-text">Detalhes do Adotante</h2>
          <button @click="showViewModal = false" class="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>

        <div v-if="selectedRequest" class="space-y-4">
          <!-- Animal -->
          <div class="flex items-center gap-3 p-3 bg-ong-background/30 rounded-lg">
            <div class="w-10 h-10 bg-ong-primary/10 rounded-full flex items-center justify-center">
              <Heart class="h-5 w-5 text-ong-primary" />
            </div>
            <div>
              <div class="font-medium text-ong-text">{{ selectedRequest.animal?.name || 'Animal não encontrado' }}</div>
              <div class="text-sm text-muted-foreground">{{ selectedRequest.animal?.species }} • {{ selectedRequest.animal?.breed }} • {{ selectedRequest.animal?.age ? `${selectedRequest.animal.age} meses` : 'N/A' }}</div>
            </div>
          </div>

          <!-- Responsável -->
          <div class="flex items-center gap-3 p-3 bg-ong-background/30 rounded-lg">
            <div class="w-10 h-10 bg-ong-accent/10 rounded-full flex items-center justify-center">
              <User class="h-5 w-5 text-ong-accent" />
            </div>
            <div>
              <div class="font-medium text-ong-text">{{ selectedRequest.responsibleName }}</div>
              <div class="text-sm text-muted-foreground flex items-center gap-1">
                <Phone class="w-3 h-3" />
                {{ selectedRequest.contactPhone }}
              </div>
            </div>
          </div>

                     <!-- Status e Data -->
           <div class="flex items-center gap-3 p-3 bg-ong-background/30 rounded-lg">
             <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
               <Calendar class="h-5 w-5 text-gray-600" />
             </div>
             <div>
               <div class="flex items-center gap-2">
                 <span class="text-sm text-muted-foreground">Revisão:</span>
                 <span
                   :class="[
                     'px-2 py-0.5 text-xs rounded-full font-semibold',
                     getStatusColor(selectedRequest.status)
                   ]"
                 >
                   {{ getStatusText(selectedRequest.status) }}
                 </span>
               </div>
               <div class="flex items-center gap-2 mt-1">
                 <span class="text-sm text-muted-foreground">Data de envio:</span>
                 <span class="text-sm font-medium">{{ formatarData(selectedRequest.submittedAt) }}</span>
               </div>
             </div>
           </div>

          <!-- Observações (se houver) -->
          <div v-if="selectedRequest.notes" class="p-3 bg-ong-background/30 rounded-lg">
            <div class="text-sm font-medium text-ong-text mb-2">Observações</div>
            <p class="text-sm text-muted-foreground">{{ selectedRequest.notes }}</p>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button @click="showViewModal = false" class="px-4 py-2 bg-ong-primary text-white rounded-md hover:bg-ong-primary/90 transition-colors">Fechar</button>
        </div>
      </div>
    </div>

    <!-- Modal de Revisão -->
    <div
      v-if="showReviewModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-xl animate-scale-in">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-ong-text">Revisar Pedido de Adoção</h2>
          <button @click="showReviewModal = false" class="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>

        <div v-if="selectedRequest" class="space-y-4">
          <div class="text-center">
            <p class="text-sm text-muted-foreground mb-2">
              Pedido de <strong>{{ selectedRequest.responsibleName }}</strong>
            </p>
            <p class="text-sm text-muted-foreground">
              para adotar <strong>{{ selectedRequest.animal?.name }}</strong>
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Observações (opcional)</label>
            <textarea
              v-model="reviewNotes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-ong-primary"
              placeholder="Adicione observações sobre a decisão..."
            ></textarea>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              @click="reviewRequest('approve')"
              :disabled="isReviewing"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              <CheckCircle class="w-4 h-4" />
              {{ isReviewing ? 'Processando...' : 'Aprovar' }}
            </button>
            <button
              @click="reviewRequest('reject')"
              :disabled="isReviewing"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              <XCircle class="w-4 h-4" />
              {{ isReviewing ? 'Processando...' : 'Rejeitar' }}
            </button>
          </div>

          <button
            @click="showReviewModal = false"
            class="w-full px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 mt-2"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  Search,
  Heart,
  Phone,
  Eye,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Clock,
  Ban,
  Check,
  Trash2
} from 'lucide-vue-next';

import { formatarData } from '@/utils/format/index.js';
import { showToast } from '@/utils/uiAlerts/toast';

const searchTerm = ref('');
const adoptionRequests = ref([]);
const showViewModal = ref(false);
const showReviewModal = ref(false);
const selectedRequest = ref(null);
const reviewNotes = ref('');
const isReviewing = ref(false);
const isRemoving = ref(false);

// Fetch adoption requests from API
async function fetchAdoptionRequests() {
  try {
    console.log('📥 Buscando pedidos de adoção...');
    const response = await fetch('/api/adoption-request');
    console.log('📨 Resposta da busca:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar pedidos de adoção');
    }
    const data = await response.json();
    console.log('✅ Pedidos carregados:', data);
    return data;
  } catch (error) {
    console.error('Erro na requisição:', error);
    showToast({
      icon: 'error',
      title: 'Erro ao carregar pedidos',
      description: 'Não foi possível carregar os pedidos de adoção.',
      timer: 4000,
    });
    return [];
  }
}

// Computed property for filtered requests
const filteredRequests = computed(() => {
  const term = searchTerm.value.toLowerCase();
  return (adoptionRequests.value || []).filter(request => {
    const responsibleName = request?.responsibleName?.toLowerCase() || '';
    const contactPhone = request?.contactPhone?.toLowerCase() || '';
    const animalName = request?.animal?.name?.toLowerCase() || '';
    return responsibleName.includes(term) || contactPhone.includes(term) || animalName.includes(term);
  });
});

// Status related functions
function getStatusColor(status) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getStatusText(status) {
  switch (status) {
    case 'pending':
      return 'Pendente';
    case 'approved':
      return 'Aprovado';
    case 'rejected':
      return 'Rejeitado';
    case 'completed':
      return 'Concluído';
    default:
      return 'Desconhecido';
  }
}

function getStatusIcon(status) {
  switch (status) {
    case 'pending':
      return Clock;
    case 'approved':
      return Check;
    case 'rejected':
      return Ban;
    case 'completed':
      return CheckCircle;
    default:
      return Clock;
  }
}

// Modal functions
function openViewModal(request) {
  selectedRequest.value = request;
  showViewModal.value = true;
}

function openReviewModal(request) {
  selectedRequest.value = request;
  reviewNotes.value = '';
  showReviewModal.value = true;
}

// Review request function
async function reviewRequest(action) {
  if (!selectedRequest.value) return;
  
  isReviewing.value = true;
  
  try {
    console.log('🔄 Iniciando revisão:', { action, requestId: selectedRequest.value.id });
    
    const response = await fetch(`/api/adoption-request/${selectedRequest.value.id}/review`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        notes: reviewNotes.value
      })
    });

    console.log('📨 Resposta da revisão:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json();
      console.log('❌ Erro na revisão:', errorData);
      throw new Error(errorData.error || 'Erro ao processar revisão');
    }

    const result = await response.json();
    console.log('✅ Revisão bem-sucedida:', result);
    
    // Update the request in the list
    const index = adoptionRequests.value.findIndex(r => r.id === selectedRequest.value.id);
    if (index !== -1) {
      adoptionRequests.value[index] = { ...adoptionRequests.value[index], ...result };
    }

    showReviewModal.value = false;
    selectedRequest.value = null;
    reviewNotes.value = '';

    showToast({
      icon: 'success',
      title: 'Revisão realizada!',
      description: result.message,
      timer: 4000,
    });

    // Refresh the list
    adoptionRequests.value = await fetchAdoptionRequests();

  } catch (error) {
    console.error('Erro ao revisar pedido:', error);
    showToast({
      icon: 'error',
      title: 'Erro na revisão',
      description: error.message,
      timer: 4000,
    });
  } finally {
    isReviewing.value = false;
  }
}

// Remove request function
async function removeRequest(request) {
  // Show confirmation dialog
  const confirmed = confirm(`Tem certeza que deseja remover o pedido de adoção de ${request.responsibleName}?\n\nEsta ação não pode ser desfeita.`);
  
  if (!confirmed) {
    return;
  }
  
  isRemoving.value = true;
  
  try {
    console.log('🗑️ Removendo pedido:', request.id);
    
    const response = await fetch(`/api/adoption-request/${request.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('📨 Resposta da remoção:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json();
      console.log('❌ Erro na remoção:', errorData);
      throw new Error(errorData.error || 'Erro ao remover pedido');
    }

    const result = await response.json();
    console.log('✅ Remoção bem-sucedida:', result);
    
    // Remove from the local list
    const index = adoptionRequests.value.findIndex(r => r.id === request.id);
    if (index !== -1) {
      adoptionRequests.value.splice(index, 1);
    }

    showToast({
      icon: 'success',
      title: 'Pedido removido!',
      description: result.message || 'O pedido foi removido com sucesso.',
      timer: 4000,
    });

  } catch (error) {
    console.error('Erro ao remover pedido:', error);
    showToast({
      icon: 'error',
      title: 'Erro ao remover',
      description: error.message || 'Não foi possível remover o pedido.',
      timer: 4000,
    });
  } finally {
    isRemoving.value = false;
  }
}

// Initialize component
onMounted(async () => {
  adoptionRequests.value = await fetchAdoptionRequests();
});
</script>