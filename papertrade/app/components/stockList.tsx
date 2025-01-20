'use client'

import { useEffect, useState } from "react";
import StockRow from "./stockRow";
import { useStockContext } from "../context/SelectedStockContext";
import LoadingSpinner from "./loader";


const dashboard = () => {
    const [stockList, setStockList] = useState<string[]>(["AAPL", "NVDA", "MSFT", "GOOGL", "AMZN", "META", "TSLA", "TSM", "AVGO", "BRK.A", "LLY", "WMT", "JPM", "V", "XOM", "UNH", "MA", "ORCL", "COST", "HD", "PG", "CVX", "MCD", "PFE", "KO", "PEP", "INTC", "CSCO", "ABBV", "NKE", "DIS", "MRK", "CRM", "ADBE", "CMCSA", "T", "BA", "IBM", "TMO", "MDT", "HON", "QCOM", "ACN", "MS", "UPS", "UNP", "LOW", "GS", "AXP", "BMY"]
    );
    
    const [count, setCount] = useState<number>(0);
    const [stockQuotes, setQuotes] = useState<any>(null)
    const [stockBars, setBars] = useState<any>(null)

    const {stock, updateChange, updatePrice, updateStats} = useStockContext()


    

    const fetchStockData = async () => {
        const res = await fetch('/api/stock', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(stockList),
        });

        let data = await res.json();
        
        setQuotes(data[0].quotes)
        setBars(data[1].bars)


        if(stock){
          const change = (((stockQuotes[stock].bp - stockBars[stock].o)/stockBars[stock].c)*100).toFixed(2)

          updateChange(change)
          updatePrice(stockQuotes[stock].bp)
          updateStats(stockBars[stock].h,stockBars[stock].l,stockBars[stock].o,stockBars[stock].c)
          
        }

        console.log(data[1].bars)
    };


    useEffect(() => {
      
        fetchStockData();

     
        const intervalId = setInterval(() => {
            fetchStockData()
            setCount((prevCount) => prevCount + 1); 
        }, 30000);

       
        return () => clearInterval(intervalId);
    },[stock]); 

   
    if(stockQuotes){

        return(
            <div className=" pl-10 bg-gray">
            
            
                
              <div className=" mx-auto    rounded-xl shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-white rounded-t-lg  border-b-2 border-gray-200 shadow-md ">
                  <div className="w-1/4  font-semibold text-gray-600">Symbol</div>
                  <div className="w-1/4 text-right font-semibold text-gray-600">Price</div>
                  <div className="w-1/4 text-right font-semibold text-gray-600">Change</div>
                  <div className="w-1/4 text-right font-semibold text-gray-600">Volume</div>
                </div>

                <div className=" overflow-hidden rounded-b-lg shadow-md mt-0  " >
                  {stockList.map((stockSymbol) => {
                    const stockQuote = stockQuotes[stockSymbol];
                    const stockBar = stockBars[stockSymbol];

                    return (
                      <div key={stockSymbol} className="  transition-all duration-200 ">
                        <StockRow 
                          open={stockBar.o}
                          price={stockQuote.bp} 
                          volume={stockBar.v} 
                          symbol={stockSymbol}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

    
            </div>
            
        )
    }
    else {
      return(
        <div className="w-[100%]  h-[75vh]" >
            <LoadingSpinner  ></LoadingSpinner>
        </div> 
      )
    }
    };

export default dashboard;
