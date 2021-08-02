// import React from 'react';
import { Link } from "react-router-dom";

export default function Header(props: {title?: string, subtitle?: string, hideStart?: boolean}) {
	return (
		<div>
			{props.hideStart ? null : <Link to="/" className="list-button start">Start</Link>}
			<div className="heading">{props.title}</div>
			{props.subtitle ? <div className="description">{props.subtitle}</div> : null}
		</div>
	);
}
