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
 * @query   {string} [title] - Search by recipe title (partial match)
 * @query   {string} [cuisine] - Filter by cuisine
 * @query   {number} [rating] - Filter by rating (greater than, less than, or equal to)
 * @query   {string} [ratingOp] - Rating operator: 'gte' (>=), 'lte' (<=), 'eq' (=)
 * @query   {number} [calories] - Filter by calories
 * @query   {string} [caloriesOp] - Calories operator: 'gte' (>=), 'lte' (<=), 'eq' (=)
 * @query   {number} [total_time] - Filter by total time
 * @query   {string} [timeOp] - Total time operator: 'gte' (>=), 'lte' (<=), 'eq' (=)
 * @query   {number} [page=1] - Page number
 * @query   {number} [limit=10] - Number of items per page
 * @query   {string} [sortBy=rating] - Field to sort by
 * @query   {string} [sortOrder=desc] - Sort order ('asc' or 'desc')
 */
exports.searchRecipes = async (req, res) => {
  try {
    // Get query parameters
    const { title, cuisine, rating, ratingOp, calories, caloriesOp, total_time, timeOp } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Build search query
    const query = {};

    // Text search by title (case-insensitive)
    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    // Filter by cuisine (case-insensitive)
    if (cuisine) {
      query.cuisine = { $regex: cuisine, $options: 'i' };
    }

    // Helper function to build filter operators
    const buildOperatorQuery = (value, operator) => {
      const num = parseFloat(value);
      if (isNaN(num)) return null;
      
      switch(operator) {
        case 'gte':
          return { $gte: num };
        case 'lte':
          return { $lte: num };
        case 'eq':
          return num;
        default:
          return { $gte: num }; // default to greater than or equal
      }
    };

    // Filter by rating
    if (rating) {
      const ratingQuery = buildOperatorQuery(rating, ratingOp || 'gte');
      if (ratingQuery !== null) {
        query.rating = ratingQuery;
      }
    }

    // Filter by calories (stored in nutrients.calories)
    if (calories) {
      const caloriesQuery = buildOperatorQuery(calories, caloriesOp || 'gte');
      if (caloriesQuery !== null) {
        query['nutrients.calories'] = caloriesQuery;
      }
    }

    // Filter by total time
    if (total_time) {
      const timeQuery = buildOperatorQuery(total_time, timeOp || 'lte');
      if (timeQuery !== null) {
        query.total_time = timeQuery;
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
