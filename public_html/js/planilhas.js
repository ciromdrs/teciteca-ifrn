// Configuração
const SPREADSHEET_ID = '1zZapwRybvNPqTKADuvYAq4jHZWHywH8w';
const SHEET_NAME = 'export'; // Nome da aba
const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

async function getSheetData() {
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
	return getSheetData().then(
		(data) => {
			let projetos = {}
			data.forEach((element, i) => {
				if (!element) {
					console.warn(`Elemento inválido: ${i} ${element}`)
					return
				}
				if (!element[2]) {
					console.warn(`Elemento inválido: (${i}) ${element}`)
					return
				}
				let titulo = element[2]
				if (!(titulo in projetos)) {
					let p = { titulo }
					p.inicio = element[0]
					p.fim = element[1]
					p.area = element[3]
					p.membros = []
					projetos[titulo] = p
				}
				let m = {
					nome: element[4],
					vinculo: element[5],
					curso_area_disciplina: element[6],
				}
				projetos[titulo].membros.push(m)
			});
			return projetos;
		}
    )
}
