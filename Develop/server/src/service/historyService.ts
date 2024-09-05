import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the City class with name and id properties
class City {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

// Define the HistoryService class
class HistoryService {
  private filePath: string;

  constructor() {
    // Define the path to the searchHistory.json file
    this.filePath = path.join(__dirname, 'searchHistory.json');
  }

  // Read from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.promises.readFile(this.filePath, 'utf-8');
      return JSON.parse(data) as City[];
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, return an empty array
        return [];
      }
      throw error;
    }
  }

  // Write the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    try {
      const data = JSON.stringify(cities, null, 2);
      await fs.promises.writeFile(this.filePath, data, 'utf-8');
    } catch (error) {
      throw error;
    }
  }

  // Get cities from the searchHistory.json file and return them as an array of City objects
  async getCities(): Promise<City[]> {
    return this.read();
  }

  // Add a city to the searchHistory.json file
  async addCity(cityName: string): Promise<void> {
    const cities = await this.read();
    const newCity = new City((new Date()).toISOString(), cityName);
    cities.push(newCity);
    await this.write(cities);
  }

  // Remove a city from the searchHistory.json file by id
  async removeCity(id: string): Promise<void> {
    const cities = await this.read();
    const updatedCities = cities.filter(city => city.id !== id);
    await this.write(updatedCities);
  }
}

export default new HistoryService();