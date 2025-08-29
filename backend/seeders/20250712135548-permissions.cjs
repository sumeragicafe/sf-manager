'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
 const permissions = [
      { name: 'user.get', description: 'Get usuários' },
      { name: 'user.create', description: 'Criar novos usuários' },
      { name: 'user.delete', description: 'Excluir usuários' },
      { name: 'user.update', description: 'Alterar dados de usuários' },
      { name: 'user.change_password', description: 'Alterar senha de outros usuários' },

      { name: 'permission.get', description: 'Visualizar permissões' },
      { name: 'permission.create', description: 'Criar permissões' },
      { name: 'permission.delete', description: 'Excluir permissões' },

      { name: 'role.get', description: 'Visualizar cargos' },
      { name: 'role.create', description: 'Criar cargos' },
      { name: 'role.delete', description: 'Excluir cargos' },
      { name: 'role.update_permissions', description: 'Alterar permissões de cargos' },

      { name: 'pet.create', description: 'Cadastrar novo pet' },
      { name: 'pet.edit', description: 'Editar dados de pet' },
      { name: 'pet.delete', description: 'Excluir pet' },

      { name: 'pet.media_add', description: 'Adicionar mídias ao pet' },
      { name: 'pet.media_remove', description: 'Remover mídias do pet' },

      { name: 'pet.vaccine_add', description: 'Registrar vacinação' },
      { name: 'pet.vaccine_remove', description: 'Remover vacinação' },
      { name: 'pet.castration_add', description: 'Registrar castração' },

      { name: 'pet.fact_add', description: 'Adicionar fato relevante do pet' },
      { name: 'pet.fact_remove', description: 'Remover fato do pet' },

      { name: 'adoption.register', description: 'Registrar adoção' },
      { name: 'adoption.fact_add', description: 'Adicionar fato à adoção' },

      { name: 'interest_form.list', description: 'Listar formulários de interesse' },
      { name: 'interest_form.delete', description: 'Excluir formulário de interesse' },

      { name: 'testimonial.list', description: 'Visualizar depoimentos' },
      { name: 'testimonial.delete', description: 'Excluir depoimento' },

      { name: 'event.create', description: 'Criar evento' },
      { name: 'event.edit', description: 'Editar evento' },
      { name: 'event.delete', description: 'Excluir evento' },

      { name: 'partner.create', description: 'Cadastrar parceiro' },
      { name: 'partner.edit', description: 'Editar parceiro' },
      { name: 'partner.delete', description: 'Excluir parceiro' },

      { name: 'media.view_private_media', description: 'Visualizar arquivos privados' },
      { name: 'media.create', description: 'Criar arquivos' },
      { name: 'media.update', description: 'Atualizar arquivos' },
      { name: 'media.delete', description: 'Excluir arquivos' },

      { name: 'access.admin_panel', description: 'Acessar painel administrativo' },
      { name: 'access.content_panel', description: 'Acessar painel de conteúdo' }
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
