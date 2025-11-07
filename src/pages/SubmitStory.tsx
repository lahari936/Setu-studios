import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import AnimatedCard from '../components/AnimatedCard';
import { useNotification } from '../contexts/NotificationContext';

const SubmitStory: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { showNotification } = useNotification();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stories = JSON.parse(localStorage.getItem('submitted_stories') || '[]');
    const newStory = {
      id: Date.now(),
      title,
      content,
      image: imageFile ? URL.createObjectURL(imageFile) : null,
      date: new Date().toISOString()
    };
    stories.unshift(newStory);
    localStorage.setItem('submitted_stories', JSON.stringify(stories));
    showNotification('Story submitted locally. It will appear on the blog after review.', 'success');
    navigate('/blog');
  };

  return (
    <div className={`min-h-screen py-20 px-4 transition-colors duration-300 ${
      isDark ? 'bg-gradient-to-br from-orange-dark to-slate-900' : 'bg-gradient-to-br from-slate-50 to-gray-100'
    }`}>
      <div className="container mx-auto max-w-3xl">
        <AnimatedCard className="p-8">
          <h2 className="text-2xl font-bold mb-4">Submit Your Startup Story</h2>
          <p className="text-gray-500 mb-6">Share your journey. Add a title, write the content, and optionally attach an image. This is stored locally for now.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-4 py-3 rounded-lg border-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <textarea value={content} onChange={e => setContent(e.target.value)} rows={8} required className="w-full px-4 py-3 rounded-lg border-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Image (optional)</label>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)} />
            </div>
            <div className="flex justify-between items-center">
              <button type="submit" className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold">Submit Story</button>
              <button type="button" onClick={() => navigate('/blog')} className="text-sm text-gray-500 underline">Cancel</button>
            </div>
          </form>
        </AnimatedCard>
      </div>
    </div>
  );
};

export default SubmitStory;
