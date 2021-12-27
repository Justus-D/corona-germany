import packageJson from '../../package.json'

const pages = process.env.CF_PAGES || false
const commitSHA = process.env.CF_PAGES_COMMIT_SHA || "0123456789abcdef0123456789abcdef01234567"
const branch = process.env.CF_PAGES_BRANCH || "dev"

export default function Footer() {
	return (
		<footer style={{padding: "10px"}}>
			<span>Datenquelle 7-Tage-Inzidenzen: Robert Koch-Institut (siehe GitHub: <a className="footer" href="https://github.com/marlon360/rki-covid-api#data-sources" target="_BLANK" rel="noreferrer">rki-covid-api</a>)</span>
			<br />
			<span>
				Datenquelle Hospitalisierungsinzidenzen:&nbsp;
				<a className="footer" href="https://github.com/robert-koch-institut/COVID-19-Hospitalisierungen_in_Deutschland" target="_BLANK" rel="noreferrer">
					Robert Koch-Institut (2021): COVID-19-Hospitalisierungen in Deutschland
				</a>
			</span><br /><br />
			<span>Alle Angaben ohne Gew&auml;hr.</span>
			{packageJson.version ?
				<>
					<br /><br />
					<span>Version: v{packageJson.version}{pages ? <>&nbsp;{branch}&nbsp;<span title={commitSHA}>{commitSHA.substring(0,7)}</span></> : null}</span>
				</>
			: null }
		</footer>
	);
}
