// components/LiveMatches.tsx
import React from 'react';
import { Activity } from 'lucide-react';

interface Match {
  team1: string;
  team2: string;
  score: string;
  status: string;
}

const LiveMatches = ({ matches }: { matches: Match[] }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 h-full">
      <div className="flex items-center space-x-3 mb-4">
        <Activity className="w-6 h-6 text-red-500" />
        <h2 className="text-xl font-bold text-gray-900">Live Matches</h2>
      </div>
      
      {matches.length > 0 ? (
        <div className="space-y-3">
          {matches.map((match, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{match.team1} vs {match.team2}</p>
                  <p className="text-sm text-gray-600">{match.score}</p>
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                  {match.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          No live matches currently
        </div>
      )}
    </div>
  );
};

export default LiveMatches;