const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

/**
 * @route   GET /api/recipes
 * @desc    Get all recipes with pagination and sorting
 * @access  Public
 * @query   {number} [page=1] - Page number
 * @query   {number} [limit=10] - Number of items per page
 * @query   {string} [sortBy=rating] - Field to sort by (e.g., 'rating', 'prep_time', 'cook_time')
 * @query   {string} [sortOrder=desc] - Sort order ('asc' or 'desc')
 */
router.get('/', recipeController.getRecipes);

/**
 * @route   GET /api/recipes/search
 * @desc    Search recipes with filters
 * @access  Public
 * @query   {string} [q] - Search query string
 * @query   {string} [cuisine] - Filter by cuisine
 * @query   {number} [minRating] - Minimum rating (1-5)
 * @query   {number} [maxPrepTime] - Maximum preparation time in minutes
 * @query   {number} [maxCookTime] - Maximum cooking time in minutes
 * @query   {number} [page=1] - Page number
 * @query   {number} [limit=10] - Number of items per page
 */
router.get('/search', recipeController.searchRecipes);

module.exports = router;
