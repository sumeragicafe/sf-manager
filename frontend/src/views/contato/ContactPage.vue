<!-- src/views/Contato.vue -->
<template>
  <section class="container max-w-3xl py-12 animate-fade-in">
    <h2 class="text-3xl font-heading font-bold text-ong-text mb-2">Contato</h2>
    <p class="text-base mb-8">
      Gostaria de entrar em contato conosco? Envie uma mensagem pelo formulário abaixo:
    </p>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Assunto -->
      <div>
        <input
          type="text"
          v-model="form.subject"
          placeholder="Assunto"
          class="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-ong-primary"
          required
        />
      </div>

      <!-- Email e Nome lado a lado -->
      <div class="flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          v-model="form.email"
          placeholder="E-mail"
          class="flex-1 rounded-xl border border-gray-300 px-4 py-3 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-ong-primary"
          required
        />
        <input
          type="text"
          v-model="form.name"
          placeholder="Nome"
          class="flex-1 rounded-xl border border-gray-300 px-4 py-3 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-ong-primary"
          required
        />
      </div>

      <!-- Mensagem -->
      <div>
        <textarea
          v-model="form.message"
          placeholder="Mensagem"
          rows="6"
          class="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-ong-primary"
          required
        ></textarea>
      </div>

      <!-- Checkboxes -->
      <div class="space-y-2 text-sm">
        <label class="flex items-start gap-2">
          <input
            type="checkbox"
            v-model="form.acceptPolicy"
            required
            class="mt-1 accent-ong-primary"
          />
          <span>Declaro estar de acordo com as políticas de privacidade</span>
        </label>
        <label class="flex items-start gap-2">
          <input
            type="checkbox"
            v-model="form.allowContact"
            class="mt-1 accent-ong-primary"
          />
          <span>A ONG pode fazer contato pelo email que forneci</span>
        </label>
      </div>

      <!-- Botão -->
      <div class="pt-4">
        <button
          type="submit"
          class="rounded-xl bg-ong-primary text-white px-8 py-3 text-base font-bold hover:bg-ong-accent transition-all"
        >
          Enviar
        </button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  subject: '',
  email: '',
  name: '',
  message: '',
  acceptPolicy: false,
  allowContact: false
})

function handleSubmit() {
  // Lógica de envio — pode usar fetch/Axios
  console.log('Formulário enviado:', { ...form })
  alert('Mensagem enviada com sucesso!')
}
</script>
