
export const handler = async (event) => {
  const API_KEY = process.env.FOOTBALL_DATA_API_KEY;

  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  };

  const json = (data, statusCode = 200) => ({
    statusCode,
    headers,
    body: JSON.stringify(data)
  });

  if (!API_KEY) {
    return json({
      error: "Clé API manquante.",
      detail: "Configurez FOOTBALL_DATA_API_KEY dans les variables Netlify."
    }, 500);
  }

  try {
    const params = new URLSearchParams();
    const query = event.queryStringParameters || {};

    // Dates facultatives transmises par la page
    if (query.dateFrom && /^\d{4}-\d{2}-\d{2}$/.test(query.dateFrom)) {
      params.set("dateFrom", query.dateFrom);
    }

    if (query.dateTo && /^\d{4}-\d{2}-\d{2}$/.test(query.dateTo)) {
      params.set("dateTo", query.dateTo);
    }

    // Football-Data.org attend "competitions"
    const competition = query.competition || query.competitions;
    if (competition) {
      params.set("competitions", competition);
    }

    const url = "https://api.football-data.org/v4/matches" +
      (params.toString() ? `?${params.toString()}` : "");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-Auth-Token": API_KEY,
        "Accept": "application/json"
      }
    });

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = { message: "Réponse invalide reçue du fournisseur." };
    }

    if (!response.ok) {
      return json({
        error: "Football-Data.org a refusé la requête.",
        status: response.status,
        detail: data.message || data.error || "Vérifiez la clé, les permissions et le quota."
      }, response.status);
    }

    return json(data);
  } catch (error) {
    return json({
      error: "Impossible de récupérer les matchs.",
      detail: error.message || "Erreur réseau."
    }, 502);
  }
};
