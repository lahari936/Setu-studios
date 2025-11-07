const express = require('express');
const router = express.Router();
const User = require('../models/User');
const IdeaAnalysis = require('../models/IdeaAnalysis');

// Middleware for authentication (simplified for now)
const authenticateUser = async (req, res, next) => {
  try {
    const { uid, email } = req.headers;
    
    if (!uid || !email) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Find or create user
    let user = await User.findByUid(uid);
    if (!user) {
      user = new User({
        uid,
        email,
        displayName: email.split('@')[0]
      });
      await user.save();
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Get user profile
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const user = await User.findByUid(req.user.uid)
      .select('-__v -updatedAt');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', authenticateUser, async (req, res) => {
  try {
    const { profile, company, contact, preferences } = req.body;
    
    const updateData = {};
    if (profile) updateData.profile = profile;
    if (company) updateData.company = company;
    if (contact) updateData.contact = contact;
    if (preferences) updateData.preferences = preferences;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-__v -updatedAt');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user's idea analysis history
router.get('/idea-analysis', authenticateUser, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'completed' } = req.query;
    
    const analyses = await IdeaAnalysis.findByUserUid(req.user.uid, {
      status,
      limit: parseInt(limit),
      page: parseInt(page)
    });
    
    const total = await IdeaAnalysis.countDocuments({
      userUid: req.user.uid,
      status
    });
    
    res.json({
      success: true,
      data: {
        analyses,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get idea analysis error:', error);
    res.status(500).json({ error: 'Failed to fetch idea analysis history' });
  }
});

// Get specific idea analysis
router.get('/idea-analysis/:id', authenticateUser, async (req, res) => {
  try {
    const analysis = await IdeaAnalysis.findOne({
      _id: req.params.id,
      userUid: req.user.uid
    });
    
    if (!analysis) {
      return res.status(404).json({ error: 'Idea analysis not found' });
    }
    
    // Increment view count
    await analysis.incrementViewCount();
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Get idea analysis error:', error);
    res.status(500).json({ error: 'Failed to fetch idea analysis' });
  }
});

// Update idea analysis interaction
router.put('/idea-analysis/:id/interaction', authenticateUser, async (req, res) => {
  try {
    const { action, rating, feedback } = req.body;
    
    const analysis = await IdeaAnalysis.findOne({
      _id: req.params.id,
      userUid: req.user.uid
    });
    
    if (!analysis) {
      return res.status(404).json({ error: 'Idea analysis not found' });
    }
    
    switch (action) {
      case 'bookmark':
        await analysis.toggleBookmark();
        break;
      case 'rate':
        if (rating) {
          await analysis.addRating(rating, feedback);
        }
        break;
      case 'share':
        analysis.userInteraction.isShared = true;
        await analysis.save();
        break;
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
    
    res.json({
      success: true,
      data: analysis,
      message: 'Interaction updated successfully'
    });
  } catch (error) {
    console.error('Update interaction error:', error);
    res.status(500).json({ error: 'Failed to update interaction' });
  }
});

// Delete idea analysis
router.delete('/idea-analysis/:id', authenticateUser, async (req, res) => {
  try {
    const analysis = await IdeaAnalysis.findOneAndUpdate(
      {
        _id: req.params.id,
        userUid: req.user.uid
      },
      { status: 'deleted' },
      { new: true }
    );
    
    if (!analysis) {
      return res.status(404).json({ error: 'Idea analysis not found' });
    }
    
    res.json({
      success: true,
      message: 'Idea analysis deleted successfully'
    });
  } catch (error) {
    console.error('Delete idea analysis error:', error);
    res.status(500).json({ error: 'Failed to delete idea analysis' });
  }
});

// Get user statistics
router.get('/stats', authenticateUser, async (req, res) => {
  try {
    const stats = {
      totalIdeasAnalyzed: req.user.activity.ideasAnalyzed,
      totalLogins: req.user.activity.totalLogins,
      profileCompleteness: req.user.profileCompleteness,
      lastLogin: req.user.activity.lastLogin,
      accountCreated: req.user.createdAt
    };
    
    // Get recent analysis count
    const recentAnalyses = await IdeaAnalysis.countDocuments({
      userUid: req.user.uid,
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
    });
    
    stats.recentAnalyses = recentAnalyses;
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Search users (for mentorship connections)
router.get('/search', authenticateUser, async (req, res) => {
  try {
    const { q, role, industry, limit = 20 } = req.query;
    
    const query = {
      _id: { $ne: req.user._id }, // Exclude current user
      status: 'active'
    };
    
    if (q) {
      query.$or = [
        { displayName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { 'company.name': { $regex: q, $options: 'i' } }
      ];
    }
    
    if (role) query['profile.role'] = role;
    if (industry) query['profile.industry'] = industry;
    
    const users = await User.find(query)
      .select('displayName email photoURL profile.role profile.industry profile.badges company.name')
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

module.exports = router;
