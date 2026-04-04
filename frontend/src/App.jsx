import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Navbar from './components/shared/Navbar';
import Sidebar from './components/shared/Sidebar';

// Pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import NotesPage from './pages/Notes/NotesPage';
import NoteDetailPage from './pages/Notes/NoteDetailPage';
import PlacementsPage from './pages/Placements/PlacementsPage';
import PlacementDetailPage from './pages/Placements/PlacementDetailPage';
import HackathonsPage from './pages/Hackathons/HackathonsPage';
import DiscussionsPage from './pages/Discussions/DiscussionsPage';
import AnnouncementsPage from './pages/Announcements/AnnouncementsPage';

function AppLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuToggle={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout><DashboardPage /></AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/notes" element={
            <ProtectedRoute>
              <AppLayout><NotesPage /></AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/notes/:id" element={
            <ProtectedRoute>
              <AppLayout><NoteDetailPage /></AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/placements" element={
            <ProtectedRoute>
              <AppLayout><PlacementsPage /></AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/placements/:id" element={
            <ProtectedRoute>
              <AppLayout><PlacementDetailPage /></AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/hackathons" element={
            <ProtectedRoute>
              <AppLayout><HackathonsPage /></AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/discussions" element={
            <ProtectedRoute>
              <AppLayout><DiscussionsPage /></AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/announcements" element={
            <ProtectedRoute>
              <AppLayout><AnnouncementsPage /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
