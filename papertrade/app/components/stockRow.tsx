import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useStockContext } from '../context/SelectedStockContext';

const StockRow = (props: { symbol: string, price: number, volume: number, open: number }) => {
  const { symbol, price, open, volume } = props;

    const change = ((price - open)/open) * 100

  const isPositive = change >= 0;

  const {updateStock} = useStockContext()


  
  return (
    <div onClick={() => {
      updateStock(symbol)
    }}  className="flex items-center justify-between w-100 py-3 px-4 border-b-2 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer   ">
      
      <div className="w-1/4">
        <div className="font-bold text-lg text-gray-900">{symbol}</div>
      </div>
      
      
      <div className="w-1/4 text-right">
        <div className="text-lg font-medium text-gray-900">
          ${price.toFixed(2)}
        </div>
      </div>

      
      <div className="w-1/4 text-right">
        <div className={`flex items-center justify-end font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 mr-1" />
          )}
          {isPositive ? '+' : ''}{change.toFixed(2)}%
        </div>
      </div>

      
      <div className="w-1/4 text-right">
        <div className="text-gray-600">
          {volume.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default StockRow;