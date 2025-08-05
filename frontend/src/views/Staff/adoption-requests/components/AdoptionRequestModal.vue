<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-ong-primary to-ong-accent text-white p-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-heading font-bold">Detalhes do Pedido de Adoção</h2>
            <p class="text-white/90 mt-1">ID: {{ request?.id || 'N/A' }}</p>
          </div>
          <button 
            @click="$emit('close')"
            class="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
        <div v-if="!request" class="text-center py-8">
          <p class="text-ong-text/60">Nenhum pedido selecionado</p>
        </div>
        
        <div v-else class="space-y-8">
          <!-- Status and Date Info -->
          <div class="bg-ong-background/30 rounded-xl p-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center">
                <div class="text-sm text-ong-text/60 mb-1">Status Atual</div>
                <span :class="getStatusClasses(request.status)" class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium">
                  {{ getStatusText(request.status) }}
                </span>
              </div>
              
              <div class="text-center">
                <div class="text-sm text-ong-text/60 mb-1">Data do Pedido</div>
                <div class="text-lg font-medium text-ong-text">{{ formatDate(request.submittedAt) }}</div>
                <div class="text-sm text-ong-text/60">{{ formatTime(request.submittedAt) }}</div>
              </div>
              
              <div class="text-center" v-if="request.reviewedAt">
                <div class="text-sm text-ong-text/60 mb-1">Revisado em</div>
                <div class="text-lg font-medium text-ong-text">{{ formatDate(request.reviewedAt) }}</div>
                <div class="text-sm text-ong-text/60">{{ formatTime(request.reviewedAt) }}</div>
              </div>
            </div>
          </div>

          <!-- Adopter Information -->
          <div class="bg-white border border-ong-secondary/20 rounded-xl p-6">
            <h3 class="text-xl font-heading font-bold text-ong-text mb-4 flex items-center">
              <User class="w-6 h-6 mr-2 text-ong-primary" />
              Informações do Adotante
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-ong-text/70 mb-1">Nome Completo</label>
                <div class="p-3 bg-ong-background/20 rounded-lg text-ong-text font-medium">
                  {{ request.responsibleName }}
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-ong-text/70 mb-1">Telefone</label>
                <div class="p-3 bg-ong-background/20 rounded-lg text-ong-text">
                  {{ formatPhone(request.contactPhone) }}
                </div>
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-ong-text/70 mb-1">Termos Aceitos</label>
                <div class="p-3 bg-ong-background/20 rounded-lg flex items-center">
                  <CheckCircle class="w-5 h-5 text-green-600 mr-2" />
                  <span class="text-ong-text">Todos os termos de responsabilidade foram aceitos</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Animal Information -->
          <div class="bg-white border border-ong-secondary/20 rounded-xl p-6" v-if="request.animal">
            <h3 class="text-xl font-heading font-bold text-ong-text mb-4 flex items-center">
              <Heart class="w-6 h-6 mr-2 text-ong-accent" />
              Informações do Animal
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-ong-text/70 mb-1">Nome</label>
                <div class="p-3 bg-ong-background/20 rounded-lg text-ong-text font-medium">
                  {{ request.animal.name }}
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-ong-text/70 mb-1">Espécie</label>
                <div class="p-3 bg-ong-background/20 rounded-lg text-ong-text">
                  {{ request.animal.species }}
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-ong-text/70 mb-1">Raça</label>
                <div class="p-3 bg-ong-background/20 rounded-lg text-ong-text">
                  {{ request.animal.breed || 'SRD' }}
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-ong-text/70 mb-1">Idade</label>
                <div class="p-3 bg-ong-background/20 rounded-lg text-ong-text">
                  {{ formatAge(request.animal.age) }}
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-ong-text/70 mb-1">Gênero</label>
                <div class="p-3 bg-ong-background/20 rounded-lg text-ong-text">
                  {{ request.animal.gender === 'male' ? 'Macho' : 'Fêmea' }}
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-ong-text/70 mb-1">Porte</label>
                <div class="p-3 bg-ong-background/20 rounded-lg text-ong-text">
                  {{ formatSize(request.animal.size) }}
                </div>
              </div>
              
              <div class="md:col-span-2" v-if="request.animal.description">
                <label class="block text-sm font-medium text-ong-text/70 mb-1">Descrição</label>
                <div class="p-3 bg-ong-background/20 rounded-lg text-ong-text">
                  {{ request.animal.description }}
                </div>
              </div>
              
              <!-- Health Status -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-ong-text/70 mb-2">Status de Saúde</label>
                <div class="flex flex-wrap gap-3">
                  <div class="flex items-center">
                    <div :class="request.animal.isVaccinated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                         class="px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <component :is="request.animal.isVaccinated ? CheckCircle : XCircle" class="w-4 h-4 mr-1" />
                      {{ request.animal.isVaccinated ? 'Vacinado' : 'Não Vacinado' }}
                    </div>
                  </div>
                  
                  <div class="flex items-center">
                    <div :class="request.animal.isCastrated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                         class="px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <component :is="request.animal.isCastrated ? CheckCircle : XCircle" class="w-4 h-4 mr-1" />
                      {{ request.animal.isCastrated ? 'Castrado' : 'Não Castrado' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Admin Notes -->
          <div class="bg-white border border-ong-secondary/20 rounded-xl p-6">
            <h3 class="text-xl font-heading font-bold text-ong-text mb-4 flex items-center">
              <FileText class="w-6 h-6 mr-2 text-ong-primary" />
              Observações da Administração
            </h3>
            
            <div class="space-y-4">
              <div>
                <label for="notes" class="block text-sm font-medium text-ong-text/70 mb-2">
                  Notas Internas
                </label>
                <textarea
                  id="notes"
                  v-model="adminNotes"
                  rows="4"
                  class="w-full p-3 border border-ong-secondary/50 rounded-lg focus:ring-2 focus:ring-ong-primary/20 focus:border-ong-primary resize-none"
                  placeholder="Adicionar observações sobre o pedido..."
                ></textarea>
              </div>
              
              <div v-if="request.notes" class="p-3 bg-ong-background/20 rounded-lg">
                <div class="text-sm font-medium text-ong-text/70 mb-1">Notas Existentes:</div>
                <div class="text-ong-text">{{ request.notes }}</div>
              </div>
            </div>
          </div>

          <!-- Status Management -->
          <div class="bg-white border border-ong-secondary/20 rounded-xl p-6" v-if="request.status === 'pending'">
            <h3 class="text-xl font-heading font-bold text-ong-text mb-4 flex items-center">
              <Settings class="w-6 h-6 mr-2 text-ong-primary" />
              Gerenciar Status
            </h3>
            
            <div class="flex flex-wrap gap-3">
              <button
                @click="updateStatus('approved')"
                :disabled="updating"
                class="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                <CheckCircle class="w-5 h-5 mr-2" />
                {{ updating ? 'Processando...' : 'Aprovar Pedido' }}
              </button>
              
              <button
                @click="updateStatus('rejected')"
                :disabled="updating"
                class="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                <XCircle class="w-5 h-5 mr-2" />
                {{ updating ? 'Processando...' : 'Rejeitar Pedido' }}
              </button>
            </div>
          </div>

          <!-- Complete Adoption -->
          <div class="bg-white border border-ong-secondary/20 rounded-xl p-6" v-if="request.status === 'approved'">
            <h3 class="text-xl font-heading font-bold text-ong-text mb-4 flex items-center">
              <Heart class="w-6 h-6 mr-2 text-ong-accent" />
              Finalizar Adoção
            </h3>
            
            <p class="text-ong-text/70 mb-4">
              Este pedido foi aprovado. Quando a adoção for concluída fisicamente, marque como finalizada.
            </p>
            
            <button
              @click="updateStatus('completed')"
              :disabled="updating"
              class="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <Heart class="w-5 h-5 mr-2" />
              {{ updating ? 'Processando...' : 'Marcar como Finalizada' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { 
  X, User, Heart, FileText, Settings, CheckCircle, XCircle 
} from 'lucide-vue-next';
import { showToast } from '@/utils/uiAlerts/toast.js';

const props = defineProps({
  request: Object,
  isOpen: Boolean
});

const emit = defineEmits(['close', 'statusChanged']);

// Reactive data
const adminNotes = ref('');
const updating = ref(false);

// Watch for request changes to populate notes
watch(() => props.request, (newRequest) => {
  if (newRequest) {
    adminNotes.value = newRequest.notes || '';
  }
}, { immediate: true });

// Utility functions
function getStatusClasses(status) {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800', 
    rejected: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
}

function getStatusText(status) {
  const texts = {
    pending: 'Pendente',
    approved: 'Aprovado',
    rejected: 'Rejeitado', 
    completed: 'Finalizado'
  };
  return texts[status] || status;
}

function formatDate(dateString) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('pt-BR');
}

function formatTime(dateString) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

function formatPhone(phone) {
  if (!phone) return '-';
  const numbers = phone.replace(/\D/g, '');
  if (numbers.length === 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  } else if (numbers.length === 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  }
  return phone;
}

function formatAge(ageInMonths) {
  if (!ageInMonths) return 'Idade não informada';
  if (ageInMonths < 12) {
    return `${ageInMonths} ${ageInMonths === 1 ? 'mês' : 'meses'}`;
  }
  const years = Math.floor(ageInMonths / 12);
  const months = ageInMonths % 12;
  if (months === 0) {
    return `${years} ${years === 1 ? 'ano' : 'anos'}`;
  }
  return `${years} ${years === 1 ? 'ano' : 'anos'} e ${months} ${months === 1 ? 'mês' : 'meses'}`;
}

function formatSize(size) {
  const sizes = {
    small: 'Pequeno',
    medium: 'Médio',
    large: 'Grande'
  };
  return sizes[size] || size;
}

// Status update function
async function updateStatus(newStatus) {
  if (!props.request) return;
  
  updating.value = true;
  
  try {
    const response = await fetch(`/api/adoption-requests/${props.request.id}/review`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: newStatus,
        notes: adminNotes.value.trim() || undefined
      })
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao atualizar status para ${newStatus}`);
    }
    
    const statusTexts = {
      approved: 'aprovado',
      rejected: 'rejeitado',
      completed: 'finalizado'
    };
    
    showToast({
      icon: 'success',
      title: 'Status Atualizado!',
      description: `O pedido foi ${statusTexts[newStatus]} com sucesso.`
    });
    
    emit('statusChanged');
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    showToast({
      icon: 'error',
      title: 'Erro ao Atualizar',
      description: 'Não foi possível atualizar o status do pedido.'
    });
  } finally {
    updating.value = false;
  }
}
</script>