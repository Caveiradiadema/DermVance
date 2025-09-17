// Arquivo: /api/depoimentos.js
// (Este código roda no servidor da Vercel, de forma segura)

export default async function handler(request, response) {
  // Pega as chaves das "Environment Variables" da Vercel usando os NOMES que cadastramos
  const apiKey = process.env.GOOGLE_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  
  const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews&language=pt_BR&key=${apiKey}`;

  try {
    const fetchResponse = await fetch(apiUrl);
    if (!fetchResponse.ok) {
      throw new Error(`Erro na API do Google: ${fetchResponse.statusText}`);
    }
    const data = await fetchResponse.json();
    
    // Retorna os dados para o site (front-end)
    response.status(200).json(data);
  } catch (error) {
    // Em caso de erro, retorna uma mensagem de erro
    response.status(500).json({ error: error.message });
  }
}