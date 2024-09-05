import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch'; // Ensure you have node-fetch installed

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// Define a class for the Weather object
class Weather {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;

  constructor(temperature: number, description: string, humidity: number, windSpeed: number) {
    this.temperature = temperature;
    this.description = description;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
  }
}

// Complete the WeatherService class
class WeatherService {
  private apiKey: string;
  private geocodeURL: string;
  private weatherURL: string;

  constructor() {
    this.apiKey = process.env.WEATHER_API_KEY || '';
    this.geocodeURL = process.env.GEOCODE_API_URL || '';
    this.weatherURL = process.env.WEATHER_API_URL || '';
  }

  // Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    const response = await fetch(`${this.geocodeURL}/geocode?q=${encodeURIComponent(query)}&key=${process.env.GEOCODE_API_KEY}`);
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    return response.json();
  }

  // Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    if (!locationData || locationData.length === 0) {
      throw new Error('No location data found');
    }
    const { lat, lon } = locationData[0].geometry;
    return { lat, lon };
  }

  // Remove the unused buildGeocodeQuery method

  // Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.weatherURL}?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
  }

  // Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(city);
    return this.destructureLocationData(locationData.results);
  }

  // Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherQuery);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    return response.json();
  }

  // Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const { main, weather, wind } = response;
    return new Weather(
      main.temp,
      weather[0].description,
      main.humidity,
      wind.speed
    );
  }

  // Remove the unused buildForecastArray method

  // Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather> {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    return this.parseCurrentWeather(weatherData);
  }
}

export default new WeatherService();