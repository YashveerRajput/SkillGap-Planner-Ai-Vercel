//this is managing state and api layer

import { useContext,useEffect,useState } from "react";
import { AuthContext } from "../auth.context";
import {login,register,logout,getMe} from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext)
    const {user,setUser ,loading,setLoading} = context

    const handleLogin = async ({email,password}) => {
        setLoading(true)
            try{
                const data = await login({email,password})
                //state management
                setUser(data.user)
            }catch(err){
                console.log(err)
            }finally{
                //state management
                setLoading(false)
            }
        }
        

    const handleRegister = async ({username,email,password}) => {
        setLoading(true)
        try{
            const data = await register({username,email,password})
            setUser(data.user)
        }catch(err){
            console.log(err)
        }finally{

            setLoading(false)
        }
        
    }

    const handleLogout = async () => {
        setLoading(true)
        try{
            const data = await logout()
            setUser(null)
        }catch(err){

        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        const getAndSetUser = async()=>{
            //current loggedin user ka data aayega from cookies stored in browser
            try{
                const data = await getMe()
                setUser(data.user)

            }catch(err){

            }finally{
                setLoading(false)
            }
        }

        getAndSetUser()
    },[])

    //api layer se data (response aa rha hai)
    return { user, loading, handleRegister, handleLogin, handleLogout }
}
