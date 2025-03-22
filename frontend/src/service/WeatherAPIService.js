// Exemplo de requisição = https://api.weatherapi.com/v1/current.json?key=225c2b130835478da6d160905252001&q=Santos

// Variáveis de ambiente
const apiKey = import.meta.env.VITE_WEATHER_API_KEY; // Certifique-se de usar "VITE_" para variáveis de ambiente no Vite.
const apiUrl = import.meta.env.VITE_WEATHER_API_URL;

// Função para logar as variáveis de ambiente
export const logEnvApi = function () {
    console.log("URL API: " + apiUrl);
    console.log("KEY API: " + apiKey);
};

// Função para retornar informações da localização
export const ReturnLocationInfo = async function (location) {
    const response = await fetch(`${apiUrl}current.json?key=${apiKey}&q=${location}`);
    if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
    }
    const data = await response.json();
    return data;
};


export default logEnvApi;