import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart,
  Plus,
  Minus,
  ArrowLeft,
  CreditCard,
  Lock,
  CheckCircle,
  Trash2,
  Heart
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../contexts/CartContext';
import { useNotification } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { createOrder, generateSessionId } from '../services/orders';
import { sendCustomerConfirmationEmail, sendAdminNotificationEmail, OrderEmailData } from '../services/email';
import AnimatedCard from '../components/AnimatedCard';

const Cart: React.FC = () => {
  const { isDark } = useTheme();
  const { cartItems, updateQuantity, removeFromCart, clearCart, getTotal, getItemCount } = useCart();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectDescription: ''
  });
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  // No need to update form from user profile since we removed authentication

  const moveToWishlist = (item: any) => {
    // Add to wishlist (you can implement wishlist functionality later)
    removeFromCart(item.id);
  };

  const getSubtotal = () => {
    return getTotal();
  };

  const getDiscount = () => {
    // Apply discount logic here if needed
    return 0;
  };

  const getFinalTotal = () => {
    return getSubtotal() - getDiscount();
  };

  const handleCheckoutFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCheckoutForm({ ...checkoutForm, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Generate a session ID for this order
      const sessionId = generateSessionId();
      
      // Prepare order data
      const orderData = {
        sessionId,
        customerName: checkoutForm.name,
        customerEmail: checkoutForm.email,
        customerPhone: checkoutForm.phone,
        customerCompany: checkoutForm.company,
        items: cartItems.map(item => item.name),
        total: getTotal(),
        projectDescription: checkoutForm.projectDescription
      };
      
      // Save order to Supabase
      const order = await createOrder(orderData);
      setCreatedOrder(order);
      
      // Prepare email data
      const emailData: OrderEmailData = {
        customerName: checkoutForm.name,
        customerEmail: checkoutForm.email,
        customerPhone: checkoutForm.phone,
        customerCompany: checkoutForm.company,
        items: cartItems.map(item => item.name),
        total: getTotal(),
        projectDescription: checkoutForm.projectDescription,
        orderId: order.id,
        orderDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      
      // Send emails (don't wait for them to complete)
      sendCustomerConfirmationEmail(emailData);
      sendAdminNotificationEmail(emailData);
      
      // Save session ID and email to localStorage for future reference
      localStorage.setItem('setu-session-id', sessionId);
      localStorage.setItem('setu-customer-email', checkoutForm.email);
      
      // Clear cart
      await clearCart();
      
      setCheckoutStep('success');
      showNotification('Order placed successfully! Confirmation email sent.', 'success');
    } catch (error) {
      showNotification('Failed to place order. Please try again.', 'error');
    }
  };

  const continueShopping = () => {
    navigate('/packages');
  };

  if (checkoutStep === 'success') {
    return (
      <div className={`py-20 transition-colors duration-300 ${
        isDark ? 'bg-gradient-to-br from-orange-dark to-slate-900' : 'bg-gradient-to-br from-slate-50 to-gray-100'
      }`}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedCard className="text-center p-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={48} className="text-green-500" />
              </div>
            </div>
             <h1 className="text-3xl font-bold text-green-500 mb-4">Order Confirmed!</h1>
             <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
               Thank you for your order. We've received your request and will get started on your project right away.
             </p>
             
             {createdOrder && (
               <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg mb-8">
                 <h3 className="font-semibold text-orange-600 mb-2">Order Details</h3>
                 <p className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                   Order ID: <span className="font-mono font-bold">#{createdOrder.id.slice(0, 8)}</span>
                 </p>
                 <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                   Confirmation email sent to: <span className="font-semibold">{checkoutForm.email}</span>
                 </p>
               </div>
             )}
             
             <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg mb-8">
               <h3 className="font-semibold text-orange-600 mb-2">What's Next?</h3>
               <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                 <li>✅ Confirmation email sent to your inbox</li>
                 <li>📧 Our team will contact you within 24 hours</li>
                 <li>🚀 We'll begin work according to the timeline specified</li>
                 <li>📞 Regular updates will be provided throughout the process</li>
               </ul>
             </div>
            <button
              onClick={() => navigate('/')}
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Return to Home
            </button>
          </AnimatedCard>
        </div>
      </div>
    );
  }

  if (checkoutStep === 'checkout') {
    return (
      <div className={`py-20 transition-colors duration-300 ${
        isDark ? 'bg-gradient-to-br from-orange-dark to-slate-900' : 'bg-gradient-to-br from-slate-50 to-gray-100'
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => setCheckoutStep('cart')}
              className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Cart</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <AnimatedCard className="p-6">
              <h2 className="text-2xl font-bold mb-6">Checkout Information</h2>
              <form onSubmit={handleCheckout} className="space-y-4">
                 <div>
                   <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                     Full Name <span className="text-red-500">*</span>
                   </label>
                   <input
                     type="text"
                     name="name"
                     value={checkoutForm.name}
                     onChange={handleCheckoutFormChange}
                     required
                     className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${
                       isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                     }`}
                   />
                 </div>

                 <div>
                   <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                     Email Address <span className="text-red-500">*</span>
                   </label>
                   <input
                     type="email"
                     name="email"
                     value={checkoutForm.email}
                     onChange={handleCheckoutFormChange}
                     required
                     className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${
                       isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                     }`}
                   />
                 </div>

                 <div>
                   <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                     Phone Number <span className="text-red-500">*</span>
                   </label>
                   <input
                     type="tel"
                     name="phone"
                     value={checkoutForm.phone}
                     onChange={handleCheckoutFormChange}
                     required
                     className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${
                       isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                     }`}
                   />
                 </div>

                 <div>
                   <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                     Company Name <span className="text-red-500">*</span>
                   </label>
                   <input
                     type="text"
                     name="company"
                     value={checkoutForm.company}
                     onChange={handleCheckoutFormChange}
                     required
                     className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${
                       isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                     }`}
                   />
                 </div>

                 <div>
                   <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                     Project Description <span className="text-red-500">*</span>
                   </label>
                   <textarea
                     name="projectDescription"
                     value={checkoutForm.projectDescription}
                     onChange={handleCheckoutFormChange}
                     rows={4}
                     required
                     placeholder="Tell us about your project idea, goals, and any specific requirements..."
                     className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${
                       isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                     }`}
                   />
                 </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Lock size={20} />
                  <span>Complete Order - ₹{getFinalTotal()}</span>
                </button>
              </form>
            </AnimatedCard>

            {/* Order Summary */}
            <div className="space-y-6">
              <AnimatedCard className="p-6">
                <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-slate-700">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Qty: {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                      <span className="font-semibold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{getSubtotal()}</span>
                  </div>
                  {getDiscount() > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>Discount:</span>
                      <span>-₹{getDiscount()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>₹{getTotal()}</span>
                  </div>
                </div>
              </AnimatedCard>

              <AnimatedCard className="p-6">
                <h3 className="text-lg font-bold mb-4">What's Included</h3>
                <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>• Professional service delivery</li>
                  <li>• Dedicated project manager</li>
                  <li>• Regular progress updates</li>
                  <li>• Post-delivery support</li>
                  <li>• Satisfaction guarantee</li>
                </ul>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-20 transition-colors duration-300 ${
      isDark ? 'bg-gradient-to-br from-orange-dark to-slate-900' : 'bg-gradient-to-br from-slate-50 to-gray-100'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <ShoppingCart size={32} className="text-orange-500" />
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <span className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              ({getItemCount()} items)
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={continueShopping}
              className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <AnimatedCard className="text-center p-12">
            <ShoppingCart size={64} className="mx-auto text-gray-400 mb-6" />
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Looks like you haven't added any services to your cart yet.
            </p>
            
            <button
              onClick={continueShopping}
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Start Shopping
            </button>
          </AnimatedCard>


        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <AnimatedCard key={item.id} className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Item Icon */}
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ShoppingCart size={24} className="text-white" />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{item.name}</h3>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                            {item.description}
                          </p>
                          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                            Delivery: {item.timeline}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-orange-500">₹{item.price}</p>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            per item
                          </p>
                        </div>
                      </div>

                      {/* Action Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Quantity: {item.quantity}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => moveToWishlist(item)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Move to Wishlist"
                          >
                            <Heart size={16} />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Remove Item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                        <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Total for this item:
                        </span>
                        <span className="text-lg font-bold text-orange-500">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <AnimatedCard className="p-6">
                <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-slate-700">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Qty: {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                      <span className="font-semibold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{getSubtotal()}</span>
                  </div>
                  {getDiscount() > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>Discount:</span>
                      <span>-₹{getDiscount()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>₹{getTotal()}</span>
                  </div>
                </div>

                <button
                  onClick={() => setCheckoutStep('checkout')}
                  className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors mt-6 flex items-center justify-center space-x-2"
                >
                  <CreditCard size={20} />
                  <span>Proceed to Checkout</span>
                </button>
              </AnimatedCard>

              <AnimatedCard className="p-6">
                <h3 className="text-lg font-bold mb-4">What's Included</h3>
                <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>• Professional service delivery</li>
                  <li>• Dedicated project manager</li>
                  <li>• Regular progress updates</li>
                  <li>• Post-delivery support</li>
                  <li>• Satisfaction guarantee</li>
                </ul>
              </AnimatedCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart; 