<template>
  <div class="border-t border-gray-200 px-6 py-4 relative dropdown-parent">
    <div class="flex items-center space-x-3 cursor-pointer">
      <div class="w-10 h-10 rounded-full bg-ong-secondary"></div>
      <div>
        <p class="text-sm font-medium text-ong-text">
          {{ session.user?.name || 'Usuário' }}
        </p>
        <p class="text-xs text-gray-500">
          {{ session.user?.role?.name || 'Sem cargo' }}
        </p>
      </div>
      <button class="text-sm" @click.stop="toggleDropdown">
        <ChevronDown v-if="!dropdownOpen" />
        <ChevronUp v-else />
      </button>
    </div>

    <!-- Dropdown -->
    <transition name="fade">
      <div
        v-if="dropdownOpen"
        class="absolute bottom-14 right-0 w-48 bg-white border border-border rounded-lg shadow-lg z-50 animate-fade-in"
        @click.stop
      >
        <button
          class="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition"
           @click="$emit('open-password-modal')"
        >
          Trocar senha
        </button>
        <button
          class="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition"
          @click="logoutUser"
        >
          Sair
        </button>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ChevronUp, ChevronDown } from 'lucide-vue-next'
import { logout } from '@/utils/auth'


defineProps({
  session: {
    type: Object,
    required: true,
  },
})

const dropdownOpen = ref(false)
const passwordModalOpen = ref(false)

const form = ref({
  currentPassword: '',
  newPassword: ''
})

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const openPasswordModal = () => {
  passwordModalOpen.value = true
  dropdownOpen.value = false
}

const closePasswordModal = () => {
  passwordModalOpen.value = false
  form.value = { currentPassword: '', newPassword: '' }
}

const logoutUser = () => {
  logout()
}

const handleClickOutside = (e) => {
  const dropdownEl = document.querySelector('.dropdown-parent')
  if (dropdownEl && !dropdownEl.contains(e.target)) {
    dropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
