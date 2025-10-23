import { Stock, HistoricalDataPoint } from '../types';

const MOCK_STOCKS: Omit<Stock, 'price' | 'change' | 'changePercent' | 'historicalData'>[] = [
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries Ltd' },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services Ltd' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Ltd' },
  { symbol: 'INFY.NS', name: 'Infosys Ltd' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank Ltd' },
  { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever Ltd' },
  { symbol: 'SBIN.NS', name: 'State Bank of India' },
  { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance Ltd' },
  { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank Ltd' },
  { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel Ltd' },
  { symbol: 'ABSL.NS', name: 'Aditya Birla Sun Life AMC Ltd' },
];

const generateHistoricalData = (basePrice: number): HistoricalDataPoint[] => {
  const data: HistoricalDataPoint[] = [];
  let currentPrice = basePrice;
  const today = new Date();
  const baseVolume = Math.floor(Math.random() * 500000) + 100000;

  for (let i = 30; i > 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const priceChange = (Math.random() - 0.5) * (basePrice * 0.05);
    currentPrice += priceChange;
    currentPrice = Math.max(currentPrice, basePrice * 0.8);

    // Simulate volume - higher on bigger price change days
    let volumeMultiplier = 1 + Math.abs(priceChange) / (basePrice * 0.02);
    const volume = Math.floor(baseVolume * (0.8 + Math.random() * 0.4) * volumeMultiplier);

    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(currentPrice.toFixed(2)),
      volume: volume,
    });
  }
  return data;
};

const initialPrices: { [key: string]: number } = {
    'RELIANCE.NS': 2850.55,
    'TCS.NS': 3850.20,
    'HDFCBANK.NS': 1650.75,
    'INFY.NS': 1550.00,
    'ICICIBANK.NS': 1100.40,
    'HINDUNILVR.NS': 2450.90,
    'SBIN.NS': 830.60,
    'BAJFINANCE.NS': 7200.10,
    'KOTAKBANK.NS': 1750.80,
    'BHARTIARTL.NS': 1400.25,
    'ABSL.NS': 655.20,
};

export const searchStocks = async (query: string): Promise<Omit<Stock, 'price' | 'change' | 'changePercent' | 'historicalData'>[]> => {
  const upperQuery = query.toUpperCase();
  return MOCK_STOCKS.filter(
    (stock) =>
      stock.symbol.toUpperCase().includes(upperQuery) ||
      stock.name.toUpperCase().includes(upperQuery)
  );
};

export const getStockData = async (symbol: string): Promise<Stock | null> => {
    const stockInfo = MOCK_STOCKS.find((s) => s.symbol === symbol);
    if (!stockInfo) return null;

    const basePrice = initialPrices[symbol] || 1000;
    const price = parseFloat((basePrice + (Math.random() - 0.5) * (basePrice * 0.02)).toFixed(2));
    const previousClose = parseFloat((price / (1 + (Math.random() - 0.5) * 0.04)).toFixed(2));
    const change = parseFloat((price - previousClose).toFixed(2));
    const changePercent = parseFloat(((change / previousClose) * 100).toFixed(2));
    const historicalData = generateHistoricalData(basePrice);

    return {
        ...stockInfo,
        price,
        change,
        changePercent,
        historicalData,
    };
};