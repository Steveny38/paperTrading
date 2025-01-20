import { createContext, useContext, useState } from "react";


const SelectedStockContext = createContext<any>(null)

export const SelectedStockProvider = ({children} : any) =>{
    const [stock, setStock] = useState<string|null>(null)
    const [price, setPrice] = useState<number|null>(null)
    const [change, setChange] = useState<number|null>(null)
    const [stockOpen, setOpen] = useState<number|null>(null)
    const [stockClose, setClose] = useState<number|null>(null)
    const [stockHigh, setHigh] = useState<number|null>(null)
    const [stockLow, setLow] = useState<number|null>(null)
    const [stockRange, setRange] = useState<string>("week")
    const updateStock = (selectedStock: string)=> {
        setStock(selectedStock)
    }
    const updatePrice = (price: number) =>{
        setPrice(price)
    }
    const updateChange = (change: number) => {
        setChange(change)
    }
    const updateStats = (high: number, low: number, open: number, close: number) => {
        setOpen(open)
        setHigh(high)
        setLow(low)
        setClose(close)
    }

    const updateRange = (range: string) =>{
        setRange(range)
    }
   


    return(
        <SelectedStockContext.Provider value={{stock,price,change, stockOpen, stockClose, stockHigh, stockLow, stockRange, updateRange, updateStats, updateStock, updatePrice, updateChange}} >
            {children}
        </SelectedStockContext.Provider>
    )
}

export const useStockContext = () =>{
    return useContext(SelectedStockContext)
}