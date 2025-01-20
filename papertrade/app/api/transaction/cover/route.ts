import { createClient } from "@/utils/supabase/server";
import { Convergence } from "next/font/google";
import { NextResponse } from "next/server";

async function checkCover(stock_symbol: string, quantity: number, total: number, price: number){

    try {
        
        const supabase = await createClient()

        const {data : {user}} = await supabase.auth.getUser()

        const {data :portfolioData , error: userError} = await supabase.from("portfolio").select().eq("id", user?.id)

        if(userError){
            console.error("Error getting User: ", userError)
            throw new Error("Error getting User");
        }

        if(portfolioData && portfolioData.length > 0){

            const {data: shortHistory, error: shortHistoryError} = await supabase.from("transactions").select().eq("user_id", user?.id).eq("stock_symbol", stock_symbol).eq("action","short").order('created_at', {ascending: false}).neq("balanced_quantity", 0)

            

            if( shortHistory?.length == 0 || shortHistoryError){
                console.error("No short history")
                throw new Error("No short history")
            }

           
            let shortQuantity = 0

            shortHistory.forEach((short) => {
                shortQuantity = shortQuantity + short.quantity
            })

            let coverQ = quantity

            let totalShortAt = 0

            if(shortQuantity - quantity >= 0){



                while(coverQ != 0){

                    const oldestShort = shortHistory.at(-1)


                    if(oldestShort.balanced_quantity - coverQ < 0){

                        coverQ = coverQ - oldestShort.balanced_quantity



                        totalShortAt = totalShortAt + oldestShort.price * oldestShort.balanced_quantity


                        const {error: updateBalance_QuantityError} = await supabase.from("transactions").update({balanced_quantity : 0}).eq("id", oldestShort.id)

                        if(updateBalance_QuantityError){
                            console.error("Error updating balanced_quantity", updateBalance_QuantityError)
                            throw new Error("Error updating balanced_quantity")
                        }


                        shortHistory.pop()
                    }
                    else {


                        totalShortAt = totalShortAt + coverQ * price
                        
                        const {error: updateBalance_QuantityError} = await supabase.from("transactions").update({balanced_quantity: (oldestShort.balanced_quantity - coverQ)}).eq("id", oldestShort.id)

                        shortHistory.pop()

                        coverQ = 0

                        if(updateBalance_QuantityError){
                            console.error("Error updating balanced_quantity", updateBalance_QuantityError)
                            throw new Error("Error updating balanced_quantity")
                        }

                    }

                }



                const {error: coverUpdateError} = await supabase.from("portfolio").update({buying_power: portfolioData[0].buying_power + Number(totalShortAt) + Number(totalShortAt) - Number(total)}).eq("id", user?.id)

                if(coverUpdateError){
                    console.error("coverUpdateError", coverUpdateError)
                    throw new Error("coverUpdateError", coverUpdateError)
                }

                const total2 = totalShortAt.toFixed(2)

                const {error: insertTransactionError} = await supabase.from("transactions").insert({
                    user_id: user?.id, stock_symbol, action : "cover", price, quantity, total_value: total, profit: ((Number(total2)) - Number(total)).toFixed(2)})

                if(insertTransactionError){
                    console.error("Error inserting COVER into transaction table", insertTransactionError)
                    throw new Error(`Error inserting COVER to transaction table`, insertTransactionError)
                }

                return true

            } else {
                console.log("Cover quantity greater than owned")
                throw new Error("Cover quantity greater than owned")
            }

        }




    } catch (error) {
        throw new Error(`Error in checkCover ${error}`);
    }

}

export async function POST(req: Request){

    const {stock_symbol, quantity, total, price} = await req.json()

    try {

        if(stock_symbol && quantity && total && price){
            const res = await checkCover(stock_symbol, quantity, total, price)

            if(res){
                return NextResponse.json({success: true})
            } else {
                throw new Error("Not all params met")
            }
        }

        
    } catch (error) {
        return NextResponse.json({success: false, message: `POST COVER Failed: ${error}`})
    }


}
