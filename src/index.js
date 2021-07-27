import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

if (window.location.pathname.substr(-1,1) !== "/") {
  window.location.pathname = window.location.pathname+'/';
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
