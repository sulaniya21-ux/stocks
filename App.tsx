import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import StockSearch from './components/StockSearch';
import StockList from './components/StockList';
import AlertModal from './components/AlertModal';
import { Stock, Alert } from './types';
import { getStockData } from './services/stockService';

const App: React.FC = () => {
  const [trackedStocks, setTrackedStocks] = useState<Stock[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stockForAlert, setStockForAlert] = useState<Stock | null>(null);

  const addStock = useCallback(async (symbol: string) => {
    if (trackedStocks.find((s) => s.symbol === symbol)) return;
    const newStockData = await getStockData(symbol);
    if (newStockData) {
      setTrackedStocks((prevStocks) => [...prevStocks, newStockData]);
    }
  }, [trackedStocks]);

  const removeStock = (symbol: string) => {
    setTrackedStocks((prevStocks) => prevStocks.filter((s) => s.symbol !== symbol));
    setAlerts((prevAlerts) => prevAlerts.filter((a) => a.symbol !== symbol));
  };
    
  const handleSetAlert = (alertData: Omit<Alert, 'id' | 'triggered'>) => {
    const newAlert: Alert = {
        ...alertData,
        id: `${alertData.symbol}-${Date.now()}`,
        triggered: false
    };
    setAlerts(prev => [...prev.filter(a => a.symbol !== newAlert.symbol), newAlert]);
    // Simple browser notification to confirm alert is set
    alert(`Alert set for ${newAlert.symbol} to trigger when price is ${newAlert.condition.toLowerCase()} ₹${newAlert.targetPrice}`);
  };

  const openAlertModal = (stock: Stock) => {
    setStockForAlert(stock);
    setIsModalOpen(true);
  };
  
  const closeAlertModal = () => {
    setIsModalOpen(false);
    setStockForAlert(null);
  };

  useEffect(() => {
    const updatePrices = async () => {
        if (trackedStocks.length === 0) return;

        const updatedStocksPromises = trackedStocks.map(stock => getStockData(stock.symbol));
        const updatedStocksData = await Promise.all(updatedStocksPromises);
        
        const validUpdatedStocks = updatedStocksData.filter((s): s is Stock => s !== null);

        setTrackedStocks(validUpdatedStocks);

        // Check alerts
        validUpdatedStocks.forEach(stock => {
            const relevantAlert = alerts.find(a => a.symbol === stock.symbol && !a.triggered);
            if (relevantAlert) {
                const { condition, targetPrice } = relevantAlert;
                let shouldTrigger = false;
                if (condition === 'ABOVE' && stock.price > targetPrice) {
                    shouldTrigger = true;
                } else if (condition === 'BELOW' && stock.price < targetPrice) {
                    shouldTrigger = true;
                }

                if (shouldTrigger) {
                    alert(`🚨 PRICE ALERT: ${stock.symbol} is now ${stock.price}, which is ${condition.toLowerCase()} your target of ${targetPrice}!`);
                    setAlerts(prevAlerts => prevAlerts.map(a => a.id === relevantAlert.id ? { ...a, triggered: true } : a));
                }
            }
        });
    };
    
    // Initial load for default stocks
    const loadInitialStocks = () => {
        addStock('RELIANCE.NS');
        addStock('TCS.NS');
        addStock('ABSL.NS');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if(trackedStocks.length === 0) loadInitialStocks();

    const intervalId = setInterval(updatePrices, 5000); // Update every 5 seconds

    return () => clearInterval(intervalId);
  }, [trackedStocks, alerts, addStock]);

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <Header />
      <main className="container mx-auto">
        <StockSearch 
          onAddStock={addStock} 
          trackedSymbols={trackedStocks.map(s => s.symbol)} 
        />
        <StockList 
          stocks={trackedStocks} 
          onRemoveStock={removeStock} 
          onSetAlert={openAlertModal}
        />
        <AlertModal 
            isOpen={isModalOpen}
            stock={stockForAlert}
            onClose={closeAlertModal}
            onSetAlert={handleSetAlert}
        />
      </main>
      <footer className="text-center p-4 text-xs text-slate-500">
        <p>Disclaimer: This is a demo application. Stock data is simulated and analysis is for educational purposes only. Not financial advice.</p>
      </footer>
    </div>
  );
};

export default App;