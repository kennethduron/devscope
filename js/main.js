import { getGitHubUser, getUserRepositories } from './api/github.js';
import { searchStackOverflowUsers } from './api/stackexchange.js';
import { renderProfile } from './components/profileCard.js';
import { renderRepositories } from './components/repositoryList.js';
import {
  renderStackOverflowCard,
  renderStackOverflowEmptyState,
} from './components/stackOverflowCard.js';
import { updateStatus } from './components/statusMessage.js';
import {
  addFavoriteDeveloper,
  getFavoriteDevelopers,
  isFavoriteDeveloper,
  removeFavoriteDeveloper,
} from './utils/storage.js';

const form = document.querySelector('#search-form');
const githubUsernameField = document.querySelector('#username');
const stackOverflowNameField = document.querySelector('#stackoverflow-name');
const githubSearchButton = document.querySelector('#github-search-button');
const stackOverflowSearchButton = document.querySelector('#stackoverflow-search-button');
const statusMessage = document.querySelector('#status-message');
const profileContainer = document.querySelector('#profile-container');
const repositoryContainer = document.querySelector('#repositories-container');
const favoritesList = document.querySelector('#favorites-list');

const repositoryState = {
  language: 'all',
  sort: 'updated',
};

let githubRequestId = 0;
let stackOverflowRequestId = 0;
let currentGitHubProfile = null;
let currentGitHubRepositories = [];
let currentStackOverflowUser = null;
let currentStackOverflowQuery = '';

function setButtonDisabled(button, isDisabled) {
  if (!button) {
    return;
  }

  button.disabled = isDisabled;
  button.setAttribute('aria-busy', String(isDisabled));
}

function setSearchButtonsDisabled(isDisabled) {
  setButtonDisabled(githubSearchButton, isDisabled);
  setButtonDisabled(stackOverflowSearchButton, isDisabled);
}

function getVisibleRepositories() {
  const repositories = [...currentGitHubRepositories];
  const selectedLanguage = repositoryState.language;

  let visibleRepositories = repositories;

  if (selectedLanguage !== 'all') {
    visibleRepositories = visibleRepositories.filter(
      (repo) => (repo?.language || 'Unknown').toLowerCase() === selectedLanguage.toLowerCase()
    );
  }

  switch (repositoryState.sort) {
    case 'stars':
      visibleRepositories.sort((a, b) => (b?.stargazers_count || 0) - (a?.stargazers_count || 0));
      break;
    case 'name':
      visibleRepositories.sort((a, b) => (a?.name || '').localeCompare(b?.name || ''));
      break;
    case 'updated':
    default:
      visibleRepositories.sort(
        (a, b) => new Date(b?.updated_at || 0).getTime() - new Date(a?.updated_at || 0).getTime()
      );
      break;
  }

  return visibleRepositories;
}

