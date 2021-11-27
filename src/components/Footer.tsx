
export default function Footer() {
	return (
		<footer>
			<span>Datenquelle: RKI (siehe GitHub: <a className="footer" href="https://github.com/marlon360/rki-covid-api#data-sources" target="_BLANK" rel="noreferrer">rki-covid-api</a>)</span><br /><br />
			<span>
				Datenquelle Hospitalisierungsinzidenzen:&nbsp;
				<a className="footer" href="https://github.com/robert-koch-institut/COVID-19-Hospitalisierungen_in_Deutschland" target="_BLANK" rel="noreferrer">
					Robert Koch-Institut (2021): COVID-19-Hospitalisierungen in Deutschland
				</a>
			</span><br /><br />
			<span>Alle Angaben ohne Gew&auml;hr.</span>
		</footer>
	);
}
