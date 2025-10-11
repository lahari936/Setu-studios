import React, { useState, useEffect } from 'react';
import { BookOpen, Newspaper, Calendar, ExternalLink, TrendingUp } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import AnimatedCard from '../components/AnimatedCard';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: { name: string };
}

interface StartupStory {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
}

const startupStories: StartupStory[] = [
  {
    id: 1,
    title: "From Side Project to $10M ARR: The TechFlow Journey",
    excerpt: "How a weekend side project turned into a thriving SaaS business serving 5000+ customers worldwide. Learn about the pivots, challenges, and breakthroughs that made it possible.",
    author: "Rahul Verma",
    date: "2024-10-05",
    readTime: "8 min read",
    category: "Success Story"
  },
  {
    id: 2,
    title: "Bootstrapped to Series A: The EduTech Revolution",
    excerpt: "A firsthand account of building an edtech startup from scratch, scaling to 100K users, and eventually raising a $15M Series A round from top VCs.",
    author: "Priya Sharma",
    date: "2024-09-28",
    readTime: "10 min read",
    category: "Fundraising"
  },
  {
    id: 3,
    title: "Building in Public: How Transparency Led to 50K Users",
    excerpt: "The unconventional journey of building a startup completely in public on Twitter, sharing revenue numbers, and building a community-first product.",
    author: "Aman Singh",
    date: "2024-09-15",
    readTime: "6 min read",
    category: "Growth"
  },
  {
    id: 4,
    title: "Failed Fast, Learned Faster: Lessons from 3 Failed Startups",
    excerpt: "Brutally honest insights from an entrepreneur who failed three times before building a successful $50M exit. What worked, what didn't, and what to avoid.",
    author: "Neha Gupta",
    date: "2024-09-01",
    readTime: "12 min read",
    category: "Lessons Learned"
  },
  {
    id: 5,
    title: "The Solo Founder's Playbook: 0 to 10K MRR in 6 Months",
    excerpt: "A detailed breakdown of how a solo founder built and scaled a profitable SaaS product to $10K MRR without any funding or co-founders.",
    author: "Karthik Reddy",
    date: "2024-08-20",
    readTime: "9 min read",
    category: "Solo Founder"
  },
  {
    id: 6,
    title: "Pivoting During Crisis: How We Survived COVID-19",
    excerpt: "When COVID-19 hit, we had 2 months of runway left. Here's how we pivoted our business model, found product-market fit, and 10x'd our revenue.",
    author: "Divya Menon",
    date: "2024-08-10",
    readTime: "7 min read",
    category: "Pivot"
  }
];

const Blog: React.FC = () => {
  const { isDark } = useTheme();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const apiKey = import.meta.env.VITE_NEWS_API_KEY || 'demo';
        
        if (apiKey === 'demo') {
          setNews([
            {
              title: "Startup Funding Hits Record High in Q4 2024",
              description: "Global startup funding reached unprecedented levels this quarter, with AI and climate tech leading the charge.",
              url: "#",
              urlToImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800",
              publishedAt: new Date().toISOString(),
              source: { name: "TechCrunch" }
            },
            {
              title: "The Rise of AI-Powered Startups in 2024",
              description: "Artificial Intelligence continues to dominate the startup ecosystem, with new innovations emerging daily.",
              url: "#",
              urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
              publishedAt: new Date().toISOString(),
              source: { name: "VentureBeat" }
            },
            {
              title: "Indian Startups Leading Global Innovation",
              description: "India's startup ecosystem is making waves globally with innovative solutions in fintech, edtech, and healthtech.",
              url: "#",
              urlToImage: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800",
              publishedAt: new Date().toISOString(),
              source: { name: "YourStory" }
            },
            {
              title: "Sustainable Startups Attract Major Investments",
              description: "Climate tech and sustainable businesses are seeing unprecedented investor interest and funding rounds.",
              url: "#",
              urlToImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800",
              publishedAt: new Date().toISOString(),
              source: { name: "Bloomberg" }
            },
            {
              title: "New Regulations Impact Startup Ecosystem",
              description: "Recent policy changes are reshaping how startups operate and raise capital in emerging markets.",
              url: "#",
              urlToImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
              publishedAt: new Date().toISOString(),
              source: { name: "Economic Times" }
            },
            {
              title: "Unicorn Count Reaches New Milestone",
              description: "The number of billion-dollar startups continues to grow, with new unicorns emerging across diverse sectors.",
              url: "#",
              urlToImage: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800",
              publishedAt: new Date().toISOString(),
              source: { name: "Forbes" }
            }
          ]);
          setLoadingNews(false);
          return;
        }

        const response = await fetch(
          `https://newsapi.org/v2/everything?q=startup OR venture capital OR entrepreneurship&language=en&sortBy=publishedAt&pageSize=6&apiKey=${apiKey}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        
        const data = await response.json();
        setNews(data.articles || []);
      } catch (error) {
        console.error('Error fetching news:', error);
        setNewsError('Unable to load latest news. Please try again later.');
        setNews([]);
      } finally {
        setLoadingNews(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <AnimatedCard>
            <div className="py-12">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                  <BookOpen size={48} className="text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Startup Blog & News
              </h1>
              <p className={`text-lg md:text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Real stories from founders, latest startup news, and insights to fuel your entrepreneurial journey.
              </p>
            </div>
          </AnimatedCard>
        </div>

        {/* Startup Stories Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen size={32} className="text-orange-500" />
            <h2 className="text-3xl font-bold">Startup Stories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {startupStories.map((story) => (
              <AnimatedCard key={story.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-500 rounded-full text-xs font-semibold">
                      {story.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-orange-500 line-clamp-2">
                    {story.title}
                  </h3>
                  <p className={`text-sm mb-4 line-clamp-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {story.excerpt}
                  </p>
                  <div className={`flex items-center justify-between text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{formatDate(story.date)}</span>
                    </div>
                    <span>{story.readTime}</span>
                  </div>
                  <div className={`mt-3 pt-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className="text-sm font-medium">By {story.author}</p>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>

        {/* Startup News Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Newspaper size={32} className="text-orange-500" />
            <h2 className="text-3xl font-bold">Latest Startup News</h2>
          </div>
          
          {loadingNews ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
              <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading latest news...</p>
            </div>
          ) : newsError ? (
            <AnimatedCard className="text-center py-12">
              <p className="text-red-500">{newsError}</p>
            </AnimatedCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((article, index) => (
                <AnimatedCard key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {article.urlToImage && (
                    <div className="w-full h-48 overflow-hidden">
                      <img 
                        src={article.urlToImage} 
                        alt={article.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800';
                        }}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp size={16} className="text-orange-500" />
                      <span className="text-sm font-semibold text-orange-500">{article.source.name}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className={`text-sm mb-4 line-clamp-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {article.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Calendar size={16} />
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                      {article.url !== '#' && (
                        <a 
                          href={article.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-orange-500 hover:text-orange-600 text-sm font-semibold"
                        >
                          Read <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <AnimatedCard className="text-center p-12 bg-gradient-to-r from-orange-500/10 to-red-500/10">
          <h2 className="text-3xl font-bold mb-4">Want to Share Your Story?</h2>
          <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            We're always looking for inspiring startup stories to feature. 
            Reach out to us if you'd like to share your journey!
          </p>
          <a
            href="mailto:guidebazaar2@gmail.com?subject=Share My Startup Story"
            className="inline-block px-8 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 hover:scale-105"
          >
            Submit Your Story
          </a>
        </AnimatedCard>
      </div>
    </div>
  );
};

export default Blog;
