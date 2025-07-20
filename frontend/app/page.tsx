"use client";

import React, { useState } from 'react';
import HomePage from './home';
import DashboardComponent from '@/components/Dashboard';
import DashboardComponent2 from '@/components/Dashboard2';

const Page = () => {
  const [currentView, setCurrentView] = useState<'home' | 'Dashboard' | 'Dashboard2'>('home');
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  const handleSportSelection = (sport: string) => {
    setSelectedSport(sport);
    if (sport === "Cricket") {
      setCurrentView('Dashboard');
    } else if (sport === "Football") {
      setCurrentView("Dashboard2");
    }
  };

  const handleSwitchDashboard = () => {
    setCurrentView(currentView === 'Dashboard' ? 'Dashboard2' : 'Dashboard');
    setSelectedSport(currentView === 'Dashboard' ? 'Football' : 'Cricket');
  };

  return (
    <div>
      {currentView === 'home' && (
        <HomePage 
          onSportSelect={handleSportSelection} 
          selectedSport={selectedSport}
        />
      )}
      
      {currentView === 'Dashboard' && (
        <DashboardComponent 
          onSwitchDashboard={handleSwitchDashboard}
        />
      )}
      
      {currentView === 'Dashboard2' && (
        <DashboardComponent2 
          onSwitchDashboard={handleSwitchDashboard}
        />
      )}
    </div>
  );
};

export default Page;