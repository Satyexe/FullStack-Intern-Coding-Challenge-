const express = require('express');
const { Store, Rating, User } = require('../models');
const { authenticateToken, requireStoreOwner } = require('../middleware/auth');

const router = express.Router();

// Apply authentication and store owner role check to all routes
router.use(authenticateToken);
router.use(requireStoreOwner);

// Get store owner dashboard - ratings for their stores
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all stores owned by this user
    const stores = await Store.findAll({
      where: { owner_id: userId },
      include: [
        {
          model: Rating,
          as: 'ratings',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ],
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    // Calculate overall statistics
    let totalRatings = 0;
    let totalRatingSum = 0;
    let allRatings = [];

    stores.forEach(store => {
      totalRatings += store.ratings_count;
      totalRatingSum += (Number(store.avg_rating) || 0) * store.ratings_count;
      allRatings.push(...store.ratings);
    });

    const overallAvgRating = totalRatings > 0 ? totalRatingSum / totalRatings : 0;

    // Sort all ratings by creation date (newest first)
    allRatings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      stores: stores.map(store => ({
        ...store.toJSON(),
        avg_rating: Number(store.avg_rating) || 0
      })),
      statistics: {
        totalStores: stores.length,
        totalRatings,
        overallAvgRating: Math.round(overallAvgRating * 100) / 100
      },
      recentRatings: allRatings.slice(0, 10) // Last 10 ratings across all stores
    });
  } catch (error) {
    console.error('Store owner dashboard error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
});

// Get detailed ratings for a specific store
router.get('/stores/:storeId/ratings', async (req, res) => {
  try {
    const { storeId } = req.params;
    const userId = req.user.id;

    // Verify the store belongs to this user
    const store = await Store.findOne({
      where: { id: storeId, owner_id: userId }
    });

    if (!store) {
      return res.status(404).json({ message: 'Store not found or access denied' });
    }

    // Get all ratings for this store
    const ratings = await Rating.findAll({
      where: { store_id: storeId },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json({
      store: {
        id: store.id,
        name: store.name,
        address: store.address,
        avg_rating: Number(store.avg_rating) || 0,
        ratings_count: store.ratings_count
      },
      ratings
    });
  } catch (error) {
    console.error('Store ratings fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch store ratings' });
  }
});

// Get store owner's stores
router.get('/stores', async (req, res) => {
  try {
    const userId = req.user.id;

    const stores = await Store.findAll({
      where: { owner_id: userId },
      order: [['createdAt', 'DESC']]
    });

    res.json({ 
      stores: stores.map(store => ({
        ...store.toJSON(),
        avg_rating: Number(store.avg_rating) || 0
      }))
    });
  } catch (error) {
    console.error('Store owner stores fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch stores' });
  }
});

module.exports = router;
