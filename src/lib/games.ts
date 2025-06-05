import api from './api';

export interface Game {
  _id: string;
  name: string;
  imageUrl: string;
  provider: string;
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  minBet: number;
  maxBet: number;
  rtp: number;
  popularity: number;
}

export async function getGames(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  provider?: string;
  active?: boolean;
}): Promise<{ success: boolean; count: number; total: number; pages: number; currentPage: number; games: Game[] }> {
  try {
    const response = await api.get('/api/games', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching games:', error);
    return { success: false, count: 0, total: 0, pages: 1, currentPage: 1, games: [] };
  }
}

export async function getFeaturedGames(): Promise<Game[]> {
  try {
    const response = await api.get('/api/games/featured');
    return response.data.games;
  } catch (error) {
    console.error('Error fetching featured games:', error);
    return [];
  }
}