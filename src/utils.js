/**
 * Generates a stable random float between 0 and 1 based on a seed string.
 * Uses a simple hash + Mulberry32 PRNG.
 */
export function getSeededRandom(seedString) {
  // Simple hash function for the seed string
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedString.length; i++) {
    h = Math.imul(h ^ seedString.charCodeAt(i), 16777619);
  }
  const seed = h >>> 0;

  // Mulberry32 PRNG
  let t = seed + 0x6D2B79F5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  const result = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  return result;
}

/**
 * Gets the current date string in YYYY-MM-DD format as a stable seed.
 */
export function getTodaySeed() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

/**
 * Picks a random item from an array based on the today's seed.
 */
export function pickDaily(array) {
  const seed = getTodaySeed();
  const randomValue = getSeededRandom(seed);
  return array[Math.floor(randomValue * array.length)];
}
