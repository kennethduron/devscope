import { formatDate, safeText, formatNumber } from '../utils/format.js';

function createMetaItem(label, value) {
  const item = document.createElement('span');
  item.textContent = `${label}: ${value}`;
  return item;
}

export function renderRepositories(repositories) {
  const section = document.createElement('section');
  section.className = 'repository-list';

  if (!Array.isArray(repositories) || repositories.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'No public repositories found for this developer.';
    section.appendChild(empty);
    return section;
  }

  repositories.forEach((repo) => {
    const card = document.createElement('article');
    card.className = 'repository-card';

    const header = document.createElement('div');
    header.className = 'repo-header';

    const repoName = document.createElement('h3');
    repoName.className = 'repo-name';
    repoName.textContent = safeText(repo?.name, 'Untitled repository');

    const repoLink = document.createElement('a');
    repoLink.href = repo?.html_url || '#';
    repoLink.target = '_blank';
    repoLink.rel = 'noopener noreferrer';
    repoLink.className = 'repo-link';
    repoLink.textContent = 'View';

    header.append(repoName, repoLink);

    const description = document.createElement('p');
    description.className = 'repo-description';
    description.textContent = safeText(repo?.description, 'No description provided.');

    const meta = document.createElement('div');
    meta.className = 'repo-meta';
    meta.append(
      createMetaItem('Language', safeText(repo?.language, 'N/A')),
      createMetaItem('Stars', formatNumber(repo?.stargazers_count || 0)),
      createMetaItem('Forks', formatNumber(repo?.forks_count || 0)),
      createMetaItem('Updated', formatDate(repo?.updated_at))
    );

    card.append(header, description, meta);
    section.appendChild(card);
  });

  return section;
}
