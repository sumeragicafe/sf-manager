<template>
  <section id="mission" class="py-20 bg-white">
    <div class="container mx-auto px-4">
      <!-- Cabeçalho -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-ong-text mb-6">Nossa Missão em Ação</h2>
        <p class="text-lg text-ong-text/80">
          Resgatamos animais em situação de rua ou em estado crítico de saúde.
          Após cuidados com medicamentos e acompanhamento veterinário,
          eles são preparados com muito amor para encontrar uma nova família.
        </p>
      </div>

      <!-- Grade de Programas -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(program, index) in programs"
          :key="program.title"
          class="bg-ong-background/50 p-8 rounded-2xl card-hover animate-fade-in border border-ong-secondary/20"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="text-5xl mb-4">{{ program.icon }}</div>
          <h3 class="text-ong-text mb-4">{{ program.title }}</h3>
          <p class="text-ong-text/80 mb-6 leading-relaxed">
            {{ program.description }}
          </p>
          <div class="flex items-center justify-between">
            <span class="text-ong-primary font-heading text-lg">
              {{ program.stats }}
            </span>
            <button
              class="text-ong-primary hover:text-ong-accent transition-colors duration-300 font-medium"
            >
              Ver mais →
            </button>
          </div>
        </div>
      </div>

      <!-- Seção CTA -->
      <div class="mt-16 text-center">
        <div class="bg-gradient-to-r from-ong-primary to-ong-accent p-12 rounded-3xl text-white">
          <h3 class="mb-6">Apoie Nossa Causa</h3>
          <p class="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Sua ajuda transforma vidas! Com sua colaboração, conseguimos oferecer resgate, tratamento e adoção
            para centenas de animais. Junte-se a nós nessa missão de amor!
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button class="bg-white text-ong-primary px-8 py-4 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-300">
              Adote um Animal
            </button>
            <button class="border-2 border-white text-white px-8 py-4 rounded-lg font-medium hover:bg-white hover:text-ong-primary transition-colors duration-300">
              Apoiar com Doação
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const programs = [
  {
    title: "Resgate de Animais",
    description:
      "Resgatamos animais em situação de rua, abandono ou risco, oferecendo socorro imediato e seguro.",
    icon: "🚨",
    stats: "+1.200 resgatados",
  },
  {
    title: "Cuidados Veterinários",
    description:
      "Proporcionamos acompanhamento com veterinários, incluindo exames, internações e tratamentos necessários.",
    icon: "💉",
    stats: "+900 atendimentos",
  },
  {
    title: "Castração e Vacinação",
    description:
      "Realizamos castrações e vacinas para garantir a saúde dos animais e evitar o abandono.",
    icon: "🩺",
    stats: "+700 procedimentos",
  },
  {
    title: "Lar Temporário",
    description:
      "Animais são acolhidos em lares temporários enquanto se recuperam física e emocionalmente.",
    icon: "🏠",
    stats: "+300 acolhidos",
  },
  {
    title: "Adoção Consciente",
    description:
      "Após os cuidados, os animais são preparados para adoção por famílias responsáveis e amorosas.",
    icon: "🐶",
    stats: "+850 adoções",
  },
  {
    title: "Conscientização",
    description:
      "Promovemos ações educativas sobre bem-estar animal e a importância do respeito e da adoção.",
    icon: "📢",
    stats: "+5 mil impactados",
  },
];
</script>
