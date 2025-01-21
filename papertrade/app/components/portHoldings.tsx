'use client'

import { useRouter } from 'next/navigation'


interface transactionHistInterface {

    stock_symbol: string,
    action: string,
    price: number,
    quantity: number,
    total_value: number,
    created_at: string,
    balanced_quantity: number,
    profit: number | null
    id: string


}

interface holdingsMapInterface {
  [key: string]: { [stockName: string]: transactionHistInterface };
}



const PortHoldings = (props:{currentHoldings: transactionHistInterface[]|null, holdingPrices: any} ) => {
    
    const {currentHoldings, holdingPrices} = props


    let holdingsMap: holdingsMapInterface = { "buy": {}, "short": {}, "sell": {}, "cover" : {} }

    const router = useRouter()

    
    currentHoldings?.forEach(hold => {
        if(holdingsMap[hold.action][hold.stock_symbol] != undefined ){
          holdingsMap[hold.action][hold.stock_symbol].balanced_quantity = holdingsMap[hold.action][hold.stock_symbol].balanced_quantity + hold.balanced_quantity
        }
        else{
          holdingsMap[hold.action][hold.stock_symbol] = hold
        }
    })

    console.log(holdingsMap)

    // action: "short"
    // balanced_quantity: 5
    // created_at: "2025-01-17T02:50:29.349934"
    // price: 424.53
    // profit: null
    // quantity: 5
    // stock_symbol: "MSFT"
    // total_value: 2122.6
    
  
    
    return ( 
  
          <div className="  w-[100%] h-[100%]  pt-5 ">
          {/* Holdings Table */}
          <div className="col-span-2 bg-white rounded-lg shadow-md
  overflow-y-scroll scrollbar-hide w-[100%] h-[100%] ">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Holdings</h2>
            </div>

            {currentHoldings?.length == 0 ? <div className="w-[100%] my-auto text-center mt-5 ">
                <div>

                  Buy Stocks To See Holdings
                </div>
              </div> : 
            
            <div className="overflow-x-auto ">
            <table className="w-full">
              <thead className="border-b bg-indigo-50">
                <tr>
                  <th className="text-left p-4">Symbol</th>
                  <th className="text-right p-4">Action</th>
                  <th className="text-right p-4">Quantity</th>
                  <th className="text-right p-4">Current Price</th>
             

                </tr>
              </thead>
              
              <tbody className="divide-y border-b ">
                

          
                {
                  Object.keys(holdingsMap["buy"]).map(holding => {
                    return(
                    <tr key={holdingsMap["buy"][holding].id} className="hover:bg-indigo-50 " >
                      <td className="p-4 font-medium">{holdingsMap["buy"][holding].stock_symbol}</td>
                      <td className="p-4 text-right">{holdingsMap["buy"][holding].action}</td>
                      <td className="p-4 text-right">{holdingsMap["buy"][holding].balanced_quantity}</td>
                      <td className="p-4 text-right">{holdingPrices[holding].bp}</td>
            
                    </tr>)
                  })
                }
                {
                  Object.keys(holdingsMap["short"]).map(holding => {

                    console.log()

                    return(
                    <tr key={holdingsMap["short"][holding].id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium">{holdingsMap["short"][holding].stock_symbol}</td>
                      <td className="p-4 text-right">{holdingsMap["short"][holding].action}</td>
                      <td className="p-4 text-right">{holdingsMap["short"][holding].balanced_quantity}</td>
                      <td className="p-4 text-right">{holdingPrices[holding].bp}</td>
                    </tr>)
                  })
                }

              </tbody>
            </table>
          </div>
            }
      
          </div>
          </div>


     );
}
 
export default PortHoldings;