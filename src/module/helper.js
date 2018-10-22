// @flow
import invariant from 'invariant';
import type {RequestState} from "../index";

/**
 * Extract list values of keys from a base object.
 * Use `getValue` 3rd param to retrieve/transform value based on key and base object
 *
 * ```
 * const baseObj = { k: 0, l: 3, m: { n: 'stringVal', o: true } }
 * const values = valuesOfKeys(['k', 'l', 'm'], baseObj);
 * console.log(values) // [0, 3, { n: 'string', o: true }]
 * ```
 * @param keys a key as string or list of keys
 * @param obj
 * @param getValue Retrieve or transform the resulting value if provided as a function
 * @returns {*} Returns an empty array if no keys had a match in the base object
 */
export const arrayValuesOfKeys = (obj: Object, keys: Array<string | number>, getValue?: (key: any, obj: Object) => any) => {
  invariant(nonEmpty(obj), 'No object has been provided for keys extraction');
  invariant(nonEmpty(keys), 'There are no keys provided for values extraction');

  if(typeof keys === 'string') {

    if(isFunc(getValue)){
      return [getValue(keys, obj)];
    } else if(Object.hasOwnProperty.call(obj, keys)){
      return [obj[keys]];
    }
    return [];
  }

  const result = [];
  for(let i = 0; i < keys.length; i ++ ){
    if(isFunc(getValue)){
      const value =  getValue(keys[i], obj);
      result.push(value);
    } else if(Object.hasOwnProperty.call(obj, keys[i])){
      result.push(obj[keys[i]]);
    }
  }

  return result;
};


/**
 * Reset a request flags to initial state.
 * Setting pending, success and failed to false
 *
 * @param req
 * @returns {Request}
 */
export const resetRequestFlags = (req: RequestState) => {
  const r = req;
  r.pending = false;
  r.success = false;
  r.failed = false;
  if(r.message) {
    delete r.message
  }
  return r;
};


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
  return typeof func === "function";
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
  return typeof num === "number";
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


export function isEmptyObj(value: any) {
  if(!nonEmpty(value)) return false;

  for (let key in value) {
    if (Object.hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
}
