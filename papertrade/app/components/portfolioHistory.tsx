


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

const PortHistory = (props: {transactionHistory: transactionHistInterface[]|null}) => {
    const {transactionHistory} = props






    return ( <div className=" rounded-lg shadow-md
 bg-white w=[100%]  pt-5 h-[100%] overflow-y-scroll  scrollbar-hide " >

        <div className="text-xl pl-5 border-b pb-5 " >Recent Transactions </div>

        {transactionHistory?.length == 0 ? 
        <div className="text-center mt-5" > Transaction History Will Appear Here </div> :             <div className="" >
        {
            transactionHistory?.map((transaction) => {
                
                return(
                    <div key={transaction.id} className="p-5 border-b h-[100%]" > 
                        <div className="flex items-center " >
                            <div className="flex items-center w-[50%] " >
                                <div className={`py-2 px-4 mr-2 rounded-lg bg-green-100 ${transaction.action == 'buy' ? "bg-green-100 text-green-700 " : transaction.action == 'short'? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700 "} `} >{(transaction.action).toUpperCase()}</div>

                                <div className="font-semibold" >{transaction.stock_symbol}</div>
                            </div>

                            <div className="w-[50%] text-right text-gray-500 text-sm ">
                                <div>{(transaction.created_at).slice(0,10)}</div>
                            </div>

                        </div>

                        <div className="flex mt-3" >
                            <div className="w-[50%] font-thin text-gray-500 text-sm " >{transaction.quantity} shares @ {transaction.price}</div>
                            {transaction.action == 'sell' || transaction.action == 'cover'? <div className="w-[50%] text-right font-thin text-gray-500 text-sm " >Profit: {transaction.profit}</div> : <div></div>}
                        </div>


                    </div>
                )
            })
        }
    </div>
    }



    </div> );
}
 
export default PortHistory;