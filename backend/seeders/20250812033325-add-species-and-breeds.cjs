'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Inserir espécies
    await queryInterface.bulkInsert('species', [
      { id: 1, name: 'Cachorro' },
      { id: 2, name: 'Gato' },
      { id: 3, name: 'Coelho' },
      { id: 4, name: 'Pássaro' },
      { id: 5, name: 'Roedor' },
      { id: 6, name: 'Réptil' }
    ], {});

    // Raças comuns de cachorro
    const dogBreeds = [
      'Vira-lata (SRD)',
      'Labrador Retriever',
      'Bulldog Francês',
      'Poodle',
      'Pastor Alemão',
      'Golden Retriever',
      'Shih Tzu',
      'Rottweiler',
      'Beagle',
      'Yorkshire Terrier',
      'Dachshund (Teckel)',
      'Boxer',
      'Doberman',
      'Chihuahua',
      'Pug',
      'Maltês',
      'Schnauzer',
      'Border Collie',
      'Akita',
      'Cocker Spaniel',
      'Bull Terrier',
      'São Bernardo',
      'Buldogue Inglês',
      'Pitbull',
      'Welsh Corgi',
      'Boston Terrier',
      'Shar Pei',
      'Lhasa Apso',
      'Weimaraner',
      'Mastiff',
      'Bernese Mountain Dog',
      'Chow Chow',
      'Cavalier King Charles Spaniel',
      'Staffordshire Bull Terrier',
      'American Staffordshire Terrier',
      'Fox Terrier',
      'Basset Hound',
      'Vizsla',
      'Alaskan Malamute',
      'Great Dane',
      'Cane Corso',
      'Rhodesian Ridgeback',
      'Samoyed'
    ].map(name => ({
      species_id: 1,
      name
    }));

    // Raças comuns de gato
    const catBreeds = [
      'Sem raça definida (SRD)',
      'Persa',
      'Siamês',
      'Maine Coon',
      'Ragdoll',
      'Sphynx',
      'British Shorthair',
      'Bengal',
      'Himalaio',
      'Angorá',
      'Scottish Fold',
      'Exótico',
      'Siberiano',
      'American Shorthair',
      'Devon Rex',
      'Oriental',
      'Birmanês',
      'Chartreux',
      'Norueguês da Floresta',
      'Tonquinês',
      'Balinês',
      'Korat',
      'LaPerm',
      'Peterbald',
      'Ragamuffin',
      'Selkirk Rex',
      'Toyger',
      'Savannah',
      'Munchkin',
      'Manx',
      'Snowshoe',
      'Ocicat',
      'Egyptian Mau',
      'Havana Brown',
      'Turkish Van'
    ].map(name => ({
      species_id: 2,
      name
    }));

    // Exemplos para outras espécies (pode expandir com raças/tipos)
    const rabbitBreeds = [
      'Coelho Anão Holandês',
      'Coelho Rex',
      'Coelho Angorá',
      'Coelho Californiano',
      'Coelho Belier'
    ].map(name => ({
      species_id: 3,
      name
    }));

    const birdBreeds = [
      'Calopsita',
      'Periquito',
      'Papagaio',
      'Canário',
      'Tucano',
      'Agapornis',
      'Arara'
    ].map(name => ({
      species_id: 4,
      name
    }));

    const rodentBreeds = [
      'Hamster Sírio',
      'Porquinho-da-Índia',
      'Gerbil',
      'Chinchila'
    ].map(name => ({
      species_id: 5,
      name
    }));

    const reptileBreeds = [
      'Jiboia',
      'Calango',
      'Iguana',
      'Tartaruga',
      'Cascavel'
    ].map(name => ({
      species_id: 6,
      name
    }));

    await queryInterface.bulkInsert('breeds', [
      ...dogBreeds,
      ...catBreeds,
      ...rabbitBreeds,
      ...birdBreeds,
      ...rodentBreeds,
      ...reptileBreeds
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('breeds', null, {});
    await queryInterface.bulkDelete('species', null, {});
  }
};
