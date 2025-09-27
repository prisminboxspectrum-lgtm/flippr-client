import { useToast } from '@/composables/useToast';

let sessionExpiredShown = false;

// Call this when the session expires
export function notifySessionExpired() {
  if (sessionExpiredShown) return; // already shown

  // Lazy call inside function, only when needed
  const { error: showError } = useToast();
  showError('Session expired. Please log in again.');
  sessionExpiredShown = true;
}

// Reset the flag after login
export function resetSessionExpiredFlag() {
  sessionExpiredShown = false;
}
