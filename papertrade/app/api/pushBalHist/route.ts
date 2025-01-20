import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";


async function pushBalHistory(buying_power: number, total_value: number){

    const supabase = await createClient()

    const {data: {user}} = await supabase.auth.getUser()


    try {
        
        const {error: insertBalHistError} = await supabase.from("porthistory").insert({buying_power: buying_power, total_value: total_value, user_id: user?.id})

        if(insertBalHistError){
            console.error("insertBalHistError", insertBalHistError)
            throw new Error("insertBalHistError", insertBalHistError)
        }
            return true
      
          
    
   


    } catch (error) {
        throw new Error(`Error in pushBalHistory ${error}`)
    }

}

export async function POST(req: Request){

    try {
        
        const {buying_power, total_value } = await req.json()

        const data = await pushBalHistory(buying_power, total_value)

        if(data){
            return NextResponse.json({success: true})
        } else {
            throw new Error("Not all params met")
        }

    } catch (error) {
        return NextResponse.json({success: false, message: `Error in POST pushBalHist: ${error}`})
    }

}