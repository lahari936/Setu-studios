const express = require('express');
const router = express.Router();
const Mentor = require('../models/Mentor');
const Booking = require('../models/Booking');
const { sendEmail, generateMentorApplicationEmail, generateBookingConfirmationEmail, generateMenteeConfirmationEmail } = require('../utils/emailService');
const crypto = require('crypto');

// Get all mentors
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, verified = true } = req.query;
    const query = verified === 'true' ? { verified: true } : {};
    
    const mentors = await Mentor.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Mentor.countDocuments(query);
    
    res.json({
      mentors,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching mentors:', error);
    res.status(500).json({ error: 'Failed to fetch mentors' });
  }
});

// Get mentor by ID
router.get('/:id', async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }
    res.json(mentor);
  } catch (error) {
    console.error('Error fetching mentor:', error);
    res.status(500).json({ error: 'Failed to fetch mentor' });
  }
});

// Create new mentor application
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      position,
      experience,
      domain,
      expertise,
      bio,
      location,
      linkedinUrl,
      calendlyUrl,
      availability,
      hourlyRate,
      languages,
      certifications,
      portfolioUrl
    } = req.body;

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const mentor = new Mentor({
      name,
      email,
      phone,
      company,
      position,
      experience,
      domain,
      expertise: Array.isArray(expertise) ? expertise : expertise.split(',').map(s => s.trim()),
      bio,
      location,
      linkedinUrl,
      calendlyUrl,
      availability,
      hourlyRate,
      languages: Array.isArray(languages) ? languages : languages.split(',').map(s => s.trim()),
      certifications: Array.isArray(certifications) ? certifications : certifications.split(',').map(s => s.trim()),
      portfolioUrl,
      verificationToken,
      status: 'pending',
      verified: false
    });

    await mentor.save();

    // Send email notification to admin
    const emailContent = generateMentorApplicationEmail(mentor, verificationToken);
    await sendEmail(
      process.env.ADMIN_EMAIL || 'studiossetu@gmail.com',
      emailContent.subject,
      emailContent.html
    );

    res.status(201).json({
      message: 'Mentor application submitted successfully',
      mentor: {
        id: mentor._id,
        name: mentor.name,
        email: mentor.email,
        status: mentor.status
      }
    });
  } catch (error) {
    console.error('Error creating mentor:', error);
    if (error.code === 11000) {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create mentor application' });
    }
  }
});

// Verify mentor (called when admin clicks accept button in email)
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const mentor = await Mentor.findOne({ verificationToken: token });
    if (!mentor) {
      return res.status(404).json({ error: 'Invalid verification token' });
    }

    mentor.verified = true;
    mentor.status = 'approved';
    mentor.verificationToken = undefined;
    await mentor.save();

    // Redirect to frontend success page
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/mentorship?verified=true`);
  } catch (error) {
    console.error('Error verifying mentor:', error);
    res.status(500).json({ error: 'Failed to verify mentor' });
  }
});

// Update mentor
router.put('/:id', async (req, res) => {
  try {
    const mentor = await Mentor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }
    
    res.json(mentor);
  } catch (error) {
    console.error('Error updating mentor:', error);
    res.status(500).json({ error: 'Failed to update mentor' });
  }
});

// Delete mentor
router.delete('/:id', async (req, res) => {
  try {
    const mentor = await Mentor.findByIdAndDelete(req.params.id);
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }
    res.json({ message: 'Mentor deleted successfully' });
  } catch (error) {
    console.error('Error deleting mentor:', error);
    res.status(500).json({ error: 'Failed to delete mentor' });
  }
});

// Book mentorship session
router.post('/:id/book', async (req, res) => {
  try {
    // Try to find mentor by MongoDB _id first, then by custom id field
    let mentor = await Mentor.findById(req.params.id);
    if (!mentor) {
      mentor = await Mentor.findOne({ id: parseInt(req.params.id) });
    }
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    const {
      menteeName,
      menteeEmail,
      menteePhone,
      menteeCompany,
      sessionType,
      scheduledDate,
      scheduledTime,
      duration,
      meetingNotes
    } = req.body;

    const booking = new Booking({
      mentor: mentor._id,
      mentee: {
        name: menteeName,
        email: menteeEmail,
        phone: menteePhone,
        company: menteeCompany
      },
      sessionDetails: {
        type: sessionType,
        scheduledDate: new Date(scheduledDate),
        scheduledTime,
        duration: duration || 60,
        meetingNotes
      },
      payment: {
        amount: mentor.hourlyRate || 0
      }
    });

    await booking.save();

    // Update mentor's total bookings
    mentor.totalBookings += 1;
    await mentor.save();

    // Send confirmation email to mentor
    const mentorEmailContent = generateBookingConfirmationEmail(booking, mentor);
    await sendEmail(mentor.email, mentorEmailContent.subject, mentorEmailContent.html);

    // Send confirmation email to mentee
    const menteeEmailContent = generateMenteeConfirmationEmail(booking, mentor);
    await sendEmail(menteeEmail, menteeEmailContent.subject, menteeEmailContent.html);

    // Send notification email to admin
    await sendEmail(
      process.env.ADMIN_EMAIL || 'studiossetu@gmail.com',
      `New Booking: ${menteeName} booked ${mentor.name}`,
      `A new mentorship session has been booked.<br><br>
       Mentee: ${menteeName} (${menteeEmail})<br>
       Mentor: ${mentor.name} (${mentor.email})<br>
       Date: ${scheduledDate}<br>
       Time: ${scheduledTime}<br>
       Session Type: ${sessionType}<br>
       ${meetingNotes ? `Notes: ${meetingNotes}` : ''}`
    );

    res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        id: booking._id,
        mentor: mentor.name,
        mentee: menteeName,
        scheduledDate,
        scheduledTime
      }
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

module.exports = router;
