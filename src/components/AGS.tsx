import React from 'react';
import { Redirect } from 'react-router-dom';

import Header from './Header';
import Loading from "./Loading";
import Fehler from "./Fehler";
import BistOffline from './BistOffline';
import { parseHosIncidence } from '../hosIncidenceParser';
import { statesList } from './State'

import { API_URL } from '../App';

export function formatDate(date: string): string {
	let a = date.split("-");
	return a[2]+"."+a[1]+"."+a[0];
}
function RenderAGS(props: any) {
	// const AGS: string = props.AGS;
	// const JSONresponse: any = props.JSONresponse;
	interface hEntry {
		weekIncidence: number,
		date: string
	}
	let historyArray: Array<hEntry> | any = props.historyArray;
	let p: number = props.precision || 1;

	var len: number;
	try {
		len = historyArray.length;
	} catch (e) {
		return <Fehler />;
	}
	let top5 = (
		<div className="top5">
			<div key="d1" className="date">{formatDate(historyArray[len-1]["date"].substr(0,10))}</div>
			<div key="i1" className="incidence">{historyArray[len-1]["weekIncidence"].toFixed(p)}</div>
			<div key="d2" className="date">{formatDate(historyArray[len-2]["date"].substr(0,10))}</div>
			<div key="i2" className="incidence">{historyArray[len-2]["weekIncidence"].toFixed(p)}</div>
			<div key="d3" className="date">{formatDate(historyArray[len-3]["date"].substr(0,10))}</div>
			<div key="i3" className="incidence">{historyArray[len-3]["weekIncidence"].toFixed(p)}</div>
			<div key="d4" className="date date-dim">{formatDate(historyArray[len-4]["date"].substr(0,10))}</div>
			<div key="i4" className="incidence incidence-dim">{historyArray[len-4]["weekIncidence"].toFixed(p)}</div>
			<div key="d5" className="date date-dim">{formatDate(historyArray[len-5]["date"].substr(0,10))}</div>
			<div key="i5" className="incidence incidence-dim">{historyArray[len-5]["weekIncidence"].toFixed(p)}</div>
		</div>
	);

	let tableData = [];
	for (var i = len - 1-5; i >= 0; i--) {
		tableData.push(
			<div className="table-item" key={historyArray[i]["date"].substr(0,10)}>
				{formatDate(historyArray[i]["date"].substr(0,10))}:&nbsp;
				{historyArray[i]["weekIncidence"].toFixed(p)}
			</div>
		);
	}
	let table = (
		<div>
			<div className="show-table" dangerouslySetInnerHTML={{__html: `<button class="list-button" onclick="document.getElementById('table').hidden = false; this.remove();">Alle Werte anzeigen</button>`}} />
			<div id="table" hidden>{tableData}</div>
		</div>
	);

	return (
		<div>
			<Header title={props.title} subtitle={props.subtitle || "7-Tage-Inzidenzen der letzten fünf Tage"} />
			{top5}
			{table}
		</div>
	);
}

export default class AGS extends React.Component {
	props: any;
	state: {
		loading: boolean,
		error: boolean,
		online: boolean,
		ags: string,
		germany: boolean,
		stateKey: string | null,
		bundeslandName: string | null
		mode: string,
		response: any
	};
	constructor(props: any) {
		super(props);
		this.props = props;
		this.state = {
			loading: true,
			error: false,
			online: navigator.onLine,
			ags: this.props.match.params.ags || "none",
			germany: this.props.match.params.germany || false,
			stateKey: this.props.match.params.stateKey || "none",
			bundeslandName: null,
			mode: "district",
			response: null
		};
		// console.log(this.props)
	}
	componentDidMount() {
		var that = this;
		let endpoint: string;

		if (this.props.location.pathname.substr(0, 18) === "/incidence/germany") {
			endpoint = `${API_URL}/germany/history/incidence`;
			this.setState({mode: "germany"})
		} else if (this.props.location.pathname.substr(0, 16) === "/incidence/state") {
			endpoint = `${API_URL}/states/${this.state.stateKey}/history/incidence`;
			this.setState({mode: "state"})
		} else if (this.props.location.pathname.substr(0, 19) === "/incidence/district") {
			endpoint = `${API_URL}/districts/${this.state.ags}/history/incidence`;
			this.setState({mode: "district"})
		} else if (this.props.location.pathname.substr(0, 19) === "/incidence/hospital") {
			endpoint = ""
			this.setState({mode: "hospital"})
			let blandId = 0
			if (this.state.stateKey !== "none") {
				blandId = statesList.data[this.state.stateKey||0].id
				this.setState({ bundeslandName: statesList.data[this.state.stateKey||0].name })
			}
			fetch("https://raw.githubusercontent.com/robert-koch-institut/COVID-19-Hospitalisierungen_in_Deutschland/master/Aktuell_Deutschland_COVID-19-Hospitalisierungen.csv")
				.then(r => r.text())
				.then(rawCSV => {
					this.setState({
						response: { data: { history: parseHosIncidence(rawCSV, blandId) } },
						loading: false
					})
				})
				.catch(e => {
					this.setState({error: true, loading: false, online: navigator.onLine})
				})
			;
		} else {
			endpoint = `${API_URL}/germany/history/incidence`
		}
		if (endpoint !== "") {
			fetch(endpoint)
				.then(r => r.json())
				.then(data => this.setState({response: data, loading: false}))
				.catch(function(e) {
					that.setState({error: true, loading: false, online: navigator.onLine})
				})
			;
		}
	}
	render() {
		if (this.state.loading) {
			return <Loading />;
		}
		if (this.state.error) {
			if (!this.state.online) {
				return <BistOffline />;
			}
			return <Fehler />;
		}
		let historyArray: any = [];
		let title: string = "Inzidenzen";
		let subtitle: string | null = null
		let precision: number | null = null
		try {
			switch (this.state.mode) {
				case "germany":
					historyArray = this.state.response.data;
					title = "Deutschland"
					break;
				case "state":
					historyArray = this.state.response.data[this.state.stateKey||0].history;
					title = this.state.response.data[this.state.stateKey||0].name;
					break;
				case "hospital":
					historyArray = this.state.response.data.history;
					title = this.state.bundeslandName || "Deutschland";
					subtitle = "Hospitalisierungsinzidenzen der letzten Tage"
					precision = 2
					break;
				default:
					historyArray = this.state.response["data"][this.state.ags]["history"];
					title = this.state.response["data"][this.state.ags]["name"] || "Inzidenzen"
					break;
			}
		} catch (e) {
			console.error(e)
			return <Redirect to="/incidence" />
		}
		try {
			return (
				<RenderAGS
					AGS={this.state.ags}
					title={title}
					subtitle={subtitle}
					JSONresponse={this.state.response}
					historyArray={historyArray}
					precision={precision}
				/>
			);
		} catch (e) {
			console.error(e)
			return <Redirect to="/incidence" />;
		}
	}
}
