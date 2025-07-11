'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    const passwordHash = await bcrypt.hash('sfmanager8123', 10);
    await queryInterface.bulkInsert('users', [{
      id: Sequelize.UUIDV4(),
      name: 'Root User',
      username: 'root',
      email: 'root@sfmanager.com',
      password: passwordHash,
      role: 'admin',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('users', { username: 'root' }, {});
  }
};
