
/**
 * Creates a random string of length less than 15 characters
 *
 * @returns {string}
 */
export default function randomId (): string {
  const rand = Math.random();
  return rand.toString().split('.')[1];
}
