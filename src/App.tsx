// import './App.css';

import {
	BrowserRouter as Router,
	HashRouter,
	Switch,
	Route,
	Link,
	Redirect
} from "react-router-dom";
// import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import React/*, { DetailedReactHTMLElement }*/ from 'react';
// import { ReactElement } from 'react';
// import { ReactHTMLElement } from 'react';
//import ErrorBoundary from './ErrorBoundary';

// Components
import Header from './components/Header';
import Footer from "./components/Footer";

const API_URL = "https://corona-germany-api.justus-d.de";

const statesList = JSON.parse(`{"data":{"BW":{"name":"Baden-Württemberg"},"BY":{"name":"Bayern"},"BE":{"name":"Berlin"},"BB":{"name":"Brandenburg"},"HB":{"name":"Bremen"},"HH":{"name":"Hamburg"},"HE":{"name":"Hessen"},"MV":{"name":"Mecklenburg-Vorpommern"},"NI":{"name":"Niedersachsen"},"NW":{"name":"Nordrhein-Westfalen"},"RP":{"name":"Rheinland-Pfalz"},"SL":{"name":"Saarland"},"SN":{"name":"Sachsen"},"ST":{"name":"Sachsen-Anhalt"},"SH":{"name":"Schleswig-Holstein"},"TH":{"name":"Thüringen"}}}`);
const zusaetze = JSON.parse(`
	{
		"0000":"Zusatz",
		"08121":"SK",
		"08125":"LK",
		"08212":"SK",
		"08215":"LK",
		"09361":"SK",
		"09371":2,
		"09561":2,
		"09571":2,
		"09661":2,
		"09671":2,
		"09761":2,
		"09772":2,
		"09461":2,
		"09471":2,
		"09462":2,
		"09472":2,
		"09463":2,
		"09473":2,
		"09563":2,
		"09573":2,
		"09464":2,
		"09475":2,
		"09261":2,
		"09274":2,
		"09162":2,
		"09184":2,
		"09262":2,
		"09275":2,
		"09362":2,
		"09375":2,
		"09163":2,
		"09187":2,
		"09662":2,
		"09678":2,
		"09263":2,
		"09278":2,
		"09663":2,
		"09679":2,
		"12054":2,
		"12069":2,
		"06411":2,
		"06432":2,
		"06611":2,
		"06633":2,
		"06438":2,
		"06413":2,
		"13003":2,
		"13072":2,
		"03458":2,
		"03403":2,
		"03404":2,
		"03459":2,
		"07312":2,
		"07335":2,
		"07315":2,
		"07339":2,
		"07211":2,
		"07235":2,
		"14713":2,
		"14729":2,
		"16055":2,
		"16071":2
	}
`);

function Loading() {
	return (
		<Header title="Laden..." />
	);
}

function Fehler() {
	return (
		<div>
			<Header title="Ein Fehler ist aufgetreten" />
			<p>Erfahrungsgem&auml;&szlig; ist der Fehler in wenigen Stunden wieder behoben. Meist liegt der Fehler bei der RKI-API.</p>
		</div>
	);
}

function ListItem(props: any): JSX.Element {
	return (
		<div className="list-item">
			<Link to={props.link} className="list-button" key={props.itemKey}>
				{props.name}
			</Link>
		</div>
	);
}


function StatesList(): JSX.Element {
	const statesJSON = statesList;
	var out: any = [];
	const states = Object.keys(statesJSON["data"]);
	var key;
	for (var i = 0; i < states.length; i++) {
		key = states[i];
		out.push(
			<ListItem link={'state/'+key} name={statesJSON["data"][key]["name"]} key={key} itemKey={key} />
		);
	}
	return out;
}

function States() {
	return (
		<div>
			<Header title="Deutschland" subtitle="w&auml;hle dein Bundesland" hideStart={true} />
			<div className="list">
				<StatesList />
			</div>
		</div>
	);
}

function renderDistricts(State: string, JSONresponse: any) {
	var districtsArr = [];
	var districts = Object.keys(JSONresponse["data"]);
	for (var h = 0; h < districts.length; h++) { // Aus den Objekten Name und AGS in ein Array packen
		if (JSONresponse["data"][districts[h]]["stateAbbreviation"] === State) {
			var key = districts[h];
			districtsArr.push({ ags: key, name: JSONresponse["data"][key]["name"], county: JSONresponse["data"][key]["county"] });
		}
	}
	for (var i = districtsArr.length-1; i > 0; i--) { // Array alphabetisch sortieren
		for (var j = 0; j < i; j++) {
			if (districtsArr[j].name.localeCompare(districtsArr[j+1].name, "de-DE") === 1) {
				var temp: any = districtsArr[j];
				districtsArr[j] = districtsArr[j+1];
				districtsArr[j+1] = temp;
			}
		}
	}
	var out = [];
	for (var m = 0; m < districtsArr.length; m++) {
		var zusatz = "";
		if (zusaetze[districtsArr[m].ags]) {
			if (zusaetze[districtsArr[m].ags] === 2) {
				zusatz = ' <span style="color: #727272;">('+districtsArr[m].county.substr(0, zusaetze[districtsArr[m].ags])+")</span>";
			} else {
				zusatz = ' <span style="color: #727272;">('+zusaetze[districtsArr[m].ags]+")</span>";
			}
		}
		let htmlStr = `
			<a class="list-button" href="#${districtsArr[m].ags}">${districtsArr[m].name}${zusatz}</a>
		`; // Vielleicht später nochmal in JSX umschreiben...
		out.push(<div key={districtsArr[m].ags} className="list-item" dangerouslySetInnerHTML={{__html: htmlStr}}></div>);
	}
	return (
		<div>
			<Header title={statesList.data[State].name} subtitle="wähle deinen Landkreis" />
			<div className="list">
				{out}
			</div>
		</div>
	);
}

