# FilmAlley+ Project Specification
**A Personalized Movie Discovery & List Management Platform**

## Project Overview
Transform FilmAlley from a basic movie search app into a comprehensive movie discovery platform with user authentication, personalized lists, AI recommendations, and community reviews.

**Estimated Timeline:** 2 months for solo development
**Target Users:** Movie enthusiasts who want to track, discover, and share their movie experiences

## Technical Stack

### Frontend
- **React.js** (existing)
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Modern responsive styling
- **Context API** - State management for auth and user data
- **Axios** - HTTP client for API calls

### Backend
- **Node.js + Express** (existing foundation)
- **MongoDB Atlas** - Cloud NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT + bcryptjs** - Authentication
- **CORS + Express middleware** - Security

### AI Microservice
- Node.js with Express
- MongoDB for storing user data (favorites, reviews)
- TMDB API for movie data
- Axios for API requests
- React.js- React Query for data fetching
- Context API for state management 

### External APIs
- **OMDb API** (current)
- **TMDb API** - Enhanced movie metadata

## Phase-by-Phase Implementation

### Phase 1: User Authentication & Profile System

#### 1.1 Backend Authentication Setup
**MongoDB Models:**
```javascript
// User Schema
const userSchema = {
  _id: ObjectId,
  email: String (unique, required),
  username: String (unique, required),
  passwordHash: String (required),
  firstName: String,
  lastName: String,
  joinDate: Date (default: now),
  favorites: [String], // Array of movie IDs
  lists: [ObjectId], // References to List documents
}
```

**API Endpoints:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login  
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout (clear cookies)
- `PUT /api/auth/profile` - Update profile

**Implementation Details:**
- Password hashing with bcrypt (salt rounds: 12)
- JWT stored in HTTP-only cookies (expires in 7 days)
- Input validation with express-validator
- Protected route middleware for authenticated endpoints

#### 1.2 Frontend Authentication
**Components to Build:**
- `AuthContext` - React context for auth state
- `LoginForm` - Email/password login with validation
- `RegisterForm` - User registration with confirm password
- `ProtectedRoute` - Wrapper for authenticated routes
- `UserProfile` - Profile display and edit functionality
- `AuthModal` - Modal component for login/register

**Features:**
- Form validation with real-time feedback
- Loading states for auth operations
- Error handling and user feedback
- Persistent login (check JWT on app load)
- Logout functionality with state cleanup

### Phase 2: Favorites & Watchlists System 

#### 2.1 List Management Backend
**MongoDB Models:**
```javascript
// Watchlists Schema
const listSchema = {
  _id: ObjectId,
  ownerId: ObjectId (ref: User),
  movies: [{
    movieId: String, // OMDb ID
    addedDate: Date,
    personalRating: Number (1-5),
    notes: String,
    movieData: Object // Cached movie info
  }],
  createdAt: Date,
  updatedAt: Date
}

// Favorites (lists) Schema
const favoritesListSchema = {
  _id: ObjectId,
  ownerId: ObjectId (ref: User),
  movies: [{
    movieId: String, // OMDb ID
    addedDate: Date,
    personalRating: Number (1-5),
    notes: String,
    movieData: Object // Cached movie info
  }],
  createdAt: Date,
  updatedAt: Date
}
```

**Default Lists Creation:**
- Auto-create "Favorites" and "Watchlist" for new users
- Special handling for these system lists

**API Endpoints:**
- `GET /api/lists` - Get user's lists
- `PUT /api/lists/:id` - Update list details
- `DELETE /api/lists/:id` - Delete list
- `POST /api/lists/:id/movies` - Add movie to list
- `DELETE /api/lists/:id/movies/:movieId` - Remove movie
- `PUT /api/lists/:id/movies/:movieId` - Update movie in list (unfavorite or remove from watchlist)

#### 2.2 Enhanced Movie Display
**Updated Components:**
- `MovieCard` - Add favorite/list buttons and indicators
- `MovieDetailModal` - Detailed movie view 
- `AddToWatchlistModal` - Select which lists to add movie to (favorites or watchlist)
- `ListManager` - CRUD interface for managing lists
- `ListDetailView` - Display movies in a specific list (favorites or watchlist)

