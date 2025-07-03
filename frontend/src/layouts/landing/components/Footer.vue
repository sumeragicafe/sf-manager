<template>
  <footer class="bg-ong-text text-white">
    <div class="container mx-auto px-4 py-16">
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Marca -->
        <div class="space-y-4">
          <div class="flex items-center space-x-2">
            <div class="w-10 h-10 bg-ong-primary rounded-full flex items-center justify-center">
              <Heart class="w-6 h-6 text-white" />
            </div>
            <span class="text-2xl font-heading">ONG São Francisco</span>
          </div>
          <p class="text-white/80 leading-relaxed">
            Transformando vidas de animais e construindo esperança através da adoção, cuidado e compaixão.
          </p>
          <div class="flex space-x-4">
            <a href="https://www.instagram.com/ongsfrancisco" target="_blank" class="w-10 h-10 bg-ong-primary rounded-full flex items-center justify-center hover:bg-ong-accent transition-colors">
              <Instagram class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- Links Rápidos -->
        <div>
          <h4 class="font-heading text-ong-secondary mb-6">Links Rápidos</h4>
          <ul class="space-y-3">
            <li><router-link to="/" class="text-white/80 hover:text-ong-primary transition-colors">Home</router-link></li>
            <li><router-link to="/o-que-fazemos" class="text-white/80 hover:text-ong-primary transition-colors">O que fazemos</router-link></li>
            <li><router-link to="/nossa-historia" class="text-white/80 hover:text-ong-primary transition-colors">Nossa História</router-link></li>
            <li><router-link to="/eventos" class="text-white/80 hover:text-ong-primary transition-colors">Eventos</router-link></li>
            <li><router-link to="/parcerias" class="text-white/80 hover:text-ong-primary transition-colors">Parcerias</router-link></li>
            <li><router-link to="/contato" class="text-white/80 hover:text-ong-primary transition-colors">Contato</router-link></li>
          </ul>
        </div>

        <!-- Programas -->
        <div>
          <h4 class="font-heading text-ong-secondary mb-6">Programas</h4>
          <ul class="space-y-3">
            <li><a href="#" class="text-white/80 hover:text-ong-primary transition-colors">Adoção</a></li>
            <li><a href="#" class="text-white/80 hover:text-ong-primary transition-colors">Castração</a></li>
            <li><a href="#" class="text-white/80 hover:text-ong-primary transition-colors">Reabilitação</a></li>
            <li><a href="#" class="text-white/80 hover:text-ong-primary transition-colors">Lar Temporário</a></li>
            <li><a href="#" class="text-white/80 hover:text-ong-primary transition-colors">Educação</a></li>
          </ul>
        </div>

        <!-- Contato -->
        <div>
          <h4 class="font-heading text-ong-secondary mb-6">Contato</h4>
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <MapPin class="w-5 h-5 text-ong-primary flex-shrink-0" />
              <span class="text-white/80">
                Rua da Esperança, 123<br />
                São Paulo, SP
              </span>
            </div>
            <div class="flex items-center space-x-3">
              <Phone class="w-5 h-5 text-ong-primary flex-shrink-0" />
              <span class="text-white/80">(11) 9999-9999</span>
            </div>
            <div class="flex items-center space-x-3">
              <Mail class="w-5 h-5 text-ong-primary flex-shrink-0" />
              <span class="text-white/80">contato@ongsf.org.br</span>
            </div>
          </div>
          <div class="mt-6">
            <button class="btn-primary w-full">
              Seja um Voluntário
            </button>
          </div>
        </div>
      </div>

      <!-- Rodapé inferior -->
      <div class="border-t border-white/20 mt-12 pt-8 text-center">
        <p class="text-white/60">
          © 2024 ONG São Francisco. Todos os direitos reservados. 
          <span class="mx-2">•</span>
          Feito com 💝 por quem ama os animais.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Instagram,
} from 'lucide-vue-next'
</script>
