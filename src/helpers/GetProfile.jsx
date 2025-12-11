import React from 'react'
import { Global } from './Global';

export const GetProfile = async(userId, setUserProfile) => {
    let data = null;

    try {
        const request = await fetch(Global.url + "user/profile/" + userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });

        data = await request.json(); 

        if (data.status === "success") {
            setUserProfile(data.user);
        }

    } catch (error) {
        console.log("Error obteniendo perfil del usuario", error);
    }

    return data

}
