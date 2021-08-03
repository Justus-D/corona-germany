import React from "react";
import { Redirect } from "react-router";

import Header from "./Header";
import Loading from "./Loading";

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

export function zusatz(district: any, onlyZusatz?: boolean) {
	var zusatz = "";
	var zusatzStr = "";
	if (zusaetze[district.ags]) {
		if (zusaetze[district.ags] === 2) {
			zusatzStr = district.county.substr(0, zusaetze[district.ags]);
			zusatz = ' <span style="color: #727272;">('+zusatzStr+")</span>";
		} else {
			zusatzStr = zusaetze[district.ags];
			zusatz = ' <span style="color: #727272;">('+zusatzStr+")</span>";
		}
	}
	if (onlyZusatz) {
		return zusatzStr;
	}
	return district.name+zusatz;
}

export default class State extends React.Component {
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
		// var zusatz = "";
		// if (zusaetze[districtsArr[m].ags]) {
		// 	if (zusaetze[districtsArr[m].ags] === 2) {
		// 		zusatz = ' <span style="color: #727272;">('+districtsArr[m].county.substr(0, zusaetze[districtsArr[m].ags])+")</span>";
		// 	} else {
		// 		zusatz = ' <span style="color: #727272;">('+zusaetze[districtsArr[m].ags]+")</span>";
		// 	}
		// }
		let htmlStr = `
			<a class="list-button" href="#${districtsArr[m].ags}">${zusatz(districtsArr[m])}</a>
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