**Features:**
- Heart icon for favorites (with colored indicator)
- Add to Watchlist button
- Remove from Watchlist button (if a movie is already in a user's watchlist)
- Personal ratings and reviews for each movie
- Visual indicators showing is a movie is favorited or in the watchlist already

### Phase 3: Enhanced Movie Data & Reviews 

#### 3.1 Review System Backend
**MongoDB Models:**
```javascript
// Review Schema  
const reviewSchema = {
  _id: ObjectId,
  movieId: String (required),
  userId: ObjectId (ref: User, required),
  rating: Number (1-5, required),
  comment: String,
  createdAt: Date,
  updatedAt: Date,
  helpful: [ObjectId] // Users who marked as helpful
}
```

**API Endpoints:**
- `POST /api/reviews` - Create review
- `GET /api/reviews/:movieId` - Get reviews for movie (paginated)


#### 3.2 Enhanced Movie Information
**TMDb API Integration:**
- Fetch additional movie metadata (cast, director, genres, runtime)
- Get movie images
- Cache movie data in MongoDB to reduce API calls

**Movie Detail Features:**
- Cast and crew information
- User reviews and ratings (ratings collected for AI recommendation system)
- Movie rating fetched from API

### Phase 4: AI Recommendation Engine 

#### 4.1 Python Microservice Setup
**Components:**
```backend/src/routes/recommendations.js``` - main recommendation algorithm
```src/context/RecommendationsContext.js``` - frontend state management
```src/pages/Recommendations.jsx``` - UI for recommendations
```src/components/recommendations/RecommendationsList.jsx``` - component to display recommendations

**Data Sources:**
1. User's favorite movies - stored in MongoDB
2. User's movie reviews - stored in MongoDB
3. TMDB API for:
	- movie details
	- similar movies
	- movie ratings

**Recommendation Algorithm:**
1. **Content-Based Filtering:**
   - Analyze user's favorited movies
   - Extract features: genres, directors, actors, year, rating
   - Create user preference profile
   - Score all movies based on similarity to profile
   - Weight recent favorites more heavily

2. **Implementation Steps:**
   - Fetch user's favorite movies and ratings
   - Use /similar API endpoint to fetch similar movies for each favorited movie
   - Compute weight for each similar movie returned
   - Return top (about 20) recommendations with confidence scores

#### 4.2 Recommendation Integration
- `GET /api/recommendations` - Get user recommendations
- Periodic recommendation updates (daily batch job)
- Store recommendations in MongoDB for quick access


### Phase 5: UI/UX Enhancement & Dashboard 

#### 5.1 Complete UI Redesign with Tailwind
**Design System:**
- Color palette: Dark theme with accent colors
- Typography scale and consistent spacing
- Component library for buttons, cards, modals
- Responsive breakpoints for mobile/tablet/desktop

**Key Components:**
- `Navigation` - Responsive navbar with user menu
- `UserDashboard` - Overview of user lists
- `MovieGrid` - Responsive grid layout for movie displays

#### 5.2 User Dashboard Features
**Dashboard Sections:**
- **Recent Activity** - Last favorited movie
- **Continue Watching** - Show top movie from user's watchlist

**Mobile Responsiveness:**
- Mobile-first design approach
- Touch-friendly interactions
- Optimized movie grid for small screens


### Phase 6: Advanced Features & Polish 

#### 6.1 Advanced Search & Filtering
**Enhanced Search Features:**
- Browse movies by genres

**Backend Implementation:**
- MongoDB text indexing for efficient search
- Complex query building for multiple filters

#### 6.2 Social Features (Basic)
**Viewing User Reviews:**
- Allow user reviews to be public (for guest users as well) 


## Database Schema Design

### Collections Overview
```javascript
// Users Collection
{
  _id: ObjectId,
  email: "user@example.com",
  username: "moviefan123", 
  passwordHash: "...",
  firstName: "John",
  lastName: "Doe",
  joinDate: ISODate,
  favorites: ["tt1234567", "tt2345678"],
  watchlist: [ObjectId1, ObjectId2]
}

// Watchlists Collection
{
  _id: ObjectId,
  title: "Weekend Watch",
  description: "Movies for relaxing weekends",
  ownerId: ObjectId,
  movies: [{
    movieId: "tt1234567",
    addedDate: ISODate,
    personalRating: 4,
    notes: "Great cinematography",
    movieData: { /* cached OMDb data */ }
  }],
  isPublic: false,
  listType: "custom",
  createdAt: ISODate,
  updatedAt: ISODate
}

// Reviews Collection
{
  _id: ObjectId,
  movieId: "tt1234567",
  userId: ObjectId,
  rating: 4,
  comment: "Excellent movie with great acting",
  createdAt: ISODate,
  helpful: [ObjectId1, ObjectId2]
}

// Recommendations Collection (cached)
{
  _id: ObjectId,
  userId: ObjectId,
  recommendations: [{
    movieId: "tt1234567",
    score: 0.87,
    reason: "Based on your love for Action and Drama"
  }],
  generatedAt: ISODate,
  expiresAt: ISODate
}
```

## API Architecture

### RESTful API Design
**Base URL:** `/api/v1`

**Authentication Routes:**
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/logout`

**List Management:**
- `GET /lists` - Get user lists
- `POST /lists` - Create list
- `GET /lists/:id` - Get specific list
- `PUT /lists/:id` - Update list
- `DELETE /lists/:id` - Delete list
- `POST /lists/:id/movies` - Add movie to list
- `DELETE /lists/:id/movies/:movieId` - Remove movie

**Review System:**
- `GET /reviews/:movieId` - Get movie reviews
- `POST /reviews` - Create review
- `PUT /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review

**Recommendations:**
- `GET /recommendations` - Get user recommendations
- `POST /recommendations/refresh` - Trigger new recommendations

## Security Considerations

### Authentication Security
- JWT tokens with reasonable expiration (7 days)
- HTTP-only cookies to prevent XSS
- Password hashing with bcrypt (12 salt rounds)
- Input validation on all endpoints

### Data Protection
- MongoDB connection with authentication
- Environment variables for sensitive data
- CORS configuration for frontend domain
- Rate limiting on API endpoints

## Testing Strategy

### Backend Testing
- Unit tests for authentication middleware
- Integration tests for CRUD operations
- API endpoint testing with Jest/Supertest
- MongoDB memory server for test database

### Frontend Testing
- Component unit tests with React Testing Library
- Integration tests for user flows

## Deployment Strategy

### Development Environment
- Local MongoDB instance or MongoDB Atlas
- Environment variables for API keys
- Separate development/production configurations


## Performance Optimization

### Backend Optimization
- MongoDB indexing on frequently queried fields
- Connection pooling for database
- Caching of movie data to reduce API calls
- Pagination for large result sets

### Frontend Optimization
- Lazy loading for routes
- Image optimization and lazy loading
- Debounced search input
- Virtual scrolling for large movie lists

## Development Timeline

### Foundation
- Set up MongoDB and user authentication
- Create basic user registration/login
- Build protected routes and auth context

### Core Features
- Implement favorites and watchlists
- Build list management UI
- Add movie detail modals

### Reviews & Enhanced Data
- Build review system
- Integrate TMDb API for richer movie data
- Create movie detail pages

### AI Recommendations
- Build recommendation microservice
- Integrate with backend and frontend
- Create recommendation UI components

### UI/UX Polish
- Complete Tailwind CSS redesign
- Build basic user dashboard
- Mobile responsive optimization

### Final Features
- Browse by genre search option
- Basic social features (public reviews)
- Testing and bug fixes

## Success Metrics

### Technical Achievement
- Fully functional user authentication system
- CRUD operations for multiple data types
- Working AI recommendation engine
- Responsive, modern UI design

### User Experience
- Intuitive movie list management
- Personalized movie recommendations
- Fast and responsive interface
- Mobile-friendly design



***above updates as of 3/9/25***


# FilmAlley_ReactJS
A React JS and Node.js full stack website that shows searched movies using results from REST API (OMDb).

This web application is inspired loosely by Filmpire and is built using React JS for front-end and back-end and executed using Node.js. The application utilizes REST API and OMDb API to retrieve movie data and movie posters.  
The application's landing page shows a search bar and a default display of selected movies. When a user searches for a movie or TV show and clicks on the search icon, the results are displayed below. Hovering over the results' posters shows additional details like the date the movie was released or the running years of the TV show. When a valid search is not made, an error message displays that no movies were found. 

Important Tools:
- React JS
- Node.js
- RESTful API
- JSX

Feature summary: 
- search movies and TV shows
- UI responsive results page

Future features implementation:
- allow users to click on movies to view additional details
- implement user login/registration with MySQL
- allow logged-in users to rate movies and display those ratings


***above updates as of 1/9/25***

The complete node_modules folder has not been uploaded so the project can't be run without it. Refer to the images attached in the repo for a view of the website. 

***above updates as of 1/10/25***


