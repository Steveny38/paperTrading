import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"


async function getPortfolioData() {
    try {

        const supabase = await createClient()

        const {data : {user}, error: getUserError} = await supabase.auth.getUser()

        if(getUserError){
            console.error("Error getting user", getUserError)
            throw new Error("Error getting user", getUserError)
        }

        const {data: portData, error: getPortError} = await supabase.from("portfolio").select().eq("id", user?.id).single()

        if(getPortError){
            console.error("Error getting portfolio data", getPortError)
            throw new Error("Error getting portfolio data", getPortError)
        }

        const {data: transactionData, error: transactionDataError} = await supabase.from("transactions").select().eq("user_id", user?.id)

        if(transactionDataError){
            console.error("Error getting transaction data", transactionDataError)
            throw new Error("Error getting transaction data", transactionDataError)
        }

        const returnTransactionData: { stock_symbol: string; action: string; price: number; quantity: number; total_value: number; created_at: string | null; balanced_quantity: number | null, profit: number | null , id : string}[] = []

        transactionData.forEach((transaction) => {
            returnTransactionData.push({stock_symbol: transaction.stock_symbol, action : transaction.action, price: transaction.price, quantity: transaction.quantity, total_value: transaction.total_value, created_at: transaction.created_at, balanced_quantity: transaction.balanced_quantity, profit: transaction.profit, id : transaction.id })
        })

        const returnPortData = {
            start_amount : portData.start_amount, net_roi: portData.net_roi, buying_power: portData.buying_power
        }

        

        const currentHoldings = returnTransactionData.filter((transaction) => {
                return transaction.balanced_quantity != 0 && transaction.balanced_quantity != null
        })

        const holdingString: string[] = []

        currentHoldings.forEach((transaction) => {holdingString.push(transaction.stock_symbol)})

        if(holdingString.length == 0){
            return  [returnPortData, returnTransactionData, currentHoldings, []]
        }

        const holdingPrices = await fetch(`${process.env.DEVELOPMENT_URL}/api/stock`, {
            method: "POST",
            headers:{
                "Content-type" : "application/json"
            },
            body: JSON.stringify(holdingString)
        }).then((res) => res.json()).then((res) => res[0])

 

        



     

        return [returnPortData, returnTransactionData, currentHoldings, holdingPrices]
        
        
    } catch (error) {
        console.error("Error in getPortfolioData", error)
        throw new Error("Error in getPortfolioData")
    }
}


export async function GET(){

    try {
        const data = await getPortfolioData()

        if(data){

            return NextResponse.json({success: true,  portfolio : data[0] ,transactions: data[1], currentHoldings: data[2], holdingPrices: data[3]})


        } else {
            throw new Error("GET getPortfolioData Failed")
        }

        
    } catch (error) {
        return NextResponse.json({success: false, message: `Error in GET getPortfolioHead`})
    }

}