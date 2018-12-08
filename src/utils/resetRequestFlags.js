import type { RequestState } from '../index';

/**
 * Reset a request flags to initial state.
 * Setting pending, success and failed to false
 *
 * @param req
 * @returns {Request}
 */
export default (req: RequestState) => {
  const r = req;
  r.pending = false;
  r.success = false;
  r.failed = false;
  r.clean = true;
  if (r.message) {
    delete r.message
  }
  return r;
};
