import isFunc from './isFunc'
import isEmptyObj from './isEmptyObj';


/**
 * Shallowly extract list values of keys from a base object.
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
export default (
  obj: Object,
  keys: Array<string | number>,
  getValue?: (key: any, obj: Object) => any
) => {
  const result = [];

  if (isEmptyObj(obj) && keys.length === 0) {
    return result;
  }
  let keyList = keys;

  if (!Array.isArray(keyList)) {
    keyList = [keys];
  }

  for (let i = 0; i < keyList.length; i += 1) {
    if (isFunc(getValue)) {
      const value = getValue(keyList[i], obj);
      result.push(value);
    } else if (Object.hasOwnProperty.call(obj, keyList[i])) {
      result.push(obj[keyList[i]]);
    }
  }

  return result;
};
