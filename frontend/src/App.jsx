import { useState, useEffect, useCallback } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme, Box, Typography } from '@mui/material';
import { RecipeProvider, useRecipeContext } from './contexts/RecipeContext';
import RecipeTable from './components/RecipeTable';
import RecipeDetails from './components/RecipeDetails';
import { getRecipes } from './services/api';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 'bold',
          backgroundColor: '#f5f5f5',
        },
      },
    },
  },
});

function AppContent() {
  const { isDrawerOpen } = useRecipeContext();
  const [isLoading, setIsLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 15,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState({});
  const [sortBy, setSortBy] = useState('rating');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchRecipes = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {
        page: pagination.page + 1,
        limit: pagination.pageSize,
        sortBy,
        sortOrder,
        ...searchParams,
      };
      
      const data = await getRecipes(params);
      setRecipes(data.data || []);
      setPagination(prev => ({
        ...prev,
        total: data.total || 0,
      }));
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.pageSize, searchParams, sortBy, sortOrder]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleSearch = useCallback((params) => {
    setSearchParams(prev => {
      const newParams = {
        ...prev,
        ...params,
        // Remove empty values to avoid sending empty strings to the backend
        ...Object.fromEntries(
          Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
        )
      };
      
      // If search term is empty, remove it from params
      if (params.q === '') {
        delete newParams.q;
      }
      
      return newParams;
    });
    
    // Reset to first page when search changes
    setPagination(prev => ({ ...prev, page: 0 }));
  }, []);

  const handleSort = useCallback((property) => {
    const isAsc = sortBy === property && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  }, [sortBy, sortOrder]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setPagination(prev => ({
      ...prev,
      pageSize: newPageSize,
      page: 0,
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Recipe Data
          </Typography>
        </Box>
        
        <RecipeTable
          recipes={recipes}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSearch={handleSearch}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
        
        <RecipeDetails />
      </Container>
    </ThemeProvider>
  );
}

function App() {
  return (
    <RecipeProvider>
      <AppContent />
    </RecipeProvider>
  );
}

export default App;