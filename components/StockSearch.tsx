
import React, { useState } from 'react';
import { Stock } from '../types';
import { searchStocks } from '../services/stockService';
import { SearchIcon } from './icons';

interface StockSearchProps {
  onAddStock: (symbol: string) => void;
  trackedSymbols: string[];
}

const StockSearch: React.FC<StockSearchProps> = ({ onAddStock, trackedSymbols }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Omit<Stock, 'price' | 'change' | 'changePercent' | 'historicalData'>[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (newQuery.length > 1) {
      const searchResult = await searchStocks(newQuery);
      setResults(searchResult);
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleAdd = (symbol: string) => {
    onAddStock(symbol);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-md mx-auto my-6">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          onFocus={() => query.length > 1 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          placeholder="Search for stocks (e.g., RELIANCE, INFY)"
          className="w-full pl-10 pr-4 py-3 bg-slate-800 text-white border-2 border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
        />
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
      </div>

      {showResults && results.length > 0 && (
        <ul className="absolute z-10 w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((stock) => {
            const isTracked = trackedSymbols.includes(stock.symbol);
            return (
              <li key={stock.symbol}>
                <button
                  onClick={() => !isTracked && handleAdd(stock.symbol)}
                  disabled={isTracked}
                  className="w-full text-left px-4 py-3 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                        <p className="font-bold text-white">{stock.symbol}</p>
                        <p className="text-sm text-slate-400">{stock.name}</p>
                    </div>
                    {isTracked && <span className="text-xs text-emerald-400 font-semibold">TRACKING</span>}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default StockSearch;
