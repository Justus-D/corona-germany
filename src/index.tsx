import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import App from './App';
import Fehler from './components/Fehler';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

if (window.location.pathname.substr(-1,1) !== "/") {
  window.location.pathname = window.location.pathname+'/';
}

console.log("%cCorona 7-Tage-Inzidenz der letzten Tage", "color: #0f0; background-color: black; padding: 20px;");

ReactDOM.render(
  <>
  {
    (()=>{
      try {
        return <App />
      } catch (e) {
        console.error(e)
        return (
          <div className="root-wrapper">
            <Fehler />
          </div>
        )
      }
    })()
  }
  </>,
  document.getElementById('root')
);

serviceWorkerRegistration.register();
