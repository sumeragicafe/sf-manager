<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-scale-in">
      <!-- Cabeçalho -->
      <div class="flex justify-between items-center border-b pb-4 mb-4">
        <h2 class="text-xl font-heading text-ong-text">Alterar Senha</h2>
        <button @click="close" class="text-gray-500 hover:text-gray-700">
          <X size="20" />
        </button>
      </div>

      <div class="mb-6">
        <p class="text-sm">
          Alterando senha para <b>{{ props.user?.username || "*Usuário Desconhecido" }}</b>.
        </p>
      </div>

      <!-- Formulário -->
      <form @submit.prevent="submit">
        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium text-gray-700">Nova Senha</label>
          <input
            v-model="newPassword"
            type="password"
            required
            class="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ong-primary"
          />
        </div>

        <div class="flex justify-end gap-2">
          <button
            type="button"
            @click="close"
            class="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-bold text-white bg-ong-primary rounded-lg hover:bg-ong-accent"
          >
            Salvar
          </button>
        </div>
      </form>

      <!-- Feedback -->
      <div
        v-if="message"
        class="mt-4 text-sm"
        :class="messageType === 'success' ? 'text-green-600' : 'text-red-600'"
      >
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { X } from 'lucide-vue-next';

const props = defineProps({
  open: Boolean,
  user: Object,
})

const emit = defineEmits(['close'])

const newPassword = ref('')
const message = ref('')
const messageType = ref('success') // 'success' ou 'error'

const close = () => {
  newPassword.value = ''
  message.value = ''
  messageType.value = 'success'
  emit('close')
}

const submit = async () => {
  try {
    const res = await fetch(`/api/user/${props.user.id}/admin-change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newPassword: newPassword.value,
      }),
    })

    if (!res.ok) {
      throw new Error(`Erro HTTP: ${res.status}`)
    }

    const data = await res.json()
    message.value = data.message || 'Senha alterada com sucesso.'
    messageType.value = 'success'
    setTimeout(() => close(), 1500)
  } catch (err) {
    console.error(err)
    message.value = 'Erro ao alterar senha.'
    messageType.value = 'error'
  }
}
</script>
