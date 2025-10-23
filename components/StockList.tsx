
import React from 'react';
import { Stock } from '../types';
import StockCard from './StockCard';

interface StockListProps {
  stocks: Stock[];
  onRemoveStock: (symbol: string) => void;
  onSetAlert: (stock: Stock) => void;
}

const StockList: React.FC<StockListProps> = ({ stocks, onRemoveStock, onSetAlert }) => {
  if (stocks.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-slate-300">Your Watchlist is Empty</h2>
        <p className="text-slate-500 mt-2">Use the search bar above to add stocks to track.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6">
      {stocks.map((stock) => (
        <StockCard key={stock.symbol} stock={stock} onRemove={onRemoveStock} onSetAlert={onSetAlert} />
      ))}
    </div>
  );
};

export default StockList;
