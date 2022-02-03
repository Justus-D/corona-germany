import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect
} from "react-router-dom";
import React from 'react';

// Components
import Footer from "./components/Footer";
import States from "./components/States";
import State from "./components/State";
import AGS from "./components/AGS";
import Top from "./components/Top";
import FAQ from "./components/FAQ";

export const API_URL = "https://corona-germany-api.justus-d.de";

function App() {
	return (
		<Router>
			<div className="root-wrapper">
				<Switch>
					<Route exact path="/">
						<Redirect to="/incidence/" />
					</Route>
					<Route path="/incidence/hospital/germany" component={AGS} />
					<Route path="/incidence/hospital/state/:stateKey" component={AGS} />
					<Route path="/incidence/state/:stateKey/all" component={AGS} />
					<Route path="/incidence/state/:stateKey" component={State} />
					<Route path="/incidence/top" component={Top} />
					<Route path="/incidence/district/:ags" component={AGS} />
					{/* <Route path="/incidence/:ags" component={AGS} /> */}
					<Route path="/incidence/germany" component={AGS} />
					<Route path="/incidence/">
						<States />
					</Route>
					<Route path="/faq">
						<FAQ />
					</Route>
					<Route path="/">
						<Redirect to="/incidence/" />
					</Route>
				</Switch>
				<Footer />
			</div>
		</Router>
	);
}

export default App;