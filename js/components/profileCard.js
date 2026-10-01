import { safeText, formatNumber } from '../utils/format.js';

function createDetail(label, value) {
  const detail = document.createElement('p');
  detail.innerHTML = `<strong>${label}:</strong> ${value}`;
  return detail;
}

export function renderProfile(profile) {
  const card = document.createElement('article');
  card.className = 'profile-card';

  const name = safeText(profile?.name, profile?.login || 'Developer');
  const login = safeText(profile?.login, 'unknown-user');
  const avatarAlt = `${login} GitHub profile avatar`;
  const bio = safeText(profile?.bio, 'No bio available.');
  const location = safeText(profile?.location, 'Location unavailable');
  const company = safeText(profile?.company, 'Company unavailable');
  const link = safeText(profile?.html_url, '#');

  const header = document.createElement('div');
  header.className = 'profile-header';

  const avatar = document.createElement('img');
  avatar.className = 'profile-avatar';
  avatar.src = profile?.avatar_url || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
  avatar.alt = avatarAlt;

  const meta = document.createElement('div');
  meta.className = 'profile-meta';

  const title = document.createElement('h3');
  title.textContent = name;

  const username = document.createElement('p');
  username.className = 'profile-login';
  username.textContent = `@${login}`;

  meta.append(title, username);
  header.append(avatar, meta);

  const bioText = document.createElement('p');
  bioText.className = 'profile-bio';
  bioText.textContent = bio;

  const stats = document.createElement('div');
  stats.className = 'profile-stats';

  const statFields = [
    ['Public repos', formatNumber(profile?.public_repos || 0)],
    ['Followers', formatNumber(profile?.followers || 0)],
    ['Following', formatNumber(profile?.following || 0)],
    ['Gists', formatNumber(profile?.public_gists || 0)],
  ];

  statFields.forEach(([label, value]) => {
    const stat = document.createElement('div');
    stat.className = 'stat-box';

    const statLabel = document.createElement('span');
    statLabel.className = 'stat-box-label';
    statLabel.textContent = label;

    const statValue = document.createElement('span');
    statValue.className = 'stat-box-value';
    statValue.textContent = value;

    stat.append(statLabel, statValue);
    stats.appendChild(stat);
  });

  const details = document.createElement('div');
  details.className = 'profile-details';
  details.append(
    createDetail('Location', location),
    createDetail('Company', company)
  );

  const linkButton = document.createElement('a');
  linkButton.href = link;
  linkButton.target = '_blank';
  linkButton.rel = 'noopener noreferrer';
  linkButton.className = 'profile-link';
  linkButton.textContent = 'View GitHub profile';

  card.append(header, bioText, stats, details, linkButton);
  return card;
}

export function clearProfile() {
  return null;
}
