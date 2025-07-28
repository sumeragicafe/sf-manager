<template>
  <div class="font-body bg-ong-background min-h-screen">
    <!-- Header Section -->
    <header class="bg-white shadow-lg border-b-4 border-ong-primary">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-center">
          <div class="text-center">
            <h1 class="font-heading text-2xl md:text-3xl lg:text-4xl text-ong-text font-bold animate-fade-in">
              ONG Cia de São Francisco
            </h1>
            <p class="text-ong-text/70 mt-2 font-body text-sm md:text-base">
              Formulário de Adoção Responsável
            </p>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8 lg:py-12">
      <div class="max-w-5xl mx-auto animate-scale-in">
        <!-- Form Card -->
        <div class="bg-white rounded-2xl shadow-2xl overflow-hidden border border-ong-secondary/20">
          <!-- Card Header -->
          <div class="bg-gradient-to-r from-ong-primary to-ong-accent text-white p-6 md:p-8">
            <div class="text-center">
              <h2 class="font-heading text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                Termo de Responsabilidade de Adoção
              </h2>
              <p class="text-white/90 text-sm md:text-base font-body">
                Leia atentamente todos os itens antes de prosseguir com seu pedido de adoção.
              </p>
            </div>
          </div>

          <!-- Terms Section -->
          <div class="p-6 md:p-8">
            <div class="mb-8">
              <h3 class="font-heading text-xl md:text-2xl text-ong-text font-bold mb-4 flex items-center">
                <div class="w-8 h-8 bg-ong-primary rounded-full flex items-center justify-center text-white font-bold mr-3">
                  📋
                </div>
                Compromissos de Adoção
              </h3>
              
              <div class="border-2 border-ong-secondary/30 rounded-xl bg-gradient-to-br from-gray-50 to-ong-background/30 p-6">
                <div class="h-80 lg:h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-ong-primary scrollbar-track-gray-200 pr-4">
                  <ol class="list-decimal list-inside space-y-4 text-gray-700 text-sm md:text-base leading-relaxed">
                    <li v-for="(term, index) in adoptionTerms" :key="index" 
                        class="hover:text-ong-text transition-colors duration-200 pl-2"
                        v-html="term">
                    </li>
                  </ol>
                  
                  <div class="mt-8 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                    <h4 class="font-bold text-red-800 mb-2">⚖️ Aspectos Legais:</h4>
                    <p class="text-red-700 text-sm leading-relaxed mb-3">
                      A partir da ciência e assinatura deste termo, declaro que no caso do não cumprimento ou violação de qualquer dos compromissos acima expostos e assumidos por mim, o animal poderá retornar à guarda da Cia de São Francisco, por descumprimento à <strong>Lei 9.605/98, artigo 32</strong>, que prevê de 3 meses a 1 ano de detenção para maus-tratos, com pena aumentada de 2 a 5 anos para violência contra cães e gatos.
                    </p>
                    <p class="text-red-700 text-sm leading-relaxed">
                      A ONG Cia de São Francisco reserva-se o direito de fiscalizar o integral cumprimento das obrigações acordadas e promover a aplicação das penalidades previstas em lei.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Form Section -->
            <div class="bg-gradient-to-br from-white to-ong-background/20 rounded-xl p-6 md:p-8 border border-ong-secondary/20">
              <h3 class="font-heading text-xl md:text-2xl text-ong-text font-bold mb-6 flex items-center">
                <div class="w-8 h-8 bg-ong-accent rounded-full flex items-center justify-center text-white font-bold mr-3">
                  👤
                </div>
                Dados do Adotante
              </h3>

              <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- Nome do Responsável -->
                <div class="group">
                  <label for="responsibleName" class="block text-lg font-medium text-ong-text mb-2 flex items-center">
                    <span class="mr-2">👨‍👩‍👧‍👦</span>
                    Nome Completo do Responsável
                    <span class="text-red-500 ml-1">*</span>
                  </label>
                  <div class="relative">
                    <input 
                      type="text" 
                      id="responsibleName"
                      v-model="formState.responsibleName"
                      @blur="validateName"
                      @input="clearFieldError('responsibleName')"
                      :class="[
                        'w-full p-4 border-2 rounded-xl font-body text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-4',
                        errors.responsibleName 
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50' 
                          : 'border-ong-secondary/50 focus:border-ong-primary focus:ring-ong-primary/20 hover:border-ong-accent/70'
                      ]"
                      placeholder="Digite seu nome completo como no documento"
                      :disabled="isSubmitting"
                    />
                    <div v-if="!errors.responsibleName && formState.responsibleName.length > 2" 
                         class="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500">
                      ✓
                    </div>
                  </div>
                  <p v-if="errors.responsibleName" class="text-red-600 text-sm mt-2 flex items-center">
                    <span class="mr-1">⚠️</span>
                    {{ errors.responsibleName }}
                  </p>
                </div>
                
                <!-- Telefone -->
                <div class="group">
                  <label for="contactPhone" class="block text-lg font-medium text-ong-text mb-2 flex items-center">
                    <span class="mr-2">📱</span>
                    Telefone para Contato
                    <span class="text-red-500 ml-1">*</span>
                  </label>
                  <div class="relative">
                    <input 
                      type="tel" 
                      id="contactPhone"
                      v-model="formState.contactPhone"
                      @input="formatAndValidatePhone"
                      @blur="validatePhone"
                      :class="[
                        'w-full p-4 border-2 rounded-xl font-body text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-4',
                        errors.contactPhone 
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50' 
                          : 'border-ong-secondary/50 focus:border-ong-primary focus:ring-ong-primary/20 hover:border-ong-accent/70'
                      ]"
                      placeholder="(11) 99999-9999"
                      maxlength="15"
                      :disabled="isSubmitting"
                    />
                    <div v-if="!errors.contactPhone && isPhoneValid" 
                         class="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500">
                      ✓
                    </div>
                  </div>
                  <p v-if="errors.contactPhone" class="text-red-600 text-sm mt-2 flex items-center">
                    <span class="mr-1">⚠️</span>
                    {{ errors.contactPhone }}
                  </p>
                  <p class="text-ong-text/60 text-sm mt-2 flex items-center">
                    <span class="mr-1">💡</span>
                    Digite apenas números. A formatação será aplicada automaticamente.
                  </p>
                </div>

                <!-- Checkbox de Termos -->
                <div class="group">
                  <div class="flex items-start space-x-4 p-4 rounded-xl border-2 border-ong-secondary/30 bg-gradient-to-r from-ong-background/30 to-white hover:from-ong-background/50 transition-all duration-300">
                    <div class="relative flex-shrink-0 mt-1">
                      <input 
                        type="checkbox" 
                        id="termsAccepted"
                        v-model="formState.termsAccepted"
                        @change="validateTerms"
                        :class="[
                          'w-6 h-6 rounded-lg border-2 text-ong-primary focus:ring-4 focus:ring-ong-primary/20 transition-all duration-200',
                          errors.termsAccepted ? 'border-red-400' : 'border-ong-secondary'
                        ]"
                        :disabled="isSubmitting"
                      />
                    </div>
                    <div class="flex-1">
                      <label for="termsAccepted" class="text-base md:text-lg font-medium text-ong-text cursor-pointer leading-relaxed flex items-start">
                        <span class="mr-2">📝</span>
                        Li, compreendi e aceito integralmente os Termos de Responsabilidade de Adoção
                        <span class="text-red-500 ml-1 flex-shrink-0">*</span>
                      </label>
                      <p v-if="errors.termsAccepted" class="text-red-600 text-sm mt-2 flex items-center">
                        <span class="mr-1">⚠️</span>
                        {{ errors.termsAccepted }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="pt-6">
                  <div class="text-center">
                    <button
                      type="submit"
                      :disabled="!canSubmit || isSubmitting"
                      class="group relative inline-flex items-center justify-center px-8 md:px-12 py-4 text-lg md:text-xl font-heading font-bold text-white bg-gradient-to-r from-ong-primary to-ong-accent rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg focus:outline-none focus:ring-4 focus:ring-ong-primary/30"
                    >
                      <!-- Loading Spinner -->
                      <svg v-if="isSubmitting" class="animate-spin h-6 w-6 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      
                      <!-- Button Text -->
                      <span v-if="!isSubmitting" class="mr-2">🐾</span>
                      {{ isSubmitting ? 'Enviando Pedido...' : 'Confirmar Adoção Responsável' }}
                      
                      <!-- Hover Effect -->
                      <div class="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    </button>
                    
                    <p class="text-ong-text/60 text-sm mt-4 font-body">
                      Ao confirmar, você se compromete com o bem-estar do animal. 💚
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Footer Info -->
        <div class="mt-8 text-center animate-fade-in">
          <div class="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-ong-secondary/20">
            <h4 class="font-heading text-lg text-ong-text font-bold mb-2">
              🏠 ONG Cia de São Francisco
            </h4>
            <p class="text-ong-text/70 text-sm font-body leading-relaxed">
              Dedicada ao resgate, cuidado e adoção responsável de animais em situação de vulnerabilidade.<br>
              <span class="font-medium">Transformando vidas através do amor pelos animais.</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive, computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { showToast } from '@/utils/uiAlerts/toast.js';

// Get animal ID from route params
const route = useRoute();

// Form state
const formState = reactive({
  responsibleName: '',
  contactPhone: '',
  animalId: '', // Will be set from route params or props
  termsAccepted: false,
});

// Error state
const errors = reactive({
  responsibleName: '',
  contactPhone: '',
  termsAccepted: '',
});

// Loading state
const isSubmitting = ref(false);

// Adoption terms data
const adoptionTerms = [
  'Comprometo-me a cuidar bem do animal adotado até seu último dia de vida, sabendo que a vida de cães e gatos podem chegar a 20 anos ou mais.',
  'Atesto que tomei (ou tomarei muito em breve) todas as medidas possíveis para garantir a segurança e o bem estar do animal adotado, como por exemplo: colocar telas em janelas de apartamentos, cercas ou muros altos em casas ou pátios, coleira e guia para passeios diários, local para água e alimento, estabelecendo um local confortável para o seu descanso.',
  'Se minha residência for um apartamento, comprometo-me a realizar no mínimo dois passeios diários com o animal, para que ele possa fazer suas necessidades e realizar atividades para gastos de energia.',
  'E minha residência for uma casa, comprometo-me a deixar o animal sempre solto no pátio e com acesso livre a espaços fechados de casa, de forma que sempre fique protegido das intempéries (frio, calor, chuva, etc).',
  'Comprometo-me a nunca, sob qualquer hipótese, manter o animal adotado preso a qualquer tipo de corrente ou em cubículos ou espaços minúsculos.',
  'Declaro também que, caso minha residência seja alugada, não há qualquer impeditivo por parte do proprietário, condomínio ou imobiliária que proíba de ter um animal de estimação.',
  'Caso eu precise mudar de residência, comprometo-me a sempre pensar no animal adotado para fazer minhas escolhas, assegurando que ele possa me acompanhar e estar sempre protegido por mim até o final de sua vida.',
  'No caso de eu já possuir outros animais em casa, asseguro que há espaços para prevenir briga territorial e me comprometo buscar todos os meios disponíveis para fazer a adaptação entre o animal adotado e os animais mais antigos que estão comigo.',
  'Asseguro que todas as pessoas que moram ou, eventualmente venham a morar comigo, respeitem os animais e aceitem a adoção sem problemas ou restrições.',
  'Asseguro que tenho com quem deixar o animal em caso de viagens ou afastamentos temporários.',
  'Comprometo-me a nunca deixar o animal sozinho por mais de 10h, providenciando sempre pessoas que possam cuidá-lo e alimentá-lo caso necessite de período maiores de afastamento.',
  'Comprometo-me a alimentar o animal adotado com ração de qualidade Premium ou superior.',
  'Comprometo-me a realizar visitas periódicas ao veterinário, bem como a manter as vacinas e vermifugação em dia.',
  'Comprometo-me a arcar com todas as despesas e dedicar todo o tempo necessário para que o animal adotado tenha plena saúde e qualidade de vida.',
  'Comprometo-me a castrar o animal adotado assim que ele atingir a idade adequada (acima de 6 meses para fêmea e acima de 1 ano para macho), junto ao comprometimento de agendamento junto a Ong Cia de São Francisco.',
  'Caso o animal fuja, comprometo-me a comunicar IMEDIATAMENTE a Ong Cia de São Francisco, e a realizar tudo que for necessário para a sua localização. Independente dos custos e envolvimento acarretados nas buscas.',
  'E por motivos de força maior (doenças graves, acidentes, etc.) eu ficar impossibilitado de continuar a ser o protetor responsável pelo animal adotado, e tiver qualquer intenção de transferir a guarda dele para outra pessoa, comprometo-me a comunicar imediatamente a Cia de São Francisco para que o novo adotante passe pelo mesmo processo de adoção.',
  'Comprometo-me a fornecer informações solicitadas pela equipe de acompanhamento pós-adoção da Cia de São Francisco, sempre que me for solicitado e/ou de forma espontânea.',
  'Caso ocorra quaisquer problemas com o animal adotado ou com o processo de adoção em si, comprometo-me a avisar imediatamente a Cia de São Francisco, para que juntos possamos buscar a melhor solução e bem estar do animal.'
];

// Computed properties
const isNameValid = computed(() => {
  const name = formState.responsibleName.trim();
  return name.length >= 2 && /^[a-zA-ZÀ-ÿ\s]+$/.test(name);
});

const isPhoneValid = computed(() => {
  const phoneDigits = formState.contactPhone.replace(/\D/g, '');
  return phoneDigits.length === 10 || phoneDigits.length === 11;
});

const canSubmit = computed(() => {
  return isNameValid.value && 
         isPhoneValid.value && 
         formState.animalId &&
         formState.termsAccepted && 
         !hasErrors.value;
});

// Set animal ID from route params on mount
onMounted(() => {
  const animalId = route.params.animalId || route.query.animalId;
  if (animalId) {
    formState.animalId = String(animalId);
  }
});

const hasErrors = computed(() => {
  return Object.values(errors).some(error => error !== '');
});

// Validation functions
function validateName() {
  const name = formState.responsibleName.trim();
  if (!name) {
    errors.responsibleName = 'Nome é obrigatório';
  } else if (name.length < 2) {
    errors.responsibleName = 'Nome deve ter pelo menos 2 caracteres';
  } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) {
    errors.responsibleName = 'Nome deve conter apenas letras e espaços';
  } else {
    errors.responsibleName = '';
  }
}