class State extends React.Component {
	state: {
		loading: boolean,
		stateKey: string,
		response: any
	};
	props: any;
	constructor(props: any) {
		super(props);
		this.props = props;
		this.state = {
			loading: true,
			stateKey: this.props.match.params.stateKey,
			response: null
		};
	}
	componentDidMount() {
		fetch(/*API_URL + */'/districts_Snapshot_2021-07-30.json')
			.then(r => r.json())
			.then(data => this.setState({response: data, loading: false}))
		;
		// this.setState({response: districtsSnapshot, loading: false});
	}
	render() {
		if (this.state.loading) {
			return (
				<Loading />
			);
		}
		try {
			return renderDistricts(this.state.stateKey, this.state.response);
		} catch (e) {
			return <Redirect to="/" />;
		}
	}
}
function formatDate(date: string): string {
	let a = date.split("-");
	return a[2]+"."+a[1]+"."+a[0];
}
function RenderAGS(props: any) {
	const AGS: string = props.AGS;
	const JSONresponse: any = props.JSONresponse;

	var len: number;
	try {
		len = JSONresponse["data"][AGS]["history"].length;
	} catch (e) {
		return <Fehler />;
	}
	let top5 = (
		<div className="top5">
			<div key="d1" className="date">{formatDate(JSONresponse["data"][AGS]["history"][len-1]["date"].substr(0,10))}</div>
			<div key="i1" className="incidence">{JSONresponse["data"][AGS]["history"][len-1]["weekIncidence"].toFixed(1)}</div>
			<div key="d2" className="date">{formatDate(JSONresponse["data"][AGS]["history"][len-2]["date"].substr(0,10))}</div>
			<div key="i2" className="incidence">{JSONresponse["data"][AGS]["history"][len-2]["weekIncidence"].toFixed(1)}</div>
			<div key="d3" className="date">{formatDate(JSONresponse["data"][AGS]["history"][len-3]["date"].substr(0,10))}</div>
			<div key="i3" className="incidence">{JSONresponse["data"][AGS]["history"][len-3]["weekIncidence"].toFixed(1)}</div>
			<div key="d4" className="date date-dim">{formatDate(JSONresponse["data"][AGS]["history"][len-4]["date"].substr(0,10))}</div>
			<div key="i4" className="incidence incidence-dim">{JSONresponse["data"][AGS]["history"][len-4]["weekIncidence"].toFixed(1)}</div>
			<div key="d5" className="date date-dim">{formatDate(JSONresponse["data"][AGS]["history"][len-5]["date"].substr(0,10))}</div>
			<div key="i5" className="incidence incidence-dim">{JSONresponse["data"][AGS]["history"][len-5]["weekIncidence"].toFixed(1)}</div>
		</div>
	);

	let tableData = [];
	for (var i = len - 1-5; i >= 0; i--) {
		tableData.push(
			<div className="table-item" key={JSONresponse["data"][AGS]["history"][i]["date"].substr(0,10)}>
				{formatDate(JSONresponse["data"][AGS]["history"][i]["date"].substr(0,10))}:&nbsp;
				{JSONresponse["data"][AGS]["history"][i]["weekIncidence"].toFixed(1)}
			</div>
		);
	}
	let table = (
		<div>
			<div className="show-table" dangerouslySetInnerHTML={{__html: `<button class="list-button" onclick="document.getElementById('table').hidden = false; this.remove();">Alle Werte anzeigen</button>`}} />
			<div id="table" hidden>{tableData}</div>
		</div>
	);

/*<button id="list-button" className="list-button" onClick={() => { document.getElementById('table').hidden = false; document.getElementById("list-button").remove(); }}>Alle Werte anzeigen</button>*/

	return (
		<div>
			<Header title={JSONresponse["data"][AGS]["name"]} subtitle="7-Tage-Inzidenzen der letzten f&uuml;nf Tage" />
			{top5}
			{table}
		</div>
	);
}

class AGS extends React.Component {
	props: any;
	state: {
		loading: boolean,
		error: boolean,
		ags: string,
		response: any
	};
	constructor(props: any) {
		super(props);
		this.props = props;
		this.state = {
			loading: true,
			error: false,
			ags: this.props.match.params.ags,
			response: null
		};
	}
	componentDidMount() {
		var that = this;
		fetch(API_URL+"/districts/"+this.state.ags+"/history/incidence")
			.then(r => r.json())
			.then(data => this.setState({response: data, loading: false}))
			.catch(function(e) {
				that.setState({error: true, loading: false})
			})
		;
	}
	render() {
		if (this.state.loading) {
			return (
				<Loading />
			);
		}
		if (this.state.error) {
			return <Fehler />;
		}
		try {
			return (
				<RenderAGS AGS={this.state.ags} JSONresponse={this.state.response} />
			);
		} catch (e) {
			return <Redirect to="/" />;
		}
	}
}

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
								<Route path="/state/:stateKey" component={State} />
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