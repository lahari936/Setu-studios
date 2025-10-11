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
import Mentorship from './pages/Mentorship';
import Blog from './pages/Blog';

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
                  <Route path="/mentorship" element={<Mentorship />} />
                  <Route path="/blog" element={<Blog />} />
                </Routes>
            </Layout>
          </Router>
        </NotificationProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;