export function getSortOption(key) {
  return localStorage.getItem(key) || 'hunt_score';
}
export function setSortOption(key, value) {
  return localStorage.setItem(key, value);
}

