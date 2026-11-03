import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'sonner';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
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

// Page transition wrapper component
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Admin Workspace route - full viewport SaaS dashboard */}
        <Route path="/admin/*" element={<AdminWorkspace />} />

        {/* Public Website routes with persistent Navbar & Footer */}
        <Route
          path="*"
          element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  <Routes location={location}>
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
                </motion.div>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const MainAppLayout: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col selection:bg-[var(--brand-orange)] selection:text-white transition-colors duration-200">
      <Toaster 
        theme={theme} 
        richColors 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)'
          }
        }}
      />
      <AnimatedRoutes />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <MainAppLayout />
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
