
import React, { useState, useEffect } from 'react';
import { Stock, Alert } from '../types';

interface AlertModalProps {
  stock: Stock | null;
  isOpen: boolean;
  onClose: () => void;
  onSetAlert: (alert: Omit<Alert, 'id' | 'triggered'>) => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ stock, isOpen, onClose, onSetAlert }) => {
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');

  useEffect(() => {
    if (stock) {
      setTargetPrice(stock.price.toFixed(2));
      setCondition(stock.price > 0 ? 'ABOVE' : 'BELOW');
    }
  }, [stock]);

  if (!isOpen || !stock) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(targetPrice);
    if (!isNaN(price) && price > 0) {
      onSetAlert({
        symbol: stock.symbol,
        targetPrice: price,
        condition: condition,
      });
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-md border border-slate-700 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white mb-2">Set Alert for {stock.symbol}</h2>
        <p className="text-slate-400 mb-6">Current Price: ₹{stock.price.toFixed(2)}</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="targetPrice" className="block text-sm font-medium text-slate-300 mb-2">Alert me when price is:</label>
            <div className="flex gap-4">
              <div className="flex-1">
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as 'ABOVE' | 'BELOW')}
                  className="w-full px-3 py-2 bg-slate-900 text-white border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="ABOVE">Above</option>
                  <option value="BELOW">Below</option>
                </select>
              </div>
              <div className="flex-1">
                <input
                  id="targetPrice"
                  type="number"
                  step="0.01"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 text-white border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-500 transition-colors"
            >
              Set Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlertModal;
