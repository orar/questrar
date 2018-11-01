// @flow

/* eslint-disable eqeqeq */
/* eslint-disable no-use-before-define */


/**
 * Creates a random string of length less than 15 characters with [a - h]
 * @param length
 * @returns {string}
 */
export function randomId () {
  const rand = Math.random();
  return rand.toString().split('.')[1];
}


/**
 * Checks if arg is a function
 *
 * @param func
 * @returns {boolean}
 */
export function isFunc (func: any):%checks {
  return typeof func === 'function';
}

/**
 * Checks if arg is an object and not null
 * @param obj
 * @returns {any|boolean}
 */
export function isObj (obj: any):%checks {
  return nonEmpty(obj) && obj.constructor == Object
}


/**
 * Checks if arg is an object and not null
 * @param num
 * @returns {any|boolean}
 */
export function isNumber (num: any):%checks {
  return typeof num === 'number';
}

/**
 * Assert if value is not null or not undefined
 *
 * @param value
 * @returns {boolean}
 */
export function nonEmpty(value: any):%checks {
  return typeof value !== 'undefined' && value !== null
}

// $FlowFixMe
export function isEmptyObj(value: any):%checks {
  if (!nonEmpty(value) || !isObj(value)) return true;

  return Object.keys(value).length === 0
}
