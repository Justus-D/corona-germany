// Datum,Bundesland,Bundesland_Id,Altersgruppe,7T_Hospitalisierung_Faelle,7T_Hospitalisierung_Inzidenz
// 2021-11-26,Bundesgebiet,00,00-04,84,2.12
// 2021-11-26,Bundesgebiet,00,00+,4966,5.97
// 2021-11-26,Bundesgebiet,00,05-14,101,1.35
// 2021-11-26,Bundesgebiet,00,15-34,353,1.87
// 2021-11-26,Bundesgebiet,00,35-59,996,3.47
// 2021-11-26,Bundesgebiet,00,60-79,1727,9.51
// 2021-11-26,Bundesgebiet,00,80+,1703,28.69
// 2021-11-26,Schleswig-Holstein,01,00-04,2,1.54
// [...]

// "Bundesgebiet"|"Schleswig-Holstein"|"Hamburg"|"Niedersachsen"|"Bremen"|"Nordrhein-Westfalen"|"Hessen"|"Rheinland-Pfalz"|"Baden-Württemberg"|"Bayern"|"Saarland"|"Berlin"|"Brandenburg"|"Mecklenburg-Vorpommern"|"Sachsen"|"Sachsen-Anhalt"|"Thüringen"

export function parseHosIncidence(rawCSV: string, onlyReturn: number) {
	interface hEntry {
		weekIncidence: number,
		date: string
	}
	let a: Array<Array<string>> = [] // a for effort
	rawCSV.split("\n").forEach((r) => { // r for row
		const tmp: Array<string> = r.split(",")
		if (tmp[3] === "00+") a.push(tmp)
	})
	let h: Array<hEntry> = [] // h for history
	a.forEach((r) => { // r for row
		let numVal: number
		try {
			numVal = parseInt(r[2])
		} catch (e) { return }
		if (numVal === onlyReturn) {
			h.push({
				weekIncidence: parseFloat(r[5]),
				date: r[0]
			})
		}
	})
	// let hRev: Array<hEntry> = [] // h for history
	return h.reverse()
}
