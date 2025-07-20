"use client";

import React, { useEffect, useState } from 'react';
import { Trophy, Activity, TrendingUp, Users, Star, ChevronRight, Play, Award, Target, BarChart3, Zap, Globe } from 'lucide-react';

interface HomePageProps {
  onSportSelect: (sport: string) => void;
  selectedSport: string | null;
}

const HomePage: React.FC<HomePageProps> = ({ onSportSelect, selectedSport }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-rotate hero slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSportSelection = (sport: string) => {
    setIsLoading(true);
    // Simulate navigation delay
    setTimeout(() => {
      setIsLoading(false);
      onSportSelect(sport);
    }, 1500);
  };

  const heroSlides = [
    {
      title: "Smart Sports Analytics",
      subtitle: "Revolutionizing team selection with AI-powered insights",
      icon: Trophy,
      gradient: "from-blue-600 to-purple-600"
    },
    {
      title: "Performance Predictions",
      subtitle: "Weather, venue, and player form analysis in real-time",
      icon: TrendingUp,
      gradient: "from-green-500 to-emerald-600"
    },
    {
      title: "Data-Driven Decisions",
      subtitle: "Transform your game strategy with comprehensive analytics",
      icon: BarChart3,
      gradient: "from-orange-500 to-red-600"
    }
  ];

  const features = [
    {
      icon: Target,
      title: "Precision Analytics",
      description: "Advanced algorithms analyze player performance, weather conditions, and venue statistics for optimal team selection."
    },
    {
      icon: Zap,
      title: "Real-time Insights",
      description: "Get instant predictions and recommendations based on current conditions and player fitness levels."
    },
    {
      icon: Globe,
      title: "Multi-Sport Support",
      description: "Comprehensive analytics for cricket, football, and more sports with expanding coverage."
    },
    {
      icon: Users,
      title: "Team Optimization",
      description: "Smart team composition suggestions based on opponent analysis and match conditions."
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-transparent rounded-full animate-ping border-t-blue-400 mx-auto"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading {selectedSport} Analytics</h2>
          <p className="text-gray-600">Preparing your personalized dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SportsAnalytics Pro
                </h1>
                <p className="text-sm text-gray-600">Intelligent Sports Management Platform</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <button className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Features
              </button>
              <button className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                About
              </button>
              <button 
                onClick={() => handleSportSelection('Cricket')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Rotating Slides */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            {heroSlides.map((slide, index) => {
              const IconComponent = slide.icon;
              return (
                <div
                  key={index}
                  className={`transition-all duration-1000 ${
                    index === currentSlide ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4 absolute inset-0'
                  }`}
                >
                  <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${slide.gradient} rounded-2xl shadow-lg mb-6`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    {slide.subtitle}
                  </p>
                </div>
              );
            })}
            
            {/* Slide Indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-blue-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sports Selection Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Sport</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select your preferred sport to access advanced analytics, team predictions, and performance insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Cricket Option */}
          <div 
            onClick={() => handleSportSelection('Cricket')}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer overflow-hidden border border-gray-100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                Cricket Analytics
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Comprehensive cricket analysis with player statistics, weather impact predictions, venue performance, and intelligent team selection algorithms.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-3 text-center group-hover:bg-blue-100 transition-colors duration-300">
                  <p className="font-bold text-blue-900">500+</p>
                  <p className="text-xs text-blue-600 uppercase tracking-wide">Players</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center group-hover:bg-blue-100 transition-colors duration-300">
                  <p className="font-bold text-blue-900">15+</p>
                  <p className="text-xs text-blue-600 uppercase tracking-wide">Teams</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Ready to Explore
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          </div>

          {/* Football Option */}
<div 
  onClick={() => handleSportSelection('Football')}
  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer overflow-hidden border border-gray-100"
>
  <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
  <div className="p-8">
    <div className="flex items-center justify-between mb-6">
      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <Activity className="w-8 h-8 text-white" />
      </div>
      <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-300" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-300">
      Football Analytics
    </h3>
    <p className="text-gray-600 mb-6 leading-relaxed">
      Advanced football analytics platform featuring player performance metrics, tactical analysis, formation optimization, and match prediction systems.
    </p>
    
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-green-50 rounded-lg p-3 text-center group-hover:bg-green-100 transition-colors duration-300">
        <p className="font-bold text-green-900">1000+</p>
        <p className="text-xs text-green-600 uppercase tracking-wide">Players</p>
      </div>
      <div className="bg-green-50 rounded-lg p-3 text-center group-hover:bg-green-100 transition-colors duration-300">
        <p className="font-bold text-green-900">50+</p>
        <p className="text-xs text-green-600 uppercase tracking-wide">Teams</p>
      </div>
    </div>

    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
        Ready to Explore
      </span>
      <div className="flex items-center space-x-1">
        <Star className="w-4 h-4 text-yellow-400 fill-current" />
        <Star className="w-4 h-4 text-yellow-400 fill-current" />
        <Star className="w-4 h-4 text-yellow-400 fill-current" />
        <Star className="w-4 h-4 text-yellow-400 fill-current" />
        <Star className="w-4 h-4 text-yellow-400 fill-current" />
      </div>
    </div>
  </div>
  <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cutting-edge technology meets sports intelligence to deliver unparalleled insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300 group-hover:scale-110">
                    <IconComponent className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Award className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Game?</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of coaches and analysts who trust our platform for data-driven sports decisions
          </p>
          <button
            onClick={() => handleSportSelection('Cricket')}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-bold text-lg"
          >
            Start with Cricket Analytics
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">SportsAnalytics Pro</h3>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering sports professionals with intelligent analytics and predictive insights for optimal performance and strategic decision-making.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => handleSportSelection('Cricket')} className="hover:text-white transition-colors">Cricket Analytics</button></li>
                <li><button onClick={() => handleSportSelection('Football')} className="hover:text-white transition-colors">Football (Coming Soon)</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} SportsAnalytics Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;