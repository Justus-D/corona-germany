import React from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "./Header";

export default function Loading(props: { reloadButton?: boolean }) {
	const location = useLocation();
	return (
		<>
			<Header title="Laden..." />
			{props.reloadButton ? <Link to={location.pathname}>Neu Laden</Link> : null}
		</>
	);
}
