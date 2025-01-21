import { createClient } from "@/utils/supabase/server";
import {  NextResponse } from "next/server";


async function checkSell(stock_symbol: string, quantity: number, total: number, price: number){

    const supabase = await createClient()

    try {
        
        const {data: {user}} = await supabase.auth.getUser()

        const {data :portfolioData , error: userError} = await supabase.from("portfolio").select().eq("id", user?.id)

        if(userError){
            console.error("Error getting User: ", userError)
            throw new Error("Error getting User");
        }

        if(portfolioData && portfolioData.length > 0){

            // get all buy orders that haven't been balanced

            const {data: buyHistory, error: buyHistoryError} = await supabase.from("transactions").select().eq("user_id", user?.id).eq("stock_symbol", stock_symbol).eq("action", "buy").neq("balanced_quantity", 0).order('created_at', {ascending: false}) 

            if( buyHistory?.length == 0 || buyHistoryError){ console.error("No buy history")
                throw new Error("No buy history")
            }

            let buyQuantity = 0
            buyHistory.forEach((purchase) => {
                buyQuantity = buyQuantity + purchase.balanced_quantity
            })


            let sellQ = quantity

            let totalBoughtAt = 0

            if(buyQuantity - quantity >= 0){
                
                // create stack to cover buy transactions

                while(sellQ != 0 ){

                    const oldestPurchase = buyHistory.at(-1)

                    if( oldestPurchase.balanced_quantity - sellQ < 0){
                        
                

                        sellQ = sellQ -oldestPurchase.balanced_quantity

                        totalBoughtAt = totalBoughtAt + oldestPurchase.balanced_quantity * oldestPurchase.price

                        const {error: updateBalance_QuantityError} = await supabase.from("transactions").update({balanced_quantity: 0}).eq("id", oldestPurchase.id)
                        
                        if(updateBalance_QuantityError){
                            console.error("Error updating balanced_quantity", updateBalance_QuantityError)
                            throw new Error("Error updating balanced_quantity")
                        }

                        buyHistory.pop()
                    } else {

                  

                        totalBoughtAt = totalBoughtAt + sellQ * oldestPurchase.price

                        const {error: updateBalance_QuantityError} = await supabase.from("transactions").update({"balanced_quantity": (oldestPurchase.balanced_quantity - Number(sellQ)) }).eq("id", buyHistory.at(-1).id)

                        buyHistory.pop()

                        sellQ = 0

                        if(updateBalance_QuantityError){
                            console.error("Error updating balanced_quantity", updateBalance_QuantityError)
                            throw new Error("Error updating balanced_quantity")
                        }


                    }

                }

                const {data: current, error: currentBPError} = await supabase.from("portfolio").select().eq("id", user?.id).single()

                const newTotal = current.buying_power + Number(total)
    
                const {error: sellUpdateError} = await supabase.from("portfolio").update({"buying_power": newTotal }).eq("id", user?.id)
    
                if(sellUpdateError){
                    console.error("sellUpdateError", sellUpdateError)
                    throw new Error("sellUpdateError", sellUpdateError)
                }
    
                
    
                if(currentBPError){
                    console.error("currentBPError", currentBPError)
                    throw new Error("currentBPError", currentBPError)
                }
    
                
    
                const {error: insertTransactionError} = await supabase.from("transactions").insert({user_id: user?.id , stock_symbol, action: 'sell', price, quantity, total_value: total, profit: totalBoughtAt - Number(total)})
    
                if(insertTransactionError){
                    console.error("Error inserting SELL into transaction table", insertTransactionError)
                    throw new Error(`Error inserting SELL to transaction table`, insertTransactionError)
                }

                return true



            } else {
                console.log("Sell quantity greater than owned")
                throw new Error("Sell quantity greater than owned")
            }


        }

    } catch (error) {
        throw new Error(`Error in checkSell ${error}` );
    }
}

export async function POST(req: Request){
    const {stock_symbol, quantity, total, price} = await req.json()

    try {
        if(stock_symbol && quantity && total && price){
            const res = await checkSell(stock_symbol, quantity, total, price)

            if(res){
                return NextResponse.json({success : true})
            }
        } else {
            throw new Error("Not all params met")
        }
        

    } catch (error) {
        return NextResponse.json({success: false, message: `POST SELL Failed: ${error}`})
    }

}