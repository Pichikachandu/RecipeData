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

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

