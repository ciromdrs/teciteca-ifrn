const spreadsheetId = '1zZapwRybvNPqTKADuvYAq4jHZWHywH8w';
const spreadsheetUrl = new URL(
  `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json`,
);

async function fetchSheetRows(sheetName) {
  const url = new URL(spreadsheetUrl);
  url.searchParams.set('sheet', sheetName);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Falha ao carregar a planilha: ${response.status}`);
  }

  const responseText = await response.text();
  const jsonStart = responseText.indexOf('{');
  const jsonEnd = responseText.lastIndexOf('}');
  if (jsonStart < 0 || jsonEnd < jsonStart) {
    throw new Error('A resposta da planilha está em formato inválido.');
  }

  const table = JSON.parse(responseText.slice(jsonStart, jsonEnd + 1)).table;
  return table.rows.map((row) => (row.c ?? []).map((cell) => cell?.v ?? null));
}

export async function fetchAbout() {
  const rows = await fetchSheetRows('Home');
  return rows[1] ?? [];
}

export async function fetchProjects() {
  const rows = await fetchSheetRows('Projetos');

  return rows.slice(2).flatMap((row) => {
    if (!row?.[0]) return [];

    return [{
      id: row[0],
      inicio: row[1],
      fim: row[2],
      titulo: row[3],
      area: row[4],
      resumo: row[5],
      membros: [],
    }];
  });
}