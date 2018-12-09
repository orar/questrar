
/**
 * Checks if id is a string or number or symbol satisfying request id
 * @param id any
 * @returns {boolean}
 */
export default (id): %checks => {
  const type = typeof id;

  return (type === 'string' && id.length > 0) || type === 'number' || type === 'symbol';
}
