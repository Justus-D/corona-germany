import React, { useEffect, useState } from "react";
import { API_URL } from "../App";

export function Map() {

	interface legend {
		incidentRanges: [
			{
				min: number,
				max: number | null,
				color: string
			}
		]
	}

	const [showLegend, openLegend] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(true)
	const [legend, setLegend] = useState<null | legend>(null)
	const [error, setError] = useState<boolean>(false)

	useEffect(() => {
		fetch(API_URL+"/map/districts/legend")
			.then(r => r.json())
			.then(data => {
				setLegend(data)
				setLoading(false)
				setError(false)
			})
			.catch(function(error) {
				setError(true)
				setLoading(false)
			})
		;
	}, [])

	return (
		<>
			<div style={{ width: "200px", height: "271.15px", margin: "0 auto" }}>
				<img src={API_URL+"/map/districts"}
					alt="&Uuml;bersichtskarte der 7-Tage-Inzidenzen der Kreise in Deutschland"
					style={{ height: "auto", width: "200px" }}
				/>
			</div>
			{(showLegend && !loading && !error && legend) ? <>
				<div style={{ margin: "12px 0" }}>
					{legend.incidentRanges.map((val) => {
						return (
							<div key={val.color}>
								<div style={{
									display: "inline-block",
									height: "16px",
									width: "16px",
									backgroundColor: val.color
								}}></div>
								&nbsp;&nbsp;{val.min}{val.max ? <> bis {val.max}</>: " und mehr" }
							</div>
						)
					})}
				</div>
			</> : null }
			<div style={{width: "100%", textAlign: "right", marginTop: "12px"}}>
				<div style={{width: "200px", margin: "0 auto"}}>
					<button onClick={() => openLegend(!showLegend)} className="list-button" style={{ color: "rgb(114, 114, 114)" }}>
						{showLegend ? "Legende verstecken" : "Legende anzeigen" }
					</button>
				</div>
			</div>
		</>
	)
}