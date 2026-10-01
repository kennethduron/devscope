export function updateStatus(element, state, message = '') {
  const allowedStates = ['idle', 'loading', 'success', 'error', 'empty'];
  const nextState = allowedStates.includes(state) ? state : 'idle';
  const defaults = {
    idle: 'Ready to search for a developer.',
    loading: 'Loading developer information...',
    success: 'Developer information loaded successfully.',
    error: 'Something went wrong while loading the profile.',
    empty: 'No public repositories found for this developer.',
  };

  element.className = `status-message status-${nextState}`;

  if (nextState === 'loading') {
    element.innerHTML = `
      <span class="loading-spinner" aria-hidden="true"></span>
      <span>${message || defaults.loading}</span>
    `;
    return;
  }

  element.textContent = message || defaults[nextState];
}
