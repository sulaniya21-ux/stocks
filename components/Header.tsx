
import React from 'react';
import { TrendUpIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm p-4 sticky top-0 z-10">
      <div className="container mx-auto flex items-center gap-3">
        <TrendUpIcon className="w-8 h-8 text-emerald-400" />
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Indian Stock Tracker <span className="text-emerald-400">&</span> Alerter
        </h1>
      </div>
    </header>
  );
};

export default Header;
