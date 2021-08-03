import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

if (window.location.pathname.substr(-1,1) !== "/") {
  window.location.pathname = window.location.pathname+'/';
}

// console.log("%cCorona 7-Tage-Inzidenz der letzten Tage", "color: #000; background-color: black; padding: 20px;");
console.log("%cCorona 7-Tage-Inzidenz der letzten Tage", "color: #0f0; background-color: black; padding: 20px;");
// console.log("%cCorona 7-Tage-Inzidenz der letzten Tage", "color: #000; background-color: black; padding: 20px;");

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

serviceWorkerRegistration.register();
