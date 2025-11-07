import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, User, ArrowRight, RefreshCw, Clock, TrendingUp } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useInView } from 'react-intersection-observer';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  url: string;
  coverImage?: string;
  tags?: string[];
}

const BlogSection: React.FC = () => {
  const { isDark } = useTheme();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Sample blog posts (in a real app, these would come from an API)
  const samplePosts: BlogPost[] = [
    {
      id: '1',
      title: 'From Idea to IPO: A Founder\'s Journey',
      description: 'Learn how Sarah Chen built her fintech startup from a simple idea to a billion-dollar company. Discover the key decisions, challenges, and strategies that led to success.',
      author: 'Sarah Chen',
      publishedAt: '2024-01-15',
      url: 'https://example.com/idea-to-ipo',
      coverImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=250&fit=crop',
      tags: ['Founder Story', 'Success', 'Fintech']
    },
    {
      id: '2',
      title: 'The Art of Pitching: 10 Tips That Actually Work',
      description: 'Master the art of pitching your startup to investors. From crafting your story to handling tough questions, here are proven strategies from successful entrepreneurs.',
      author: 'Michael Rodriguez',
      publishedAt: '2024-01-12',
      url: 'https://example.com/pitching-tips',
      coverImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=250&fit=crop',
      tags: ['Pitching', 'Investors', 'Strategy']
    },
    {
      id: '3',
      title: 'Building Your MVP: What Really Matters',
      description: 'Stop overthinking your MVP. Learn what features actually matter for early validation and how to build something users will love without breaking the bank.',
      author: 'Emily Watson',
      publishedAt: '2024-01-10',
      url: 'https://example.com/mvp-guide',
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop',
      tags: ['MVP', 'Product Development', 'Validation']
    },
    {
      id: '4',
      title: 'The Psychology of Startup Failure (And How to Avoid It)',
      description: 'Understanding the common psychological traps that lead to startup failure and practical strategies to stay focused, motivated, and successful.',
      author: 'Dr. James Park',
      publishedAt: '2024-01-08',
      url: 'https://example.com/startup-psychology',
      coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
      tags: ['Psychology', 'Failure', 'Mindset']
    },
    {
      id: '5',
      title: 'Remote Team Building: Lessons from a Distributed Startup',
      description: 'How to build and manage a high-performing remote team. Real insights from a startup that went from 2 to 50 employees while staying fully remote.',
      author: 'Lisa Thompson',
      publishedAt: '2024-01-05',
      url: 'https://example.com/remote-teams',
      coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=250&fit=crop',
      tags: ['Remote Work', 'Team Building', 'Management']
    },
    {
      id: '6',
      title: 'The Future of AI in Startups: What You Need to Know',
      description: 'Explore how artificial intelligence is reshaping the startup landscape and discover practical ways to leverage AI in your own venture.',
      author: 'Alex Chen',
      publishedAt: '2024-01-03',
      url: 'https://example.com/ai-startups',
      coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
      tags: ['AI', 'Technology', 'Future']
    }
  ];

  const generateBlogImage = async (title: string, description: string): Promise<string> => {
    try {
      // Try to generate an image using a free image API or placeholder service
      // For now, we'll use a service that generates images based on text
      const encodedTitle = encodeURIComponent(title);
      const encodedDesc = encodeURIComponent(description.substring(0, 100));
      
      // Use Lorem Picsum with different seeds for variety
      const seed = title.length + description.length;
      return `https://picsum.photos/400/250?random=${seed}`;
    } catch (error) {
      console.warn('Failed to generate image:', error);
      // Fallback to a default startup-related image
      return `https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=250&fit=crop&auto=format`;
    }
  };

  const fetchBlogPosts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try multiple APIs for diverse content
      const apis = [
        'https://dev.to/api/articles?tag=startup&per_page=3',
        'https://dev.to/api/articles?tag=entrepreneur&per_page=2',
        'https://dev.to/api/articles?tag=business&per_page=1'
      ];
      
      const responses = await Promise.allSettled(
        apis.map(url => fetch(url))
      );
      
      let allPosts: any[] = [];
      
      for (const result of responses) {
        if (result.status === 'fulfilled' && result.value.ok) {
          const data = await result.value.json();
          allPosts = [...allPosts, ...data];
        }
      }
      
      if (allPosts.length > 0) {
        const formattedPosts = await Promise.all(
          allPosts.slice(0, 6).map(async (article: any, index: number) => {
            let coverImage = article.cover_image;
            
            // If no cover image, generate one
            if (!coverImage) {
              coverImage = await generateBlogImage(article.title, article.description || article.excerpt || '');
            }
            
            return {
              id: article.id.toString(),
              title: article.title,
              description: article.description || article.excerpt || 'Read more about this interesting startup topic...',
              author: article.user.name,
              publishedAt: article.published_at,
              url: article.url,
              coverImage,
              tags: article.tag_list.slice(0, 3)
            };
          })
        );
        setPosts(formattedPosts);
      } else {
        throw new Error('No posts fetched from APIs');
      }
    } catch (err) {
      console.log('Using fallback blog posts with generated images');
      // Fallback to sample posts with generated images
      const fallbackPosts = await Promise.all(
        samplePosts.map(async (post) => ({
          ...post,
          coverImage: await generateBlogImage(post.title, post.description)
        }))
      );
      setPosts(fallbackPosts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleReadMore = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600 dark:text-gray-400">Loading latest blog posts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchBlogPosts}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 mx-auto"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={inView ? { scale: 1 } : { scale: 0.8 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-4"
          >
            <TrendingUp size={20} className="text-orange-500" />
            <span className="text-orange-600 dark:text-orange-400 font-medium">Latest Insights</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 gradient-text-entrepreneur animate-startup-rise">
            Latest Blog Posts
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Insights, stories, and lessons from successful entrepreneurs and industry experts
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ 
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className={`group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ${
                isDark ? 'bg-slate-800' : 'bg-white'
              }`}
            >
              {/* Cover Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-4 left-4">
                  {post.tags && (
                    <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
                      {post.tags[0]}
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-orange-500 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {post.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                </div>

                {/* Read More Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleReadMore(post.url)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 group/btn"
                >
                  <span>Read More</span>
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Load More Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 border-2 border-orange-500 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300 font-semibold"
          >
            Load More Posts
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogSection;

