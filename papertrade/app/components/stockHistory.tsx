"use client"

import { useEffect, useState } from "react";
import { useStockContext } from "../context/SelectedStockContext";
import { LineChart, ResponsiveContainer, Line, CartesianGrid, XAxis, YAxis, AreaChart, Tooltip } from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";
import StockAction from "./stockAction";

interface bar {
    "c": number,
    "h": number,
    "l": number,
    "n": number,
    "o": number,
    "t": string,
    "v": number,
    "vw": number
}

const stockHistory = () => {

    const {stock, price, change,stockHigh, stockLow, stockClose, stockOpen, stockRange, updateRange} = useStockContext()
    const [history, setHistory] = useState<bar[] | null>(null)

    const [minP, setMin] = useState<number | null>(null)
    const [maxP, setMax] = useState<number | null>(null)

 
      
      const CustomTooltip = ({ active, payload,  } : {
        active: any ; payload: any; 
      }) => {
        if (active && payload && payload.length) {
          return (
            <div className="custom-tooltip">
              <p className="label">{`Price: ${payload[0].value}`}</p>
            </div>
          );
        }
      
        return null;
      };

    useEffect(() => {
        if(!stock) return
        const getStockHistory = async () => {
            const data = await fetch(`/api/stock/${stock}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(`${stockRange}`)
            })
            const res = await data.json()
            
            let low = res.bars[0].l
            let high = res.bars[0].h
            res.bars.forEach((bar: bar) => {
                if(bar.l < low){
                    low = bar.l
                }
                if(bar.h > high){
                    high = bar.h
                }
            });

            setMin(low)
            setMax(high)

            setHistory(res.bars)

           

        }
        getStockHistory()
    }, [stock, stockRange])

    
        return(
             <div className="p-7 border-b rounded-md shadow-md bg-white
 ">
               <div className={`h-[75vh] flex items-center ${stock && history? 'flex-col' : '' } `}>
                 {
                    stock && history && minP && maxP ? (
                        <>
                        <div className="flex flex-col w-[100%] pb-4  mx-auto border-b ">
                            <div className="flex flex-row justify-between  ">
                                <h1 className="font-bold size text-3xl" >{stock}</h1>
                                <h1 className="font-bold size text-3xl" >{price}</h1>
                            </div>
                            <div className={`flex items-center justify-end font-medium text-lg ${change > 0 ? 'text-green-500' : 'text-red-500'} `}   >
                                {change > 0 ?
                                    <TrendingUp className="w-4 h-4 mr-1" /> :
                                    <TrendingDown className="w-4 h-4 mr-1" />
                                }
                                <h1>{change}%</h1>
                            </div>
                        </div>
                        
                        <div className={"mt-4 w-[100%] h-[50%] border-b "}>

                            <ResponsiveContainer   width="100%" height="100%">
                                <LineChart  data={history}>
                                        <XAxis></XAxis>
                                    <YAxis domain={[minP - 2, maxP + 2]} />
                                    <Tooltip content={<CustomTooltip active={undefined} payload={undefined} ></CustomTooltip>} />
                                    <Line dot={{r:0}} type="monotone" dataKey="c" stroke="#2563eb" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="my-4 flex flex-row w-[100%] justify-end " >
                            <button onClick={()=> {updateRange("minute")}} className={`ml-4 bg-gray-100 rounded-lg hover:bg-gray-200 p-2 ${stockRange == "minute"?"bg-indigo-800 hover:none  text-white" : "" } `} >1Min</button>
                            <button onClick={()=> {updateRange("hour")}} className={`ml-4 bg-gray-100 rounded-lg hover:bg-gray-200 p-2 ${stockRange == "hour"?"bg-indigo-800 hover:none  text-white" : "" } `} >1H</button>
                            <button onClick={()=> {updateRange("week")}} className={`ml-4 bg-gray-100 rounded-lg hover:bg-gray-200 p-2 ${stockRange == "week"?"bg-indigo-800 hover:none  text-white" : "" } `} >1W</button>
                            <button onClick={()=> {updateRange("month")}} className={`ml-4 bg-gray-100 rounded-lg hover:bg-gray-200 p-2 ${stockRange == "month"?"bg-indigo-800 hover:none  text-white" : "" } `} >1M</button>

                        </div>

                        <div className="flex flex-col w-[100%] mt-4 " >
                            <h1 className="text-left text-xl  mb-4  ">Key Statistics</h1>

                            <div className="flex flex-wrap justify-between">
                                <div className="w-[40%] flex flex-col mb-4 " >
                                    <div  className="text-lg font-medium"  >Open</div>
                                    <div className=" text-xl font-semibold" >${stockOpen}</div>
                                </div>
                                <div className="w-[40%] flex flex-col mb-4 " >
                                    <div className="text-lg font-light" >Close</div>
                                    <div className=" text-xl font-semibold" >${stockClose}</div>
                                </div>
                                <div className="w-[40%] flex flex-col mb-4 " >
                                    <div className="text-lg font-light" >High</div>
                                    <div className=" text-xl font-semibold" >${stockHigh}</div>
                                </div>
                                <div className="w-[40%] flex flex-col mb-4 " >
                                    <div className="text-lg font-light" >Low</div>
                                    <div className=" text-xl font-semibold" >${stockLow}</div>
                                </div>
                            </div>

                        </div>

                            <StockAction>

                            </StockAction>
              



                        </>


                    ) : (<h1 className="mx-auto" >Please Select A Stock to View History</h1>)
                 }
               </div>
             </div> 
        )
    



}
 
export default stockHistory;