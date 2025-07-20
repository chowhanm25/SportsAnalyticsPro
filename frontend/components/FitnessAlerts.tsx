// components/FitnessAlerts.tsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';
// Define the Player type locally
type Player = {
  Name: string;
  Team: string;
  MedicalScore: number;
};

const FitnessAlerts = ({ alerts }: { alerts: Player[] }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 h-full">
      <div className="flex items-center space-x-3 mb-4">
        <AlertTriangle className="w-6 h-6 text-yellow-500" />
        <h2 className="text-xl font-bold text-gray-900">Fitness Alerts</h2>
      </div>
      
      {alerts.length > 0 ? (
        <div className="space-y-3">
          {alerts.slice(0, 5).map((player, index) => (
            <div key={index} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{player.Name}</p>
                  <p className="text-sm text-gray-600">{player.Team}</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Fitness: {player.MedicalScore}
                </span>
              </div>
            </div>
          ))}
          {alerts.length > 5 && (
            <p className="text-sm text-gray-500 mt-2">
              +{alerts.length - 5} more alerts...
            </p>
          )}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          No fitness alerts currently
        </div>
      )}
    </div>
  );
};

export default FitnessAlerts;