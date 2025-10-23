export interface HistoricalDataPoint {
  date: string;
  price: number;
  volume: number;
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  historicalData: HistoricalDataPoint[];
}

export interface Alert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW';
  triggered: boolean;
}

export interface EntryPoint {
    price: number;
    reason: string;
}

export interface MacdAnalysis {
  signal: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  reason: string;
}

export interface FibonacciLevel {
  level: string;
  price: number;
}

export interface FibonacciAnalysis {
  levels: FibonacciLevel[];
  reason: string;
}

export interface VolumeAnalysis {
  trend: 'INCREASING' | 'DECREASING' | 'STABLE';
  reason: string;
}

export interface EntryPointAnalysis {
  overallSummary: string;
  macdAnalysis: MacdAnalysis;
  fibonacciAnalysis: FibonacciAnalysis;
  volumeAnalysis: VolumeAnalysis;
  entryPoints: EntryPoint[];
}
