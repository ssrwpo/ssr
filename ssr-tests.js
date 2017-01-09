// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by ssr.js.
import { name as packageName } from "meteor/ssrwpo:ssr";

// Write your tests here!
// Here is an example.
Tinytest.add('ssr - example', function (test) {
  test.equal(packageName, "ssr");
});
