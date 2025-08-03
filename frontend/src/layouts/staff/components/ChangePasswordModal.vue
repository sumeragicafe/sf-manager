<!-- src/components/ChangePasswordModal.vue -->
<template>
  <transition name="scale-in">
    <div
      v-if="modelValue"
      class="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
    >
      <div class="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md space-y-4 animate-scale-in">
        <h2 class="text-xl font-bold text-ong-text">Trocar Senha</h2>

        <input
          v-model="form.currentPassword"
          type="password"
          placeholder="Senha atual"
          class="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring focus:border-ong-primary"
        />
        <input
          v-model="form.newPassword"
          type="password"
          placeholder="Nova senha"
          class="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring focus:border-ong-primary"
        />

        <div class="flex justify-end space-x-2 pt-2">
          <button @click="close" class="px-4 py-2 text-sm text-gray-600 hover:underline">
            Cancelar
          </button>
          <button
            @click="submit"
            class="px-4 py-2 bg-ong-primary text-white text-sm rounded-lg hover:bg-ong-accent transition"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import {showToast} from '@/utils/uiAlerts/toast';

const props = defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const form = ref({
  currentPassword: '',
  newPassword: ''
})

function close() {
  emit('update:modelValue', false)
  form.value = { currentPassword: '', newPassword: '' }
}

async function submit() {
  try {
    const res = await fetch('/api/user/change-password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })

    if (!res.ok) throw new Error('Erro na requisição')

    showToast({
      icon: 'success',
      title: 'Senha alterada com sucesso!',
      timer: 3000,
    });
    close()
  } catch (err) {

    showToast({
      icon: 'error',
      title: 'Erro ao trocar senha. Verifique os dados.',
      timer: 3000,
    });
  
    console.error(err)
  }
}
</script>
