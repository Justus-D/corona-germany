import React from 'react';

export default class ErrorBoundary extends React.Component {
	state: {
		hasError: boolean
	};
	constructor(props: Object) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: any) {    // Update state so the next render will show the fallback UI.
		return { hasError: true };
	}
	componentDidCatch(error: any, errorInfo: any) {    // You can also log the error to an error reporting service
		console.log(error, errorInfo);
	}
	render() {
		if (this.state.hasError) {      // You can render any custom fallback UI
			return (
				<div>
					<h2>Ein Fehler ist aufgetreten.</h2>
					<p>Erfahrungsgem&auml;&szlig; ist der Fehler in wenigen Stunden wieder behoben. Meist liegt der Fehler bei der RKI-API.</p>
				</div>
			);
		}
		return this.props.children; 
	}
}
