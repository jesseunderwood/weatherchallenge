import { Router, type Request, type Response } from 'express';
const router = Router();

// Import the services
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    // Get weather data from city name
    const weather = await WeatherService.getWeatherForCity(city);

    // Save city to search history
    await HistoryService.addCity(city);

    return res.status(200).json(weather);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

// GET search history
router.get('/history', async (_, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    return res.status(200).json(cities);
  } catch (error) {
    console.error('Error fetching search history:', error);
    return res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

// DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'City ID is required' });
  }

  try {
    await HistoryService.removeCity(id);
    return res.status(200).json({ message: 'City removed from history' });
  } catch (error) {
    console.error('Error removing city from history:', error);
    return res.status(500).json({ error: 'Failed to remove city from history' });
  }
});

export default router;