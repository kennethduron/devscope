export function saveRecentSearch(username) {
  if (!username) {
    return;
  }

  try {
    const existing = JSON.parse(localStorage.getItem('devscope-recent-searches') || '[]');
    const next = [username, ...existing.filter((item) => item !== username)].slice(0, 5);
    localStorage.setItem('devscope-recent-searches', JSON.stringify(next));
  } catch (error) {
    console.warn('Unable to save recent searches.', error);
  }
}

export function getRecentSearches() {
  try {
    const saved = JSON.parse(localStorage.getItem('devscope-recent-searches') || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.warn('Unable to read recent searches.', error);
    return [];
  }
}
