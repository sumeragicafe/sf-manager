'use strict';

const { v4: uuidv4 } = require('uuid');
//import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const adminId = uuidv4();
    const userId = uuidv4();

    await queryInterface.bulkInsert('roles', [
      { id: adminId, name: 'Administrador', description: 'Administrador do sistema' },
      { id: userId, name: 'Voluntário', description: 'Usuário com permissões limitadas' }
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

      // VOLUNTÁRIO: regras explícitas e legíveis
      const allowedForVolunteer =
        // Pode visualizar usuários, cargos e permissões
        ['user.get', 'role.get', 'permission.get'].includes(permission.name)
        // Pode acessar qualquer permissão que não seja de user, role ou permission (exceto admin panel)
        || (
          !permission.name.startsWith('user.')
          && !permission.name.startsWith('role.')
          && !permission.name.startsWith('permission.')
          && permission.name !== 'access.admin_panel'
        );

      if (allowedForVolunteer) {
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
