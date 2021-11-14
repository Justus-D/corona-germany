// import './App.css';

import {
	BrowserRouter as Router,
	HashRouter,
	Switch,
	Route,
	// Link,
	Redirect
} from "react-router-dom";
// import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import React/*, { DetailedReactHTMLElement }*/ from 'react';
// import { ReactElement } from 'react';
// import { ReactHTMLElement } from 'react';
//import ErrorBoundary from './ErrorBoundary';

// Components
// import Header from './components/Header';
import Footer from "./components/Footer";
// import Loading from "./components/Loading";
// import Fehler from "./components/Fehler";
import States from "./components/States";
import State from "./components/State";
import AGS from "./components/AGS";
import Top from "./components/Top";

export const API_URL = "https://corona-germany-api.justus-d.de";

function App() {
	return (
		<Router>
			<Switch>
				<Route path="/incidence/">
					<HashRouter hashType="noslash">
						<div className="wrapper">
							<Switch>
								<Route exact path="/">
									<States />
								</Route>
								<Route path="/state/:stateKey/all" component={AGS} />
								<Route path="/state/:stateKey" component={State} />
								<Route path="/top" component={Top} />
								<Route path="/:ags" component={AGS} />
							</Switch>
						</div>
						<Footer />
					</HashRouter>
				</Route>
				<Route path="/">
					<Redirect to="/incidence/" />
				</Route>
			</Switch>
		</Router>
	);
}

export default App;