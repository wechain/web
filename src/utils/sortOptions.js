import { getToken } from 'utils/token';

export function getSortOption(key) {
  let defaultOption =  'hunt_score';
  if (key === 'daily-0' && getToken()) {
    defaultOption = 'random';
  }

  if (window.sortOption && window.sortOption[key]) {
    return window.sortOption[key];
  }

  return defaultOption;
}
export function setSortOption(key, value) {
  window.sortOption = window.sortOption || {};
  window.sortOption[key] = value;
}

