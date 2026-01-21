# Recipe Data Management System

## 🚀 Project Showcase

A full-stack web application that demonstrates modern web development practices through an interactive recipe management system. This project showcases clean architecture, responsive design, and efficient data handling.

## ✨ Key Achievements

- **End-to-End Development**: Built a complete MERN stack application from scratch
- **Performance**: Implemented efficient data fetching with pagination and filtering
- **User Experience**: Created an intuitive, responsive interface with Material-UI
- **Code Quality**: Maintained clean, well-documented, and maintainable codebase

## 🛠 Technical Stack

### Frontend
- **Framework**: React 18 with Hooks
- **UI Library**: Material-UI v5
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **API**: RESTful architecture
- **Validation**: Built-in and custom validators

## 📊 Technical Highlights

### Backend Architecture
- Implemented **RESTful API** with proper status codes and error handling
- Designed **scalable database schema** with MongoDB
- Created **efficient queries** with pagination and sorting
- Set up **environment-based configuration** for different deployment stages

### Frontend Implementation
- Built **reusable UI components** with Material-UI
- Implemented **responsive design** for all device sizes
- Used **React hooks** for state and side effects
- Added **loading states** and **error boundaries** for better UX

## 🏗 Project Structure

```
recipe-app/
├── backend/                  # Backend services
│   ├── controllers/          # Business logic
│   ├── models/              # Database models
│   ├── routes/              # API endpoints
│   └── server.js            # Express server
│
└── frontend/                # Frontend application
    ├── public/             # Static assets
    └── src/
        ├── components/     # Reusable components
        ├── contexts/       # State management
        └── services/       # API services
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd recipe-app
   ```

2. **Set up backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your MongoDB URI
   ```

3. **Set up frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Run the application**
   ```bash
   # Start backend server
   cd ../backend
   npm run dev

   # In a new terminal, start frontend
   cd ../frontend
   npm run dev
   ```

## 📚 API Documentation

### Base URL: `http://localhost:5000/api/recipes`

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/` | GET | Get paginated recipes | `page`, `limit`, `sortBy`, `sortOrder` |
| `/search` | GET | Search recipes | `q`, `cuisine`, `minRating`, `maxPrepTime` |
| `/:id` | GET | Get recipe details | - |

## 🎯 Skills Demonstrated

- **Frontend Development**: React, Material-UI, Responsive Design
- **Backend Development**: Node.js, Express, MongoDB
- **API Design**: RESTful principles, Error Handling
- **State Management**: Context API
- **Version Control**: Git, GitHub
- **Problem Solving**: Efficient data handling and optimization

## 📈 Performance Optimization

- Implemented **pagination** for large datasets
- Used **React.memo** for component optimization
- **Lazy loading** for better initial load time
- Optimized **MongoDB queries** with proper indexing

## 📋 Submission Instructions

### 1. Code Submission
The complete source code is available in this Git repository, which includes:

- **JSON Parsing Logic**: The backend includes seed script (`backend/seed.js`) that parses the JSON recipe data file (`US_recipes_null.Pdf.json`)
- **Database Storage**: Recipes are stored in MongoDB with proper schema validation using Mongoose
- **RESTful APIs**: Complete set of APIs for CRUD operations and recipe management

**Key Files:**
- Backend Logic: [backend/server.js](backend/server.js)
- Database Models: [backend/models/Recipe.js](backend/models/Recipe.js)
- API Routes: [backend/routes/recipeRoutes.js](backend/routes/recipeRoutes.js)
- Controllers: [backend/controllers/recipeController.js](backend/controllers/recipeController.js)
- Data Seeding: [backend/seed.js](backend/seed.js)

### 2. Database Setup

#### MongoDB Schema
The Recipe schema is defined in [backend/models/Recipe.js](backend/models/Recipe.js):

```javascript
{
  name: String (required),
  cuisine: String,
  prepTime: Number,
  cookTime: Number,
  totalTime: Number,
  ingredients: [String],
  instructions: String,
  rating: Number,
  servings: Number,
  calories: Number,
  createdAt: Date (auto-generated)
}
```

#### Database Setup Instructions

1. **Install MongoDB**
   - Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Or use MongoDB Atlas for cloud hosting

2. **Configure Environment Variables**
   Create a `.env` file in the backend directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/recipe-db
   PORT=5000
   NODE_ENV=development
   ```

3. **Seed the Database**
   ```bash
   cd backend
   npm install
   node seed.js
   ```
   This will parse `US_recipes_null.Pdf.json` and populate the MongoDB database with recipe data.

### 3. API Testing

#### Base URL
```
http://localhost:5000/api/recipes
```

#### Endpoints & Examples

**Get All Recipes (Paginated)**
```http
GET /api/recipes?page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Classic Pancakes",
      "cuisine": "American",
      "prepTime": 10,
      "cookTime": 15,
      "totalTime": 25,
      "ingredients": ["flour", "eggs", "milk"],
      "instructions": "Mix ingredients...",
      "rating": 4.5,
      "servings": 4,
      "calories": 350,
      "createdAt": "2024-01-21T10:30:00Z"
    }
  ],
  "total": 5000,
  "page": 1,
  "pages": 500
}
```

**Get Recipe by ID**
```http
GET /api/recipes/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Classic Pancakes",
    "cuisine": "American",
    "prepTime": 10,
    "cookTime": 15,
    "totalTime": 25,
    "ingredients": ["flour", "eggs", "milk"],
    "instructions": "Mix all ingredients...",
    "rating": 4.5,
    "servings": 4,
    "calories": 350,
    "createdAt": "2024-01-21T10:30:00Z"
  }
}
```

**Search Recipes**
```http
GET /api/recipes/search?q=pancake&cuisine=American&minRating=4
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Classic Pancakes",
      "cuisine": "American",
      "rating": 4.5,
      "prepTime": 10,
      "totalTime": 25
    }
  ],
  "total": 3
}
```

#### Testing Tools

Use any of these tools to test the API:

1. **Postman**
   - Import the API endpoints
   - Test with different query parameters
   - Verify response status and data

2. **cURL**
   ```bash
   # Get all recipes
   curl http://localhost:5000/api/recipes?page=1&limit=10

   # Get specific recipe
   curl http://localhost:5000/api/recipes/507f1f77bcf86cd799439011

   # Search recipes
   curl "http://localhost:5000/api/recipes/search?q=pancake&cuisine=American"
   ```

3. **Frontend Application**
   - Access the web interface at `http://localhost:5173`
   - Browse recipes, view details, and search

#### Running Tests

```bash
# Start backend server
cd backend
npm install
npm run dev

# In another terminal, start frontend
cd frontend
npm install
npm run dev

# Access application
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000/api/recipes
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

