const nodemailer = require('nodemailer');
const path = require('path');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'studiossetu@gmail.com',
      pass: process.env.EMAIL_PASS
    }
  });
};

// Generate email templates
const generateMentorApplicationEmail = (mentor, verificationToken) => {
  const acceptUrl = `${process.env.FRONTEND_URL}/api/mentors/verify/${verificationToken}`;
  
  return {
    subject: `New Mentor Application - ${mentor.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Mentor Application</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f97316, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .mentor-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .info-row { margin: 10px 0; }
          .label { font-weight: bold; color: #f97316; }
          .value { margin-left: 10px; }
          .button { display: inline-block; background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
          .button:hover { background: #ea580c; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 New Mentor Application</h1>
            <p>A new mentor has applied to join Setu Studios</p>
          </div>
          
          <div class="content">
            <div class="mentor-info">
              <h2>Mentor Details</h2>
              <div class="info-row">
                <span class="label">Name:</span>
                <span class="value">${mentor.name}</span>
              </div>
              <div class="info-row">
                <span class="label">Email:</span>
                <span class="value">${mentor.email}</span>
              </div>
              <div class="info-row">
                <span class="label">Company:</span>
                <span class="value">${mentor.company || 'Not specified'}</span>
              </div>
              <div class="info-row">
                <span class="label">Position:</span>
                <span class="value">${mentor.position || 'Not specified'}</span>
              </div>
              <div class="info-row">
                <span class="label">Experience:</span>
                <span class="value">${mentor.experience}</span>
              </div>
              <div class="info-row">
                <span class="label">Domain:</span>
                <span class="value">${mentor.domain}</span>
              </div>
              <div class="info-row">
                <span class="label">Expertise:</span>
                <span class="value">${mentor.expertise.join(', ')}</span>
              </div>
              <div class="info-row">
                <span class="label">LinkedIn:</span>
                <span class="value"><a href="${mentor.linkedinUrl}" target="_blank">${mentor.linkedinUrl}</a></span>
              </div>
              <div class="info-row">
                <span class="label">Location:</span>
                <span class="value">${mentor.location}</span>
              </div>
              <div class="info-row">
                <span class="label">Bio:</span>
                <span class="value">${mentor.bio}</span>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="${acceptUrl}" class="button">✅ Accept Mentor</a>
            </div>
            
            <p style="margin-top: 30px; padding: 15px; background: #e3f2fd; border-radius: 6px; color: #1565c0;">
              <strong>Note:</strong> Clicking the "Accept Mentor" button will automatically verify the mentor and make their profile visible on the website.
            </p>
          </div>
          
          <div class="footer">
            <p>This email was sent from Setu Studios Mentor Management System</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

const generateBookingConfirmationEmail = (booking, mentor) => {
  return {
    subject: `New Mentorship Session Booking - ${mentor.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Booking Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f97316, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .booking-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .info-row { margin: 10px 0; }
          .label { font-weight: bold; color: #f97316; }
          .value { margin-left: 10px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📅 New Mentorship Session</h1>
            <p>You have a new booking scheduled</p>
          </div>
          
          <div class="content">
            <div class="booking-info">
              <h2>Session Details</h2>
              <div class="info-row">
                <span class="label">Mentee Name:</span>
                <span class="value">${booking.mentee.name}</span>
              </div>
              <div class="info-row">
                <span class="label">Email:</span>
                <span class="value">${booking.mentee.email}</span>
              </div>
              <div class="info-row">
                <span class="label">Company:</span>
                <span class="value">${booking.mentee.company || 'Not specified'}</span>
              </div>
              <div class="info-row">
                <span class="label">Session Type:</span>
                <span class="value">${booking.sessionDetails.type}</span>
              </div>
              <div class="info-row">
                <span class="label">Date:</span>
                <span class="value">${new Date(booking.sessionDetails.scheduledDate).toLocaleDateString()}</span>
              </div>
              <div class="info-row">
                <span class="label">Time:</span>
                <span class="value">${booking.sessionDetails.scheduledTime}</span>
              </div>
              <div class="info-row">
                <span class="label">Duration:</span>
                <span class="value">${booking.sessionDetails.duration} minutes</span>
              </div>
              ${booking.sessionDetails.meetingNotes ? `
              <div class="info-row">
                <span class="label">Notes:</span>
                <span class="value">${booking.sessionDetails.meetingNotes}</span>
              </div>
              ` : ''}
            </div>
          </div>
          
          <div class="footer">
            <p>This email was sent from Setu Studios Booking System</p>
            <p>Please prepare for your session accordingly.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

const generateMenteeConfirmationEmail = (booking, mentor) => {
  return {
    subject: `Mentorship Session Confirmed with ${mentor.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Session Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f97316, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .booking-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .mentor-info { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .info-row { margin: 10px 0; }
          .label { font-weight: bold; color: #f97316; }
          .value { margin-left: 10px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Session Confirmed!</h1>
            <p>Your mentorship session has been scheduled</p>
          </div>
          
          <div class="content">
            <div class="booking-info">
              <h2>Your Session Details</h2>
              <div class="info-row">
                <span class="label">Mentor:</span>
                <span class="value">${mentor.name}</span>
              </div>
              <div class="info-row">
                <span class="label">Domain:</span>
                <span class="value">${mentor.domain}</span>
              </div>
              <div class="info-row">
                <span class="label">Session Type:</span>
                <span class="value">${booking.sessionDetails.type}</span>
              </div>
              <div class="info-row">
                <span class="label">Date:</span>
                <span class="value">${new Date(booking.sessionDetails.scheduledDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div class="info-row">
                <span class="label">Time:</span>
                <span class="value">${booking.sessionDetails.scheduledTime}</span>
              </div>
              <div class="info-row">
                <span class="label">Duration:</span>
                <span class="value">${booking.sessionDetails.duration} minutes</span>
              </div>
            </div>

            <div class="mentor-info">
              <h3>About Your Mentor</h3>
              <p><strong>${mentor.name}</strong> - ${mentor.experience} in ${mentor.domain}</p>
              <p><strong>Expertise:</strong> ${mentor.expertise}</p>
              <p><strong>Bio:</strong> ${mentor.bio}</p>
              ${mentor.linkedin ? `<p><strong>LinkedIn:</strong> <a href="${mentor.linkedin}" target="_blank">${mentor.linkedin}</a></p>` : ''}
            </div>

            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4>📝 What to Prepare:</h4>
              <ul>
                <li>Prepare your questions and specific challenges you'd like to discuss</li>
                <li>Have your startup details, metrics, and goals ready to share</li>
                <li>Test your video/audio setup if it's a video call</li>
                <li>Be ready to take notes during the session</li>
              </ul>
            </div>
          </div>
          
          <div class="footer">
            <p>This email was sent from Setu Studios</p>
            <p>If you need to reschedule, please contact us at studiossetu@gmail.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

const generateWeeklyReportEmail = (reportData) => {
  const { totalBookings, mentorBookings, topMentors } = reportData;
  
  return {
    subject: `Weekly Booking Report - ${new Date().toLocaleDateString()}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Weekly Booking Report</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f97316, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .stat-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .stat-number { font-size: 2em; font-weight: bold; color: #f97316; }
          .mentor-list { margin: 10px 0; }
          .mentor-item { padding: 8px 0; border-bottom: 1px solid #eee; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Weekly Booking Report</h1>
            <p>Summary of mentorship bookings for the week</p>
          </div>
          
          <div class="content">
            <div class="stat-card">
              <h2>📈 Total Bookings</h2>
              <div class="stat-number">${totalBookings}</div>
              <p>Bookings made this week</p>
            </div>
            
            <div class="stat-card">
              <h2>🏆 Top 3 Most Booked Mentors</h2>
              <div class="mentor-list">
                ${topMentors.map((mentor, index) => `
                  <div class="mentor-item">
                    <strong>${index + 1}. ${mentor.name}</strong> - ${mentor.bookings} bookings
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div class="stat-card">
              <h2>👥 All Mentor Bookings</h2>
              <div class="mentor-list">
                ${mentorBookings.map(mentor => `
                  <div class="mentor-item">
                    <strong>${mentor.name}</strong> - ${mentor.bookings} bookings
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p>This report was generated automatically by Setu Studios Booking System</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

// Send email function
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'studiossetu@gmail.com',
      to,
      subject,
      html
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  generateMentorApplicationEmail,
  generateBookingConfirmationEmail,
  generateMenteeConfirmationEmail,
  generateWeeklyReportEmail
};
