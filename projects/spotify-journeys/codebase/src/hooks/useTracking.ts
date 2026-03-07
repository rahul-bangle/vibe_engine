import { useJourney } from './useJourney';

export const useTracking = () => {
    const { trackEvent, interactionCount } = useJourney();
    return { trackEvent, interactionCount };
};
