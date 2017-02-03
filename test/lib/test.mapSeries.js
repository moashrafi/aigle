'use strict';

const assert = require('assert');

const parallel = require('mocha.parallel');
const Aigle = require('../../');
const DELAY = require('../config').DELAY;

parallel('mapSeries', () => {

  it('should execute on parallel', () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key) => {
      return new Aigle(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value * 2);
      }, DELAY * value));
    };
    return Aigle.mapSeries(collection, iterator)
      .then(res => {
        assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
        assert.deepEqual(res, [2, 8, 4]);
        assert.deepEqual(order, [
          [0, 1],
          [1, 4],
          [2, 2]
        ]);
      });
  });

  it('should execute with object collection on parallel', () => {

    const order = [];
    const collection = {
      task1: 1,
      task2: 4,
      task3: 2
    };
    const iterator = (value, key) => {
      return new Aigle(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value * 2);
      }, DELAY * value));
    };
    return Aigle.mapSeries(collection, iterator)
      .then(res => {
        assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
        assert.deepEqual(res, [2, 8, 4]);
        assert.deepEqual(order, [
          ['task1', 1],
          ['task2', 4],
          ['task3', 2]
        ]);
      });
  });

  it('should throw TypeError', () => {

    const collection = [1, 4, 2];
    const iterator = value => {
      value.test();
    };
    return Aigle.mapSeries(collection, iterator)
      .then(() => assert.ok(false))
      .catch(TypeError, error => {
        assert.ok(error);
        assert.ok(error instanceof TypeError);
      });
  });
});

parallel('#mapSeries', () => {

  it('should execute on parallel', () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key) => {
      return new Aigle(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value * 2);
      }, DELAY * value));
    };
    return Aigle.resolve(collection)
      .mapSeries(iterator)
      .then(res => {
        assert.deepEqual(res, [2, 8, 4]);
        assert.deepEqual(order, [
          [0, 1],
          [1, 4],
          [2, 2]
        ]);
      });
  });

  it('should execute with object collection on parallel', () => {
    const order = [];
    const collection = {
      task1: 1,
      task2: 4,
      task3: 2
    };
    const iterator = (value, key) => {
      return new Aigle(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value * 2);
      }, DELAY * value));
    };
    return Aigle.resolve(collection)
      .mapSeries(iterator)
      .then(res => {
        assert.deepEqual(res, [2, 8, 4]);
        assert.deepEqual(order, [
          ['task1', 1],
          ['task2', 4],
          ['task3', 2]
        ]);
      });
  });

  it('should throw TypeError', () => {

    const collection = [1, 4, 2];
    const iterator = value => {
      value.test();
    };
    return Aigle.resolve(collection)
      .mapSeries(iterator)
      .then(() => assert.ok(false))
      .catch(TypeError, error => {
        assert.ok(error);
        assert.ok(error instanceof TypeError);
      });
  });
});

