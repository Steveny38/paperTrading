import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

async function checkShort(stock_symbol: string, quantity: number, total: number, price: number){

    try {
        
        const supabase = await createClient()

        const {data : {user}} = await supabase.auth.getUser()

        const {data :portfolioData , error: userError} = await supabase.from("portfolio").select().eq("id", user?.id)

        if(userError){
            console.error("Error getting User: ", userError)
            throw new Error("Error getting User");
        }

        if(portfolioData && portfolioData.length > 0){
            
            if(portfolioData[0].buying_power >= total * 1.5 ){

                const {error: portfolioError} = await supabase.from('portfolio').update({buying_power: (Number(portfolioData[0].buying_power) - Number(total)).toFixed(2)  }).eq("id", user?.id)

                if(portfolioError){
                    console.error(`Error updating buying power:`, portfolioError)
                    throw new Error(`Error updating buying power: ${portfolioError}`)
                }

                const {error : insertTransactionError} = await supabase.from('transactions').insert({user_id : user?.id, stock_symbol, action : 'short', price ,quantity,total_value : total, balanced_quantity: quantity})

                if(insertTransactionError){
                    console.error(`Error insterting BUY to transaction table: `, insertTransactionError)
                    throw new Error(`Error insterting to transaction table: `, insertTransactionError)
                }

                return true


            }else {
                console.log("Insufficent buying power to short (1.5 * total)")
                throw new Error("Insufficent buying power to short (1.5 * total)")
            }

        }


    } catch (error) {
        throw new Error(`Error in checkShort: ${error}`)
    }
}


export async function POST(req: Request){
    try {
        
        const {stock_symbol, quantity, total, price} = await req.json()

        if(stock_symbol && quantity && total && price){
            const res = await checkShort(stock_symbol, quantity, total, price)

            if(res){
                return NextResponse.json({success: true})
            }
        } else {
            throw new Error("Not all params met")
        }


    } catch (error) {
        return NextResponse.json({structuredClone: false, message: `POST SHORT Failed: ${error}`})
    }
}