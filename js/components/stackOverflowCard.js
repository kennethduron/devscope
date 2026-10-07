import { formatNumber, safeText } from '../utils/format.js';

export function renderStackOverflowCard(user) {
  const card = document.createElement('article');
  card.className = 'stack-card';

  const profileImage = document.createElement('img');
  profileImage.className = 'stack-avatar';
  profileImage.src = user?.profile_image || 'https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon@2.png';
  profileImage.alt = `${safeText(user?.display_name, 'Stack Overflow user')} profile avatar`;

  const content = document.createElement('div');
  content.className = 'stack-content';

  const heading = document.createElement('h3');
  heading.textContent = safeText(user?.display_name, 'Stack Overflow user');

  const reputation = document.createElement('p');
  reputation.className = 'stack-reputation';
  reputation.textContent = `Reputation: ${formatNumber(Number(user?.reputation) || 0)}`;

  const badges = document.createElement('div');
  badges.className = 'stack-badges';

  const badgeFields = [
    ['Gold', user?.badge_counts?.gold || 0],
    ['Silver', user?.badge_counts?.silver || 0],
    ['Bronze', user?.badge_counts?.bronze || 0],
  ];

  badgeFields.forEach(([label, count]) => {
    const badge = document.createElement('span');
    badge.className = 'stack-badge';
    badge.textContent = `${label}: ${formatNumber(Number(count) || 0)}`;
    badges.appendChild(badge);
  });

  const location = document.createElement('p');
  location.className = 'stack-location';
  location.textContent = `Location: ${safeText(user?.location, 'Location unavailable')}`;

  const link = document.createElement('a');
  link.href = user?.link || '#';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.className = 'stack-link';
  link.textContent = 'View Stack Overflow profile';

  content.append(heading, reputation, badges, location, link);
  card.append(profileImage, content);

  return card;
}

export function renderStackOverflowEmptyState(message) {
  const empty = document.createElement('div');
  empty.className = 'empty-state';
  empty.textContent = message || 'No Stack Overflow profile found for this search.';
  return empty;
}
