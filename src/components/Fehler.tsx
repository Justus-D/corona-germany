import Header from "./Header";

type FehlerProps = {
	standalone?: boolean
}

export default function Fehler(props: FehlerProps) {
	return (
		<div>
			<Header title="Ein Fehler ist aufgetreten" hideStart={props.standalone} hideTop={props.standalone} />
			<p>Erfahrungsgem&auml;&szlig; ist der Fehler in wenigen Stunden wieder behoben. Meist liegt der Fehler bei der RKI-API.</p>
		</div>
	);
}
