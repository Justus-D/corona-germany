// import React from 'react';
import { Link } from "react-router-dom";

type HeaderProps = {
	title: string,
	subtitle?: string,
	hideStart?: boolean,
	hideTop?: boolean
}

export default function Header(props: HeaderProps) {
	return (
		<div>
			{props.hideStart ? null : <Link to="/" className="list-button start">Start</Link>}
			{props.hideTop ? null : <Link to="/top" className="list-button top">Top Inzidenzen</Link>}
			<div className="heading">{props.title}</div>
			{props.subtitle ? <div className="description">{props.subtitle}</div> : null}
		</div>
	);
}
