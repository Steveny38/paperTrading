'use client'
import Link from "next/link";

import { 
    
    LayoutDashboard, 
    Wallet, 
    LogOutIcon

  } from 'lucide-react';
import { usePathname, useRouter } from "next/navigation";

const SideBar = () => {


    const pathname = usePathname()
    const router = useRouter()

    const navigation = [
        { name: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
        { name: 'Portfolio', icon: Wallet, id: 'portfolio' },

      ];

    
    return ( <div className="flex flex-col h-screen w-[20vw] sticky  left-0 top-0 bg-white shadow-sm text-center p-[2rem] " >
        {   
            navigation.map((page) => {
                
                return(

                    <Link onClick={() => router.push(page.id)} key={page.id} href={`/${page.id}`}  className={`pl-[1vw] pt-[1vh] mb-4     flex items-center gap-3 px-4 py-3 rounded-lg transition-colors  ${pathname === `/${page.id}` ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'} `} >

                        <page.icon className="w-5 h-5"></page.icon>
                        <span className="font-bold">{page.name}</span>
                    
                    </Link>



                )
            })

    
        }
   
        <div className="pl-[1vw] pt-[1vh]  flex items-center gap-3 px-4 py-3 rounded-lg  text-red-400 hover:text-red-600 hover:bg-red-50  " >
            <LogOutIcon className="w-5 h-5"></LogOutIcon>
            <form action="/auth/signout" method="post">
            <button className="button block" type="submit"> 
                Sign out
            </button>
            </form>
        </div>


    </div> );
}
 
export default SideBar;