// app/compare/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
// import { Player } from '../../types';

interface Player {
  No: number;
  Name: string;
  Team: string;
  // Add other properties as needed
}

Chart.register(...registerables);

const PlayerComparisonPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      const res = await fetch('http://localhost:8000/players/all');
      const data = await res.json();
      setPlayers(data.data);
    };
    fetchPlayers();
  }, []);

  const handleCompare = async () => {
    if (selectedPlayers.length < 2) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/players/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_ids: selectedPlayers })
      });
      const data = await res.json();
      setComparisonData(data.comparison);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Player Comparison</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Select Players to Compare</h2>
        <select
          multiple
          value={selectedPlayers as any}
          onChange={(e) => setSelectedPlayers(
            Array.from(e.target.selectedOptions, option => Number(option.value))
          )}
          className="w-full p-2 border rounded-md h-40"
        >
          {players.map(player => (
            <option key={player.No} value={player.No}>
              {player.Name} ({player.Team})
            </option>
          ))}
        </select>
        <button
          onClick={handleCompare}
          disabled={selectedPlayers.length < 2 || loading}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
        >
          {loading ? 'Comparing...' : 'Compare Players'}
        </button>
      </div>

      {comparisonData && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Comparison Results</h2>
          <div className="h-96">
            <Radar
              data={{
                labels: Object.keys(comparisonData.metrics.avg_runs),
                datasets: Object.entries(comparisonData.metrics).map(([metric, values]) => ({
                  label: metric.replace(/_/g, ' '),
                  data: Object.values(values as any),
                  backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
                  borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
                  borderWidth: 1
                }))
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  r: {
                    angleLines: { display: true },
                    suggestedMin: 0
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

export default PlayerComparisonPage;    