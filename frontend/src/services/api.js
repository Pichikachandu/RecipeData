import axios from 'axios';

const API_URL = 'http://localhost:5000/api/recipes';

export const getRecipes = async (params = {}) => {
  // Ensure we have default values for pagination
  const { page = 1, limit = 15, ...restParams } = params;
  const response = await axios.get(API_URL, { 
    params: { 
      page, 
      limit, 
      ...restParams 
    } 
  });
  return response.data;
};

// This can be removed if not used elsewhere
export const searchRecipes = async (searchParams) => {
  const response = await axios.get(API_URL, { params: searchParams });
  return response.data;
};
