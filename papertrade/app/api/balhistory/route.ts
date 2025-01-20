import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";


async function checkHistory(){

    const supabase = await createClient()

    const {data:{user}} = await supabase.auth.getUser()

    try {
        
        const {data: balHist, error: balHistError} = await supabase.from("porthistory").select().eq("user_id", user?.id)

        if(balHistError){
            console.error("balHistError", balHistError)
            throw new Error("balHistError", balHistError)
        }

        const returnBalHist: { id: string; buying_power: number; created_at: string; total_value: number }[] = []

        balHist.forEach((hist) => {
            returnBalHist.push({id: hist.id, buying_power: hist.buying_power, created_at: hist.created_at, total_value: hist.total_value})
        })

        return returnBalHist


    } catch (error) {
        console.error("Error in checkHistory", error)
        throw new Error("Error in checkHistory");
        
    }

}

export async function GET(req: Request){
    try {
        const data = await checkHistory()

        if(data){
            return NextResponse.json({success: true, balHist: data})
        }

    } catch (error) {
        return NextResponse.json({success: false, message: `ERROR IN BALHIST ${error}`})
    }
}