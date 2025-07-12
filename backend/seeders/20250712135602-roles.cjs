'use strict';

const { v4: uuidv4 } = require('uuid');
//import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const adminId = uuidv4();
    const userId = uuidv4();

    await queryInterface.bulkInsert('roles', [
      { id: adminId, name: 'ADMIN', description: 'Administrador do sistema' },
      { id: userId, name: 'USER', description: 'Usuário com permissões limitadas' }
    ]);

    // Buscar todas as permissões
    const permissions = await queryInterface.sequelize.query(
      'SELECT id, name FROM permissions;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const rolePermissions = [];

    for (const permission of permissions) {
      // ADMIN tem todas as permissões
      rolePermissions.push({
        role_id: adminId,
        permission_id: permission.id
      });

      // USER tem acesso apenas a conteúdo
      if (['ACCESS_CONTENT_PANEL', 'INTEREST_FORM_LIST'].includes(permission.name)) {
        rolePermissions.push({
          role_id: userId,
          permission_id: permission.id
        });
      }
    }

    await queryInterface.bulkInsert('role_permissions', rolePermissions);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('role_permissions', null, {});
    await queryInterface.bulkDelete('roles', null, {});
  }
};
