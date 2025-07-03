<template>
  <div class="animate-fade-in space-y-4">
    <h2 class="text-3xl font-heading font-bold">Nossa Missão</h2>
    <p class="leading-relaxed">
      Bem-vindo à <strong>ONG São Francisco</strong>! Somos uma organização dedicada a transformar a vida de animais em situação de vulnerabilidade, oferecendo resgate, cuidado e adoção responsável.
    </p>
    <p class="leading-relaxed">
      Nosso trabalho começa onde a urgência fala mais alto: animais abandonados, feridos ou em risco iminente são acolhidos com carinho e responsabilidade. Fornecemos tratamento médico completo, alimentação e atenção individualizada — tudo que eles precisam para se recuperar.
    </p>
    <p class="leading-relaxed">
      Acreditamos que cada animal merece uma segunda chance. Por isso, preparamos nossos resgatados para adoção, conectando-os a famílias amorosas que realmente desejam fazer a diferença.
    </p>
    <p class="leading-relaxed">
      Quer acompanhar nosso dia a dia? Siga a gente no 
      <a :href="instagramLink" target="_blank" class="text-ong-primary underline hover:text-ong-accent transition">
        Instagram
      </a> e veja de perto cada resgate, transformação e final feliz.
    </p>
    <p class="leading-relaxed">
      Junte-se a nós nessa missão! Seja um doador, voluntário ou divulgador — seu apoio salva vidas.
    </p>
  </div>
</template>

<script setup>
var instagramLink = "https://www.instagram.com/ongsfrancisco" 
</script>
