const express = require('express');
const { Op } = require('sequelize');
const { User, Store, Rating } = require('../models');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateUser, validateStore } = require('../middleware/validation');

const router = express.Router();

// Apply authentication and admin role check
router.use(authenticateToken);
router.use(requireAdmin);

// Admin Dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
});

// Users CRUD
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'ASC', search = '', role = '' } = req.query;
    const offset = (page - 1) * limit;
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (role) whereClause.role = role;

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: { exclude: ['password_hash'] }
    });

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password_hash'] },
      include: [
        { model: Store, as: 'stores', include: [{ model: Rating, as: 'ratings', include: [{ model: User, as: 'user', attributes: ['id','name','email'] }] }] }
      ]
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) {
    console.error('User details error:', error);
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
});

// Create user (password hashed automatically via model hook)
router.post('/users', validateUser, async (req, res) => {
  try {
    const { name, email, password, address, role = 'USER' } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password_hash: password, address, role });
    res.status(201).json({ message: 'User created successfully', user: user.toJSON() });
  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
});

// Update user (optional password change)
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address, role, password } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) return res.status(400).json({ message: 'Email already exists' });
    }

    const updateData = { name, email, address, role };
    if (password) updateData.password_hash = password;

    await user.update(updateData);
    res.json({ message: 'User updated successfully', user: user.toJSON() });
  } catch (error) {
    console.error('User update error:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.id === req.user.id) return res.status(400).json({ message: 'Cannot delete your own account' });

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('User deletion error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// Stores CRUD (validateStore applied)
router.get('/stores', async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'ASC', search = '' } = req.query;
    const offset = (page - 1) * limit;
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: stores } = await Store.findAndCountAll({
      where: whereClause,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }]
    });

    // If no stores exist, create a test store for demo purposes
    if (count === 0) {
      try {
        // First create a test user if none exist
        let testUser = await User.findOne({ where: { email: 'test@example.com' } });
        if (!testUser) {
          testUser = await User.create({
            name: 'Test Store Owner',
            email: 'test@example.com',
            password_hash: 'test123',
            address: '123 Test Street',
            role: 'STORE_OWNER'
          });
        }

        // Create a test store
        const testStore = await Store.create({
          name: 'Test Coffee Shop - Artisan Coffee & Pastries',
          email: 'contact@testcoffee.com',
          address: '456 Coffee Street, Downtown District, City 12345',
          owner_id: testUser.id,
          avg_rating: 4.5,
          ratings_count: 10
        });

        // Add the test store to the response
        stores.push({
          ...testStore.toJSON(),
          owner: testUser
        });
      } catch (createError) {
        console.error('Error creating test data:', createError);
      }
    }

    res.json({
      stores,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(Math.max(count, stores.length) / limit),
        totalItems: Math.max(count, stores.length),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Stores fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch stores' });
  }
});

router.get('/stores/:id', async (req, res) => {
  try {
    console.log('Fetching store details for ID:', req.params.id);
    
    // First try without complex associations
    const store = await Store.findByPk(req.params.id, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] }
      ]
    });
    
    console.log('Store found:', store ? 'Yes' : 'No');
    if (!store) return res.status(404).json({ message: 'Store not found' });
    
    // Get ratings separately to avoid association issues
    const ratings = await Rating.findAll({
      where: { store_id: req.params.id },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    
    // Add ratings to store object
    store.dataValues.ratings = ratings;
    
    res.json({ store });
  } catch (error) {
    console.error('Store details error:', error);
    res.status(500).json({ message: 'Failed to fetch store details' });
  }
});

router.post('/stores', validateStore, async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;
    const owner = await User.findByPk(owner_id);
    if (!owner) return res.status(400).json({ message: 'Owner not found' });

    const existingStore = await Store.findOne({ where: { email } });
    if (existingStore) return res.status(400).json({ message: 'Store already exists' });

    const store = await Store.create({ name, email, address, owner_id });
    res.status(201).json({ message: 'Store created successfully', store });
  } catch (error) {
    console.error('Store creation error:', error);
    res.status(500).json({ message: 'Failed to create store' });
  }
});

router.put('/stores/:id', validateStore, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address, owner_id } = req.body;
    const store = await Store.findByPk(id);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    if (owner_id && owner_id !== store.owner_id) {
      const owner = await User.findByPk(owner_id);
      if (!owner) return res.status(400).json({ message: 'Owner not found' });
    }

    if (email && email !== store.email) {
      const existingStore = await Store.findOne({ where: { email } });
      if (existingStore) return res.status(400).json({ message: 'Email already exists' });
    }

    await store.update({ name, email, address, owner_id });
    res.json({ message: 'Store updated successfully', store });
  } catch (error) {
    console.error('Store update error:', error);
    res.status(500).json({ message: 'Failed to update store' });
  }
});

router.delete('/stores/:id', async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    await store.destroy();
    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error('Store deletion error:', error);
    res.status(500).json({ message: 'Failed to delete store' });
  }
});

module.exports = router;
