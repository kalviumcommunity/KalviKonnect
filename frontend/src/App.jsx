import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold text-blue-500 mb-4 font-outfit">Kalvi Connect</h1>
        <p className="text-gray-400 text-lg">Centralized platform for Kalvium Students.</p>
        
        <Routes>
          <Route path="/" element={<div className="mt-8 p-6 bg-neutral-800 rounded-xl border border-neutral-700 shadow-2xl">Dashboard Placeholder</div>} />
          {/* Add more routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
