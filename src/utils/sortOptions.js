export function getSortOption(key) {
  return localStorage.getItem(key) || 'payout';
}
export function setSortOption(key, value) {
  return localStorage.setItem(key, value);
}

