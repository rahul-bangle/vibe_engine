import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { OnboardingModal } from './components/OnboardingModal';
import { JourneyPlayer } from './components/JourneyPlayer';
import { MarketingDashboard } from './components/MarketingDashboard';
import { Dashboard } from './components/Dashboard';
import { useJourney } from './context/JourneyContext';
import { useAuth } from './context/AuthContext';

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const { state } = useJourney();
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex h-screen bg-black overflow-hidden select-none">
      <Sidebar onJourneyClick={() => setModalOpen(true)} />

      {!isAuthenticated ? (
        <MarketingDashboard />
      ) : state.currentPath ? (
        <main className="flex-1 bg-background-base rounded-lg mt-2 mr-2 mb-2 overflow-y-auto shadow-inner relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          <div className="p-8 relative z-10">
            <header className="flex justify-between items-center mb-10">
              <h1 className="text-4xl font-black tracking-tight">
                {state.currentPath}
              </h1>
            </header>
            <JourneyPlayer />
          </div>
        </main>
      ) : (
        <Dashboard />
      )}

      <OnboardingModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}

export default App;
