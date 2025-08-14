import apiClient from './index.js';

export const exchangeRate = async () => {
  try {
    const response = await apiClient.get('/exchange');
    return response.data;
  } catch (e) {
    console.error('Error fetching exchange rates:', e);
    throw e;
  }
};