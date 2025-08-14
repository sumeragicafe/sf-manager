'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     const vaccines = [
      {
        name: 'V8',
        description: 'Protege contra cinomose, hepatite infecciosa canina, adenovirose, parainfluenza, parvovirose e leptospirose (duas cepas).'
      },
      {
        name: 'V10',
        description: 'Inclui todas as proteções da V8 e mais duas cepas adicionais de leptospira.'
      },
      {
        name: 'Antirrábica Canina',
        description: 'Previne a raiva, doença viral fatal transmitida pela saliva de animais infectados.'
      },
      {
        name: 'Gripe Canina (Tosse dos Canis)',
        description: 'Protege contra Bordetella bronchiseptica e vírus parainfluenza, principais causadores da tosse dos canis.'
      },
      {
        name: 'Leishmaniose',
        description: 'Ajuda na prevenção da leishmaniose visceral canina, doença transmitida pelo mosquito-palha.'
      },
      {
        name: 'V3 Felina',
        description: 'Protege contra panleucopenia felina, rinotraqueíte viral felina e calicivirose.'
      },
      {
        name: 'V4 Felina',
        description: 'Inclui as proteções da V3 e mais a clamidiose felina.'
      },
      {
        name: 'V5 Felina',
        description: 'Inclui as proteções da V4 e ainda a leucose felina.'
      },
      {
        name: 'Antirrábica Felina',
        description: 'Previne a raiva em gatos, protegendo também a saúde pública.'
      }
    ];

    await queryInterface.bulkInsert(
      'vaccine',
      vaccines.map(v => ({
        name: v.name,
        description: v.description
      })),
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('vaccine', null, {});
  }
};
