<template>
  <ChangePasswordModal v-model="passwordModalOpen" />

  <div
    :class="[
      'fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out',
      isOpen ? 'translate-x-0' : '-translate-x-full',
      'lg:translate-x-0' // Sempre visível em telas grandes
    ]"
  >
    <div class="flex flex-col h-full">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div class="flex items-center gap-2">
          <img class="w-10 h-10"src="../../../../public/images/logo.png" alt="">
          <h1 class="text-xl font-heading font-bold text-ong-text">SF Manager</h1>
        </div>

        <!-- Botão fechar (mobile) -->
        <!-- <button class="lg:hidden" @click="$emit('close')">
          <X class="text-gray-700" size="20" />
        </button> -->
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-2">
        <RouterLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
          :class="{
            'bg-ong-primary text-white': isActive(item),
            'text-ong-text hover:bg-ong-secondary/50': !isActive(item)
          }"
          @click="$emit('close')"
        >
          <component :is="item.icon" class="mr-3" size="20" />
          {{ item.name }}
        </RouterLink>
      </nav>

      <UserProfileSection :session="session" @open-password-modal="openPasswordModal" />
    </div>
  </div>


</template>

<script setup>
import { defineProps, defineEmits, onMounted, computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { Home, Users, Calendar, Heart, MessageSquare, FileText, Settings, UserCheck, Shield, X, FolderDown  } from 'lucide-vue-next';
import UserProfileSection from '@/layouts/staff/components/UserProfileSection.vue';
import { useSessionStore } from '@/stores/session';
import { verifyPermission } from '@/composables';
import ChangePasswordModal from '@/layouts/staff/components/ChangePasswordModal.vue';




const passwordModalOpen = ref(false);

const openPasswordModal = () => {
  passwordModalOpen.value = true
};

const hasPermission = verifyPermission();

const props = defineProps({
  isOpen: Boolean
});

defineEmits(['close']);

const route = useRoute();

const session = useSessionStore();

const fullNavigation = [
  // { name: 'Dashboard', href: '/staff', icon: Home, exact: true },
  { name: 'Animais em Adoção', href: '/staff/pet', icon: Heart },
  { name: 'Pedidos de Adoção', href: '/staff/adoption-requests', icon: UserCheck },
  { name: 'Eventos', href: '/staff/event', icon: Calendar },
  { name: 'Contatos', href: '/staff/contacts', icon: MessageSquare },
  // { name: 'Formulários', href: '/staff/forms', icon: FileText },
  { name: 'Mídia', href: '/staff/media', icon: FolderDown  },
  { name: 'Usuários', href: '/staff/user', icon: Users },
  { name: 'Cargos & Permissões', href: '/staff/role', icon: Shield },
  // { name: 'Configurações', href: '/staff/settings', icon: Settings },
];

const can = verifyPermission();

const navigation = computed(() => {
  return fullNavigation.filter(item => {
    // Se não precisa de permissão, mantém
    if (!item.permission) return true;
    
    // Só mantém se a permissão existir
    return hasPermission(item.permission);
  });
});

function isActive(item) {
  return item.exact ? route.path === item.href : route.path.startsWith(item.href);
}

onMounted(async () => {
  await session.fetchSession();
})
</script>
