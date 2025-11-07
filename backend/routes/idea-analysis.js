const express = require('express');
const router = express.Router();
const IdeaAnalysis = require('../models/IdeaAnalysis');
const User = require('../models/User');

// Middleware for authentication
const authenticateUser = async (req, res, next) => {
  try {
    const { uid, email } = req.headers;
    
    if (!uid || !email) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
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

// Create new idea analysis
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { ideaName, ideaDescription } = req.body;
    
    if (!ideaName || !ideaDescription) {
      return res.status(400).json({ 
        error: 'Idea name and description are required' 
      });
    }
    
    // Create analysis record
    const analysis = new IdeaAnalysis({
      userId: req.user._id,
      userUid: req.user.uid,
      ideaName: ideaName.trim(),
      ideaDescription: ideaDescription.trim(),
      status: 'draft'
    });
    
    await analysis.save();
    
    res.json({
      success: true,
      data: analysis,
      message: 'Idea analysis created successfully'
    });
  } catch (error) {
    console.error('Create analysis error:', error);
    res.status(500).json({ error: 'Failed to create idea analysis' });
  }
});

// Update analysis with Gemini results
router.put('/:id/analysis', authenticateUser, async (req, res) => {
  try {
    const { analysis, metadata } = req.body;
    
    const ideaAnalysis = await IdeaAnalysis.findOne({
      _id: req.params.id,
      userUid: req.user.uid
    });
    
    if (!ideaAnalysis) {
      return res.status(404).json({ error: 'Idea analysis not found' });
    }
    
    // Update analysis data
    ideaAnalysis.analysis = analysis;
    ideaAnalysis.status = 'completed';
    
    if (metadata) {
      ideaAnalysis.analysisMetadata = {
        ...ideaAnalysis.analysisMetadata,
        ...metadata
      };
    }
    
    await ideaAnalysis.save();
    
    // Update user's idea analysis count
    await req.user.incrementIdeasAnalyzed();
    
    res.json({
      success: true,
      data: ideaAnalysis,
      message: 'Analysis updated successfully'
    });
  } catch (error) {
    console.error('Update analysis error:', error);
    res.status(500).json({ error: 'Failed to update analysis' });
  }
});

// Get all analyses for a user
router.get('/', authenticateUser, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, visibility } = req.query;
    
    const options = {
      limit: parseInt(limit),
      page: parseInt(page)
    };
    
    if (status) options.status = status;
    if (visibility) options.visibility = visibility;
    
    const analyses = await IdeaAnalysis.findByUserUid(req.user.uid, options);
    
    const total = await IdeaAnalysis.countDocuments({
      userUid: req.user.uid,
      ...(status && { status }),
      ...(visibility && { visibility })
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
    console.error('Get analyses error:', error);
    res.status(500).json({ error: 'Failed to fetch analyses' });
  }
});

// Get specific analysis
router.get('/:id', authenticateUser, async (req, res) => {
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
    console.error('Get analysis error:', error);
    res.status(500).json({ error: 'Failed to fetch analysis' });
  }
});

// Update analysis interaction
router.put('/:id/interaction', authenticateUser, async (req, res) => {
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

// Update analysis visibility
router.put('/:id/visibility', authenticateUser, async (req, res) => {
  try {
    const { visibility } = req.body;
    
    if (!['private', 'public', 'connections'].includes(visibility)) {
      return res.status(400).json({ error: 'Invalid visibility setting' });
    }
    
    const analysis = await IdeaAnalysis.findOneAndUpdate(
      {
        _id: req.params.id,
        userUid: req.user.uid
      },
      { visibility },
      { new: true }
    );
    
    if (!analysis) {
      return res.status(404).json({ error: 'Idea analysis not found' });
    }
    
    res.json({
      success: true,
      data: analysis,
      message: 'Visibility updated successfully'
    });
  } catch (error) {
    console.error('Update visibility error:', error);
    res.status(500).json({ error: 'Failed to update visibility' });
  }
});

// Delete analysis
router.delete('/:id', authenticateUser, async (req, res) => {
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
    console.error('Delete analysis error:', error);
    res.status(500).json({ error: 'Failed to delete analysis' });
  }
});

// Search public analyses
router.get('/public/search', async (req, res) => {
  try {
    const { q, tags, limit = 20 } = req.query;
    
    let analyses;
    
    if (q) {
      analyses = await IdeaAnalysis.searchIdeas(q, { limit: parseInt(limit) });
    } else {
      const query = {
        visibility: 'public',
        status: 'completed'
      };
      
      if (tags) {
        query.tags = { $in: tags.split(',') };
      }
      
      analyses = await IdeaAnalysis.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .populate('userId', 'displayName photoURL profile.role');
    }
    
    res.json({
      success: true,
      data: analyses
    });
  } catch (error) {
    console.error('Search analyses error:', error);
    res.status(500).json({ error: 'Failed to search analyses' });
  }
});

// Get trending analyses
router.get('/public/trending', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const analyses = await IdeaAnalysis.find({
      visibility: 'public',
      status: 'completed',
      'userInteraction.viewCount': { $gt: 0 }
    })
    .sort({ 'userInteraction.viewCount': -1, createdAt: -1 })
    .limit(parseInt(limit))
    .populate('userId', 'displayName photoURL profile.role');
    
    res.json({
      success: true,
      data: analyses
    });
  } catch (error) {
    console.error('Get trending analyses error:', error);
    res.status(500).json({ error: 'Failed to fetch trending analyses' });
  }
});

// Get analysis statistics
router.get('/stats/overview', authenticateUser, async (req, res) => {
  try {
    const stats = {
      totalAnalyses: await IdeaAnalysis.countDocuments({
        userUid: req.user.uid,
        status: { $ne: 'deleted' }
      }),
      completedAnalyses: await IdeaAnalysis.countDocuments({
        userUid: req.user.uid,
        status: 'completed'
      }),
      bookmarkedAnalyses: await IdeaAnalysis.countDocuments({
        userUid: req.user.uid,
        'userInteraction.isBookmarked': true,
        status: { $ne: 'deleted' }
      }),
      sharedAnalyses: await IdeaAnalysis.countDocuments({
        userUid: req.user.uid,
        'userInteraction.isShared': true,
        status: { $ne: 'deleted' }
      }),
      totalViews: await IdeaAnalysis.aggregate([
        { $match: { userUid: req.user.uid, status: { $ne: 'deleted' } } },
        { $group: { _id: null, totalViews: { $sum: '$userInteraction.viewCount' } } }
      ]).then(result => result[0]?.totalViews || 0)
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get analysis stats error:', error);
    res.status(500).json({ error: 'Failed to fetch analysis statistics' });
  }
});

module.exports = router;