function validatePhone() {
  const phoneDigits = formState.contactPhone.replace(/\D/g, '');
  if (!phoneDigits) {
    errors.contactPhone = 'Telefone é obrigatório';
  } else if (phoneDigits.length < 10) {
    errors.contactPhone = 'Telefone deve ter pelo menos 10 dígitos';
  } else if (phoneDigits.length > 11) {
    errors.contactPhone = 'Telefone deve ter no máximo 11 dígitos';
  } else {
    errors.contactPhone = '';
  }
}

function validateTerms() {
  if (!formState.termsAccepted) {
    errors.termsAccepted = 'Você deve aceitar os termos para continuar';
  } else {
    errors.termsAccepted = '';
  }
}

function clearFieldError(field) {
  errors[field] = '';
}

// Phone formatting function
function formatPhoneNumber(value) {
  const digits = value.replace(/\D/g, '');
  
  if (digits.length <= 2) {
    return digits;
  } else if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  } else if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  } else {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  }
}

function formatAndValidatePhone(event) {
  const formatted = formatPhoneNumber(event.target.value);
  formState.contactPhone = formatted;
  clearFieldError('contactPhone');
}

function validateAllFields() {
  validateName();
  validatePhone();
  validateTerms();
}

function resetForm() {
  formState.responsibleName = '';
  formState.contactPhone = '';
  formState.termsAccepted = false;
  // Keep animalId as it comes from route/props
  
  errors.responsibleName = '';
  errors.contactPhone = '';
  errors.termsAccepted = '';
}

