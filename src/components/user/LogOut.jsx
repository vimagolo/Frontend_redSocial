import React from 'react'
import { useEffect } from 'react'
import useAuth from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom';

export const LogOut = () => {
    const {setAuth, setCounters} = useAuth();
    const navigate = useNavigate()
    useEffect(()=>{
        //Vaciar el localStorage
        localStorage.clear();

        //Setear estados globales a vacio
        setAuth({})
        setCounters({})
        

        //navigate a login
        navigate("/login")
    })

    return (
        <h1>Cerrando sesión ...</h1>
    )
}
