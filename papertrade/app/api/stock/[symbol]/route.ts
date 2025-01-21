import { NextResponse } from "next/server";


const APCA_API_KEY_ID = process.env.APCA_API_KEY_ID
const APCA_API_SECRET_KEY = process.env.APCA_API_SECRET_KEY

async function getStockHistory(symbol: string, timeframe: string){

    let time, start, formatedStart
  

   

    const current = new Date()
    
    const formatedEnd = current.toISOString().replace(/\.\d{3}Z$/, 'Z').replace(/:/g, '%3A')

    switch (timeframe) {
        case "minute":
            start = new Date()
            start.setHours(0,0,0,0)
            
            formatedStart = start.toISOString().replace(/\.\d{3}/, '').replace(/:/g, '%3A');


            time = "1Min"
            

            break;
        
        case "hour":

            start = new Date()
            start.setHours(0,0,0,0)
     
            formatedStart = start.toISOString().replace(/\.\d{3}/, '').replace(/:/g, '%3A');
            time = "1H"
            
            break;

        case "week":
            start = new Date()
            start.setFullYear(start.getFullYear() -1)
    
            start.setHours(0,0,0,0)
    
            formatedStart = start.toISOString().replace(/\.\d{3}/, '').replace(/:/g, '%3A');
            
            time = "1W"
            break;
        
        case "month":

            start = new Date()
            start.setFullYear(start.getFullYear() -1)
    
            start.setHours(0,0,0,0)
    
            formatedStart = start.toISOString().replace(/\.\d{3}/, '').replace(/:/g, '%3A');
            
            time = "1M"

            break;

        
    
        default:
            break;
    }

     const url = `https://data.alpaca.markets/v2/stocks/${symbol}/bars?timeframe=${time}&start=${formatedStart}&end=${formatedEnd}&limit=1000&adjustment=all&feed=iex&sort=asc`

    try {
      
        const data = await fetch(url, {
            method: "GET",
            headers: {
                accept: "application/json",
                'APCA-API-KEY-ID': `${APCA_API_KEY_ID}`,
                'APCA-API-SECRET-KEY': `${APCA_API_SECRET_KEY}`
            }
        })

        const res = await data.json()

        if(res){
            return res
        } else {
            throw Error("No res")
        }
        
    } catch (error) {
        console.log("Error: ", error)
    }

    


}


export async function POST(request: Request, { params }: { params: { symbol: string } }){
    const {symbol} = await params

    const timeframe = await request.json()



    const data = await getStockHistory(symbol, timeframe)

    return NextResponse.json(data)

}