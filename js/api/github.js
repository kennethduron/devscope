const GITHUB_HEADERS = {
  Accept: 'application/vnd.github+json',
};

function getGitHubErrorMessage(statusCode) {
  if (statusCode === 404) {
    return 'Developer not found.';
  }

  if (statusCode === 403) {
    return 'GitHub API rate limit reached. Please try again later.';
  }

  if (statusCode >= 500) {
    return 'Unable to reach GitHub right now.';
  }

  return 'Unable to reach GitHub right now.';
}

export async function getGitHubUser(username) {
  const trimmedUsername = username?.trim();

  if (!trimmedUsername) {
    throw new Error('Please enter a GitHub username.');
  }

  const safeUsername = encodeURIComponent(trimmedUsername);

  try {
    const response = await fetch(`https://api.github.com/users/${safeUsername}`, {
      headers: GITHUB_HEADERS,
    });

    if (!response.ok) {
      throw new Error(getGitHubErrorMessage(response.status));
    }

    const data = await response.json();

    if (!data || !data.login) {
      throw new Error('Unexpected GitHub response.');
    }

    return data;
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw error;
    }

    throw new Error('Unable to reach GitHub right now.');
  }
}

export async function getUserRepositories(username) {
  const trimmedUsername = username?.trim();

  if (!trimmedUsername) {
    throw new Error('Please enter a GitHub username.');
  }

  const safeUsername = encodeURIComponent(trimmedUsername);

  try {
    const response = await fetch(
      `https://api.github.com/users/${safeUsername}/repos?sort=updated&direction=desc&per_page=12`,
      {
        headers: GITHUB_HEADERS,
      }
    );

    if (!response.ok) {
      throw new Error(getGitHubErrorMessage(response.status));
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Unexpected GitHub response.');
    }

    return data;
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw error;
    }

    throw new Error('Unable to reach GitHub right now.');
  }
}
