'use strict';

const { Aigle } = require('./aigle');
const { DEFAULT_LIMIT, AigleLimitArray, AigleLimitObject } = require('./internal/aigleLimit');

class FindLimitArray extends AigleLimitArray {

  constructor(array, iterator, limit) {
    super(array, iterator, limit);
  }

  _callResolve(value, index) {
    if (this._promise._resolved !== 0) {
      return;
    }
    if (value) {
      this._promise._resolve(this._array[index]);
    } else if (--this._rest === 0) {
      this._promise._resolve();
    } else if (this._index < this._size) {
      this._next();
    }
  }
}
class FindLimitObject extends AigleLimitObject {

  constructor(object, iterator, limit) {
    super(object, iterator, limit);
  }

  _callResolve(value, index) {
    if (this._promise._resolved !== 0) {
      return;
    }
    if (value) {
      this._promise._resolve(this._object[this._keys[index]]);
    } else if (--this._rest === 0) {
      this._promise._resolve();
    } else if (this._index < this._size) {
      this._next();
    }
  }
}

module.exports = { findLimit, FindLimitArray, FindLimitObject };

/**
 * @param {Array|Object} collection
 * @param {integer} [limit=8]
 * @param {Function} iterator
 * @return {Aigle} Returns an Aigle instance
 * @example
 * const order = [];
 * const collection = [1, 5, 3, 4, 2];
 * const iterator = (num, index) => {
 *   return Aigle.delay(num * 10)
 *     .then(() => {
 *       order.push(num);
 *       return num % 2 === 0;
 *     });
 * };
 * Aigle.findLimit(collection, 2, iterator)
 *   .then(value => {
 *     console.log(value); // 2
 *     console.log(order); // [1, 3, 5, 2];
 *   });
 *
 * @example
 * const order = [];
 * const collection = {
 *   task1: 1,
 *   task2: 5,
 *   task3: 3,
 *   task4: 4,
 *   task5: 2
 * };
 * const iterator = (num, key) => {
 *   return Aigle.delay(num * 10)
 *     .then(() => {
 *       order.push(num);
 *       return num % 2 === 0;
 *     });
 * };
 * Aigle.findLimit(collection, 2, iterator)
 *   .then(value => {
 *     console.log(value); // 2
 *     console.log(order); // [1, 3, 5, 2];
 *   });
 *
 * @example
 * const order = [];
 * const collection = [1, 5, 3, 4, 2];
 * const iterator = num => {
 *   return Aigle.delay(num * 10)
 *     .then(() => {
 *       order.push(num);
 *       return num % 2 === 0;
 *     });
 * };
 * Aigle.findLimit(collection, iterator)
 *   .then(value => {
 *     console.log(value); // 2
 *     console.log(order); // [1, 2];
 *   });
 */
function findLimit(collection, limit, iterator) {
  if (typeof limit === 'function') {
    iterator = limit;
    limit = DEFAULT_LIMIT;
  }
  if (Array.isArray(collection)) {
    return new FindLimitArray(collection, iterator, limit)._iterate();
  }
  if (collection && typeof collection === 'object') {
    return new FindLimitObject(collection, iterator, limit)._iterate();
  }
  return Aigle.resolve();
}