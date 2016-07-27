/* global it */
'use strict';

const assert = require('assert');

const parallel = require('mocha.parallel');
const Promise = require('../../');
const DELAY = require('../config').DELAY;

parallel('#Promise', () => {

  it('should resolve on synchronous', done => {

    let called = 0;
    new Promise(resolve => {
      resolve(0);
      ++called;
    })
    .then(value => {
      assert.strictEqual(value, 0);
      ++called;
      return ++value;
    })
    .then(value => {
      assert.strictEqual(value, 1);
      ++called;
      assert.strictEqual(called, 3);
      done();
    });
  });

  it('should resolve on asynchronous', done => {

    let called = 0;
    new Promise(resolve => {
      setTimeout(() => {
        called++;
        resolve(0);
      }, DELAY);
    })
    .then(value => {
      assert.strictEqual(value, 0);
      return new Promise(resolve => {
        setTimeout(() => {
          called++;
          resolve(1);
        }, DELAY);
      });
    })
    .then(value => {
      assert.strictEqual(value, 1);
      called++;
      assert.strictEqual(called, 3);
      done();
    });
  });

  it('should catch an error', done => {

    var str = 'test';
    var called = 0;
    new Promise((resolve, reject) => {
      reject(new Error('error'));
      called++;
    })
    .catch(err => {
      assert.ok(err);
      called++;
      return str;
    })
    .then(res => {
      assert.strictEqual(res, str);
      called++;
      assert.strictEqual(called, 3);
      done();
    });
  });

  it('should catch TypeError from error type', done => {

    var str = 'test';
    var called = 0;
    new Promise((resolve, reject) => {
      reject(new TypeError('error'));
      called++;
    })
    .catch(ReferenceError, TypeError, err => {
      assert.ok(err);
      called++;
      return str;
    })
    // should not be called this function
    .catch(err => {
      assert(false);
      called++;
      return err;
    })
    .then(res => {
      assert.strictEqual(res, str);
      called++;
      assert.strictEqual(called, 3);
      done();
    });
  });

  it('should resolve', done => {

    var str = 'test';
    var p = Promise.resolve(str);
    p.then(res => {
      assert.strictEqual(res, str);
      done();
    });
  });

  it('should reject', done => {

    var called = 0;
    var err = new Error('error');
    var p = Promise.reject(err);
    p.then(res => {
      assert(false);
      called++;
      return res;
    })
    .catch(err => {
      assert.ok(err);
      called++;
      return err;
    })
    .then(err => {
      assert.ok(err);
      called++;
      assert.strictEqual(called, 2);
      done();
    });
  });

  it('should call finally function', done => {

    var called = 0;
    var err = new Error('error');
    var p = Promise.reject(err);
    p.then(res => {
      assert(false);
      called++;
      return res;
    })
    .catch(err => {
      assert.ok(err);
      called++;
      return err;
    })
    .finally(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          called++;
          assert.strictEqual(called, 2);
          reject(new Error('error2'));
        }, DELAY);
      });
    })
    .catch(err => {
      assert.ok(err);
      assert.strictEqual(err.message, 'error2');
      called++;
      assert.strictEqual(called, 3);
      return 'catch';
    })
    .finally(() => {
      called++;
      assert.strictEqual(called, 4);
      return 'finally';
    })
    .then(res => {
      assert.strictEqual(res, 'catch');
      called++;
      assert.strictEqual(called, 5);
      done();
    });
  });
});
