// Configuração
const SPREADSHEET_ID = '1zZapwRybvNPqTKADuvYAq4jHZWHywH8w';
const base_url = new URL(`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json`);

async function fetchSheetData(sheet_name) {
	// Copia a URL base para alterar a cópia
	const url = new URL(base_url)
	url.searchParams.append('sheet', sheet_name);
    const response = await fetch(url);
    const text = await response.text();
    
    // Google returns a JSONP-like string wrapped in "google.visualization.Query.setResponse(...)"
    // This slice cleans it up into valid JSON text
    const jsonText = text.substring(47).slice(0, -2);
    const data = JSON.parse(jsonText);
    
    // Extract rows from the structured response
    const rows = data.table.rows;
    
    // Map the rows into clean arrays of cell values
    const cleanData = rows.map(row => {
        return row.c.map(cell => cell ? cell.v : null);
    });

    return cleanData;
}

async function getProjetos() {
	return fetchSheetData('Projetos').then(
		(data) => {
			let projetos = {}
			data.slice(2).forEach((element, i) => {
				if (!element) {
					console.warn(`Elemento inválido: ${i} ${element}`)
					return
				}
				let p = {
					id: element[0],
					inicio: element[1],
					fim: element[2],
					titulo: element[3],
					area: element[4],
					resumo: element[5],
					membros: []
				}
				projetos[p.id] = p
			});
			return projetos;
		}
    )
}

async function getSobre() {
	return fetchSheetData('Home').then(
		(data) => {
			const sobre = data[1];
			return sobre;
		}
    )
}