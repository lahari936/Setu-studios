import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import Packages from './pages/Packages';
import Cart from './pages/Cart';
import IdeaAnalyzer from './pages/IdeaAnalyzer';

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <NotificationProvider>
          <Router>
            <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/packages" element={<Packages />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/idea-analyzer" element={<IdeaAnalyzer />} />
                </Routes>
            </Layout>
          </Router>
        </NotificationProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;