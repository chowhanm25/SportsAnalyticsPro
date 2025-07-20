import React from 'react';
import { SignIn } from '@clerk/nextjs';
import { Award, Users, TrendingUp, Star, Shield, Zap, Activity } from 'lucide-react';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Cricket Dashboard</h1>
                <p className="text-gray-600">Smart team predictions and player analytics</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Secure Authentication</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Feature Showcase */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to Cricket Analytics
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Access powerful insights, smart team predictions, and comprehensive player analytics
              </p>
            </div>

            {/* Feature Cards */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-50 rounded-full">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Performance Analytics</h3>
                    <p className="text-gray-600">Deep insights into player statistics and team performance</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-50 rounded-full">
                    <Star className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Smart Predictions</h3>
                    <p className="text-gray-600">AI-powered team selection based on conditions and fitness</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-50 rounded-full">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Player Database</h3>
                    <p className="text-gray-600">Comprehensive database of players with detailed statistics</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-yellow-50 rounded-full">
                    <Activity className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Real-time Updates</h3>
                    <p className="text-gray-600">Live data updates and dynamic filtering capabilities</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Preview */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-4 text-center border border-gray-100">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900">1000+</p>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Players</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-4 text-center border border-gray-100">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900">50K+</p>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Matches</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-4 text-center border border-gray-100">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900">100</p>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Teams</p>
              </div>
            </div>
          </div>

          {/* Right Side - Sign In Form */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-center">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Welcome Back</h3>
                  <p className="text-blue-100">Sign in to access your dashboard</p>
                </div>

                {/* Clerk Sign In Component Container */}
                <div className="p-8">
                  <div className="flex justify-center">
                    <SignIn 
                      path="/sign-in" 
                      routing="path" 
                      signUpUrl="/sign-up"
                      appearance={{
                        elements: {
                          formButtonPrimary: 
                            "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105",
                          card: "shadow-none border-none",
                          headerTitle: "hidden",
                          headerSubtitle: "hidden",
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="text-center mt-6 space-y-2">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <Zap className="w-4 h-4" />
                  <span>Powered by advanced analytics</span>
                </div>
                <p className="text-xs text-gray-400">
                  Secure authentication provided by Clerk
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Features Row */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
            <p className="text-gray-600 text-sm">Your data is protected with enterprise-grade security</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600 text-sm">Optimized for speed with real-time data processing</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Always Updated</h3>
            <p className="text-gray-600 text-sm">Latest player stats and match data at your fingertips</p>
          </div>
        </div>
      </div>
    </div>
  );
}