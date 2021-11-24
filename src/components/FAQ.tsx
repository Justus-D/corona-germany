import React from "react";
import Header from "./Header";

export default function FAQ() {
	return (
		<div className="wrapper">
			<Header title="Tipps und FAQ" subtitle="Hier einige h&auml;ufig gestellte Fragen" />
			<br /><br />
			<div style={{lineHeight: "22px"}}>
				<u>Wie gelange ich auf die vorherige Seite zur&uuml;ck?</u><br /><br />
				Du gelangst auf die vorherige Seite zur&uuml;ck, indem du die Zur&uuml;cktaste
				in deinem Browser benutzt. Wenn du die Seite als App installiert hast, dann
				kannst du auf Android die Zur&uuml;cktaste deines Handys benutzen. Bei iOS
				Ger&auml;ten kannst du vom linken Rand nach rechts streichen.<br /><br />

				<u>Gibt es diese Seite auch als App?</u><br /><br />
				Ja, und zwar als Progressive Web App (PWA)! Du kannst sie installieren,
				indem du auf die entsprechende Schaltfl&auml;che im Men&uuml;
				deines Browsers tippst. Bei iOS Ger&auml;ten musst du auf "Teilen" gehen
				und dann auf "Zum Home-Bildschirm" tippen.<br /><br />
				<img
					src="/images/screenshots/screenshot-iPhone-share-button-marked.jpg"
					alt="iPhone share button"
					style={{aspectRatio: "749/198", width: "100%", boxShadow: "rgba(1,1,1,0.5) 1px 1px 16px"}}
				/>
				<br /><br />
				<img
					src="/images/screenshots/screenshot-iPhone-add-to-home-button-marked.jpg"
					alt="iPhone share button"
					style={{aspectRatio: "749/268", width: "100%", boxShadow: "rgba(1,1,1,0.5) 1px 1px 16px"}}
				/>
				<br /><br />

				<u>K&ouml;nnen die Hospitalisierungsinzidenzen hinzugef&uuml;gt werden?</u><br /><br />
				Dieses Feature ist unterwegs! Es wird in den n&auml;chsten Tagen umgesetzt und
				ver&ouml;ffentlicht.
			</div>
		</div>
	)
}