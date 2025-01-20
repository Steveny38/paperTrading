'use client'

import StockHistory from "../components/stockHistory";
import StockList from "../components/stockList"
import { SelectedStockProvider } from "../context/SelectedStockContext"


const page = () => {

    return (
        <SelectedStockProvider>
            <div className="" >
                <h1 className="text-4xl py-10 pl-10" >Dashboard</h1>
                <div className="flex flex-wrap " >

                    <div className="min-w-[70%] mb-4 " >

                        <StockList></StockList>

                    </div>

                    <div className=" min-w-[20%] h-[75vh] mr-[2.5%]   fixed  right-0 ">
                        <StockHistory  ></StockHistory>
                    </div>
                </div>



            </div>

        </SelectedStockProvider>
 );
}   
 
export default page;