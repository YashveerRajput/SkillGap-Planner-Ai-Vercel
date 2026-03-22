//this is managing state and api layer

import { useContext } from "react";
import { AuthContext } from "../auth.context";
import {login,register,logout} from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext)
    const {user,setUser ,loading,setLoading} = context

    const handleLogin = async ({email,password}) => {
        setLoading(true)
            try{
                const data = await login({email,password})
                //state management
                setUser(data?.user ?? null)
                return true
            }catch(err){
                console.error(err)
                return false
            }finally{
                //state management
                setLoading(false)
            }
        }
        

    const handleRegister = async ({username,email,password}) => {
        setLoading(true)
        try{
            const data = await register({username,email,password})
            setUser(data?.user ?? null)
            return true
        }catch(err){
            console.error(err)
            return false
        }finally{

            setLoading(false)
        }
        
    }

    const handleLogout = async () => {
        setLoading(true)
        try{
            await logout()
            setUser(null)
            return true
        }catch(err){
            console.error(err)
            return false
        }finally{
            setLoading(false)
        }
    }

    //api layer se data (response aa rha hai)
    return { user, loading, handleRegister, handleLogin, handleLogout }
}
