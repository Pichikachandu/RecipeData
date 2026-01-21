const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    cuisine: {
      type: String,
      required: [true, 'Cuisine is required'],
      trim: true,
    },
    rating: {
      type: Number,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot be more than 5'],
      default: 0,
    },
    prep_time: {
      type: Number,
      min: [0, 'Prep time cannot be negative'],
    },
    cook_time: {
      type: Number,
      min: [0, 'Cook time cannot be negative'],
    },
    total_time: {
      type: Number,
      min: [0, 'Total time cannot be negative'],
    },
    description: {
      type: String,
      trim: true,
    },
    nutrients: {
      calories: String,
      carbohydrateContent: String,
      cholesterolContent: String,
      fiberContent: String,
      proteinContent: String,
      saturatedFatContent: String,
      sodiumContent: String,
      sugarContent: String,
      fatContent: String,
      unsaturatedFatContent: String,
    },
    serves: String,
    ingredients: [String],
    instructions: [String],
    url: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
recipeSchema.index({ title: 'text', cuisine: 'text', description: 'text' });
recipeSchema.index({ rating: -1 });
recipeSchema.index({ total_time: 1 });

// Virtual for getting the average rating
recipeSchema.virtual('averageRating').get(function () {
  return this.rating;
});

// Pre-save hook to handle NaN values
recipeSchema.pre('save', function (next) {
  // Convert numeric fields to null if they're not valid numbers
  ['rating', 'prep_time', 'cook_time', 'total_time'].forEach((field) => {
    if (this[field] !== undefined && (isNaN(Number(this[field])) || this[field] === null)) {
      this[field] = null;
    }
  });
  next();
});

// Static method for text search
recipeSchema.statics.search = async function (query) {
  return await this.find({ $text: { $search: query } });
};

// Static method for filtering by nutrients
recipeSchema.statics.filterByNutrients = async function (filters) {
  const query = {};
  
  if (filters.calories) {
    query['nutrients.calories'] = this._parseNutrientFilter(filters.calories);
  }
  
  // Add more nutrient filters as needed
  
  return await this.find(query);
};

// Helper method to parse nutrient filters
recipeSchema.statics._parseNutrientFilter = function (filterString) {
  const operator = filterString.match(/^[<>=]+/)?.[0] || '=';
  const value = parseFloat(filterString.replace(/^[<>=]+/, ''));
  
  switch (operator) {
    case '>': return { $gt: value };
    case '>=': return { $gte: value };
    case '<': return { $lt: value };
    case '<=': return { $lte: value };
    default: return value;
  }
};

module.exports = mongoose.model('Recipe', recipeSchema);
