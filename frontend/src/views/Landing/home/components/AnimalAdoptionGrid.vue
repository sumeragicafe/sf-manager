<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Heart, MapPin, Calendar, ChevronDown, ChevronUp } from 'lucide-vue-next'

const router = useRouter()
const showAll = ref(false)
const favorites = ref([])

const animals = [
  {
    id: "c1992d52-74a9-11f0-b260-0242ac130003", // teste com id gerado ao inserir animais no banco (testando formulário de adoção)
    name: "Malu",
    species: "Cachorra",
    age: "2 anos",
    location: "São Paulo - SP",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    description: "Malu é uma cachorrinha muito carinhosa e brincalhona. Adora crianças e se dá bem com outros animais.",
    personality: ["Carinhosa", "Brincalhona", "Sociável"],
    adopted: false
  },
  {
    id: 2,
    name: "Simba",
    species: "Gato",
    age: "1 ano",
    location: "Rio de Janeiro - RJ",
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    description: "Simba é um gatinho independente mas muito afetuoso. Gosta de lugares altos e de receber carinho.",
    personality: ["Independente", "Afetuoso", "Curioso"],
    adopted: false
  },
  {
    id: 3,
    name: "Bella",
    species: "Cachorra",
    age: "3 anos",
    location: "Belo Horizonte - MG",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    description: "Bella é uma cadela muito leal e protetora. Ideal para famílias que buscam um companheiro fiel.",
    personality: ["Leal", "Protetora", "Calma"],
    adopted: false
  },
  {
    id: 4,
    name: "Mingau",
    species: "Gato",
    age: "6 meses",
    location: "Porto Alegre - RS",
    image: "https://images.unsplash.com/photo-1513245543132-31f507417b26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    description: "Mingau é um filhote muito energético e brincalhão. Perfeito para quem tem tempo para brincar e educar.",
    personality: ["Energético", "Brincalhão", "Inteligente"],
    adopted: false
  },
  {
    id: 5,
    name: "Thor",
    species: "Cachorro",
    age: "4 anos",
    location: "Salvador - BA",
    image: "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    description: "Thor é um cão forte e corajoso, mas extremamente dócil com crianças. Adora atividades ao ar livre.",
    personality: ["Corajoso", "Dócil", "Ativo"],
    adopted: false
  },
  {
    id: 6,
    name: "Luna",
    species: "Gata",
    age: "2 anos",
    location: "Recife - PE",
    image: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    description: "Luna é uma gata muito elegante e carinhosa. Adora receber atenção e fazer companhia durante o dia.",
    personality: ["Elegante", "Carinhosa", "Companheira"],
    adopted: false
  }
]

const displayedAnimals = computed(() => showAll.value ? animals : animals.slice(0, 3))

function toggleFavorite(animalId) {
  if (favorites.value.includes(animalId)) {
    favorites.value = favorites.value.filter(id => id !== animalId)
  } else {
    favorites.value.push(animalId)
  }
}

function goToAdoptionForm(animalId) {
  router.push(`/formulario-de-adocao/${animalId}`)
}
</script>

<template>
  <section class="py-20 bg-gradient-to-br from-ong-background to-white">
    <div class="container mx-auto px-4">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-ong-text mb-6">Procurando um Lar</h2>
        <p class="text-lg text-ong-text/80">
          Conheça nossos amigos especiais que estão esperando por uma família.
          Cada um tem sua personalidade única e muito amor para dar.
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div
          v-for="(animal, index) in displayedAnimals"
          :key="animal.id"
          class="bg-white rounded-2xl shadow-lg overflow-hidden card-hover animate-fade-in cursor-pointer group"
          :style="{ animationDelay: `${index * 0.1}s` }"
          @click="goToAdoptionForm(animal.id)"
        >
          <div class="relative">
            <img
              :src="animal.image"
              :alt="animal.name"
              class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <button
              @click.stop="toggleFavorite(animal.id)"
              :class="[
                'absolute top-4 right-4 p-2 rounded-full transition-all duration-300 z-10',
                favorites.includes(animal.id)
                  ? 'bg-red-500 text-white'
                  : 'bg-white/80 text-gray-600 hover:bg-white'
              ]"
            >
              <Heart :size="20" :fill="favorites.includes(animal.id) ? 'currentColor' : 'none'" />
            </button>
          </div>

          <div class="p-6">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h4 class="text-ong-text mb-1">{{ animal.name }}</h4>
                <p class="text-ong-text/70 text-sm">{{ animal.species }}</p>
              </div>
              <span class="text-ong-primary font-medium text-sm bg-ong-secondary/30 px-3 py-1 rounded-full">
                {{ animal.age }}
              </span>
            </div>

            <p class="text-ong-text/80 text-sm mb-4 line-clamp-2">
              {{ animal.description }}
            </p>

            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="trait in animal.personality"
                :key="trait"
                class="text-xs bg-ong-primary/20 text-ong-primary px-2 py-1 rounded-full"
              >
                {{ trait }}
              </span>
            </div>

            <div class="flex items-center text-ong-text/60 text-sm mb-4">
              <MapPin size="16" class="mr-2" />
              {{ animal.location }}
            </div>

            <button 
              @click.stop="goToAdoptionForm(animal.id)"
              class="w-full btn-primary hover:bg-ong-accent transition-colors duration-300"
            >
              Quero Adotar
            </button>
          </div>
        </div>
      </div>

      <div class="text-center">
        <button @click="showAll = !showAll" class="inline-flex items-center gap-2 btn-secondary">
          <span v-if="showAll">Ver Menos <ChevronUp size="20" /></span>
          <span v-else>Ver Todos os Animais <ChevronDown size="20" /></span>
        </button>
      </div>

      <div class="mt-16 text-center">
        <div class="inline-flex items-center gap-6 bg-white px-8 py-4 rounded-2xl shadow-lg">
          <div class="text-center">
            <div class="text-2xl font-heading text-ong-primary mb-1">{{ animals.length }}</div>
            <div class="text-sm text-ong-text/70">Animais Disponíveis</div>
          </div>
          <div class="w-px h-12 bg-ong-text/20"></div>
          <div class="text-center">
            <div class="text-2xl font-heading text-ong-primary mb-1">847</div>
            <div class="text-sm text-ong-text/70">Adoções Realizadas</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>