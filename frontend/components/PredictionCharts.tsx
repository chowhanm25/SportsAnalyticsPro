"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Users, TrendingUp, Award, CloudRain, MapPin, ArrowLeft, Search, Filter, Heart, Star, CheckCircle 
} from 'lucide-react';

type PredictionCriteriaType = {
  weather: string;
  venue: string;
  matchType: string;
  team?: string;
  sport: 'cricket' | 'football';
};

type Player = {
  Name: string;
  Format: string;
  VenuePerformance?: { [venue: string]: number };
  WeatherPreference?: string;
  Team?: string;
  predictionScore?: number;
  Goals?: number;
  Matches?: number;
  Fitness?: number;
  Strength?: number;
  Acceleration?: number;
  Assists?: number;
  Sport: 'cricket' | 'football';
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

type ChartData = {
  name: string;
  value: number;
  players?: string[];
  fullName?: string;
};

const safeNumber = (value: any): number => {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};

const PredictionCharts: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [criteria, setCriteria] = useState<PredictionCriteriaType>({
    weather: 'sunny',
    venue: "Lord's",
    matchType: 'Test',
    team: 'all',
    sport: 'cricket'
  });
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formatData, setFormatData] = useState<ChartData[]>([]);
  const [weatherData, setWeatherData] = useState<ChartData[]>([]);
  const [venueData, setVenueData] = useState<ChartData[]>([]);
  const [teamComparisonData, setTeamComparisonData] = useState<any[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('goals');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [displayCount, setDisplayCount] = useState(3);

  // Filter players by current sport
  const currentSportPlayers = players.filter(player => player.Sport === criteria.sport);

  // Stats calculations based on current sport
  const totalGoals = currentSportPlayers.reduce((sum, player) => sum + safeNumber(player.Goals), 0);
  const totalPlayers = currentSportPlayers.length;
  const avgFitness = currentSportPlayers.length > 0 
    ? currentSportPlayers.reduce((sum, player) => sum + safeNumber(player.Fitness), 0) / currentSportPlayers.length 
    : 0;

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const cricketResponse = await fetch('http://localhost:8000/cricket/players/all');
        const footballResponse = await fetch('http://localhost:8000/football/players/all');
        const cricketData = await cricketResponse.json();
        const footballData = await footballResponse.json();
        let cricketPlayers: any[] = [];
        let footballPlayers: any[] = [];
        
        // Process cricket players
        if (Array.isArray(cricketData)) {
          cricketPlayers = cricketData;
        } else if (cricketData.data && Array.isArray(cricketData.data)) {
          cricketPlayers = cricketData.data;
        } else if (cricketData.players && Array.isArray(cricketData.players)) {
          cricketPlayers = cricketData.players;
        } else if (cricketData.results && Array.isArray(cricketData.results)) {
          cricketPlayers = cricketData.results;
        }

        // Process football players
        if (Array.isArray(footballData)) {
          footballPlayers = footballData;
        } else if (footballData.data && Array.isArray(footballData.data)) {
          footballPlayers = footballData.data;
        } else if (footballData.players && Array.isArray(footballData.players)) {
          footballPlayers = footballData.players;
        } else if (footballData.results && Array.isArray(footballData.results)) {
          footballPlayers = footballData.results;
        }

        // Normalize cricket players
        const normalizedCricketPlayers = cricketPlayers.map((player: any) => ({
          Name: player.NAME || `${player.FIRST || ''} ${player.LAST || ''}`.trim() || 'Unknown Player',
          Team: player.TEAM || 'Unknown Team',
          Format: player.FORMAT || 'Test',
          WeatherPreference: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)],
          VenuePerformance: {
            'Lord\'s': Math.random() * 100,
            'Eden Gardens': Math.random() * 100,
            'MCG': Math.random() * 100,
            'The Oval': Math.random() * 100,
            'Wankhede Stadium': Math.random() * 100,
            'Newlands': Math.random() * 100,
          },
          Goals: safeNumber(player.GOALS),
          Matches: safeNumber(player.MATCHESPLAYED),
          Fitness: safeNumber(player.FITNESS),
          Strength: safeNumber(player.STRENGTH),
          Acceleration: safeNumber(player.ACCELERATION),
          Assists: safeNumber(player.ASSISTS),
          Sport: 'cricket'
        }));

        // Normalize football players
        const normalizedFootballPlayers = footballPlayers.map((player: any) => ({
          Name: player.NAME || `${player.FIRST || ''} ${player.LAST || ''}`.trim() || 'Unknown Player',
          Team: player.TEAM || 'Unknown Team',
          Format: 'N/A', // Football doesn't have formats
          WeatherPreference: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)],
          VenuePerformance: {
            'Wembley': Math.random() * 100,
            'Camp Nou': Math.random() * 100,
            'San Siro': Math.random() * 100,
            'Allianz Arena': Math.random() * 100,
            'Maracanã': Math.random() * 100,
          },
          Goals: safeNumber(player.GOALS),
          Matches: safeNumber(player.MATCHESPLAYED),
          Fitness: safeNumber(player.FITNESS),
          Strength: safeNumber(player.STRENGTH),
          Acceleration: safeNumber(player.ACCELERATION),
          Assists: safeNumber(player.ASSISTS),
          Sport: 'football'
        }));

        const allPlayers = [...normalizedCricketPlayers, ...normalizedFootballPlayers];
        const uniqueTeams = [...new Set(allPlayers.map(p => p.Team).filter(Boolean))] as string[];
        
        setTeams(uniqueTeams);
        setPlayers(allPlayers);
        setFilteredPlayers(allPlayers);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  useEffect(() => {
    if (players.length === 0) return;

    let filtered = players.filter(player => {
      const name = (player.Name || '').toLowerCase();
      const team = (player.Team || '').toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      return name.includes(searchLower) || team.includes(searchLower);
    });

    // Filter by sport
    filtered = filtered.filter(player => player.Sport === criteria.sport);

    if (selectedTeam !== 'all') {
      filtered = filtered.filter(player => player.Team === selectedTeam);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'goals':
          return safeNumber(b.Goals) - safeNumber(a.Goals);
        case 'name':
          return (a.Name || '').localeCompare(b.Name || '');
        case 'fitness':
          return safeNumber(b.Fitness) - safeNumber(a.Fitness);
        default:
          return 0;
      }
    });

    setFilteredPlayers(filtered);
  }, [players, searchTerm, sortBy, selectedTeam, criteria.sport]);

  useEffect(() => {
    if (players.length === 0) return;

    let filteredPlayers = players.filter(p => p.Sport === criteria.sport);
    if (criteria.team && criteria.team !== 'all') {
      filteredPlayers = filteredPlayers.filter(p => p.Team === criteria.team);
    }

    // Prepare format data (only for cricket)
    if (criteria.sport === 'cricket') {
      const formats = ['Test', 'ODI', 'T20'];
      const formatChartData = formats.map(format => {
        const formatPlayers = filteredPlayers.filter(p => p.Format === format);
        const avgScore = formatPlayers.reduce((sum, player) => {
          const venueScore = player.VenuePerformance?.[criteria.venue] || 50;
          return sum + (venueScore / 100) * 50 + (player.WeatherPreference === criteria.weather ? 30 : 0);
        }, 0) / (formatPlayers.length || 1);
        
        return {
          name: format,
          value: parseFloat(avgScore.toFixed(2)),
          players: formatPlayers.slice(0, 3).map(p => p.Name || 'Unknown')
        };
      });
      setFormatData(formatChartData);
    } else {
      setFormatData([]);
    }

    // Prepare weather data
    const weatherTypes = ['sunny', 'cloudy', 'rainy'];
    const weatherChartData = weatherTypes.map(weather => {
      const weatherPlayers = filteredPlayers.filter(p => p.WeatherPreference === weather);
      const avgScore = weatherPlayers.reduce((sum, player) => {
        const venueScore = player.VenuePerformance?.[criteria.venue] || 50;
        return sum + (venueScore / 100) * 50 + (player.Format === criteria.matchType ? 20 : 0);
      }, 0) / (weatherPlayers.length || 1);
      
      return {
        name: weather.charAt(0).toUpperCase() + weather.slice(1),
        value: parseFloat(avgScore.toFixed(2)),
        players: weatherPlayers.slice(0, 3).map(p => p.Name || 'Unknown')
      };
    });
    setWeatherData(weatherChartData);

    // Prepare venue data
    const venues = criteria.sport === 'cricket' ? [
      'Lord\'s', 'Eden Gardens', 'MCG', 'The Oval', 
      'Wankhede Stadium', 'Newlands'
    ] : [
      'Wembley', 'Camp Nou', 'San Siro', 'Allianz Arena', 'Maracanã'
    ];
    
    const venueChartData = venues.map(venue => {
      const avgScore = filteredPlayers.reduce((sum, player) => {
        const venueScore = player.VenuePerformance?.[venue] || 50;
        return sum + (venueScore / 100) * 50 + 
               (player.WeatherPreference === criteria.weather ? 20 : 0) +
               (player.Format === criteria.matchType ? 30 : 0);
      }, 0) / filteredPlayers.length;
      
      return {
        name: venue.split(' ')[0],
        value: parseFloat(avgScore.toFixed(2)),
        fullName: venue
      };
    }).slice(0, 5);
    setVenueData(venueChartData);

    // Prepare team comparison data
    const teamChartData = teams.map(team => {
      const teamPlayers = players.filter(p => p.Team === team && p.Sport === criteria.sport);
      const avgScore = teamPlayers.reduce((sum, player) => {
        const venueScore = player.VenuePerformance?.[criteria.venue] || 50;
        return sum + (venueScore / 100) * 40 + 
               (player.WeatherPreference === criteria.weather ? 30 : 0) +
               (player.Format === criteria.matchType ? 30 : 0);
      }, 0) / (teamPlayers.length || 1);
      
      return {
        name: team,
        score: parseFloat(avgScore.toFixed(2)),
        players: teamPlayers.length
      };
    }).sort((a, b) => b.score - a.score).slice(0, 5);
    setTeamComparisonData(teamChartData);
  }, [players, criteria, teams]);

  // ... (keep the rest of the component the same until the Criteria Controls section)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => router.back()}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  {criteria.sport === 'cricket' ? 'Cricket' : 'Football'} Prediction Analytics
                </h1>
                <p className="text-xs md:text-sm text-gray-600">Visual insights on player performance predictions</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs md:text-sm text-gray-500">Total Players</p>
              <p className="text-lg md:text-xl font-bold text-blue-600">{currentSportPlayers.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ... (keep the Stats Overview section the same) ... */}

      {/* Criteria Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Prediction Criteria</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Sport Selection */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3 mb-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <h3 className="font-medium text-gray-800">Sport</h3>
            </div>
            <select
              value={criteria.sport}
              onChange={(e) => setCriteria(prev => ({ ...prev, sport: e.target.value as 'cricket' | 'football' }))}
              className="w-full px-4 py-2 border text-gray-800 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="cricket">Cricket</option>
              <option value="football">Football</option>
            </select>
          </div>

          {/* Weather Selection */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3 mb-2">
              <CloudRain className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-gray-800">Weather Condition</h3>
            </div>
            <select
              value={criteria.weather}
              onChange={(e) => setCriteria(prev => ({ ...prev, weather: e.target.value }))}
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
              value={criteria.venue}
              onChange={(e) => setCriteria(prev => ({ ...prev, venue: e.target.value }))}
              className="w-full px-4 py-2 border text-gray-800 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {criteria.sport === 'cricket' ? (
                <>
                  <option value="Lord's">Lord's (England)</option>
                  <option value="Eden Gardens">Eden Gardens (India)</option>
                  <option value="MCG">MCG (Australia)</option>
                  <option value="The Oval">The Oval (England)</option>
                  <option value="Wankhede Stadium">Wankhede Stadium (India)</option>
                  <option value="Newlands">Newlands (South Africa)</option>
                </>
              ) : (
                <>
                  <option value="Wembley">Wembley (England)</option>
                  <option value="Camp Nou">Camp Nou (Spain)</option>
                  <option value="San Siro">San Siro (Italy)</option>
                  <option value="Allianz Arena">Allianz Arena (Germany)</option>
                  <option value="Maracanã">Maracanã (Brazil)</option>
                </>
              )}
            </select>
          </div>

          {/* Match Type Selection - Only for cricket */}
          {criteria.sport === 'cricket' && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3 mb-2">
                <Award className="w-5 h-5 text-purple-600" />
                <h3 className="font-medium text-gray-800">Match Format</h3>
              </div>
              <select
                value={criteria.matchType}
                onChange={(e) => setCriteria(prev => ({ ...prev, matchType: e.target.value }))}
                className="w-full px-4 py-2 border text-gray-800 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="Test">Test</option>
                <option value="ODI">ODI</option>
                <option value="T20">T20</option>
              </select>
            </div>
          )}

          {/* Team Selection */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3 mb-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <h3 className="font-medium text-gray-800">Team</h3>
            </div>
            <select
              value={criteria.team}
              onChange={(e) => setCriteria(prev => ({ ...prev, team: e.target.value }))}
              className="w-full px-4 py-2 border text-gray-800 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Teams</option>
              {teams.map((team, index) => (
                <option key={`${team}-${index}`} value={team}>{team}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Performance by Format - Only for cricket */}
        {criteria.sport === 'cricket' && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Performance by Match Format</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formatData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Avg Score', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                            <p className="font-bold">{payload[0].payload.name}</p>
                            <p className="text-sm">Score: {payload[0].value}</p>
                            <p className="text-xs mt-2 text-gray-600">
                              Top players: {payload[0].payload.players?.join(', ')}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" fill="#8884d8" name="Prediction Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Weather Preference Impact */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Weather Preference Impact</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={weatherData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {weatherData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                 ) )}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-bold">{payload[0].payload.name}</p>
                          <p className="text-sm">Score: {payload[0].value}</p>
                          <p className="text-xs mt-2 text-gray-600">
                            Top players: {payload[0].payload.players?.join(', ')}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Venue Performance */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Venue Performance Comparison</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={venueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Avg Score', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-bold">{payload[0].payload.fullName}</p>
                          <p className="text-sm">Score: {payload[0].value}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                  name="Prediction Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Teams by Prediction Score</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Avg Score', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-bold">{payload[0].payload.name}</p>
                          <p className="text-sm">Score: {payload[0].value}</p>
                          <p className="text-xs mt-2 text-gray-600">
                            Players analyzed: {payload[0].payload.players}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="score" fill="#82ca9d" name="Team Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Goals Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Goals Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredPlayers.slice(0, 5).map(player => ({
                name: player.Name?.split(' ')[0] || 'Player',
                goals: safeNumber(player.Goals),
                assists: safeNumber(player.Assists)
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="goals" fill="#8884d8" name="Goals" />
                <Bar dataKey="assists" fill="#82ca9d" name="Assists" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fitness vs Strength */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Fitness vs Strength</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredPlayers.slice(0, 5).map(player => ({
                name: player.Name?.split(' ')[0] || 'Player',
                fitness: safeNumber(player.Fitness),
                strength: safeNumber(player.Strength)
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="fitness" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="strength" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white shadow-lg border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">
                © {new Date().getFullYear()} Sports Prediction Pro. All Rights Reserved.
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
};

export default PredictionCharts;