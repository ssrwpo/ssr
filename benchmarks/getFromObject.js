/* eslint-disable import/no-extraneous-dependencies, no-console, func-names */
const { Suite } = require('benchmark');
const { Map } = require('immutable');
const Receptacle = require('receptacle');

// Mock Object, Map, Receptacle
console.log('Mocking data...');
const NB_ITEMS = 10;
const items = Array.from(Array(10000).keys(), idx => idx);
const obj = items.reduce((acc, key) =>
  ({ ...acc, [`url${key}`]: { head: `head${key}`, body: `body${key}` } })
, {});
const map = items.reduce((acc, key) =>
  acc.set(`url${key}`, { head: `head${key}`, body: `body${key}` })
, new Map());
const receptacle = new Receptacle({ max: NB_ITEMS + 1 });
items.forEach(key => receptacle.set(`url${key}`, { head: `head${key}`, body: `body${key}` }, { ttl: 1000 }));

const noop = () => {};

// Test suite for: get
const getSuite = new Suite();
console.log('\n\ngetSuite starting...');
getSuite
  .add('Object.get', () => {
    const val = 'url0';
    const dummy = obj[val];
    noop(dummy);
  })
  .add('Map.get', () => {
    const dummy = map.get('url0');
    noop(dummy);
  })
  .add('Receptacle.get', () => {
    const dummy = receptacle.get('url0');
    noop(dummy);
  })
  .on('cycle', e => console.log(e.target.name, ':', e.target.stats.mean * 1000 * 1000, 'μs'))
  .on('complete', function () { console.log(`Fastest is ${this.filter('fastest').map('name')}`); })
  .run();

// Test suite for: has
const hasSuite = new Suite();
console.log('\n\nhasSuite starting...');
hasSuite
  .add('Object.has', () => {
    const val = 'url0';
    const dummy = Object.prototype.hasOwnProperty.call(obj, val);
    noop(dummy);
  })
  .add('Map.has', () => {
    const dummy = map.has('url0');
    noop(dummy);
  })
  .add('Receptacle.has', () => {
    const dummy = receptacle.has('url0');
    noop(dummy);
  })
  .on('cycle', e => console.log(e.target.name, ':', e.target.stats.mean * 1000 * 1000, 'μs'))
  .on('complete', function () { console.log(`Fastest is ${this.filter('fastest').map('name')}`); })
  .run();
