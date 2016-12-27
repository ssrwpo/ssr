import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import MainApp from '../imports/app/MainApp';
import { EJSON } from 'meteor/ejson';

Meteor.startup(() => {
  const context = EJSON.parse(window.initialReactContext);
  const div = document.getElementById('react');
  render(<MainApp context={context} />, div);
});
