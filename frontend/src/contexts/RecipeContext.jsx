import { createContext, useContext, useState } from 'react';

const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openRecipeDetails = (recipe) => {
    setSelectedRecipe(recipe);
    setIsDrawerOpen(true);
  };

  const closeRecipeDetails = () => {
    setIsDrawerOpen(false);
    // Small delay to allow the drawer animation to complete
    setTimeout(() => setSelectedRecipe(null), 300);
  };

  return (
    <RecipeContext.Provider
      value={{
        selectedRecipe,
        isDrawerOpen,
        openRecipeDetails,
        closeRecipeDetails,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipeContext = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipeContext must be used within a RecipeProvider');
  }
  return context;
};
