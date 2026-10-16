exports.handler = async function(event, context) {
  // Récupère la clé depuis les variables d'environnement Netlify
  const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
  
  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "La clé API n'est pas configurée dans Netlify." })
    };
  }

  try {
    const response = await fetch('https://api.football-data.org/v4/matches', {
      headers: { 'X-Auth-Token': API_KEY }
    });
    
    const data = await response.json();
    
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.toString() }) 
    };
  }
};
