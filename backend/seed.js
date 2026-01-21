const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Recipe = require('./models/Recipe');
const recipeData = require('./data/US_recipes_null.Pdf.json');

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Recipe.deleteMany({});
    console.log('Cleared existing recipes');

    // Format and insert recipe data
    const formattedRecipes = [];
    
    for (const [key, recipe] of Object.entries(recipeData)) {
      // Skip invalid entries
      if (!recipe || !recipe.title) continue;
      
      formattedRecipes.push({
        title: recipe.title,
        cuisine: recipe.cuisine || 'Uncategorized',
        rating: recipe.rating || 0,
        prep_time: recipe.prep_time || 0,
        cook_time: recipe.cook_time || 0,
        total_time: recipe.total_time || (recipe.prep_time || 0) + (recipe.cook_time || 0),
        description: recipe.description || '',
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || [],
        nutrients: recipe.nutrients || {},
        serves: recipe.serves || '',
        url: recipe.URL || '',
        continent: recipe.Continent || 'Unknown',
        country_state: recipe.Country_State || 'Unknown'
      });
    }

    // Insert recipes in batches of 50
    const batchSize = 50;
    for (let i = 0; i < formattedRecipes.length; i += batchSize) {
      const batch = formattedRecipes.slice(i, i + batchSize);
      await Recipe.insertMany(batch);
      console.log(`Inserted ${Math.min(i + batchSize, formattedRecipes.length)}/${formattedRecipes.length} recipes`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
