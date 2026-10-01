import { getGitHubUser, getUserRepositories } from './api/github.js';
import { renderProfile } from './components/profileCard.js';
import { renderRepositories } from './components/repositoryList.js';
import { updateStatus } from './components/statusMessage.js';

const form = document.querySelector('#search-form');
const usernameField = document.querySelector('#username');
const statusMessage = document.querySelector('#status-message');
const profileContainer = document.querySelector('#profile-container');
const repositoryContainer = document.querySelector('#repositories-container');

let requestToken = 0;

function resetResults() {
  profileContainer.innerHTML = '';
  repositoryContainer.innerHTML = '';
}

function renderInitialState() {
  updateStatus(statusMessage, 'idle', 'Ready to search for a developer.');
  resetResults();
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = usernameField.value.trim();

  if (!username) {
    resetResults();
    updateStatus(statusMessage, 'error', 'Please enter a GitHub username.');
    return;
  }

  const currentRequestToken = ++requestToken;
  resetResults();
  updateStatus(statusMessage, 'loading', 'Searching for developer...');

  try {
    const [profile, repositories] = await Promise.all([
      getGitHubUser(username),
      getUserRepositories(username),
    ]);

    if (currentRequestToken !== requestToken) {
      return;
    }

    profileContainer.appendChild(renderProfile(profile));
    repositoryContainer.appendChild(renderRepositories(repositories));

    updateStatus(
      statusMessage,
      'success',
      `Loaded profile and repositories for ${profile.login}.`
    );
  } catch (error) {
    if (currentRequestToken !== requestToken) {
      return;
    }

    resetResults();
    updateStatus(statusMessage, 'error', error.message || 'Unable to load developer data.');
  }
});

renderInitialState();
