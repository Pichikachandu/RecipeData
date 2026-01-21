import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  Divider,
  IconButton,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Rating,
  Chip,
} from '@mui/material';
import { 
  Close as CloseIcon, 
  ExpandMore as ExpandMoreIcon, 
  ExpandLess as ExpandLessIcon,
  AccessTime as TimeIcon,
  Restaurant as NutritionIcon
} from '@mui/icons-material';
import { useRecipeContext } from '../contexts/RecipeContext';

const NutritionTable = ({ nutrition }) => {
  if (!nutrition) return (
    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
      No nutrition information available
    </Typography>
  );

  const nutritionItems = [
    { label: 'Calories', value: nutrition.calories, unit: 'kcal' },
    { label: 'Carbohydrates', value: nutrition.carbohydrateContent, unit: 'g' },
    { label: 'Cholesterol', value: nutrition.cholesterolContent, unit: 'mg' },
    { label: 'Fiber', value: nutrition.fiberContent, unit: 'g' },
    { label: 'Protein', value: nutrition.proteinContent, unit: 'g' },
    { label: 'Saturated Fat', value: nutrition.saturatedFatContent, unit: 'g' },
    { label: 'Sodium', value: nutrition.sodiumContent, unit: 'mg' },
    { label: 'Sugar', value: nutrition.sugarContent, unit: 'g' },
    { label: 'Total Fat', value: nutrition.fatContent, unit: 'g' },
  ];

  return (
    <TableContainer component={Paper} sx={{ mt: 1, boxShadow: 'none', border: '1px solid rgba(224, 224, 224, 1)' }}>
      <Table size="small">
        <TableBody>
          {nutritionItems.map((item) => (
            <TableRow 
              key={item.label}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{ py: 1, pl: 2 }}>
                <Typography variant="body2">{item.label}</Typography>
              </TableCell>
              <TableCell align="right" sx={{ py: 1, pr: 2 }}>
                <Typography variant="body2" fontWeight="medium">
                  {item.value ? `${item.value} ${item.unit}` : 'N/A'}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const RecipeDetails = () => {
  const { selectedRecipe, isDrawerOpen, closeRecipeDetails } = useRecipeContext();
  const [expanded, setExpanded] = React.useState({
    time: false,
    nutrition: false,
  });

  const handleExpandClick = (section) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  if (!selectedRecipe) return null;

  const { 
    title, 
    cuisine, 
    description, 
    total_time, 
    cook_time, 
    prep_time, 
    serves, 
    rating, 
    nutrients 
  } = selectedRecipe;

  return (
    <Drawer
      anchor="right"
      open={isDrawerOpen}
      onClose={closeRecipeDetails}
      PaperProps={{ 
        sx: { 
          width: { xs: '100%', sm: '500px', md: '500px' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
          },
        } 
      }}
    >
      <Box sx={{ p: 3, height: '100%', overflowY: 'auto' }}>
        {/* Header with Title, Cuisine, and Close Button */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              {title}
            </Typography>
            {cuisine && (
              <Chip
                label={cuisine}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ textTransform: 'capitalize' }}
              />
            )}
          </Box>
          <IconButton 
            onClick={closeRecipeDetails}
            sx={{ ml: 1 }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Description Section */}
        {description && (
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Description:
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {description}
            </Typography>
          </Box>
        )}

        {/* Time Section */}
        <Box 
          mb={3}
          sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <Box 
            onClick={() => handleExpandClick('time')}
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              backgroundColor: 'action.hover',
              '&:hover': {
                backgroundColor: 'action.selected',
              },
            }}
          >
            <TimeIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" fontWeight="medium" sx={{ flexGrow: 1 }}>
              Total Time: {total_time ? `${total_time} min` : 'N/A'}
            </Typography>
            {expanded.time ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Box>
          
          <Collapse in={expanded.time} timeout="auto" unmountOnExit>
            <Box p={2}>
              <Box mb={1}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Prep Time:</strong> {prep_time ? `${prep_time} min` : 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  <strong>Cook Time:</strong> {cook_time ? `${cook_time} min` : 'N/A'}
                </Typography>
              </Box>
              {serves && (
                <Box mt={1}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Serves:</strong> {serves}
                  </Typography>
                </Box>
              )}
            </Box>
          </Collapse>
        </Box>

        {/* Rating */}
        {rating && (
          <Box 
            mb={3} 
            display="flex" 
            alignItems="center"
            sx={{
              p: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
            }}
          >
            <Typography variant="subtitle1" fontWeight="medium" sx={{ mr: 1 }}>
              Rating:
            </Typography>
            <Rating value={rating} precision={0.1} readOnly size="small" />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({rating.toFixed(1)})
            </Typography>
          </Box>
        )}

        {/* Nutrition Section */}
        <Box
          sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <Box 
            onClick={() => handleExpandClick('nutrition')}
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              backgroundColor: 'action.hover',
              '&:hover': {
                backgroundColor: 'action.selected',
              },
            }}
          >
            <NutritionIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" fontWeight="medium" sx={{ flexGrow: 1 }}>
              Nutrition Information
            </Typography>
            {expanded.nutrition ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Box>
          
          <Collapse in={expanded.nutrition} timeout="auto" unmountOnExit>
            <Box p={2}>
              <NutritionTable nutrition={nutrients} />
            </Box>
          </Collapse>
        </Box>
      </Box>
    </Drawer>
  );
};

export default RecipeDetails;