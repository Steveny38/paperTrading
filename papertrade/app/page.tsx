'use client'
import { redirect } from "next/navigation";

export default function Home() {



  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-[10rem]" >Paper Trade</h1>
        <div className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <div className="mb-[2rem]">
          <a href="https://github.com/Steveny38/paperTrading">
            https://github.com/Steveny38/paperTrading
          
          </a>
          </div>
          
          <button onClick={() => {redirect('/dashboard')}} className="p-5 bg-indigo-800 rounded-xl text-white " >Login / Sign Up</button>
          
        </div>

      </main>
      <div className="row-start-3 flex flex-col flex-wrap items-center justify-center">
       <div className="font-[family-name:var(--font-geist-mono)" >Made Using</div>
       <div className="flex gap-6 flex-wrap items-center justify-center">
        <div>
          <img height={50} width={50} src="/supabase-logo-icon.svg" alt="Supabase Logo" />
        </div>
        <div>
          <img height={100} width={100} src="/next.svg" alt="" />
          </div>
        <div><img height={50} width={50} src="/ts-logo-128.svg" alt="" /></div>

       </div>


  
      </div>
    </div>
  );
}
