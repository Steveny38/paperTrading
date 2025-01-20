'use client'

import { User } from "@supabase/supabase-js";
import { createContext, useContext, useState } from "react";


const AuthContext = createContext<any>(null)

export const AuthContextProvider = ({children} : any) => {

    
    const [user, setUser] = useState<User | null>(null)


    const updateUser = (user: User) => {
        setUser(user)
    }

    return(
        <AuthContext.Provider value={{user,updateUser} }>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuthContext = () => {
    return useContext(AuthContext)
}