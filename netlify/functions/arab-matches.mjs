
export const handler = async (event) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "public, max-age=60",
    "Access-Control-Allow-Origin": "*"
  };

  const json = (data, statusCode = 200) => ({
    statusCode,
    headers,
    body: JSON.stringify(data)
  });

  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return json({
      error: "La variable API_FOOTBALL_KEY n'est pas configurée dans Netlify."
    }, 500);
  }

  try {
    const params = event.queryStringParameters || {};
    let date = params.date;

    if (!date) {
      date = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Africa/Algiers",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).format(new Date());
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return json({ error: "Date invalide. Utilisez AAAA-MM-JJ." }, 400);
    }

    const url = new URL("https://v3.football.api-sports.io/fixtures");
    url.searchParams.set("date", date);
    url.searchParams.set("timezone", "Africa/Algiers");

    const response = await fetch(url.toString(), {
      headers: {
        "x-apisports-key": apiKey
      }
    });

    const data = await response.json();

    if (!response.ok || (data.errors && Object.keys(data.errors).length)) {
      return json({
        error: "L'API-Football a refusé la requête.",
        details: data.errors || data.message || response.status
      }, response.status >= 400 && response.status < 600
        ? response.status
        : 502);
    }

    const arabCountries = new Set([
      "Algeria",
      "Bahrain",
      "Comoros",
      "Djibouti",
      "Egypt",
      "Iraq",
      "Jordan",
      "Kuwait",
      "Lebanon",
      "Libya",
      "Mauritania",
      "Morocco",
      "Oman",
      "Palestine",
      "Qatar",
      "Saudi Arabia",
      "Somalia",
      "Sudan",
      "Syria",
      "Tunisia",
      "United Arab Emirates",
      "Yemen"
    ]);

    const matches = (data.response || [])
      .filter((item) => arabCountries.has(item.league?.country))
      .map((item) => ({
        id: item.fixture?.id,
        utcDate: item.fixture?.date,
        status: item.fixture?.status?.short || "NS",
        statusText: item.fixture?.status?.long || "À venir",
        minute: item.fixture?.status?.elapsed ?? null,
        competition: {
          name: item.league?.name || "Championnat arabe",
          code: String(item.league?.id || ""),
          emblem: item.league?.logo || "",
          area: {
            name: item.league?.country || ""
          }
        },
        homeTeam: {
          name: item.teams?.home?.name || "Équipe domicile",
          crest: item.teams?.home?.logo || ""
        },
        awayTeam: {
          name: item.teams?.away?.name || "Équipe extérieure",
          crest: item.teams?.away?.logo || ""
        },
        score: {
          fullTime: {
            home: item.goals?.home ?? null,
            away: item.goals?.away ?? null
          },
          halfTime: {
            home: item.score?.halftime?.home ?? null,
            away: item.score?.halftime?.away ?? null
          }
        },
        venue: item.fixture?.venue?.name || "",
        country: item.league?.country || "",
        source: "API-Football"
      }));

    return json({
      date,
      count: matches.length,
      matches
    });
  } catch (error) {
    return json({
      error: "Impossible de récupérer les matchs arabes.",
      details: error.message
    }, 500);
  }
};
