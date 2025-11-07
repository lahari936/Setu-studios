import React from 'react';
import { BookOpen } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import AnimatedCard from '../components/AnimatedCard';
import BlogSection from '../components/BlogSection';

const Blog: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-slate-50 to-gray-100'
    }`}>
      {/* Enhanced Hero Section */}
      <div className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <AnimatedCard variant="modern" padding="lg">
              <div className="py-16">
                <div className="flex justify-center mb-8">
                  <div className="p-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl shadow-2xl animate-idea-spark">
                    <BookOpen size={56} className="text-white" />
                  </div>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text-entrepreneur animate-startup-rise">
                  Startup Blog & Stories
                </h1>
                <p className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Real stories from founders, latest insights, and lessons to fuel your entrepreneurial journey. 
                  Discover actionable advice and inspiration from successful entrepreneurs.
                </p>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </div>

      {/* Blog Section */}
      <BlogSection />

      {/* CTA Section */}
      <div className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <AnimatedCard className="text-center p-12 bg-gradient-to-r from-orange-500/10 to-red-500/10">
            <h2 className="text-3xl font-bold mb-4">Want to Share Your Story?</h2>
            <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              We're always looking for inspiring startup stories to feature. 
              Reach out to us if you'd like to share your journey!
            </p>
            <a
              href="/submit-story"
              className="inline-block px-8 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 hover:scale-105"
            >
              Submit Your Story
            </a>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
};

export default Blog;
