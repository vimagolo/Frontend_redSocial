import React, { createContext, useEffect, useState, useContext } from 'react';
import { Global } from '../helpers/Global';
import { SocialContext } from './SocialContext'; // Ajusta la ruta según tu proyecto

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({});
    const [loading, setLoading] = useState(true);

    // Accedemos al dispatch de SocialContext
    const { dispatch } = useContext(SocialContext);

    useEffect(() => {
        authUser();
    }, []);

    const authUser = async () => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (!token || !user) {
            setLoading(false);
            return;
        }

        const userObj = JSON.parse(user);
        const userId = userObj.id;

        // Petición para obtener datos del usuario
        const request = await fetch(Global.url + "user/profile/" + userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        const data = await request.json();
        setAuth(data.user);

        // Petición para obtener contadores sociales
        const requestCounters = await fetch(Global.url + "user/counters/" + userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        const dataCounters = await requestCounters.json();

        // Hidratar SocialContext con contadores reales
        dispatch({
            type: "SET_COUNTS",
            payload: {
                followers: dataCounters.followed,
                following: dataCounters.following,
                publications: dataCounters.publications
            }
        });

        setLoading(false);
    }

    return (
        <AuthContext.Provider
            value={{ auth, setAuth, loading, setLoading }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;