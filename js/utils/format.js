export function safeText(value, fallback = 'Not available') {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  return value;
}

export function formatNumber(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '0';
  }

  return value.toLocaleString();
}

export function formatDate(dateString) {
  if (!dateString) {
    return 'Date unavailable';
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}