function renderRepositorySection() {
  repositoryContainer.innerHTML = '';

  if (!currentGitHubProfile || !currentGitHubRepositories.length) {
    return;
  }

  const repositoryPanel = document.createElement('section');
  repositoryPanel.className = 'repository-panel';

  const toolbar = document.createElement('div');
  toolbar.className = 'repository-toolbar';

  const languageOptions = [...new Set(currentGitHubRepositories.map((repo) => repo?.language).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b)
  );

  const languageLabel = document.createElement('label');
  languageLabel.htmlFor = 'repo-language-filter';
  languageLabel.textContent = 'Filter by language';

  const languageSelect = document.createElement('select');
  languageSelect.id = 'repo-language-filter';
  languageSelect.className = 'select-control';

  const defaultLanguageOption = document.createElement('option');
  defaultLanguageOption.value = 'all';
  defaultLanguageOption.textContent = 'All languages';
  languageSelect.appendChild(defaultLanguageOption);

  languageOptions.forEach((language) => {
    const option = document.createElement('option');
    option.value = language;
    option.textContent = language;
    if (language === repositoryState.language) {
      option.selected = true;
    }
    languageSelect.appendChild(option);
  });

  languageSelect.value = repositoryState.language;
  languageSelect.addEventListener('change', (event) => {
    repositoryState.language = event.target.value;
    renderRepositorySection();
  });

  const sortLabel = document.createElement('label');
  sortLabel.htmlFor = 'repo-sort';
  sortLabel.textContent = 'Sort';

  const sortSelect = document.createElement('select');
  sortSelect.id = 'repo-sort';
  sortSelect.className = 'select-control';

  [
    ['updated', 'Recently Updated'],
    ['stars', 'Most Stars'],
    ['name', 'Name A-Z'],
  ].forEach(([value, label]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    if (value === repositoryState.sort) {
      option.selected = true;
    }
    sortSelect.appendChild(option);
  });

  sortSelect.value = repositoryState.sort;
  sortSelect.addEventListener('change', (event) => {
    repositoryState.sort = event.target.value;
    renderRepositorySection();
  });

  const filterGroup = document.createElement('div');
  filterGroup.className = 'toolbar-field';
  filterGroup.append(languageLabel, languageSelect);

  const sortGroup = document.createElement('div');
  sortGroup.className = 'toolbar-field';
  sortGroup.append(sortLabel, sortSelect);

  toolbar.append(filterGroup, sortGroup);
  repositoryPanel.appendChild(toolbar);
  repositoryPanel.appendChild(renderRepositories(getVisibleRepositories()));
  repositoryContainer.appendChild(repositoryPanel);
}

function renderFavoritesList() {
  favoritesList.innerHTML = '';

  const favorites = getFavoriteDevelopers();

  if (!favorites.length) {
    const empty = document.createElement('li');
    empty.className = 'favorite-empty';
    empty.textContent = 'No saved favorites yet.';
    favoritesList.appendChild(empty);
    return;
  }

  favorites.forEach((favorite) => {
    const item = document.createElement('li');
    item.className = 'favorite-item';

    const openButton = document.createElement('button');
    openButton.type = 'button';
    openButton.className = 'favorite-open';
    openButton.textContent = favorite?.stackOverflowDisplayName
      ? `${favorite.login} · ${favorite.stackOverflowDisplayName}`
      : favorite.login;
    openButton.addEventListener('click', async () => {
      githubUsernameField.value = favorite.login;
      if (favorite.stackOverflowDisplayName) {
        stackOverflowNameField.value = favorite.stackOverflowDisplayName;
      }
      await handleGitHubSearch({ preventDefault() {} });
    });

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'favorite-remove';
    removeButton.textContent = 'Remove';
    removeButton.setAttribute('aria-label', `Remove ${favorite.login} from favorites`);
    removeButton.addEventListener('click', () => {
      removeFavoriteDeveloper(favorite.login);
      renderFavoritesList();
    });

    item.append(openButton, removeButton);
    favoritesList.appendChild(item);
  });
}

function renderDeveloperOverview() {
  profileContainer.innerHTML = '';

  if (!currentGitHubProfile) {
    return;
  }

  const profileCard = renderProfile(currentGitHubProfile);
  const actionRow = document.createElement('div');
  actionRow.className = 'profile-actions';

  const favoriteButton = document.createElement('button');
  favoriteButton.type = 'button';
  favoriteButton.className = 'secondary-button';
  favoriteButton.textContent = isFavoriteDeveloper(currentGitHubProfile.login) ? 'Remove Favorite' : 'Add to Favorites';
  favoriteButton.addEventListener('click', () => {
    const isAlreadyFavorite = isFavoriteDeveloper(currentGitHubProfile.login);

    if (isAlreadyFavorite) {
      removeFavoriteDeveloper(currentGitHubProfile.login);
      favoriteButton.textContent = 'Add to Favorites';
    } else {
      const saved = addFavoriteDeveloper(currentGitHubProfile, currentStackOverflowUser);
      if (saved) {
        favoriteButton.textContent = 'Remove Favorite';
      }
    }

    renderFavoritesList();
  });

  actionRow.appendChild(favoriteButton);
  profileContainer.append(profileCard, actionRow);

  if (currentStackOverflowUser) {
    profileContainer.appendChild(renderStackOverflowCard(currentStackOverflowUser));
  } else if (currentStackOverflowQuery) {
    profileContainer.appendChild(
      renderStackOverflowEmptyState(`No Stack Overflow profiles matched “${currentStackOverflowQuery}”.`)
    );
  }
}

