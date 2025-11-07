const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Mentor = require('../models/Mentor');
const { sendEmail, generateWeeklyReportEmail } = require('../utils/emailService');

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, mentorId } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (mentorId) query.mentor = mentorId;
    
    const bookings = await Booking.find(query)
      .populate('mentor', 'name email domain')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Booking.countDocuments(query);
    
    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('mentor');
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Update booking status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('mentor');
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

// Add feedback to booking
router.put('/:id/feedback', async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { feedback: { rating, comment } },
      { new: true }
    ).populate('mentor');
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Update mentor's rating
    if (rating) {
      await Mentor.findByIdAndUpdate(
        booking.mentor._id,
        { $push: { reviews: { rating, comment } } }
      );
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Error adding feedback:', error);
    res.status(500).json({ error: 'Failed to add feedback' });
  }
});

// Get booking analytics
router.get('/analytics/weekly', async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    // Get total bookings for the week
    const totalBookings = await Booking.countDocuments({
      createdAt: { $gte: oneWeekAgo }
    });
    
    // Get bookings by mentor
    const mentorBookings = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: oneWeekAgo }
        }
      },
      {
        $group: {
          _id: '$mentor',
          bookings: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'mentors',
          localField: '_id',
          foreignField: '_id',
          as: 'mentor'
        }
      },
      {
        $unwind: '$mentor'
      },
      {
        $project: {
          name: '$mentor.name',
          bookings: 1
        }
      },
      {
        $sort: { bookings: -1 }
      }
    ]);
    
    // Get top 3 mentors
    const topMentors = mentorBookings.slice(0, 3);
    
    res.json({
      totalBookings,
      mentorBookings,
      topMentors
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Send weekly report
router.post('/analytics/weekly-report', async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    // Get analytics data
    const totalBookings = await Booking.countDocuments({
      createdAt: { $gte: oneWeekAgo }
    });
    
    const mentorBookings = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: oneWeekAgo }
        }
      },
      {
        $group: {
          _id: '$mentor',
          bookings: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'mentors',
          localField: '_id',
          foreignField: '_id',
          as: 'mentor'
        }
      },
      {
        $unwind: '$mentor'
      },
      {
        $project: {
          name: '$mentor.name',
          bookings: 1
        }
      },
      {
        $sort: { bookings: -1 }
      }
    ]);
    
    const topMentors = mentorBookings.slice(0, 3);
    
    // Generate and send email report
    const reportData = {
      totalBookings,
      mentorBookings,
      topMentors
    };
    
    const emailContent = generateWeeklyReportEmail(reportData);
    await sendEmail(
      process.env.ADMIN_EMAIL || 'studiossetu@gmail.com',
      emailContent.subject,
      emailContent.html
    );
    
    res.json({
      message: 'Weekly report sent successfully',
      reportData
    });
  } catch (error) {
    console.error('Error sending weekly report:', error);
    res.status(500).json({ error: 'Failed to send weekly report' });
  }
});

module.exports = router;
