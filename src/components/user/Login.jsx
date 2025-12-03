import React, { useState } from 'react'
import { useForm } from "../../hooks/useForm";
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';

export const Login = () => {
  const { form, changed}= useForm({});
  const [login, setLogin] = useState("not_sended");

  const{setAuth}= useAuth();

  const loginUser = async(e) =>{
    //Prevenir actualizacion de la pantalla
    e.preventDefault();

    //Datos del formulario
    let usertoLogin = form;

    //Peticion al backend
    const request = await fetch(Global.url + "user/login", {
      method: "POST",
      body: JSON.stringify(usertoLogin),
      headers: {
        "Content-Type": "application/json",
      }
    });

    const data = await request.json();

    if(data.status=="success"){
      //Persistir los datos en el navegador
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setLogin("login")

      //Set datos en el auth
      setAuth(data.user);

      //Redirigir
      setTimeout(()=>{
        window.location.reload()
      },1000)
    } else{
      setLogin("error")
    }


    //Persistir los datos en el navegador
  }


  return (
    <>
      <header className='content__header content__header--public'>
        <h1 className='content__title'>Login</h1>  
      </header>    
      <div className='content__post'>

        {login == "login" ? 
          <strong className="alert alert-success">"Usuario autentificado correctamente !!"</strong>
        :""}
        {login == "error" ?
          <strong className="alert alert-error"> "Usuario no se ha identificado correctamente !!"</strong>
        :""}

        <form className='form-login' onSubmit={loginUser}>

          <div className='form-group'>
            <label htmlFor="email">Email</label>
            <input type="email" name='email' onChange={changed}/>
          </div>

          <div className='form-group'>
            <label htmlFor="password">Contraseña</label>
            <input type="password" name='password' onChange={changed} />
          </div>

          <input type="submit" value="Identificate" className='btn btn-success'/>
        </form>
      </div>
    </>
  )
}