// Form submission
async function handleSubmit() {
  validateAllFields();
  
  if (!canSubmit.value) {
    showToast({
      icon: 'error',
      title: 'Formulário Incompleto',
      description: 'Por favor, corrija os erros antes de continuar.'
    });
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    // Call our adoption request API endpoint
    const response = await fetch('/api/adoption-requests', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        responsibleName: formState.responsibleName.trim(),
        contactPhone: formState.contactPhone.replace(/\D/g, ''),
        animalId: formState.animalId, // Animal ID will be passed as route param or prop
        termsAccepted: formState.termsAccepted
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      showToast({
        icon: 'success',
        title: 'Pedido de Adoção Enviado! 🎉',
        description: `Obrigado, ${formState.responsibleName}! Entraremos em contato em breve para dar continuidade ao processo.`,
        timer: 6000
      });
      resetForm();
    } else {
      throw new Error('Erro no servidor');
    }
  } catch (error) {
    console.error('Erro ao enviar formulário:', error);
    
    // Fallback for development - remove in production
    if (error.message.includes('fetch')) {
      showToast({
        icon: 'success',
        title: 'Formulário Recebido! 🐾 (Modo Desenvolvimento)',
        description: `Obrigado, ${formState.responsibleName}! Em produção, isso seria enviado para o servidor da ONG.`,
        timer: 6000
      });
      resetForm();
    } else {
      showToast({
        icon: 'error',
        title: 'Erro no Envio',
        description: 'Não foi possível enviar o formulário. Tente novamente mais tarde ou entre em contato conosco.'
      });
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
/* Custom scrollbar for webkit browsers */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  @apply bg-gray-200 rounded-full;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  @apply bg-ong-primary rounded-full;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  @apply bg-ong-accent;
}

/* Enhanced focus styles */
.group:focus-within {
  transform: translateY(-1px);
}

/* Gradient text animation */
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}
</style>