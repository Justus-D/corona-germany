import React from 'react';
import { Redirect } from 'react-router-dom';

import Header from './Header';
import Loading from "./Loading";
import Fehler from "./Fehler";

const API_URL = "https://corona-germany-api.justus-d.de";

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

export default class AGS extends React.Component {
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
