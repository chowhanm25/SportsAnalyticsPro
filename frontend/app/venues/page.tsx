// app/venues/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const venues = [
  "Lord's (England)",
  "Eden Gardens (India)",
  "MCG (Australia)",
  "The Oval (England)",
  "Wankhede Stadium (India)",
  "Newlands (South Africa)"
];

const VenueInsightsPage = () => {
  const [selectedVenue, setSelectedVenue] = useState(venues[0]);
  const [venueStats, setVenueStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedVenue) {
      const fetchVenueStats = async () => {
        setLoading(true);
        try {
          const res = await fetch(
            `http://localhost:8000/venues/${encodeURIComponent(selectedVenue)}/stats`
          );
          const data = await res.json();
          setVenueStats(data.stats);
        } finally {
          setLoading(false);
        }
      };
      fetchVenueStats();
    }
  }, [selectedVenue]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Venue Insights</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Select Venue</h2>
        <select
          value={selectedVenue}
          onChange={(e) => setSelectedVenue(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          {venues.map(venue => (
            <option key={venue} value={venue}>{venue}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-center">Loading venue data...</p>}

      {venueStats && !loading && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">{selectedVenue} Performance</h2>
          <div className="h-96">
            <Bar
              data={{
                labels: ['Average Runs', 'Average Wickets', 'Total Matches'],
                datasets: [{
                  label: 'Performance Metrics',
                  data: [
                    venueStats.avg_runs,
                    venueStats.avg_wickets,
                    venueStats.total_matches
                  ],
                  backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(75, 192, 192, 0.6)'
                  ],
                  borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)'
                  ],
                  borderWidth: 1
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueInsightsPage;