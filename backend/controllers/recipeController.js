const Recipe = require('../models/Recipe');

/**
 * @desc    Get all recipes with pagination, sorting, and filtering
 * @route   GET /api/recipes
 * @access  Public
 * @query   {number} [page=1] - Page number
 * @query   {number} [limit=10] - Number of items per page
 * @query   {string} [sortBy=rating] - Field to sort by (e.g., 'rating', 'prep_time', 'cook_time')
 * @query   {string} [sortOrder=desc] - Sort order ('asc' or 'desc')
 * @query   {string} [q] - Search query (searches in title, cuisine, and description)
 * @query   {string} [cuisine] - Filter by cuisine (case-insensitive partial match)
 * @query   {number} [rating] - Filter by minimum rating
 * @query   {number} [maxTotalTime] - Filter by maximum total time in minutes
 */
exports.getRecipes = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Sorting
    const sortBy = req.query.sortBy || 'rating';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    // Build query for filtering
    const query = {};

    // Text search (case-insensitive)
    if (req.query.q) {
      query.$or = [
        { title: { $regex: req.query.q, $options: 'i' } },
        { cuisine: { $regex: req.query.q, $options: 'i' } },
        { description: { $regex: req.query.q, $options: 'i' } }
      ];
    }

    // Filter by cuisine (case-insensitive)
    if (req.query.cuisine) {
      query.cuisine = { $regex: req.query.cuisine, $options: 'i' };
    }

    // Filter by minimum rating
    if (req.query.rating) {
      query.rating = { $gte: parseFloat(req.query.rating) };
    }

    // Filter by maximum total time
    if (req.query.maxTotalTime) {
      query.total_time = { $lte: parseInt(req.query.maxTotalTime, 10) };
    }

    // Convert string 'null' or 'undefined' to actual null for number fields
    const handleNumberFilter = (value) => {
      if (value === 'null' || value === 'undefined') return null;
      const num = parseFloat(value);
      return isNaN(num) ? null : num;
    };

    // Handle numeric filters
    ['prep_time', 'cook_time', 'total_time', 'rating'].forEach(field => {
      if (req.query[field] !== undefined) {
        const value = handleNumberFilter(req.query[field]);
        if (value !== null) {
          query[field] = value;
        }
      }
    });

    // Get total count and paginated results
    const [recipes, total] = await Promise.all([
      Recipe.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Recipe.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      page: page,
      limit: limit,
      total: total,
      data: recipes
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recipes',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * @desc    Search recipes with filters
 * @route   GET /api/recipes/search
 * @access  Public
 * @query   {string} [q] - Search query string
 * @query   {string} [cuisine] - Filter by cuisine
 * @query   {number} [minRating] - Minimum rating (1-5)
 * @query   {number} [maxPrepTime] - Maximum preparation time in minutes
 * @query   {number} [maxCookTime] - Maximum cooking time in minutes
 * @query   {number} [page=1] - Page number
 * @query   {number} [limit=10] - Number of items per page
 * @query   {string} [sortBy=rating] - Field to sort by
 * @query   {string} [sortOrder=desc] - Sort order ('asc' or 'desc')
 */
exports.searchRecipes = async (req, res) => {
  try {
    // Get query parameters
    const { q, cuisine, minRating, maxPrepTime, maxCookTime } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Build search query
    const query = {};

    // Text search (case-insensitive search in title and description)
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    // Filter by cuisine (case-insensitive)
    if (cuisine) {
      query.cuisine = { $regex: cuisine, $options: 'i' };
    }

    // Filter by minimum rating (1-5)
    if (minRating) {
      const rating = parseFloat(minRating);
      if (!isNaN(rating) && rating >= 1 && rating <= 5) {
        query.rating = { $gte: rating };
      }
    }

    // Filter by maximum preparation time (in minutes)
    if (maxPrepTime) {
      const prepTime = parseInt(maxPrepTime, 10);
      if (!isNaN(prepTime) && prepTime > 0) {
        query.prep_time = { $lte: prepTime };
      }
    }

    // Filter by maximum cooking time (in minutes)
    if (maxCookTime) {
      const cookTime = parseInt(maxCookTime, 10);
      if (!isNaN(cookTime) && cookTime > 0) {
        query.cook_time = { $lte: cookTime };
      }
    }

    // Sorting
    const sortBy = req.query.sortBy || 'rating';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    // Execute search query with pagination
    const [recipes, total] = await Promise.all([
      Recipe.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Recipe.countDocuments(query),
    ]);

    res.status(200).json({
      page: page,
      limit: limit,
      total: total,
      data: recipes
    });
  } catch (error) {
    console.error('Error searching recipes:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching recipes',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};
