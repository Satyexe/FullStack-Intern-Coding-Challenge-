const express = require('express');
const { Op } = require('sequelize');
const { Store, Rating, User } = require('../models');
const { authenticateToken, requireUser } = require('../middleware/auth');
const { validateRating } = require('../middleware/validation');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);
router.use(requireUser);

// Get all stores with search and filter
router.get('/stores', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'name', 
      sortOrder = 'ASC',
      search = ''
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Add search filter
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: stores } = await Store.findAndCountAll({
      where: whereClause,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    // Get user's ratings for these stores
    const storeIds = stores.map(store => store.id);
    const userRatings = await Rating.findAll({
      where: {
        user_id: req.user.id,
        store_id: { [Op.in]: storeIds }
      }
    });

    // Create a map of user ratings by store ID
    const userRatingsMap = {};
    userRatings.forEach(rating => {
      userRatingsMap[rating.store_id] = rating.rating;
    });

    // Add user's rating + ensure avg_rating is a number
    const storesWithUserRating = stores.map(store => {
      const jsonStore = store.toJSON();
      return {
        ...jsonStore,
        userRating: userRatingsMap[store.id] || null,
        avg_rating: Number(jsonStore.avg_rating) || 0
      };
    });

    res.json({
      stores: storesWithUserRating,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Stores fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch stores' });
  }
});

// Submit or update rating for a store
router.post('/stores/:storeId/rating', validateRating, async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    // Verify store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Check if user already rated this store
    const existingRating = await Rating.findOne({
      where: { user_id: userId, store_id: storeId }
    });

    let ratingRecord;
    let isNewRating = false;

    if (existingRating) {
      // Update existing rating
      await existingRating.update({ rating });
      ratingRecord = existingRating;
    } else {
      // Create new rating
      ratingRecord = await Rating.create({
        user_id: userId,
        store_id: storeId,
        rating
      });
      isNewRating = true;
    }

    // Update store's average rating and ratings count
    await updateStoreRatingStats(storeId);

    res.json({
      message: isNewRating ? 'Rating submitted successfully' : 'Rating updated successfully',
      rating: ratingRecord
    });
  } catch (error) {
    console.error('Rating submission error:', error);
    res.status(500).json({ message: 'Failed to submit rating' });
  }
});

// Get user's ratings
router.get('/ratings', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: ratings } = await Rating.findAndCountAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name', 'address', 'avg_rating']
        }
      ]
    });

    // Fix avg_rating here too
    const fixedRatings = ratings.map(r => {
      const jsonRating = r.toJSON();
      return {
        ...jsonRating,
        store: {
          ...jsonRating.store,
          avg_rating: Number(jsonRating.store.avg_rating) || 0
        }
      };
    });

    res.json({
      ratings: fixedRatings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('User ratings fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch ratings' });
  }
});

// Helper function to update store rating statistics
async function updateStoreRatingStats(storeId) {
  try {
    const ratings = await Rating.findAll({
      where: { store_id: storeId },
      attributes: ['rating']
    });

    if (ratings.length === 0) {
      await Store.update(
        { avg_rating: 0.00, ratings_count: 0 },
        { where: { id: storeId } }
      );
      return;
    }

    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const avgRating = totalRating / ratings.length;
    const ratingsCount = ratings.length;

    await Store.update(
      { 
        avg_rating: Math.round(avgRating * 100) / 100, // Round to 2 decimal places
        ratings_count: ratingsCount 
      },
      { where: { id: storeId } }
    );
  } catch (error) {
    console.error('Error updating store rating stats:', error);
  }
}

module.exports = router;
