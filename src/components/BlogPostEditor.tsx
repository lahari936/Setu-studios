import React, { useState } from 'react';
import { X, Image, FileText, Save, Eye, Upload } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/useAuth';

interface BlogPostEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string | null;
  author: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  tags: string[];
  publishedAt: string;
  status: 'draft' | 'published';
  likes: number;
  views: number;
}

const BlogPostEditor: React.FC<BlogPostEditorProps> = ({ isOpen, onClose, onPostCreated }) => {
  const { showNotification } = useNotification();
  const { user, userProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    coverImage: null as File | null,
    status: 'published' as 'draft' | 'published'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      coverImage: file
    }));
  };

  const generateExcerpt = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !userProfile) {
      showNotification('Please sign in to create a blog post', 'error');
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      showNotification('Please fill in the title and content', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const newPost: BlogPost = {
        id: `blog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: formData.title.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim() || generateExcerpt(formData.content),
        coverImage: formData.coverImage ? URL.createObjectURL(formData.coverImage) : null,
        author: {
          id: user.uid,
          name: userProfile.name || user.displayName || 'Anonymous',
          email: user.email || '',
          avatar: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name || 'User')}&background=f97316&color=fff`
        },
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        publishedAt: new Date().toISOString(),
        status: formData.status,
        likes: 0,
        views: 0
      };

      // Save to localStorage (in a real app, this would go to a database)
      const existingPosts = JSON.parse(localStorage.getItem('user_blog_posts') || '[]');
      existingPosts.unshift(newPost);
      localStorage.setItem('user_blog_posts', JSON.stringify(existingPosts));

      // Also add to global blog feed
      const globalPosts = JSON.parse(localStorage.getItem('global_blog_feed') || '[]');
      globalPosts.unshift(newPost);
      localStorage.setItem('global_blog_feed', JSON.stringify(globalPosts));

      showNotification('Blog post published successfully!', 'success');
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        tags: '',
        coverImage: null,
        status: 'published'
      });

      onPostCreated();
      onClose();

    } catch (error) {
      console.error('Error creating blog post:', error);
      showNotification('Failed to create blog post. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Create New Blog Post
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Share your startup insights and experiences
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-120px)]">
          {/* Editor */}
          <div className={`flex-1 p-6 overflow-y-auto ${isPreview ? 'hidden md:block' : ''}`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter a compelling title for your blog post"
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cover Image
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="cover-image"
                  />
                  <label
                    htmlFor="cover-image"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Choose Image
                  </label>
                  {formData.coverImage && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formData.coverImage.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter tags separated by commas (e.g., startup, funding, technology)"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Excerpt (Optional)
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Brief summary of your post (auto-generated if empty)"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={12}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Write your blog post content here..."
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="published">Publish Now</option>
                  <option value="draft">Save as Draft</option>
                </select>
              </div>
            </form>
          </div>

          {/* Preview */}
          {isPreview && (
            <div className="flex-1 p-6 border-l border-gray-200 dark:border-slate-700 overflow-y-auto">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview</h4>
              <div className="bg-white dark:bg-slate-700 rounded-lg p-6 border border-gray-200 dark:border-slate-600">
                {formData.coverImage && (
                  <img
                    src={URL.createObjectURL(formData.coverImage)}
                    alt="Cover"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {formData.title || 'Your blog post title will appear here'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {formData.excerpt || generateExcerpt(formData.content) || 'Your excerpt will appear here'}
                </p>
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  By {userProfile?.name || 'You'} • {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-slate-700">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <Eye className="w-4 h-4" />
            {isPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {formData.status === 'draft' ? 'Save Draft' : 'Publish Post'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostEditor;
