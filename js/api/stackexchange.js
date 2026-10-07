const STACK_EXCHANGE_API_BASE = 'https://api.stackexchange.com/2.3';
const STACK_EXCHANGE_SITE = 'stackoverflow';

function getStackExchangeErrorMessage(statusCode, payload) {
  if (payload && typeof payload.backoff === 'number') {
    return `Stack Overflow API is rate limited. Please wait ${payload.backoff} seconds and try again.`;
  }

  if (statusCode === 429 || statusCode === 403) {
    return 'Stack Overflow API quota reached. Please try again later.';
  }

  if (statusCode >= 500) {
    return 'Stack Overflow is temporarily unavailable.';
  }

  return 'Unable to load Stack Overflow data right now.';
}

export function normalizeStackOverflowUser(user) {
  if (!user || typeof user !== 'object') {
    return null;
  }

  return {
    user_id: user.user_id ?? null,
    display_name: user.display_name || 'Stack Overflow user',
    profile_image: user.profile_image || '',
    reputation: Number(user.reputation) || 0,
    badge_counts: {
      gold: Number(user?.badge_counts?.gold) || 0,
      silver: Number(user?.badge_counts?.silver) || 0,
      bronze: Number(user?.badge_counts?.bronze) || 0,
    },
    link: user.link || '#',
    location: user.location || 'Location unavailable',
    creation_date: user.creation_date || null,
    last_access_date: user.last_access_date || null,
  };
}

export async function searchStackOverflowUsers(displayName) {
  const trimmedName = typeof displayName === 'string' ? displayName.trim() : '';

  if (!trimmedName) {
    throw new Error('Please enter a Stack Overflow display name.');
  }

  const query = new URLSearchParams({
    site: STACK_EXCHANGE_SITE,
    inname: trimmedName,
  });

  try {
    const response = await fetch(`${STACK_EXCHANGE_API_BASE}/users?${query.toString()}`);

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(getStackExchangeErrorMessage(response.status, payload));
    }

    const payload = await response.json();

    if (!payload || !Array.isArray(payload.items)) {
      if (payload && typeof payload.backoff === 'number') {
        throw new Error(`Stack Overflow API is rate limited. Please wait ${payload.backoff} seconds and try again.`);
      }

      throw new Error('Unexpected Stack Overflow response.');
    }

    if (payload.backoff) {
      throw new Error(`Stack Overflow API is rate limited. Please wait ${payload.backoff} seconds and try again.`);
    }

    return payload.items.map(normalizeStackOverflowUser).filter(Boolean);
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw error;
    }

    throw new Error('Unable to load Stack Overflow data right now.');
  }
}
