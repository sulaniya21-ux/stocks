import React, { useState } from 'react';
import { Stock, EntryPointAnalysis } from '../types';
import { 
    TrendUpIcon, TrendDownIcon, XIcon, BrainCircuitIcon, BellIcon, LoadingSpinnerIcon, 
    BullIcon, BearIcon, MinusIcon, LayersIcon, ChartBarIcon 
} from './icons';
import { getEntryPointAnalysis } from '../services/geminiService';

interface StockCardProps {
  stock: Stock;
  onRemove: (symbol: string) => void;
  onSetAlert: (stock: Stock) => void;
}

const AnalysisDetails: React.FC<{ analysis: EntryPointAnalysis }> = ({ analysis }) => {
    const { macdAnalysis, fibonacciAnalysis, volumeAnalysis, overallSummary, entryPoints } = analysis;

    const macd_icon = {
        'BULLISH': <BullIcon className="w-5 h-5 text-emerald-400" />,
        'BEARISH': <BearIcon className="w-5 h-5 text-red-400" />,
        'NEUTRAL': <MinusIcon className="w-5 h-5 text-slate-400" />
    }[macdAnalysis.signal];

    const macd_color = {
        'BULLISH': 'text-emerald-400',
        'BEARISH': 'text-red-400',
        'NEUTRAL': 'text-slate-400'
    }[macdAnalysis.signal];

    const volume_color = {
        'INCREASING': 'text-emerald-400',
        'DECREASING': 'text-red-400',
        'STABLE': 'text-slate-400'
    }[volumeAnalysis.trend];


    return (
        <div className="mt-4 bg-slate-900/70 p-4 rounded-lg border border-slate-700 space-y-4">
            <div>
                <h4 className="font-bold text-sky-400 text-md mb-2">Overall Summary</h4>
                <p className="text-sm text-slate-300">{overallSummary}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-slate-800/50 p-3 rounded-md">
                    <h5 className="font-semibold text-slate-300 flex items-center gap-2 mb-2"><div className={macd_color}>{macd_icon}</div> MACD</h5>
                    <p className="text-slate-400"><span className={`font-bold ${macd_color}`}>{macdAnalysis.signal}</span>: {macdAnalysis.reason}</p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-md">
                    <h5 className="font-semibold text-slate-300 flex items-center gap-2 mb-2"><ChartBarIcon className="w-5 h-5 text-slate-400"/> Volume</h5>
                    <p className="text-slate-400"><span className={`font-bold ${volume_color}`}>{volumeAnalysis.trend}</span>: {volumeAnalysis.reason}</p>
                </div>
                 <div className="bg-slate-800/50 p-3 rounded-md">
                    <h5 className="font-semibold text-slate-300 flex items-center gap-2 mb-2"><LayersIcon className="w-5 h-5 text-slate-400"/> Fibonacci</h5>
                    <p className="text-slate-400">{fibonacciAnalysis.reason}</p>
                </div>
            </div>

             <div>
                <h5 className="font-semibold text-slate-300 mt-4">Fibonacci Levels (Support/Resistance):</h5>
                <ul className="mt-2 space-y-1 text-xs">
                    {fibonacciAnalysis.levels.map((item, index) => (
                        <li key={index} className="flex justify-between items-center bg-slate-800/50 p-1.5 rounded">
                            <span className="font-mono text-sky-400">{item.level}</span>
                            <span className="font-semibold text-white">₹{item.price.toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h5 className="font-semibold text-slate-300 mt-4">Potential Entry Points:</h5>
                <ul className="mt-2 space-y-2 text-sm">
                    {entryPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-3 p-2 bg-slate-800/50 rounded-md">
                            <span className="font-bold text-emerald-400 w-28 text-md">₹{point.price.toFixed(2)}</span>
                            <span className="text-slate-400 text-xs flex-1">{point.reason}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};


const StockCard: React.FC<StockCardProps> = ({ stock, onRemove, onSetAlert }) => {
  const [analysis, setAnalysis] = useState<EntryPointAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPositive = stock.change >= 0;
  
  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await getEntryPointAnalysis(stock.symbol, stock.name, stock.historicalData);
      if(result) {
        setAnalysis(result);
      } else {
        setError("Gemini API key not configured. Analysis unavailable.");
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg p-5 transition-all hover:shadow-emerald-500/10 hover:border-slate-600 flex flex-col">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-white">{stock.symbol}</h2>
          <p className="text-sm text-slate-400 truncate max-w-[200px]">{stock.name}</p>
        </div>
        <button
          onClick={() => onRemove(stock.symbol)}
          className="text-slate-500 hover:text-red-500 transition-colors p-1"
          aria-label={`Remove ${stock.symbol}`}
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-4 flex items-baseline gap-4">
        <p className="text-3xl font-semibold text-white">₹{stock.price.toFixed(2)}</p>
        <div className={`flex items-center gap-1 text-lg ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPositive ? <TrendUpIcon className="w-5 h-5" /> : <TrendDownIcon className="w-5 h-5" />}
          <span>{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)</span>
        </div>
      </div>

      <div className="mt-6 border-t border-slate-700 pt-4 flex gap-2">
        <button 
            onClick={handleAnalyze}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-sky-600 text-white rounded-md hover:bg-sky-500 transition-colors disabled:bg-slate-600 disabled:cursor-wait"
        >
          {isLoading ? <LoadingSpinnerIcon className="w-4 h-4 animate-spin"/> : <BrainCircuitIcon className="w-4 h-4" />}
          {isLoading ? 'Analyzing...' : 'Analyze Entry'}
        </button>
        <button 
            onClick={() => onSetAlert(stock)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors"
        >
            <BellIcon className="w-4 h-4" />
            Set Alert
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
      
      {analysis && <AnalysisDetails analysis={analysis} />}

    </div>
  );
};

export default StockCard;
