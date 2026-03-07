import { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { JourneyPlayer } from './components/JourneyPlayer';
import { CategoryDetail } from './components/CategoryDetail';
import { NudgeToast } from './components/NudgeToast';
import { GlobalMiniPlayer } from './components/GlobalMiniPlayer';
import { WelcomeBanner } from './components/WelcomeBanner';
import { ReviewModal } from './components/ReviewModal';
import { useTracking } from './hooks/useTracking';
import { useJourney } from './hooks/useJourney';
import { MobileLayout, MobileJourneyPlayer } from './components/MobileLayout';

function AppContent() {
  const { state, nudgeMessage, clearNudge, resetJourney } = useJourney();
  const { interactionCount } = useTracking();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [hasTriggeredReview, setHasTriggeredReview] = useState(() => {
    return sessionStorage.getItem('spotify-review-triggered') === 'true';
  });

  // Auto-trigger review modal after threshold
  const { trackEvent: appTrackEvent } = useTracking();
  useEffect(() => {
    if (interactionCount >= 10 && !hasTriggeredReview && state.userName) {
      setShowReviewModal(true);
      setHasTriggeredReview(true);
      sessionStorage.setItem('spotify-review-triggered', 'true');
      appTrackEvent('REVIEW_AUTO_TRIGGER', 'app', { count: interactionCount });
    }
  }, [interactionCount, hasTriggeredReview, state.userName, appTrackEvent]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <>
        <WelcomeBanner />
        <MobileLayout />
        {state.step === 2 && <MobileJourneyPlayer onClose={resetJourney} />}

        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
        />

        <NudgeToast
          show={!!nudgeMessage}
          message={nudgeMessage || ''}
          onClose={clearNudge}
        />
      </>
    );
  }

  return (
    <div className={`flex h-screen bg-black overflow-hidden select-none font-sans text-text-base`}>
      <WelcomeBanner />
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
      />

      {isSidebarOpen && window.innerWidth < 768 && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <button
          className="md:hidden absolute top-4 left-4 z-20 p-2 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/category/:id" element={<CategoryDetail />} />
          <Route path="/player/:id" element={<JourneyPlayer />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

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
    <AppContent />
  );
}

export default App;
