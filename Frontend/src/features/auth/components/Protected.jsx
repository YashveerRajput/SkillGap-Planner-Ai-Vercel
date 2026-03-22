import { useAuth } from "../hooks/use.auth";
import { useNavigate, Navigate } from "react-router";
import React from "react";
import PageLoader from "../../../components/PageLoader";

const Protected = ({children}) => {
    const {loading,user} = useAuth()
    const navigate = useNavigate()

    if(loading){
        return <PageLoader />
    }

    if(!user){
        return <Navigate to={'/login'}/>
    }

    return children
}

export default Protected