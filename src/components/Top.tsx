import React from "react";
import { Link } from "react-router-dom";
import { Online, Offline } from "react-detect-offline";

import Header from "./Header";
import Loading from "./Loading";
import Fehler from "./Fehler";
import { formatDate } from "./AGS";
import { zusatz } from "./State";
import BistOffline from "./BistOffline";

const API_URL = "https://corona-germany-api.justus-d.de";

export default class Top extends React.Component {
	props: any;
	state: {
		loading: boolean,
		error: boolean,
		online: boolean,
		response: any
	};
	constructor(props: any) {
		super(props);
		this.props = props;
		this.state = {
			loading: true,
			error: false,
			online: navigator.onLine,
			response: null
		};
	}
	componentDidMount() {
		var that = this;
		fetch(API_URL+"/districts")
			.then(r => r.json())
			.then(data => this.setState({response: data, loading: false}))
			.catch(function(error) {
				that.setState({error: true, loading: false, online: navigator.onLine});
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
		const dis = this.state.response["data"];
		const disKeys = Object.keys(dis);
		const disLen = disKeys.length;
		var disArr = [];
		for (var i = 0; i < disLen-1; i++) {
			disArr.push(dis[disKeys[i]]);
		}
		for (var j = disArr.length-1; j > 0; j--) {
			for (var k = 0; k < j; k++) {
				if (disArr[k].weekIncidence > disArr[k+1].weekIncidence) {
					let temp: any = disArr[k];
					disArr[k] = disArr[k+1];
					disArr[k+1] = temp;
				}
			}
		}
		var out = [];
		for (let o = disArr.length-1; o > 0; o--) {
			let linkText = disArr[o].weekIncidence.toFixed(1)+' - ' + zusatz(disArr[o]);
			out.push(
				<div className="list-item" key={disArr[o].ags}>
					<Link to={disArr[o].ags} className="list-button" dangerouslySetInnerHTML={{__html: linkText}} />
				</div>
			);
		}
		return (
			<div>
				<Header
					title="H&ouml;chste Inzidenzen"
					subtitle={"Eine Liste der Kreise mit den höchsten Inzidenzen (Stand: "+formatDate(this.state.response.meta.lastUpdate.substr(0,10))+")"}
					hideTop
				/>
				<br />
				{out}
			</div>
		);
	}
}
