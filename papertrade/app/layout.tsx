

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SideBar from "./components/SideBar";
import { createClient } from "@/utils/supabase/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paper Trade",
  description: "Paper Trade app made using Next.JS, TypeScript, and Supabase",
};




export default async function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  const supabase = await createClient()
  const {data : {user}} = await supabase.auth.getUser()
  
  if(user){
    return (

      <html lang="en">
        <head>
          
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased `}
          >
     
  
            <div className="flex min-h-screen font-[family-name:var(--font-geist-sans)] ">
                <SideBar></SideBar> 
              <div className="w-screen" >{children}</div> 
  
            </div>
  
          
        </body>
      </html>
    );
  } else {
    return (

      <html lang="en">
        <head>
          
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased `}
          >
     
  
            <div className="flex min-h-screen font-[family-name:var(--font-geist-sans)] ">
              <div className="w-screen" >{children}</div> 
  
            </div>
  
          
        </body>
      </html>
    );
  }

  
}
