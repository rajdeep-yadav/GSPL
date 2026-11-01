import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { RegisterPage } from './pages/RegisterPage';
import { RegistrationStatusPage } from './pages/RegistrationStatusPage';
import { TeamsPage } from './pages/TeamsPage';
import { FixturesPage } from './pages/FixturesPage';
import { PointsTablePage } from './pages/PointsTablePage';
import { StatisticsPage } from './pages/StatisticsPage';
import { AdminWorkspace } from './pages/AdminWorkspace';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#090909] text-white flex flex-col selection:bg-[#FF5722] selection:text-white">
          <Routes>
            {/* Admin Workspace route - full viewport SaaS dashboard */}
            <Route path="/admin/*" element={<AdminWorkspace />} />

            {/* Public Website routes with persistent Navbar & Footer */}
            <Route
              path="*"
              element={
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/registration-status" element={<RegistrationStatusPage />} />
                      <Route path="/teams" element={<TeamsPage />} />
                      <Route path="/fixtures" element={<FixturesPage />} />
                      <Route path="/matches" element={<FixturesPage />} />
                      <Route path="/points-table" element={<PointsTablePage />} />
                      <Route path="/statistics" element={<StatisticsPage />} />
                      <Route path="/awards" element={<StatisticsPage />} />
                      <Route path="/news" element={<HomePage />} />
                      <Route path="/gallery" element={<HomePage />} />
                      <Route path="/about" element={<HomePage />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
