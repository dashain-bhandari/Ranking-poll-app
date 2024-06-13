import { createContext, useEffect, useState } from "react";
import  { AxiosInstance } from "../axios";

export const authContext=createContext();

export const AuthContextProvider=({children})=>{
const [poll,setPoll]=useState();
const [user,setUser]=useState();
const [active,setActive]=useState([]);


useEffect(()=>{
const getUser=async()=>{
    try {
        const {data}=await AxiosInstance.get('polls/token')
        console.log(data)
        setUser(data)
    } catch (error) {
       console.log(error.message) 
    }
}
getUser()
},[])

    return (<authContext.Provider value={{poll,setPoll,user,active,setActive,setUser}}>
{children}
    </authContext.Provider>)
}