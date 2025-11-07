import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const Packages = lazy(() => import('./pages/Packages'));
const Cart = lazy(() => import('./pages/Cart'));
const IdeaAnalyzer = lazy(() => import('./pages/IdeaAnalyzer'));
const Mentorship = lazy(() => import('./pages/Mentorship'));
const Blog = lazy(() => import('./pages/Blog'));
const SubmitStory = lazy(() => import('./pages/SubmitStory'));
const LinkedInCallback = lazy(() => import('./pages/LinkedInCallback'));
const Profile = lazy(() => import('./pages/Profile'));
const Feed = lazy(() => import('./pages/Feed'));
const MentorVerification = lazy(() => import('./pages/MentorVerification'));

// Lazy load enhanced components
const SmartProfile = lazy(() => import('./components/SmartProfile'));
const EngagementFeatures = lazy(() => import('./components/EngagementFeatures'));
const BonusEnhancements = lazy(() => import('./components/BonusEnhancements'));
const CoFounderX2 = lazy(() => import('./components/CoFounderX2'));
const EnhancedSignup = lazy(() => import('./components/EnhancedSignup'));
const EnhancedDemo = lazy(() => import('./pages/EnhancedDemo'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <NotificationProvider>
          <AuthProvider>
            <Router>
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/packages" element={<Packages />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/idea-analyzer" element={<IdeaAnalyzer />} />
                    <Route path="/mentorship" element={<Mentorship />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/submit-story" element={<SubmitStory />} />
                    <Route path="/linkedin-callback" element={<LinkedInCallback />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/feed" element={<Feed />} />
                    <Route path="/mentor-verification" element={<MentorVerification />} />
                    {/* Enhanced routes */}
                    <Route path="/enhanced-demo" element={<EnhancedDemo />} />
                    <Route path="/smart-profile" element={<SmartProfile />} />
                    <Route path="/engagement" element={<EngagementFeatures />} />
                    <Route path="/bonus-features" element={<BonusEnhancements />} />
                    <Route path="/cofounderx" element={<CoFounderX2 />} />
                    <Route path="/enhanced-signup" element={<EnhancedSignup />} />
                  </Routes>
                </Suspense>
              </Layout>
            </Router>
          </AuthProvider>
        </NotificationProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;