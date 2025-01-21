import { createClient } from "@/utils/supabase/server";

import { NextResponse } from "next/server";



async function checkBuy(stock_symbol: string, quantity:number, total: number, price: number){

    const supabase = await createClient()

    try {
        const {data : {user}} = await supabase.auth.getUser()

        const {data , error :userError} = await supabase.from("portfolio").select().eq("id", user?.id)

        if(userError){
            throw new Error(`Error getting User: ${userError}`)
        }

        if(data && data.length > 0){
            const buying_power = data[0].buying_power

            if(buying_power > total){
                
                // if able to buy, deduct amount from balance
                // add to transaction table


                // updating buying power
                const {error : portfolioError} = await supabase.from('portfolio').update({"buying_power": (buying_power - Number(total)).toFixed(2)}).eq("id", user?.id)

                if(portfolioError){
                    console.error(`Error updating buying power:`, portfolioError)
                    throw new Error(`Error updating buying power: ${portfolioError}`)
                }

                // inserting into transaction table
                const {error : insertTransactionError} = await supabase.from('transactions').insert({user_id : user?.id, stock_symbol, action : 'buy', price ,quantity,total_value : total, balanced_quantity: quantity})

                if(insertTransactionError){
                    console.error(`Error insterting BUY to transaction table: `, insertTransactionError)
                    throw new Error(`Error insterting to transaction table: `, insertTransactionError)
                }

                // long balance idk if want to use or just do client calculations

                // const {error: updateLongBalanceError} = await supabase.from('portfolio').update({long_balance: Number(total)}).eq("id",user?.id)

                // if(updateLongBalanceError){
                //     console.error("Error updating long balance", updateLongBalanceError)
                //     throw new Error(`Error updating long balance ${updateLongBalanceError}`)
                // }

                return true


            } else {
                console.log("Insufficent buying power")
                throw new Error("Insufficent buying power")
            }

        }
    } catch (error) {
        throw new Error(`Error in checkBuy: ${error}`)
    }

    

}



export async function POST(req: Request){
     
    const {stock_symbol, quantity, total, price} = await req.json()

    try {
        if(stock_symbol && quantity && total && price){
            const buyStock = await checkBuy(stock_symbol, quantity, total, price)

            if(buyStock){
                return NextResponse.json({success: true})
            }

        } else {
            throw new Error("Not all params met")
        }
        
    } catch (error) {
        return NextResponse.json({success: false, message: `POST BUY Failed: ${error}`})
    }

}