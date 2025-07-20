"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Users, TrendingUp, Award, Filter, CloudRain, MapPin, Heart, Star, CheckCircle } from 'lucide-react';

type Player = {
  No?: number;
  Name?: string;
  Team?: string;
  Runs?: number;
  Avg?: number;
  Matches?: number;
  StrikeRate?: number;
  Format?: string;
  Gender?: string;
  HighScore?: number;
  Fifties?: number;
  Hundreds?: number;
  Balls?: number;
  Wickets?: number;
  BestBowling?: string;
  BowlingAvg?: number;
  FiveWickets?: number;
  Catches?: number;
  Stumpings?: number;
  MedicalScore?: number;
  WeatherPreference?: string;
  VenuePerformance?: { [key: string]: number };
  predictionScore?: number;
  [key: string]: any;
};

type PredictionCriteria = {
  weather: string;
  venue: string;
  matchType: string;
  team?: string;
};

const safeNumber = (value: any): number => {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};

const normalizePlayer = (player: any): Player => {
  const runs = safeNumber(player.RUNS);
  const balls = safeNumber(player.BALLS);
  const strikeRate = balls > 0 ? (runs / balls) * 100 : 0;

  return {
    No: safeNumber(player.NO),
    Name: player.NAME || `${player.FIRST || ''} ${player.LAST || ''}`.trim() || 'Unknown Player',
    Team: player.TEAM || 'Unknown Team',
    Runs: runs,
    Avg: safeNumber(player.AVG),
    Matches: safeNumber(player.MAT),
    StrikeRate: strikeRate,
    Format: player.FORMAT,
    Gender: player.GENDER,
    HighScore: safeNumber(player.HS),
    Fifties: safeNumber(player.FIFTYS),
    Hundreds: safeNumber(player.HUNDREDS),
    Balls: balls,
    Wickets: safeNumber(player.WKT),
    BestBowling: player.BBI,
    BowlingAvg: safeNumber(player.AVE),
    FiveWickets: safeNumber(player.FIVEWICKET),
    Catches: safeNumber(player.CA),
    Stumpings: safeNumber(player.ST),
    MedicalScore: Math.floor(Math.random() * 100) + 50,
    WeatherPreference: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)],
    VenuePerformance: {
      'Lord\'s': Math.random() * 100,
      'Eden Gardens': Math.random() * 100,
      'MCG': Math.random() * 100,
      'The Oval': Math.random() * 100,
      'Wankhede Stadium': Math.random() * 100,
      'Newlands': Math.random() * 100,
    }
  };
};

const predictBestTeam = (players: Player[], criteria: PredictionCriteria): Player[] => {
  let filteredPlayers = players;
  if (criteria.team && criteria.team !== 'all') {
    filteredPlayers = players.filter(player => player.Team === criteria.team);
  }

  const scoredPlayers = filteredPlayers.map(player => {
    let score = 0;
    
    const perfScore = (safeNumber(player.Runs) / 1000) * 20 + 
                     (safeNumber(player.Wickets) / 10) * 10 + 
                     (safeNumber(player.Catches) / 20) * 10;
    score += perfScore * 0.4;
    
    score += (safeNumber(player.MedicalScore) / 150) * 30;
    
    if (player.WeatherPreference === criteria.weather) {
      score += 20;
    }
    
    const venueScore = player.VenuePerformance?.[criteria.venue] || 50;
    score += (venueScore / 100) * 10;
    
    return { ...player, predictionScore: score };
  });
  
  return scoredPlayers
    .sort((a, b) => (b.predictionScore || 0) - (a.predictionScore || 0))
    .slice(0, 11);
};

