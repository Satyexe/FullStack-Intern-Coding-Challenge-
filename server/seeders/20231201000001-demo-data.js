'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create admin user
    const adminPasswordHash = await bcrypt.hash('Admin123!', 12);
    await queryInterface.bulkInsert('users', [
      {
        name: 'System Administrator',
        email: 'admin@storeapp.com',
        password_hash: adminPasswordHash,
        address: '123 Admin Street, Administrative District, City 12345',
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Create sample users
    const user1PasswordHash = await bcrypt.hash('User123!', 12);
    const user2PasswordHash = await bcrypt.hash('User123!', 12);
    const user3PasswordHash = await bcrypt.hash('User123!', 12);

    await queryInterface.bulkInsert('users', [
      {
        name: 'John Smith - Regular Customer',
        email: 'john.smith@email.com',
        password_hash: user1PasswordHash,
        address: '456 Main Street, Downtown District, City 12345',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sarah Johnson - Store Owner',
        email: 'sarah.johnson@email.com',
        password_hash: user2PasswordHash,
        address: '789 Business Avenue, Commercial District, City 12345',
        role: 'STORE_OWNER',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Mike Wilson - Another Customer',
        email: 'mike.wilson@email.com',
        password_hash: user3PasswordHash,
        address: '321 Residential Road, Suburban Area, City 12345',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Get the created user IDs
    const createdUsers = await queryInterface.sequelize.query(
      'SELECT id, role, email FROM users WHERE email IN (?, ?, ?)',
      {
        replacements: ['john.smith@email.com', 'sarah.johnson@email.com', 'mike.wilson@email.com'],
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    );

    const sarahId = createdUsers.find(u => u.role === 'STORE_OWNER').id;
    const johnId = createdUsers.find(u => u.email === 'john.smith@email.com').id;
    const mikeId = createdUsers.find(u => u.email === 'mike.wilson@email.com').id;

    // Create sample stores
    await queryInterface.bulkInsert('stores', [
      {
        name: 'Sarah\'s Electronics Store - Premium Tech Solutions',
        email: 'info@sarahselectronics.com',
        address: '100 Technology Boulevard, Tech District, City 12345',
        owner_id: sarahId,
        avg_rating: 4.2,
        ratings_count: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Mike\'s Coffee Corner - Artisan Coffee & Pastries',
        email: 'contact@mikescoffee.com',
        address: '200 Coffee Street, Downtown District, City 12345',
        owner_id: sarahId,
        avg_rating: 4.5,
        ratings_count: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Get store IDs
    const createdStores = await queryInterface.sequelize.query(
      'SELECT id FROM stores WHERE name LIKE ? OR name LIKE ?',
      {
        replacements: ['%Electronics%', '%Coffee%'],
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    );

    const electronicsStoreId = createdStores[0].id;
    const coffeeStoreId = createdStores[1].id;

    // Create sample ratings
    await queryInterface.bulkInsert('ratings', [
      {
        user_id: johnId,
        store_id: electronicsStoreId,
        rating: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: mikeId,
        store_id: electronicsStoreId,
        rating: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: johnId,
        store_id: coffeeStoreId,
        rating: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: mikeId,
        store_id: coffeeStoreId,
        rating: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ratings', null, {});
    await queryInterface.bulkDelete('stores', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
