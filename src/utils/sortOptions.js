export function getSortOption(key) {
  const defaultOption = key === 'daily-0' ? 'random' : 'hunt_score';
  if (window.sortOption && window.sortOption[key]) {
    return window.sortOption[key];
  }

  return defaultOption;
}
export function setSortOption(key, value) {
  window.sortOption = window.sortOption || {};
  window.sortOption[key] = value;
}

