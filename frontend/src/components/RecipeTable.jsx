import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Box,
  TableSortLabel,
  CircularProgress,
  Typography,
  Rating,
  Tooltip,
} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterListIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useRecipeContext } from '../contexts/RecipeContext';

const RecipeTable = ({
  recipes,
  isLoading,
  pagination,
  onPageChange,
  onPageSizeChange,
  onSearch,
  onSort,
  sortBy,
  sortOrder,
}) => {
  const { openRecipeDetails } = useRecipeContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('title');
  const [order, setOrder] = useState('asc');
  const [filters, setFilters] = useState({
    title: '',
    cuisine: '',
    rating: '',
  });

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({
      q: searchTerm,  // Changed from 'search' to 'q' to match backend expectation
      ...filters,
    });
  };

  const handleFilterChange = (field) => (event) => {
    const newFilters = {
      ...filters,
      [field]: event.target.value,
    };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const handleSort = (property) => {
    onSort(property);
  };

  const handleRowClick = (recipe) => {
    openRecipeDetails(recipe);
  };

  const columns = [
    { id: 'title', label: 'Title', minWidth: 200 },
    { id: 'cuisine', label: 'Cuisine', minWidth: 150 },
    { id: 'rating', label: 'Rating', minWidth: 150, align: 'center' },
    { id: 'totalTime', label: 'Total Time (min)', minWidth: 100, align: 'right' },
    { id: 'servings', label: 'Serves', minWidth: 100, align: 'right' },
  ];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (recipes.length === 0) {
    return (
      <Box textAlign="center" my={4}>
        <Typography variant="h6">No recipes found</Typography>
        <Typography variant="body2" color="textSecondary">
          Try adjusting your search or filter criteria
        </Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', mb: 3 }}>
      <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
        <form onSubmit={handleSearch} style={{ flexGrow: 1, marginRight: 16 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSearchTerm('');
                      onSearch({ q: '' });
                    }}
                    edge="end"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
        <Tooltip title="Filter">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth }}
                >
                  <TableSortLabel
                    active={sortBy === column.id}
                    direction={sortBy === column.id ? sortOrder : 'asc'}
                    onClick={() => handleSort(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell>
                <TextField
                  size="small"
                  placeholder="Filter title"
                  value={filters.title}
                  onChange={handleFilterChange('title')}
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  placeholder="Filter cuisine"
                  value={filters.cuisine}
                  onChange={handleFilterChange('cuisine')}
                  fullWidth
                />
              </TableCell>
              <TableCell align="center">
                <TextField
                  size="small"
                  type="number"
                  placeholder="Min rating"
                  value={filters.rating}
                  onChange={handleFilterChange('rating')}
                  inputProps={{ min: 0, max: 5, step: 0.1 }}
                  fullWidth
                />
              </TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {recipes.map((recipe) => (
              <TableRow
                hover
                key={recipe._id}
                onClick={() => handleRowClick(recipe)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>
                  <Tooltip title={recipe.title}>
                    <Typography noWrap sx={{ maxWidth: 300 }}>
                      {recipe.title}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>{recipe.cuisine || '-'}</TableCell>
                <TableCell align="center">
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <Rating
                      value={recipe.rating || 0}
                      precision={0.5}
                      readOnly
                      size="small"
                    />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {recipe.rating ? recipe.rating.toFixed(1) : 'N/A'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">{recipe.total_time ? `${recipe.total_time} min` : '-'}</TableCell>
                <TableCell align="right">{recipe.serves || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[15, 25, 50]}
        component="div"
        count={pagination.total}
        rowsPerPage={pagination.pageSize}
        page={pagination.page}
        onPageChange={(e, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
      />
    </Paper>
  );
};

export default RecipeTable;
