import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { JourneyPlayer } from './components/JourneyPlayer';
import { CategoryDetail } from './components/CategoryDetail';
import { OnboardingModal } from './components/OnboardingModal';
import { NudgeToast } from './components/NudgeToast';
import { GlobalMiniPlayer } from './components/GlobalMiniPlayer';
import { useJourney, JourneyProvider } from './context/JourneyContext';

function AppContent() {
  const { state, nudgeMessage, clearNudge } = useJourney();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const renderMainContent = () => {
    switch (state.step) {
      case 1:
        return <CategoryDetail />;
      case 2:
        return <JourneyPlayer />;
      default:
        return <Dashboard />;
    }
  };

  const hasMiniPlayer = state.globalTrack !== null && state.step !== 2;

  return (
    <div className={`flex h-screen bg-black overflow-hidden select-none font-sans text-text-base ${hasMiniPlayer ? 'pb-24' : ''}`}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 relative">
        {renderMainContent()}
      </div>

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      <NudgeToast
        show={!!nudgeMessage}
        message={nudgeMessage || ''}
        onClose={clearNudge}
      />

      <GlobalMiniPlayer />
    </div>
  );
}

function App() {
  return (
    <JourneyProvider>
      <AppContent />
    </JourneyProvider>
  );
}

export default App;
