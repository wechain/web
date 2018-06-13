export function getSortOption(key) {
  // TODO_ABV: REMOVE IT
  if (localStorage.getItem(key) == 'payout') {
    localStorage.setItem(key, 'hunt_score');
  }
  return localStorage.getItem(key) || 'hunt_score';
}
export function setSortOption(key, value) {
  return localStorage.setItem(key, value);
}

