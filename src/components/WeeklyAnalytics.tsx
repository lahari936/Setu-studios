import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, Mail, Download } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';

interface BookingData {
  mentorId: number;
  mentorName: string;
  menteeName: string;
  menteeEmail: string;
  sessionType: string;
  scheduledDate: string;
  scheduledTime: string;
  timestamp: string;
}

interface WeeklyReport {
  totalBookings: number;
  mentorBookings: Array<{
    name: string;
    bookings: number;
  }>;
  topMentors: Array<{
    name: string;
    bookings: number;
  }>;
}

const WeeklyAnalytics: React.FC = () => {
  const { showNotification } = useNotification();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadBookings();
    generateWeeklyReport();
  }, []);

  const loadBookings = () => {
    try {
      const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      setBookings(storedBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const generateWeeklyReport = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyBookings = bookings.filter(booking => 
      new Date(booking.timestamp) >= oneWeekAgo
    );

    // Count bookings by mentor
    const mentorCounts: { [key: string]: number } = {};
    weeklyBookings.forEach(booking => {
      mentorCounts[booking.mentorName] = (mentorCounts[booking.mentorName] || 0) + 1;
    });

    // Convert to array and sort
    const mentorBookings = Object.entries(mentorCounts)
      .map(([name, bookings]) => ({ name, bookings }))
      .sort((a, b) => b.bookings - a.bookings);

    const topMentors = mentorBookings.slice(0, 3);

    setWeeklyReport({
      totalBookings: weeklyBookings.length,
      mentorBookings,
      topMentors
    });
  };

  const sendWeeklyReport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/bookings/analytics/weekly-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        showNotification('Weekly report sent successfully!', 'success');
      } else {
        throw new Error('Failed to send report');
      }
    } catch (error) {
      console.error('Error sending weekly report:', error);
      showNotification('Failed to send weekly report. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = () => {
    if (!weeklyReport) return;

    const reportData = {
      generatedAt: new Date().toISOString(),
      period: 'Last 7 days',
      ...weeklyReport,
      allBookings: bookings.filter(booking => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return new Date(booking.timestamp) >= oneWeekAgo;
      })
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weekly-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Report downloaded successfully!', 'success');
  };

  if (!weeklyReport) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-6"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
            <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Weekly Analytics Report
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last 7 days booking summary
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={downloadReport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={sendWeeklyReport}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Mail className="w-4 h-4" />
            {isLoading ? 'Sending...' : 'Send Report'}
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8" />
            <div>
              <p className="text-orange-100">Total Bookings</p>
              <p className="text-2xl font-bold">{weeklyReport.totalBookings}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8" />
            <div>
              <p className="text-green-100">Active Mentors</p>
              <p className="text-2xl font-bold">{weeklyReport.mentorBookings.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8" />
            <div>
              <p className="text-orange-100">Avg per Mentor</p>
              <p className="text-2xl font-bold">
                {weeklyReport.mentorBookings.length > 0 
                  ? (weeklyReport.totalBookings / weeklyReport.mentorBookings.length).toFixed(1)
                  : '0'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Mentors */}
      {weeklyReport.topMentors.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🏆 Top 3 Most Booked Mentors
          </h4>
          <div className="space-y-3">
            {weeklyReport.topMentors.map((mentor, index) => (
              <div key={mentor.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    'bg-orange-600'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {mentor.name}
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {mentor.bookings} bookings
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Mentor Bookings */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          📊 All Mentor Bookings
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="text-left py-2 text-gray-600 dark:text-gray-400">Mentor</th>
                <th className="text-right py-2 text-gray-600 dark:text-gray-400">Bookings</th>
                <th className="text-right py-2 text-gray-600 dark:text-gray-400">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {weeklyReport.mentorBookings.map((mentor) => {
                const percentage = weeklyReport.totalBookings > 0 
                  ? ((mentor.bookings / weeklyReport.totalBookings) * 100).toFixed(1)
                  : '0';
                return (
                  <tr key={mentor.name} className="border-b border-gray-100 dark:border-slate-700">
                    <td className="py-3 text-gray-900 dark:text-white">{mentor.name}</td>
                    <td className="py-3 text-right text-gray-900 dark:text-white">{mentor.bookings}</td>
                    <td className="py-3 text-right text-gray-600 dark:text-gray-400">{percentage}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {weeklyReport.totalBookings === 0 && (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            No bookings found for the last 7 days.
          </p>
        </div>
      )}
    </div>
  );
};

export default WeeklyAnalytics;
