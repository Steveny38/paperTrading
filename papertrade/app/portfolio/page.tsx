'use client'

import { useEffect, useState } from "react";
import PortfolioHead from "../components/portfolioHead";
import PortRangeChart from "../components/portRangeChart";
import PortHoldings from "../components/portHoldings";
import PortHistory from "../components/portfolioHistory";
import PortfolioPie from "../components/portfolioPie";
import LoadingSpinner from "../components/loader";
import { SelectedStockProvider } from "../context/SelectedStockContext";

interface transactionHistInterface {

    stock_symbol: string,
    action: string,
    price: number,
    quantity: number,
    total_value: number,
    created_at: string,
    balanced_quantity: number,
    profit: number | null
    id : string

}


interface portDataInterface{
    start_amount : number
    net_roi: number 
    buying_power: number
}

interface Quote {
    ap: number;
    as: number;
    ax: string;
    bp: number;
    bs: number;
    bx: string;
    c: string[];
    t: string;
    z: string;
  }
  
  interface Quotes {
    [symbol: string]: Quote;
  }



const PortfolioPage = () => {

    const [transactionHist, setTransactionHist] = useState<transactionHistInterface[] | null>(null)

    const [currHolding, setCurr] = useState<transactionHistInterface[]|null>(null)
    const [holdingValues, setHoldingValues] = useState<Quotes|null>(null)

    const [totalValue, setTotalValue] = useState<number|null>(null)

    const [portData, setPortData] = useState<portDataInterface | null>(null)

    useEffect(() => {
        const getData = async () => {
            const res = await fetch('/api/portfolio')

            const data = await res.json()

            if(data.success){
                setPortData(data.portfolio)
                setTransactionHist(data.transactions)
                setCurr(data.currentHoldings)

                if(data.holdingPrices.quotes == undefined){
                    setHoldingValues({})
                } else {

                    setHoldingValues(data.holdingPrices.quotes)
                }




                



                let stockRevenue = 0

                data.currentHoldings?.forEach((stock: { action: string; quantity: number; stock_symbol: string ; price: number; }) =>{
                    if(stock.action == 'buy'){
                        stockRevenue+= stock.quantity * data.holdingPrices.quotes[stock.stock_symbol].bp
                        
                    } else if (stock.action == 'short'){
                        stockRevenue += stock.quantity * (stock.price - (stock.price - data.holdingPrices.quotes[stock.stock_symbol].bp  ))
                    }
                })

                console.log("DATA:",data)

                setTotalValue(stockRevenue + data.portfolio.buying_power)

            } 

            

        }

        getData()

        const intervalId = setInterval(() => {
            getData()
        }, 30000);

       
        return () => clearInterval(intervalId);

        
        


    }, [])

        console.log("HUH",portData)
        console.log("ASD", totalValue)

  
        if(portData && totalValue && holdingValues){

            return ( <div className="w-[100%] p-4 flex flex-col  h-screen " >
          
                
                <div className="h[15%] " >
                    <PortfolioHead buyingPower={portData.buying_power} totalValue={totalValue}  ></PortfolioHead>
                </div>
    
                <div className="w-[100%] h-[85%] flex flex-wrap justify-between  " >
    
                    <div className="w-[70%] h-[100%] " >
                        <div className=" w-[100%] pt-5 h-[65%] " >
                            <PortRangeChart buying_power={portData.buying_power} total_value={totalValue}  ></PortRangeChart>
                        </div>
    
                        <div className="h-[35%]" >
                            <SelectedStockProvider>
                                <PortHoldings holdingPrices={holdingValues} currentHoldings={currHolding} ></PortHoldings>
                            </SelectedStockProvider>
                        </div>
                        
                    </div>
    
    
                    <div className="w-[30%] h-[100%] flex flex-wrap justify-between pl-5" >
    
                        <div className="h-[50%] w-[100%] " ><PortfolioPie currentHoldings={currHolding} ></PortfolioPie></div>
    
                        <div className="h-[50%] w-[100%] bg-transparent pt-10 " >
                            <PortHistory transactionHistory={transactionHist}></PortHistory>
    
                        </div>
                    </div>
                </div>
    
    
            </div> );
    
        
        }

        return ( <div className="w-[100%]  h-screen" >
            <LoadingSpinner  ></LoadingSpinner>
        </div> );

    }


   

 
export default PortfolioPage;