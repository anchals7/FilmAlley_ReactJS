import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ReviewsProvider } from './context/ReviewsContext';
import { RecommendationsProvider } from './context/RecommendationsContext';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Watchlist from './pages/Watchlist';
import Favorites from './pages/Favorites';
import Recommendations from './pages/Recommendations';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Navigation from './components/Navigation';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <WatchlistProvider>
            <FavoritesProvider>
              <ReviewsProvider>
                <RecommendationsProvider>
                  <div className="min-h-screen bg-gray-900 text-white">
                    <Navigation />
                    <main className="container mx-auto px-4 py-8">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/movie/:id" element={<MovieDetails />} />
                        <Route path="/watchlist" element={<Watchlist />} />
                        <Route path="/favorites" element={<Favorites />} />
                        <Route path="/recommendations" element={<Recommendations />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/profile" element={<Profile />} />
                      </Routes>
                    </main>
                  </div>
                </RecommendationsProvider>
              </ReviewsProvider>
            </FavoritesProvider>
          </WatchlistProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App; 