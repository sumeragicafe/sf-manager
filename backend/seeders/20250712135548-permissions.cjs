'use strict';

const { v4: uuidv4 } = require('uuid');
// import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const permissions = [
      { name: 'USER_CREATE', description: 'Criar novos usuários' },
      { name: 'USER_DELETE', description: 'Excluir usuários' },
      { name: 'USER_UPDATE_ROLE', description: 'Alterar permissões de usuários' },

      { name: 'PERMISSION_GET', description: 'Criar novos usuários' },
      { name: 'PERMISSION_CREATE', description: 'Criar novos usuários' },
      { name: 'PERMISSION_DELETE', description: 'Excluir usuários' },

      { name: 'ROLE_GET', description: 'Alterar permissões de usuários' },
      { name: 'ROLE_CREATE', description: 'Alterar permissões de usuários' },
      { name: 'ROLE_DELETE', description: 'Alterar permissões de usuários' },
      { name: 'ROLE_UPDATE_PERMISSIONS', description: 'Alterar permissões de usuários' },

      { name: 'PET_CREATE', description: 'Cadastrar novo pet' },
      { name: 'PET_EDIT', description: 'Editar dados de pet' },
      { name: 'PET_DELETE', description: 'Excluir pet' },

      { name: 'PET_MEDIA_ADD', description: 'Adicionar mídias ao pet' },
      { name: 'PET_MEDIA_REMOVE', description: 'Remover mídias do pet' },

      { name: 'PET_VACCINE_ADD', description: 'Registrar vacinação' },
      { name: 'PET_VACCINE_REMOVE', description: 'Remover vacinação' },
      { name: 'PET_CASTRATION_ADD', description: 'Registrar castração' },

      { name: 'PET_FACT_ADD', description: 'Adicionar fato relevante do pet' },
      { name: 'PET_FACT_REMOVE', description: 'Remover fato do pet' },

      { name: 'ADOPTION_REGISTER', description: 'Registrar adoção' },
      { name: 'ADOPTION_FACT_ADD', description: 'Adicionar fato à adoção' },

      { name: 'INTEREST_FORM_LIST', description: 'Listar formulários de interesse' },
      { name: 'INTEREST_FORM_DELETE', description: 'Excluir formulário de interesse' },

      { name: 'TESTIMONIAL_LIST', description: 'Visualizar depoimentos' },
      { name: 'TESTIMONIAL_DELETE', description: 'Excluir depoimento' },

      { name: 'EVENT_CREATE', description: 'Criar evento' },
      { name: 'EVENT_EDIT', description: 'Editar evento' },
      { name: 'EVENT_DELETE', description: 'Excluir evento' },

      { name: 'PARTNER_CREATE', description: 'Cadastrar parceiro' },
      { name: 'PARTNER_EDIT', description: 'Editar parceiro' },
      { name: 'PARTNER_DELETE', description: 'Excluir parceiro' },

      { name: 'ACCESS_ADMIN_PANEL', description: 'Acessar painel administrativo' },
      { name: 'ACCESS_CONTENT_PANEL', description: 'Acessar painel de conteúdo' }
    ];

    await queryInterface.bulkInsert('permissions', permissions.map(p => ({
      id: uuidv4(),
      name: p.name,
      description: p.description
    })), {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
