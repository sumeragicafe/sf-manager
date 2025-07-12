'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const [adminRole] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'ADMIN' LIMIT 1;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const hashedPassword = await bcrypt.hash('trocar123', 10);

    await queryInterface.bulkInsert('users', [{
      id: uuidv4(),
      name: 'Root User',
      username: 'root',
      email: 'root@example.com',
      password: hashedPassword,
      is_active: true,
      role_id: adminRole.id,
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { username: 'root' }, {});
  }
};
