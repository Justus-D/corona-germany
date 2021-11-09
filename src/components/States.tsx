import { Link } from 'react-router-dom';

import Header from './Header';

const statesList = JSON.parse(`{"data":{"BW":{"name":"Baden-Württemberg"},"BY":{"name":"Bayern"},"BE":{"name":"Berlin"},"BB":{"name":"Brandenburg"},"HB":{"name":"Bremen"},"HH":{"name":"Hamburg"},"HE":{"name":"Hessen"},"MV":{"name":"Mecklenburg-Vorpommern"},"NI":{"name":"Niedersachsen"},"NW":{"name":"Nordrhein-Westfalen"},"RP":{"name":"Rheinland-Pfalz"},"SL":{"name":"Saarland"},"SN":{"name":"Sachsen"},"ST":{"name":"Sachsen-Anhalt"},"SH":{"name":"Schleswig-Holstein"},"TH":{"name":"Thüringen"}}}`);

export function ListItem(props: any): JSX.Element {
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