function renderInitialState() {
  updateStatus(statusMessage, 'idle', 'Ready to search for a developer.');
  renderFavoritesList();
  renderDeveloperOverview();
  renderRepositorySection();
}

async function handleGitHubSearch(event) {
  event.preventDefault();

  const username = githubUsernameField.value.trim();

  if (!username) {
    currentGitHubProfile = null;
    currentGitHubRepositories = [];
    currentStackOverflowUser = null;
    currentStackOverflowQuery = '';
    renderDeveloperOverview();
    renderRepositorySection();
    updateStatus(statusMessage, 'error', 'Please enter a GitHub username.');
    return;
  }

  const requestId = ++githubRequestId;
  setSearchButtonsDisabled(true);
  updateStatus(statusMessage, 'loading', 'Searching for GitHub developer...');

  try {
    const [profile, repositories] = await Promise.all([
      getGitHubUser(username),
      getUserRepositories(username),
    ]);

    if (requestId !== githubRequestId) {
      return;
    }

    currentGitHubProfile = profile;
    currentGitHubRepositories = repositories;
    currentStackOverflowQuery = stackOverflowNameField.value.trim() || profile.login;
    repositoryState.language = 'all';
    repositoryState.sort = 'updated';

    if (!stackOverflowNameField.value.trim()) {
      stackOverflowNameField.value = profile.login;
    }

    renderDeveloperOverview();
    renderRepositorySection();
    updateStatus(statusMessage, 'success', `Loaded profile and repositories for ${profile.login}.`);
  } catch (error) {
    if (requestId !== githubRequestId) {
      return;
    }

    currentGitHubProfile = null;
    currentGitHubRepositories = [];
    currentStackOverflowUser = null;
    currentStackOverflowQuery = '';
    renderDeveloperOverview();
    renderRepositorySection();
    updateStatus(statusMessage, 'error', error.message || 'Unable to load developer data.');
  } finally {
    setSearchButtonsDisabled(false);
  }
}

async function handleStackOverflowSearch(event) {
  event.preventDefault();

  const stackOverflowName = stackOverflowNameField.value.trim();
  const lookupName = stackOverflowName || currentGitHubProfile?.login || '';

  if (!lookupName) {
    currentStackOverflowUser = null;
    currentStackOverflowQuery = '';
    renderDeveloperOverview();
    updateStatus(statusMessage, 'error', 'Please enter a Stack Overflow display name.');
    return;
  }

  const requestId = ++stackOverflowRequestId;
  setSearchButtonsDisabled(true);
  updateStatus(statusMessage, 'loading', 'Searching for Stack Overflow developer...');

  try {
    const matches = await searchStackOverflowUsers(lookupName);

    if (requestId !== stackOverflowRequestId) {
      return;
    }

    currentStackOverflowQuery = lookupName;
    currentStackOverflowUser = matches[0] || null;
    renderDeveloperOverview();

    if (!currentStackOverflowUser) {
      updateStatus(statusMessage, 'empty', 'No Stack Overflow profiles matched that search.');
      return;
    }

    updateStatus(
      statusMessage,
      'success',
      `Loaded Stack Overflow profile for ${currentStackOverflowUser.display_name}.`
    );
  } catch (error) {
    if (requestId !== stackOverflowRequestId) {
      return;
    }

    currentStackOverflowUser = null;
    currentStackOverflowQuery = lookupName;
    renderDeveloperOverview();
    updateStatus(statusMessage, 'error', error.message || 'Unable to load Stack Overflow data.');
  } finally {
    setSearchButtonsDisabled(false);
  }
}

form.addEventListener('submit', handleGitHubSearch);
stackOverflowSearchButton.addEventListener('click', handleStackOverflowSearch);
stackOverflowNameField.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleStackOverflowSearch(event);
  }
});

renderInitialState();
