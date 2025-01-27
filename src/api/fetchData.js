export async function fetchWeatherData(city) {
  const apiKey = "0b119156d44fd4ae748de6662549bb18";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    return {
      location: data.name || "Unknown location",
      country: data.sys.country || "Unknown country",
      temperature: data.main.temp.toFixed(1),
      feelsLike: data.main.feels_like.toFixed(1),
      weather: data.weather[0]?.description || "No description available",
      windSpeed: data.wind.speed,
      windDirection: data.wind.deg,
      humidity: data.main.humidity,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}
