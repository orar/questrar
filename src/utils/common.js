// @flow
import type { RequestState } from '../index';

const initialObjectId = Symbol('initial_request_state');

//  status flags
export const PENDING = 'pending';
export const SUCCESS = 'success';
export const FAILED = 'failed';

//  action flags
export const REMOVE = 'remove';
export const CLEAN = 'clean';
export const DIRTY = 'dirty';


//  Initial request state
export const initialRequest: RequestState = {
  $id: initialObjectId,
  pending: false,
  success: false,
  failed: false,
  successCount: 0,
  failureCount: 0,
  clean: true,
};