const PlayerCard = ({ player, isPredicted = false }: { player: Player; isPredicted?: boolean }) => {
  const [showPredictionForm, setShowPredictionForm] = useState(false);
  const [playerPredictionCriteria, setPlayerPredictionCriteria] = useState({
    weather: 'sunny',
    venue: 'Lord\'s',
    matchType: 'Test'
  });
  const [predictionResult, setPredictionResult] = useState<number | null>(null);

  const calculatePrediction = () => {
    let score = 0;
    
    // Performance score (40% weight)
    const perfScore = (safeNumber(player.Runs) / 1000) * 20 + 
                     (safeNumber(player.Wickets) / 10) * 10 + 
                     (safeNumber(player.Catches) / 20) * 10;
    score += perfScore * 0.4;
    
    // Medical fitness score (30% weight)
    score += (safeNumber(player.MedicalScore) / 150) * 30;
    
    // Weather preference match (20% weight)
    if (player.WeatherPreference === playerPredictionCriteria.weather) {
      score += 20;
    }
    
    // Venue performance (10% weight)
    const venueScore = player.VenuePerformance?.[playerPredictionCriteria.venue] || 50;
    score += (venueScore / 100) * 10;
    
    setPredictionResult(parseFloat(score.toFixed(1)));
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border overflow-hidden group ${isPredicted ? 'border-green-300 bg-green-50' : 'border-gray-100'}`}>
      <div className={`h-2 ${isPredicted ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-blue-500 to-purple-600'}`}></div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                {player.Name || 'Unknown Player'}
              </h3>
              {isPredicted && <CheckCircle className="w-5 h-5 text-green-600" />}
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              <p className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {player.Team || 'Unknown Team'}
              </p>
              {player.Format && (
                <p className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                  {player.Format}
                </p>
              )}
              {(isPredicted || predictionResult !== null) && (
                <p className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Predicted: {predictionResult || ((player as any).predictionScore || 0).toFixed(1)}
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isPredicted ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-blue-500 to-purple-600'}`}>
              <span className="text-white font-bold text-sm">#{safeNumber(player.No) || '?'}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 text-center hover:bg-blue-50 transition-colors duration-200">
            <p className="text-2xl font-bold text-gray-900">
              {safeNumber(player.Runs).toLocaleString()}
            </p>
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Runs</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center hover:bg-purple-50 transition-colors duration-200">
            <p className="text-2xl font-bold text-gray-900">{safeNumber(player.Matches)}</p>
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Matches</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center hover:bg-green-50 transition-colors duration-200">
            <p className="text-2xl font-bold text-gray-900">{safeNumber(player.MedicalScore)}</p>
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Fitness</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center hover:bg-yellow-50 transition-colors duration-200">
            <p className="text-lg font-bold text-gray-900 capitalize">{player.WeatherPreference}</p>
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Weather</p>
          </div>
          {safeNumber(player.HighScore) > 0 && (
            <div className="bg-gray-50 rounded-lg p-3 text-center hover:bg-orange-50 transition-colors duration-200">
              <p className="text-lg font-bold text-gray-900">{safeNumber(player.HighScore)}</p>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">High Score</p>
            </div>
          )}
          {(safeNumber(player.Fifties) > 0 || safeNumber(player.Hundreds) > 0) && (
            <div className="bg-gray-50 rounded-lg p-3 text-center hover:bg-red-50 transition-colors duration-200">
              <p className="text-lg font-bold text-gray-900">
                {safeNumber(player.Hundreds)},{safeNumber(player.Fifties)}
              </p>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">100s/50s</p>
            </div>
          )}
        </div>

        {/* Prediction Button and Form */}
        <div className="mt-4">
          <button
            onClick={() => setShowPredictionForm(!showPredictionForm)}
            className="w-full py-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-lg hover:from-indigo-600 hover:to-blue-700 transition-colors duration-200"
          >
            {showPredictionForm ? 'Hide Prediction' : 'Generate Prediction'}
          </button>

          {showPredictionForm && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-800 mb-3">Prediction Criteria</h4>
              
              <div className="grid grid-cols-1 gap-3">
                {/* Weather Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weather</label>
                  <select
                    value={playerPredictionCriteria.weather}
                    onChange={(e) => setPlayerPredictionCriteria(prev => ({ ...prev, weather: e.target.value }))}
                    className="w-full px-3 py-2 border text-gray-800 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                  >
                    <option value="sunny">Sunny</option>
                    <option value="cloudy">Cloudy</option>
                    <option value="rainy">Rainy</option>
                  </select>
                </div>

                {/* Venue Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                  <select
                    value={playerPredictionCriteria.venue}
                    onChange={(e) => setPlayerPredictionCriteria(prev => ({ ...prev, venue: e.target.value }))}
                    className="w-full px-3 py-2 border text-gray-800 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                  >
                    <option value="Lord's">Lord's (England)</option>
                    <option value="Eden Gardens">Eden Gardens (India)</option>
                    <option value="MCG">MCG (Australia)</option>
                    <option value="The Oval">The Oval (England)</option>
                    <option value="Wankhede Stadium">Wankhede Stadium (India)</option>
                    <option value="Newlands">Newlands (South Africa)</option>
                  </select>
                </div>

                {/* Match Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                  <select
                    value={playerPredictionCriteria.matchType}
                    onChange={(e) => setPlayerPredictionCriteria(prev => ({ ...prev, matchType: e.target.value }))}
                    className="w-full px-3 py-2 border text-gray-800 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                  >
                    <option value="Test">Test</option>
                    <option value="ODI">ODI</option>
                    <option value="T20">T20</option>
                  </select>
                </div>
              </div>

              <button
                onClick={calculatePrediction}
                className="mt-3 w-full py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-colors duration-200"
              >
                Calculate Prediction
              </button>

              {predictionResult !== null && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">
                    Prediction Score: <span className="font-bold">{predictionResult}</span>
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Based on current form, venue history, and weather preference
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  value: string | number;
  color: string;
}) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ borderLeftColor: color }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="p-3 rounded-full" style={{ backgroundColor: `${color}15` }}>
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
    </div>
  </div>
);

interface DashboardProps {
  onSwitchDashboard?: () => void;
}

export default function Dashboard({ onSwitchDashboard }: DashboardProps) {
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

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        console.log("🏏 Starting to fetch players...");
        setLoading(true);
        setError('');
        
        const response = await fetch('http://localhost:8000/cricket/players/all');
        console.log("📡 Response status:", response.status);
        console.log("📡 Response OK:", response.ok);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        
        const rawData = await response.json();
        
        console.log("🔍 Full API Response:", rawData);
        console.log("🔍 Response type:", typeof rawData);
        console.log("🔍 Is array?", Array.isArray(rawData));
        
        let playersData: any[] = [];
        
        if (Array.isArray(rawData)) {
          playersData = rawData;
          console.log("✅ Using direct array response");
        } else if (rawData.data && Array.isArray(rawData.data)) {
          playersData = rawData.data;
          console.log("✅ Using data.data array");
        } else if (rawData.players && Array.isArray(rawData.players)) {
          playersData = rawData.players;
          console.log("✅ Using data.players array");
        } else if (rawData.results && Array.isArray(rawData.results)) {
          playersData = rawData.results;
          console.log("✅ Using data.results array");
        } else {
          console.error("❌ Unexpected data structure:", rawData);
          throw new Error(`Invalid data structure from API. Expected array but got: ${typeof rawData}`);
        }
        
        if (playersData.length === 0) {
          console.warn("⚠️ No players found in response");
        }
        
        console.log("👥 Total players found:", playersData.length);
        console.log("👤 First player raw:", playersData[0]);
        
        if (playersData.length > 0) {
          console.log("🔑 Available keys in first player:", Object.keys(playersData[0]));
        }
        
        const normalizedPlayers = playersData.map(normalizePlayer);
        console.log("👤 First player normalized:", normalizedPlayers[0]);
        
        const uniqueTeams = [...new Set(normalizedPlayers.map(p => p.Team).filter(Boolean))] as string[];
        setTeams(uniqueTeams);
        
        const uniquePlayers = normalizedPlayers.filter(
          (player, index, self) => 
            index === self.findIndex(p => 
              p.No === player.No && 
              p.Name === player.Name
            )
        );
        
        setPlayers(uniquePlayers);
        setFilteredPlayers(uniquePlayers);
        
      } catch (err) {
        console.error("❌ Fetch error:", err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  useEffect(() => {
    let filtered = players.filter(player => {
      const name = (player.Name || '').toLowerCase();
      const team = (player.Team || '').toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      return name.includes(searchLower) || team.includes(searchLower);
    });

    if (selectedTeam !== 'all') {
      filtered = filtered.filter(player => player.Team === selectedTeam);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'runs':
          return safeNumber(b.Runs) - safeNumber(a.Runs);
        case 'name':
          return (a.Name || '').localeCompare(b.Name || '');
        case 'medical':
          return safeNumber(b.MedicalScore) - safeNumber(a.MedicalScore);
        default:
          return 0;
      }
    });

    setFilteredPlayers(filtered);
  }, [players, searchTerm, sortBy, selectedTeam]);

  useEffect(() => {
    if (showPrediction && players.length > 0) {
      const predicted = predictBestTeam(players, predictionCriteria);
      setPredictedTeam(predicted);
    }
  }, [showPrediction, predictionCriteria, players]);

  const totalRuns = players.reduce((sum, player) => sum + safeNumber(player.Runs), 0);
  const totalPlayers = players.length;
  const avgFitness = players.length > 0 
    ? players.reduce((sum, player) => sum + safeNumber(player.MedicalScore), 0) / players.length 
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-ping border-t-blue-400 mx-auto"></div>
          </div>
          <p className="text-xl font-semibold text-gray-700">Loading Cricket Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
<div className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Cricket Dashboard</h1>
            <p className="text-xs md:text-sm text-gray-600">Smart team predictions and player analytics</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {onSwitchDashboard && (
            <button
              onClick={onSwitchDashboard}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-colors duration-200"
            >
              Switch to Football
            </button>
          )}
          <div className="text-right">
            <p className="text-xs md:text-sm text-gray-500">Total Players</p>
            <p className="text-lg md:text-xl font-bold text-blue-600">{totalPlayers}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={Users} 
            label="Total Players" 
            value={totalPlayers} 
            color="#3B82F6" 
          />
          <StatCard 
            icon={TrendingUp} 
            label="Total Runs" 
            value={totalRuns.toLocaleString()} 
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
            value={avgFitness.toFixed(1)} 
            color="#EF4444" 
          />
        </div>

        {/* Team Prediction Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Smart Team Prediction</h2>
            </div>
            <div className="flex">
              <button
                onClick={() => setShowPrediction(!showPrediction)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {showPrediction ? 'Hide Prediction' : 'Generate Team'}
              </button>
              <button
                onClick={() => router.push('/prediction-charts')}
                className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-indigo-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg ml-4"
              >
                View Prediction Analytics
              </button>
            </div>
          </div>
          
          {/* Prediction Criteria Controls */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Weather Selection */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                  <CloudRain className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-gray-800">Weather Condition</h3>
                </div>
                <select
                  value={predictionCriteria.weather}
                  onChange={(e) => setPredictionCriteria(prev => ({ ...prev, weather: e.target.value }))}
                  className="w-full px-4 py-2 border text-gray-800 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="sunny">Sunny</option>
                  <option value="cloudy">Cloudy</option>
                  <option value="rainy">Rainy</option>
                </select>
              </div>

              {/* Venue Selection */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <h3 className="font-medium text-gray-800">Venue</h3>
                </div>
                <select
                  value={predictionCriteria.venue}
                  onChange={(e) => setPredictionCriteria(prev => ({ ...prev, venue: e.target.value }))}
                  className="w-full px-4 py-2 border text-gray-800 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="Lord's">Lord's (England)</option>
                  <option value="Eden Gardens">Eden Gardens (India)</option>
                  <option value="MCG">MCG (Australia)</option>
                  <option value="The Oval">The Oval (England)</option>
                  <option value="Wankhede Stadium">Wankhede Stadium (India)</option>
                  <option value="Newlands">Newlands (South Africa)</option>
                </select>
              </div>

              {/* Match Type Selection */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  <h3 className="font-medium text-gray-800">Match Format</h3>
                </div>
                <select
                  value={predictionCriteria.matchType}
                  onChange={(e) => setPredictionCriteria(prev => ({ ...prev, matchType: e.target.value }))}
                  className="w-full px-4 py-2 border text-gray-800 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="Test">Test</option>
                  <option value="ODI">ODI</option>
                  <option value="T20">T20</option>
                </select>
              </div>

              {/* Team Selection */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-medium text-gray-800">Team</h3>
                </div>
                <select
                  value={predictionCriteria.team}
                  onChange={(e) => setPredictionCriteria(prev => ({ ...prev, team: e.target.value }))}
                  className="w-full px-4 py-2 border text-gray-800 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Teams</option>
                  {teams.map((team, index) => (
                    <option key={`${team}-${index}`} value={team}>{team}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Prediction Results */}
            {showPrediction && predictedTeam.length > 0 && (
              <div className="bg-green-50 border-l-4 border-green-500 rounded-r-lg p-4 mt-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-green-800 mb-1">
                      {predictionCriteria.team === 'all' 
                        ? 'Recommended Team' 
                        : `Recommended ${predictionCriteria.team} Team`} 
                      for {predictionCriteria.weather} weather at {predictionCriteria.venue} ({predictionCriteria.matchType})
                    </h3>
                    <p className="text-sm text-green-600">
                      Based on performance, fitness, weather preference, and venue history
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search players or teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border text-gray-800  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black placeholder-gray-500 bg-white"
              />
            </div>
            
            <div className="flex space-x-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="pl-10 pr-8 py-3 border text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
                >
                  <option value="all">All Teams</option>
                  {teams.map((team, index) => (
                    <option key={`${team}-${index}`} value={team} className="text-gray-800" >{team}</option>
                  ))}
                </select>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
              >
                <option value="runs">Sort by Runs</option>
                <option value="medical">Sort by Fitness</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Predicted Team Section */}
        {showPrediction && predictedTeam.length > 0 && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-t-xl">
              <h2 className="text-xl font-bold flex items-center space-x-2">
                <CheckCircle className="w-6 h-6" />
                <span>
                  {predictionCriteria.team === 'all' 
                    ? 'Predicted Best Team (Top 11)' 
                    : `Predicted ${predictionCriteria.team} Team (Top 11)`}
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-b-xl">
              {predictedTeam.map((player, index) => (
                <PlayerCard key={`predicted-${player.No}-${index}`} player={player} isPredicted={true} />
              ))}
            </div>
          </div>
        )}

        {/* All Players Grid */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">All Players</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPlayers.slice(0, displayCount).map((player, index) => (
            <PlayerCard key={`player-${player.No}-${index}`} player={player} />
          ))}
        </div>

        {/* Show More Button */}
        {filteredPlayers.length > displayCount && (
          <div className="text-center mt-8">
            <button
              onClick={() => setDisplayCount(prev => prev + 6)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
            >
              Show More Players ({filteredPlayers.length - displayCount} remaining)
            </button>
          </div>
        )}

        {/* Show Less Button */}
        {displayCount > 3 && filteredPlayers.length > 3 && (
          <div className="text-center mt-4">
            <button
              onClick={() => setDisplayCount(3)}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              Show Less
            </button>
          </div>
        )}

        {filteredPlayers.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No players found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>

      {/* Footer */}
<footer className="bg-white shadow-lg border-t border-gray-200">
  <div className="max-w-7xl mx-auto px-4 py-6">
    <div className="flex flex-col md:flex-row justify-between items-center">
      <div className="mb-4 md:mb-0">
        <p className="text-gray-600">
          © {new Date().getFullYear()} Cricket Prediction Pro. All Rights Reserved.
        </p>
      </div>
      <div className="flex space-x-6">
        <button 
          onClick={() => router.push('/privacy')}
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          Privacy Policy
        </button>
        <button 
          onClick={() => router.push('/terms')}
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          Terms of Service
        </button>
        <button 
          onClick={() => router.push('/contact')}
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          Contact Us
        </button>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
}