import React, { createContext, use, useEffect } from 'react';
import { useState } from 'react';
import { Global } from '../helpers/Global';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState({});
    const [counters, setCounters] = useState({});
    const [loading, setloading]= useState(true);

    useEffect(()=>{
        authUser()
    },[]);

    const authUser =async()=>{
        //Sacar datos del usuario identificado del loaclstorage
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user")

        //Comprobar si tene,os el token y el user
        if(!token || !user){
            setloading(false);
            return false
        }

        //Trasnformar los datos a un onjeto de javascript
        const userObj = JSON.parse(user);
        const userId = userObj.id;

        //Peticion ajax al backend que compuebe el token y
        //que me devuelva todo los datos del usuario
        const request = await fetch(Global.url +"user/profile/" +userId,{
            method:"GET",
            headers:{
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        const data = await request.json();

        //Setear el estado de auth
        setAuth(data.user)
        console.log(data.user)
        console.log("data")

        //Peticion para los contadores
        const requestCounters = await fetch(Global.url +"user/counters/" +userId,{
            method:"GET",
            headers:{
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        const dataCounters = await requestCounters.json();

        setCounters(dataCounters);
        setloading(false)
    }

    return (
        <AuthContext.Provider
        value={{auth,setAuth,counters,setCounters,loading,setloading}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
