// app/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Users, TrendingUp, Award, Filter, CloudRain, MapPin, Heart, Star, CheckCircle } from 'lucide-react';
import LiveMatches from '@/components/LiveMatches';
import FitnessAlerts from '@/components/FitnessAlerts';

// Define the Player type
interface Player {
  id: number;
  Name: string;
  Team: string;
  Runs: number;
  MedicalScore: number;
  // Add other fields as needed based on your API response
}

// Define the PredictionCriteria type
interface PredictionCriteria {
  weather: string;
  venue: string;
  matchType: string;
  team: string;
}

// ... (keep all your existing types and utility functions)

// Utility function to normalize player data
function normalizePlayer(player: any): Player {
  return {
    id: player.id ?? 0,
    Name: player.Name ?? '',
    Team: player.Team ?? '',
    Runs: player.Runs ?? 0,
    MedicalScore: player.MedicalScore ?? 0,
    // Add other fields as needed
  };
}

export default function Dashboard() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('runs');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [displayCount, setDisplayCount] = useState(3);
  const [showPrediction, setShowPrediction] = useState(false);
  const [predictionCriteria, setPredictionCriteria] = useState<PredictionCriteria>({
    weather: 'sunny',
    venue: 'Lord\'s',
    matchType: 'Test',
    team: 'all'
  });
  const [predictedTeam, setPredictedTeam] = useState<Player[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [liveMatches, setLiveMatches] = useState<any[]>([]);
  const [fitnessAlerts, setFitnessAlerts] = useState<Player[]>([]);

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch players
        const playersRes = await fetch('http://localhost:8000/players/all');
        const playersData = await playersRes.json();
        const normalizedPlayers = playersData.data.map(normalizePlayer);
        setPlayers(normalizedPlayers);
        setFilteredPlayers(normalizedPlayers);
        setTeams([...new Set(normalizedPlayers.map((p: Player) => p.Team).filter(Boolean))] as string[]);

        // Fetch live matches
        const matchesRes = await fetch('http://localhost:8000/matches/live');
        const matchesData = await matchesRes.json();
        setLiveMatches(matchesData.matches || []);

        // Fetch fitness alerts
        const alertsRes = await fetch('http://localhost:8000/players/fitness-alerts?threshold=80');
        const alertsData = await alertsRes.json();
        setFitnessAlerts(alertsData.data || []);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ... (keep all your existing useEffect hooks and filter logic)

  // Update Stats Overview section to include new components
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header remains the same */}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview - Updated with new components */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={Users}  
            label="Total Players" 
            value={players.length} 
            color="#3B82F6" 
          />
          <StatCard 
            icon={TrendingUp} 
            label="Total Runs" 
            value={players.reduce((sum, p) => sum + safeNumber(p.Runs), 0).toLocaleString()} 
            color="#10B981" 
          />
          <StatCard 
            icon={Award} 
            label="Teams" 
            value={teams.length} 
            color="#F59E0B" 
          />
          <StatCard 
            icon={Heart} 
            label="Avg Fitness" 
            value={(players.reduce((sum, p) => sum + safeNumber(p.MedicalScore), 0) / players.length || 0).toFixed(1)} 
            color="#EF4444" 
          />
        </div>

        {/* New Components Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <LiveMatches matches={liveMatches} />
          <FitnessAlerts alerts={fitnessAlerts} />
        </div>

        {/* Rest of your existing dashboard content */}
        {/* ... (keep all your existing Team Prediction, Filters, and Players sections) */}
      </div>
    </div>
  );
}

// ... (keep all your existing sub-components like PlayerCard, StatCard)