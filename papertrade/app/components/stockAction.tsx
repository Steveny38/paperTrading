
import {useState} from 'react'
import { useStockContext } from '../context/SelectedStockContext'
import {Notification} from "../components/notification"




const StockAction = () => {

    const {price, stock} = useStockContext()
    
    const [action, setAction] = useState<string>("buy")
    
    const [amount, setAmount] = useState<number>(1)

    const [notification, setNotification] = useState<{
        message: string;
        type: string;
    } | null>(null);

    const showNotification = (message: string, type: string) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
    };


    const submitOrder = async () => {
        const data = await fetch (`/api/transaction/${action}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                "stock_symbol": stock,
                "quantity": amount,
                "total":  (amount * price).toFixed(2),
                "price": price
            })
        })
        const res = await data.json()

        if (res.success === true) {
            showNotification(
                `Successfully placed ${action.toUpperCase()} order for ${amount} shares of ${stock}`,
                'success'
            );
        } else {
            showNotification(
                res.message || "Failed to process order. Please try again.",
                'error'
            );
        }
    }

    return ( 

        <div className='flex flex-col  w-[100%]' >

            <div className='w-[100%] flex flex-wrap justify-evenly ' >
                <button className={`w-[23%] text-2xl  p-2 rounded-md ${action == 'buy' ? 'bg-indigo-800 text-white' : 'bg-gray-100' } `  }   onClick={() => {setAction("buy"); setAmount(1) }} >Buy</button>
                <button className={`w-[23%] text-2xl  p-2 rounded-md ${action == 'sell' ? 'bg-indigo-800 text-white' : 'bg-gray-100' } `  } onClick={() => {setAction("sell")}} >Sell</button>
                <button className={`w-[23%] text-2xl  p-2 rounded-md ${action == 'short' ? 'bg-indigo-800 text-white' : 'bg-gray-100' } `  } onClick={() => {setAction("short")}}  >Short</button>
                <button className={`w-[23%] text-2xl  p-2 rounded-md ${action == 'cover' ? 'bg-indigo-800 text-white' : 'bg-gray-100' } `  } onClick={() => {setAction("cover")}}  >Cover</button>

            </div>

            <div className='mt-4' >
                <p>Quantity</p>
                <div className='flex items-center space-x-2 mt-4 ' >
                    <button className='w-8 h-8 p-1 border "px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 ' onClick={() => {

                        if(amount > 1){
                            setAmount(amount-1)
                        }

                    }}   > - </button>
                    <input className='w-20 p-2 text-center border rounded-lg' type="number" min={1} value={amount} onChange={e => setAmount(Number(e.target.value))} />
                    <button className='w-8 h-8 p-1 border "px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 ' onClick={() => {setAmount(amount+1)}} > + </button>
                </div>
            </div>

            <div className='mt-4 p-4 bg-gray-100 rounded-lg flex flex-row justify-between '  >
                <div className=' ' > 
                    Total Amount: 
                </div>  
                <div>
                    ${ (amount * price).toFixed(2)}
                </div>

            </div>

            <div>
                {notification && (
                    <Notification
                        message={notification.message}
                        type={notification.type}
                    
                    />
                )}
            </div>

            <button onClick={submitOrder} className='bg-indigo-800 p-5 rounded-lg text-white text-xl mt-4'  >Place {action.toUpperCase()} Order </button>

        </div>

     );
}
 
export default StockAction;