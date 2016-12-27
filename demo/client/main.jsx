import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import { EJSON } from 'meteor/ejson';
import MainApp from '../imports/app/MainApp';

window.onload = () => {
  // Get initial context transmitted as a script
  const context = EJSON.parse(window.initialReactContext);
  // Get the React root element
  const div = document.getElementById('react');
  // Render and start the application
  render(<MainApp context={context} />, div);
};
