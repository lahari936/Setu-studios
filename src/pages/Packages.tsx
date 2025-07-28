import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Star, 
  ArrowRight,
  Zap,
  Rocket,
  Crown,
  Shield,
  ShoppingCart,
  X,
  Plus,
  Minus,
  Search,
  Filter,
  Heart,
  Eye,
  Clock,
  Users,
  Target,
  TrendingUp,
  FileText,
  Palette,
  Code,
  Presentation,
  Calculator,
  MessageCircle,
  Globe,
  Monitor,
  Smartphone
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import AnimatedCard from '../components/AnimatedCard';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'individual' | 'combo';
}

const Packages: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  // Individual Products
  const individualProducts = [
    {
      id: 'insight-report',
      name: 'Insight Report',
      description: 'AI-powered market analysis with competitor insights and validation',
      price: 99,
      originalPrice: 149,
      category: 'strategy',
      icon: Search,
      color: 'from-blue-500 to-blue-600',
      features: ['Market size analysis', 'Competitor research', 'SWOT analysis', 'Risk assessment'],
      timeline: '3 Days',
      rating: 4.8,
      reviews: 127,
      inStock: true,
      popular: true
    },
    {
      id: 'prd',
      name: 'Product Requirement Document',
      description: 'Detailed product specification with features and technical architecture',
      price: 149,
      originalPrice: 199,
      category: 'strategy',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      features: ['Feature prioritization', 'Technical specs', 'User journeys', 'Success metrics'],
      timeline: '4 Days',
      rating: 4.7,
      reviews: 89,
      inStock: true,
      popular: false
    },
    {
      id: 'pitch-outline',
      name: 'Pitch Outline',
      description: 'Professional pitch deck structure with storytelling framework',
      price: 79,
      originalPrice: 99,
      category: 'fundraising',
      icon: Presentation,
      color: 'from-orange-500 to-orange-600',
      features: ['Story structure', 'Key slides outline', 'Investor messaging', 'Presentation tips'],
      timeline: '2 Days',
      rating: 4.6,
      reviews: 156,
      inStock: true,
      popular: false
    },
    {
      id: 'figma-design',
      name: 'Figma UI/UX Design',
      description: 'Interactive prototype with complete user experience design',
      price: 549,
      originalPrice: 749,
      category: 'design',
      icon: Palette,
      color: 'from-purple-500 to-purple-600',
      features: ['Interactive wireframes', 'User flows', 'Design system', 'Prototype testing'],
      timeline: '7 Days',
      rating: 4.9,
      reviews: 203,
      inStock: true,
      popular: true
    },
    {
      id: 'mvp-plan',
      name: 'MVP Development Plan',
      description: 'Complete technical roadmap and development strategy',
      price: 199,
      originalPrice: 299,
      category: 'development',
      icon: Code,
      color: 'from-green-500 to-green-600',
      features: ['Tech stack selection', 'Architecture planning', 'Development timeline', 'Resource allocation'],
      timeline: '3 Days',
      rating: 4.5,
      reviews: 67,
      inStock: true,
      popular: false
    },
    {
      id: 'no-code-mvp',
      name: 'No-Code MVP',
      description: 'Rapid MVP development using modern no-code platforms',
      price: 499,
      originalPrice: 699,
      category: 'development',
      icon: Smartphone,
      color: 'from-green-500 to-green-600',
      features: ['Platform selection', 'Database design', 'User authentication', 'Deployment setup'],
      timeline: '7-10 Days',
      rating: 4.8,
      reviews: 178,
      inStock: true,
      popular: true
    },
    {
      id: 'landing-page',
      name: 'Landing Page',
      description: 'SEO-optimized landing page with conversion-focused design',
      price: 349,
      originalPrice: 499,
      category: 'design',
      icon: Globe,
      color: 'from-purple-500 to-purple-600',
      features: ['SEO optimization', 'Conversion design', 'Mobile responsive', 'Analytics setup'],
      timeline: '4 Days',
      rating: 4.7,
      reviews: 134,
      inStock: true,
      popular: false
    },
    {
      id: 'branding',
      name: 'Brand Kit',
      description: 'Complete brand identity with logo, colors, and style guide',
      price: 139,
      originalPrice: 199,
      category: 'design',
      icon: Palette,
      color: 'from-purple-500 to-purple-600',
      features: ['Logo design', 'Color palette', 'Typography', 'Style guide'],
      timeline: '2-3 Days',
      rating: 4.6,
      reviews: 98,
      inStock: true,
      popular: false
    },
    {
      id: 'financial-projections',
      name: 'Financial Projections',
      description: '3-year financial modeling with revenue streams and breakeven analysis',
      price: 149,
      originalPrice: 199,
      category: 'fundraising',
      icon: Calculator,
      color: 'from-orange-500 to-orange-600',
      features: ['Revenue modeling', 'Breakeven analysis', '3-year projections', 'Investment planning'],
      timeline: '2 Days',
      rating: 4.7,
      reviews: 112,
      inStock: true,
      popular: false
    },
    {
      id: 'strategy-call',
      name: 'Strategy Call',
      description: '1:1 personalized coaching session with startup expert',
      price: 79,
      originalPrice: 99,
      category: 'mentorship',
      icon: MessageCircle,
      color: 'from-indigo-500 to-indigo-600',
      features: ['Personalized coaching', 'Problem solving', 'Industry insights', 'Action planning'],
      timeline: '30 mins',
      rating: 4.9,
      reviews: 245,
      inStock: true,
      popular: true
    }
  ];

  // Combo Packages
  const comboPackages = [
    {
      id: 'ai-idea-ignite',
      name: 'AI Idea Ignite',
      description: 'Perfect for validating your startup idea with comprehensive insights',
      price: 499,
      originalPrice: 699,
      savings: 200,
      items: ['insight-report', 'prd', 'pitch-outline'],
      icon: Zap,
      color: 'from-blue-500 to-blue-600',
      features: ['Market validation', 'Product planning', 'Pitch preparation'],
      timeline: '5-7 Days',
      rating: 4.8,
      reviews: 89,
      popular: true
    },
    {
      id: 'prototype-builder',
      name: 'Prototype Builder',
      description: 'Turn your validated idea into a working prototype',
      price: 699,
      originalPrice: 999,
      savings: 300,
      items: ['prd', 'figma-design', 'mvp-plan'],
      icon: Rocket,
      color: 'from-orange-500 to-orange-600',
      features: ['Product specification', 'Interactive design', 'Development roadmap'],
      timeline: '10-12 Days',
      rating: 4.9,
      reviews: 156,
      popular: true
    },
    {
      id: 'mvp-launch-pack',
      name: 'MVP Launch Pack',
      description: 'Complete MVP development ready for market launch',
      price: 899,
      originalPrice: 1299,
      savings: 400,
      items: ['no-code-mvp', 'landing-page', 'branding'],
      icon: Crown,
      color: 'from-purple-500 to-purple-600',
      features: ['Functional MVP', 'Marketing site', 'Brand identity'],
      timeline: '12-15 Days',
      rating: 4.8,
      reviews: 203,
      popular: false
    },
    {
      id: 'investor-ready-pack',
      name: 'Investor Ready Pack',
      description: 'Complete package to prepare for fundraising and scaling',
      price: 1199,
      originalPrice: 1799,
      savings: 600,
      items: ['no-code-mvp', 'pitch-outline', 'financial-projections', 'strategy-call'],
      icon: Shield,
      color: 'from-green-500 to-green-600',
      features: ['MVP development', 'Pitch preparation', 'Financial modeling', 'Expert guidance'],
      timeline: '15-20 Days',
      rating: 4.9,
      reviews: 178,
      popular: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products', icon: Target },
    { id: 'strategy', name: 'Strategy', icon: TrendingUp },
    { id: 'design', name: 'Design', icon: Palette },
    { id: 'development', name: 'Development', icon: Code },
    { id: 'fundraising', name: 'Fundraising', icon: Presentation },
    { id: 'mentorship', name: 'Mentorship', icon: MessageCircle },
    { id: 'combos', name: 'Combo Packages', icon: Crown }
  ];

  const addToCart = (item: any, type: 'individual' | 'combo') => {
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      type,
      description: item.description,
      timeline: item.timeline,
      category: item.category || 'other'
    };

    const savedCart = localStorage.getItem('setu-cart');
    const currentCart = savedCart ? JSON.parse(savedCart) : [];
    
    const existingItem = currentCart.find((cartItem: any) => cartItem.id === item.id);
    let updatedCart;
    
    if (existingItem) {
      updatedCart = currentCart.map((cartItem: any) => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      updatedCart = [...currentCart, cartItem];
    }
    
    localStorage.setItem('setu-cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
    
    // Show success message
    setShowAddedToCart(true);
    setTimeout(() => setShowAddedToCart(false), 2000);
  };



  const [cartCount, setCartCount] = useState(0);

  // Update cart count when localStorage changes
  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem('setu-cart');
      if (savedCart) {
        try {
          const currentCart = JSON.parse(savedCart);
          const count = currentCart.reduce((count: number, item: any) => count + item.quantity, 0);
          setCartCount(count);
          setCart(currentCart); // Also update the cart state with the actual items
        } catch (error) {
          setCartCount(0);
          setCart([]);
        }
      } else {
        setCartCount(0);
        setCart([]);
      }
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    const interval = setInterval(updateCartCount, 1000);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      clearInterval(interval);
    };
  }, []);

  const getCartCount = () => {
    return cartCount;
  };

  const toggleWishlist = (itemId: string) => {
    setWishlist(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const openModal = (item: any) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const filteredProducts = () => {
    let products = [...individualProducts];
    
    if (selectedCategory === 'combos') {
      return comboPackages;
    }
    
    if (selectedCategory !== 'all') {
      products = products.filter(product => product.category === selectedCategory);
    }
    
    if (searchTerm) {
      products = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return products;
  };

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Startup Services Store</h1>
          <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Build your startup with our comprehensive range of services. Mix and match or choose our curated packages.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-orange-500 text-white'
                    : isDark 
                      ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <category.icon size={16} />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Shopping Cart Button */}
        <div className="fixed top-4 right-4 z-40">
          <button
            onClick={() => navigate('/cart')}
            className="relative bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-all duration-300 hover:scale-105"
          >
            <ShoppingCart size={24} />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                {getCartCount()}
              </span>
            )}
          </button>
        </div>

        {/* Success Notification */}
        {showAddedToCart && (
          <div className="fixed top-20 right-4 z-50">
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fadeIn">
              <CheckCircle size={20} />
              <span>Item added to cart!</span>
            </div>
          </div>
        )}

        {/* View Cart Button */}
        {getCartCount() > 0 && (
          <div className="fixed top-20 left-4 z-40">
            <button
              onClick={() => navigate('/cart')}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-600 transition-all duration-300 flex items-center space-x-2"
            >
              <ShoppingCart size={20} />
              <span>View Cart ({getCartCount()} items)</span>
            </button>
          </div>
        )}





        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts().map((item) => (
            <AnimatedCard key={item.id} className="group overflow-hidden">
              <div className="relative">
                {/* Product Image/Icon */}
                <div className={`h-48 bg-gradient-to-r ${item.color} flex items-center justify-center relative`}>
                  <item.icon size={48} className="text-white" />
                  {item.popular && (
                    <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Popular
                    </div>
                  )}
                  {item.originalPrice && item.originalPrice > item.price && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                    </div>
                  )}
                  
                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(item.id)}
                    className={`absolute top-2 right-2 p-2 rounded-full transition-all ${
                      wishlist.includes(item.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <Heart size={16} fill={wishlist.includes(item.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg line-clamp-2">{item.name}</h3>
                    <button
                      onClick={() => openModal(item)}
                      className="p-1 text-gray-400 hover:text-orange-500 transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                  
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-3 line-clamp-2`}>
                    {item.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.floor(item.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {item.rating} ({item.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl font-bold text-orange-500">₹{item.price}</span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className={`text-sm line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        ₹{item.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center space-x-2 mb-4">
                    <Clock size={14} className="text-gray-400" />
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {item.timeline}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => addToCart(item, selectedCategory === 'combos' ? 'combo' : 'individual')}
                      className="flex-1 bg-orange-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => {
                        addToCart(item, selectedCategory === 'combos' ? 'combo' : 'individual');
                        navigate('/cart');
                      }}
                      className="flex-1 border border-orange-500 text-orange-500 py-2 px-3 rounded-lg text-sm font-medium hover:bg-orange-500 hover:text-white transition-colors"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>



        {/* Product Detail Modal */}
        {modalOpen && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className={`w-full max-w-2xl mx-4 rounded-2xl shadow-2xl border-2 ${isDark ? 'bg-slate-900 border-orange-500' : 'bg-white border-orange-500'} p-8 relative animate-fadeIn max-h-[90vh] overflow-y-auto`}>
              <button
                className="absolute top-4 right-4 text-orange-500 hover:text-orange-600 text-2xl font-bold focus:outline-none"
                onClick={closeModal}
                aria-label="Close"
              >
                &times;
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className={`h-64 bg-gradient-to-r ${selectedItem.color} rounded-lg flex items-center justify-center`}>
                  <selectedItem.icon size={80} className="text-white" />
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedItem.name}</h2>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {selectedItem.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl font-bold text-orange-500">₹{selectedItem.price}</span>
                    {selectedItem.originalPrice && selectedItem.originalPrice > selectedItem.price && (
                      <span className={`text-lg line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        ₹{selectedItem.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.floor(selectedItem.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedItem.rating} ({selectedItem.reviews} reviews)
                    </span>
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center space-x-2">
                    <Clock size={16} className="text-gray-400" />
                    <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Delivery: {selectedItem.timeline}
                    </span>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="font-semibold mb-2">What's Included:</h4>
                    <ul className="space-y-1">
                      {selectedItem.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => {
                        addToCart(selectedItem, selectedCategory === 'combos' ? 'combo' : 'individual');
                        closeModal();
                      }}
                      className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                    >
                      Add to Cart
                    </button>
                                          <button
                        onClick={() => {
                          addToCart(selectedItem, selectedCategory === 'combos' ? 'combo' : 'individual');
                          closeModal();
                          navigate('/cart');
                        }}
                        className="flex-1 border border-orange-500 text-orange-500 py-3 rounded-lg font-semibold hover:bg-orange-500 hover:text-white transition-colors"
                      >
                        Buy Now
                      </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Packages;