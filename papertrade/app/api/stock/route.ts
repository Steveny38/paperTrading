import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";




const APCA_API_KEY_ID = process.env.APCA_API_KEY_ID
const APCA_API_SECRET_KEY = process.env.APCA_API_SECRET_KEY

async function alpacaQuotesAPI(symbol: string) {
    try {
        const url = "https://data.alpaca.markets/v2/stocks/quotes/latest"
        const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              'APCA-API-KEY-ID': `${APCA_API_KEY_ID}`,
              'APCA-API-SECRET-KEY': `${APCA_API_SECRET_KEY}`
            }
          };
        
        const symbolList = symbol.replace(",", "%2C")

        const response = await fetch(`${url}?symbols=${symbolList}`, options)

        const data = await response.json()

        
        return data;


    } catch (error) {
        console.log(error)
    }

}

async function alpacaBarsAPI(symbol: string){
    try {
        const url = "https://data.alpaca.markets/v2/stocks/bars/latest"

        const options = {
            method: "GET",
            headers: {
                accept: 'application/json',
                'APCA-API-KEY-ID': `${APCA_API_KEY_ID}`,
                'APCA-API-SECRET-KEY': `${APCA_API_SECRET_KEY}`
              }
        }

        const symbolList = symbol.replace(",", "%2C")

        const data = await fetch(`${url}?symbols=${symbolList}`, options)

        const res = await data.json()

   

        return res



    } catch (error) {
        console.log(error)
    }
}

export async function POST(request: Request){

    const stockList = await request.json(); 

    const joinedList = stockList.join(",");

    const quotes = await alpacaQuotesAPI(joinedList);   

    const bars = await alpacaBarsAPI(joinedList);

    

    return NextResponse.json([quotes, bars])



}