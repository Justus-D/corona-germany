import React from 'react';
import { Redirect } from 'react-router-dom';

import Header from './Header';
import Loading from "./Loading";
import Fehler from "./Fehler";
import BistOffline from './BistOffline';

const API_URL = "https://corona-germany-api.justus-d.de";

export function formatDate(date: string): string {
	let a = date.split("-");
	return a[2]+"."+a[1]+"."+a[0];
}
function RenderAGS(props: any) {
	// const AGS: string = props.AGS;
	// const JSONresponse: any = props.JSONresponse;
	let historyArray: any = props.historyArray;

	var len: number;
	try {
		len = historyArray.length;
	} catch (e) {
		return <Fehler />;
	}
	let top5 = (
		<div className="top5">
			<div key="d1" className="date">{formatDate(historyArray[len-1]["date"].substr(0,10))}</div>
			<div key="i1" className="incidence">{historyArray[len-1]["weekIncidence"].toFixed(1)}</div>
			<div key="d2" className="date">{formatDate(historyArray[len-2]["date"].substr(0,10))}</div>
			<div key="i2" className="incidence">{historyArray[len-2]["weekIncidence"].toFixed(1)}</div>
			<div key="d3" className="date">{formatDate(historyArray[len-3]["date"].substr(0,10))}</div>
			<div key="i3" className="incidence">{historyArray[len-3]["weekIncidence"].toFixed(1)}</div>
			<div key="d4" className="date date-dim">{formatDate(historyArray[len-4]["date"].substr(0,10))}</div>
			<div key="i4" className="incidence incidence-dim">{historyArray[len-4]["weekIncidence"].toFixed(1)}</div>
			<div key="d5" className="date date-dim">{formatDate(historyArray[len-5]["date"].substr(0,10))}</div>
			<div key="i5" className="incidence incidence-dim">{historyArray[len-5]["weekIncidence"].toFixed(1)}</div>
		</div>
	);

	let tableData = [];
	for (var i = len - 1-5; i >= 0; i--) {
		tableData.push(
			<div className="table-item" key={historyArray[i]["date"].substr(0,10)}>
				{formatDate(historyArray[i]["date"].substr(0,10))}:&nbsp;
				{historyArray[i]["weekIncidence"].toFixed(1)}
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
			<Header title={props.title} subtitle="7-Tage-Inzidenzen der letzten f&uuml;nf Tage" />
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
			response: null
		};
	}
	componentDidMount() {
		var that = this;
		let endpoint: string;
		switch (this.state.ags) {
			case "germany":
				endpoint = `${API_URL}/germany/history/incidence`;
				break;
			case "none":
				endpoint = `${API_URL}/states/${this.state.stateKey}/history/incidence`;
				break;
			default:
				endpoint = `${API_URL}/districts/${this.state.ags}/history/incidence`;
				break;
		}
		fetch(endpoint)
			.then(r => r.json())
			.then(data => this.setState({response: data, loading: false}))
			.catch(function(e) {
				that.setState({error: true, loading: false, online: navigator.onLine})
			})
		;
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
		switch (this.state.ags) {
			case "germany":
				historyArray = this.state.response.data;
				title = "Deutschland"
				break;
			case "none":
				historyArray = this.state.response.data[this.state.stateKey||0].history;
				title = this.state.response.data[this.state.stateKey||0].name;
				break;
			default:
				historyArray = this.state.response["data"][this.state.ags]["history"];
				title = this.state.response["data"][this.state.ags]["name"] || "Inzidenzen"
				break;
		}
		try {
			return (
				<RenderAGS
					AGS={this.state.ags}
					title={title}
					JSONresponse={this.state.response}
					historyArray={historyArray}
				/>
			);
		} catch (e) {
			console.error(e)
			return <Redirect to="/" />;
		}
	}
}
