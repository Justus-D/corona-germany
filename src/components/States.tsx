import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Header from './Header';
import { API_URL } from '../App';

const statesList = JSON.parse(`{"data":{"BW":{"name":"Baden-Württemberg"},"BY":{"name":"Bayern"},"BE":{"name":"Berlin"},"BB":{"name":"Brandenburg"},"HB":{"name":"Bremen"},"HH":{"name":"Hamburg"},"HE":{"name":"Hessen"},"MV":{"name":"Mecklenburg-Vorpommern"},"NI":{"name":"Niedersachsen"},"NW":{"name":"Nordrhein-Westfalen"},"RP":{"name":"Rheinland-Pfalz"},"SL":{"name":"Saarland"},"SN":{"name":"Sachsen"},"ST":{"name":"Sachsen-Anhalt"},"SH":{"name":"Schleswig-Holstein"},"TH":{"name":"Thüringen"}}}`);

export function ListItem(props: {
		link: string,
		name: string,
		itemKey: string,
		incidence?: string | number,
		zusatz?: string,
		trend?: null | "up" | "down"
	}): JSX.Element {
	return (
		<div className="list-item">
			<Link to={props.link} className="list-button" key={props.itemKey}>
				{props.name}
				{props.zusatz ? <span style={{color: "#727272"}}>{` (${props.zusatz})`}</span> : null}
				{props.incidence ? <span style={{color: "#727272"}}>{" - " + props.incidence}</span> : null}
				{props.trend ? (() => {
					if (props.trend === "up") {
						return <span style={{color: "#727272", fontSize: "13px"}}> ↗</span> // 📈
					}
					if (props.trend === "down") {
						return <span style={{color: "#727272", fontSize: "13px"}}> ↘</span> // 📉
					}
					return null
				})() : null}
			</Link>
		</div>
	);
}

function StateListItem(props: { idKey: string, name: string, incidence?: string | number }): JSX.Element {

	const [stateIncidences, setStateIncidences] = useState<any>(null);
	useEffect(() => {
		fetch(`${API_URL}/states/${props.idKey}/history/incidence/2`)
			.then(r => r.json())
			.then(data => setStateIncidences(data))
			.catch(()=>{})
		;
	}, [props.idKey])

	let trend: null | "up" | "down" = null
	if (stateIncidences) {
		try {
			const historyArray = stateIncidences["data"][props.idKey]["history"]
			if (historyArray[1].weekIncidence > historyArray[0].weekIncidence) {
				trend = "up"
			}
			if (historyArray[1].weekIncidence < historyArray[0].weekIncidence) {
				trend = "down"
			}
		} catch (e) {
			trend = null
		}
	}
	
	return (
		<ListItem
			link={'/state/'+props.idKey}
			name={props.name}
			incidence={props.incidence}
			key={props.idKey}
			itemKey={props.idKey}
			trend={trend}
		/>
	)
}

function StatesList(): JSX.Element {

	const [statesIncidences, setStatesIncidences] = useState<any>(null);
	useEffect(() => {
		fetch(`${API_URL}/states`)
			.then(r => r.json())
			.then(data => setStatesIncidences(data))
			.catch(()=>{})
		;
	}, [])

	const statesJSON = statesList;
	var out: any = [];
	const states = Object.keys(statesJSON["data"]);
	var key;
	for (var i = 0; i < states.length; i++) {
		key = states[i];
		let incidence = null
		let name = statesJSON["data"][key]["name"]

		if (statesIncidences) {
			incidence = statesIncidences["data"][key]["weekIncidence"].toFixed(1);
		}

		out.push(
			// <ListItem
			// 	link={'state/'+key}
			// 	name={name}
			// 	incidence={incidence}
			// 	key={key}
			// 	itemKey={key}
			// 	trend={"up"}
			// />
			<StateListItem
				key={key}
				idKey={key}
				name={name}
				incidence={incidence}
			/>
		);
	}
	return out;
}

export default function States() {
	return (
		<div>
			<Header title="Deutschland" subtitle="w&auml;hle dein Bundesland" hideStart={true} />
			<div className="list">
				<ListItem link={'germany'} name="Inzidenzen f&uuml;r ganz Deutschland" key="germany" itemKey="germany" />
			</div>
			<div className="list">
				<StatesList />
			</div>
		</div>
	);
}
