import './App.css';

import {
	//BrowserRouter as Router,
	HashRouter,
	Switch,
	Route,
	Link,
	Redirect
} from "react-router-dom";
// import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import React from 'react';

const API_URL = "https://corona-germany-api.justus-d.de";

const statesList = JSON.parse(`{"data":{"BW":{"name":"Baden-Württemberg"},"BY":{"name":"Bayern"},"BE":{"name":"Berlin"},"BB":{"name":"Brandenburg"},"HB":{"name":"Bremen"},"HH":{"name":"Hamburg"},"HE":{"name":"Hessen"},"MV":{"name":"Mecklenburg-Vorpommern"},"NI":{"name":"Niedersachsen"},"NW":{"name":"Nordrhein-Westfalen"},"RP":{"name":"Rheinland-Pfalz"},"SL":{"name":"Saarland"},"SN":{"name":"Sachsen"},"ST":{"name":"Sachsen-Anhalt"},"SH":{"name":"Schleswig-Holstein"},"TH":{"name":"Thüringen"}}}`);

function Loading() {
	return (
		<Header title="Laden..." />
	);
}

function ListItem(props) {
	return (
		<div className="list-item">
			<Link to={props.link} className="list-button">
				{props.name}
			</Link>
		</div>
	);
}


function StatesList() {
	const statesJSON = statesList;
	var out = [];
	const states = Object.keys(statesJSON["data"]);
	var key;
	for (var i = 0; i < states.length; i++) {
		key = states[i];
		out.push(
			<ListItem link={'state/'+key} name={statesJSON["data"][key]["name"]} />
		);
	}
	return out;
}

function Header(props) {
	return (
		<div>
			{props.hideStart ? null : <a href="#" className="list-button start">Start</a>}
			<div className="heading">{props.title}</div>
			{props.subtitle ? <div className="description">{props.subtitle}</div> : null}
		</div>
	);
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

function renderDistricts(State, JSONresponse) {
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
				var temp = districtsArr[j];
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
		out.push(<div className="list-item" dangerouslySetInnerHTML={{__html: htmlStr}}></div>);
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
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			stateKey: this.props.match.params.stateKey,
			response: null
		};
	}
	componentDidMount() {
		fetch(API_URL + '/districts')
			.then(r => r.json())
			.then(data => this.setState({response: data, loading: false}))
		;
	}
	render() {
		if (this.state.loading) {
			return (
				<Loading />
			);
		}
		return renderDistricts(this.state.stateKey, this.state.response);
	}
}
function formatDate(date) {
	var a = date.split("-");
	return a[2]+"."+a[1]+"."+a[0];
}
function renderAGS(AGS, JSONresponse) {
	const len = JSONresponse["data"][AGS]["history"].length;
	var out = "";
	out += `
			<div class="top5">
				<div class="date">${formatDate(JSONresponse["data"][AGS]["history"][len-1]["date"].substr(0,10))}</div>
				<div class="incidence">${JSONresponse["data"][AGS]["history"][len-1]["weekIncidence"].toFixed(1)}</div>
				<div class="date">${formatDate(JSONresponse["data"][AGS]["history"][len-2]["date"].substr(0,10))}</div>
				<div class="incidence">${JSONresponse["data"][AGS]["history"][len-2]["weekIncidence"].toFixed(1)}</div>
				<div class="date">${formatDate(JSONresponse["data"][AGS]["history"][len-3]["date"].substr(0,10))}</div>
				<div class="incidence">${JSONresponse["data"][AGS]["history"][len-3]["weekIncidence"].toFixed(1)}</div>
				<div class="date date-dim">${formatDate(JSONresponse["data"][AGS]["history"][len-4]["date"].substr(0,10))}</div>
				<div class="incidence incidence-dim">${JSONresponse["data"][AGS]["history"][len-4]["weekIncidence"].toFixed(1)}</div>
				<div class="date date-dim">${formatDate(JSONresponse["data"][AGS]["history"][len-5]["date"].substr(0,10))}</div>
				<div class="incidence incidence-dim">${JSONresponse["data"][AGS]["history"][len-5]["weekIncidence"].toFixed(1)}</div>
			</div>
			<div class="show-table"><button class="list-button" onclick="document.getElementById('table').hidden = false; this.remove();">Alle Werte anzeigen</button></div>
			<div id="table" hidden>
	`;
	for (var i = len - 1-5; i >= 0; i--) {
		out += `
				<div class="table-item">
					${formatDate(JSONresponse["data"][AGS]["history"][i]["date"].substr(0,10))}:&nbsp;
					${JSONresponse["data"][AGS]["history"][i]["weekIncidence"].toFixed(1)}
				</div>
		`;
	}
	out += `
			</div>
	`;
	return (
		<div>
			<Header title={JSONresponse["data"][AGS]["name"]} subtitle="7-Tage-Inzidenzen der letzten f&uuml;nf Tage" />
			<div dangerouslySetInnerHTML={{__html: out}} />
		</div>
	);
}

class AGS extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			ags: this.props.match.params.ags,
			response: null
		};
	}
	componentDidMount() {
		fetch(API_URL+"/districts/"+this.state.ags+"/history/incidence")
			.then(r => r.json())
			.then(data => this.setState({response: data, loading: false}))
		;
	}
	render() {
		if (this.state.loading) {
			return (
				<Loading />
			);
		}
		try {
			return (
				renderAGS(this.state.ags, this.state.response)
			);
		} catch (e) {
			return <Redirect to="/" />;
		}
	}
}

function Footer() {
	return (
		<footer>
			<span>Datenquelle: RKI (siehe GitHub: <a className="footer" href="https://github.com/marlon360/rki-covid-api#data-sources" target="_BLANK" rel="noreferrer">rki-covid-api</a>)</span><br />
			<span>Alle Angaben ohne Gew&auml;hr.</span>
		</footer>
	);
}

function App() {
	return (
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
	);
}

export default App;