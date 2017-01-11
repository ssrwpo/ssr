/* eslint-disable import/no-extraneous-dependencies, no-console, func-names */
const { Suite } = require('benchmark');
const { Map } = require('immutable');

// Mock an Object and a Map
const items = Array.from(Array(10000).keys(), idx => idx);
const obj = items.reduce((acc, key) =>
  ({ ...acc, [`url${key}`]: { head: `head${key}`, body: `body${key}` } })
, {});
const map = items.reduce((acc, key) =>
  acc.set(`url${key}`, { head: `head${key}`, body: `body${key}` })
, new Map());

const noop = () => {};

// Test suite
const suite = new Suite();
suite
  .add('Object.get', () => {
    const val = 'url0';
    const dummy = obj[val];
    noop(dummy);
  })
  .add('Map.get', () => {
    const dummy = map.get('url0');
    noop(dummy);
  })
  .on('cycle', e => console.log(e.target.name, ':', e.target.times.elapsed))
  .on('complete', function () { console.log(`Fastest is ${this.filter('fastest').map('name')}`); })
  .run();
