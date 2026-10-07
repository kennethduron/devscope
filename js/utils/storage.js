function readStoredArray(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.warn(`Unable to read ${key}.`, error);
    return [];
  }
}

export function saveRecentSearch(username) {
  if (!username) {
    return;
  }

  try {
    const existing = readStoredArray('devscope-recent-searches');
    const next = [username, ...existing.filter((item) => item !== username)].slice(0, 5);
    localStorage.setItem('devscope-recent-searches', JSON.stringify(next));
  } catch (error) {
    console.warn('Unable to save recent searches.', error);
  }
}

export function getRecentSearches() {
  return readStoredArray('devscope-recent-searches');
}

export function getFavoriteDevelopers() {
  return readStoredArray('devscope-favorites');
}

export function isFavoriteDeveloper(login) {
  const favorites = getFavoriteDevelopers();
  return favorites.some((favorite) => favorite?.login === login);
}

export function addFavoriteDeveloper(profile, stackOverflowProfile = null) {
  const login = profile?.login?.trim();

  if (!login) {
    return false;
  }

  const favorites = getFavoriteDevelopers();

  if (favorites.some((favorite) => favorite?.login === login)) {
    return false;
  }

  const favorite = {
    login,
    avatar: profile?.avatar_url || '',
    stackOverflowUserId: stackOverflowProfile?.user_id ?? null,
    stackOverflowDisplayName: stackOverflowProfile?.display_name || null,
  };

  favorites.push(favorite);

  try {
    localStorage.setItem('devscope-favorites', JSON.stringify(favorites));
    return true;
  } catch (error) {
    console.warn('Unable to save favorite developer.', error);
    return false;
  }
}

export function removeFavoriteDeveloper(login) {
  if (!login) {
    return false;
  }

  try {
    const favorites = getFavoriteDevelopers().filter((favorite) => favorite?.login !== login);
    localStorage.setItem('devscope-favorites', JSON.stringify(favorites));
    return true;
  } catch (error) {
    console.warn('Unable to remove favorite developer.', error);
    return false;
  }
}
