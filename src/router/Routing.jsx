import React from 'react'
import { Routes , Route , BrowserRouter , Navigate, Link } from 'react-router-dom'
import { PublicLayout } from '../components/layout/public/PublicLayout'
import { PrivateLayout } from '../components/layout/private/PrivateLayout'
import { Login } from '../components/user/Login'
import { Register } from '../components/user/Register'
import { People} from '../components/user/People'
import { Config} from '../components/user/Config'
import { Feed } from '../components/publication/feed'
import { AuthProvider } from '../context/AuthProvider'
import { LogOut } from '../components/user/LogOut'

import { Followers } from '../components/follow/Followers'
import { Following } from '../components/follow/following'
import { Profile } from '../components/user/Profile'


export const Routing = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
            <Routes>

                {/* RUTAS PUBLICAS */}
                <Route path='/' element={<PublicLayout/>}>
                    <Route index element={<Login/>}/> 
                    <Route path='login' element={<Login/>}/> 
                    <Route path='register' element={<Register/>}/> 
                </Route>

                {/* RUTAS PRIVADAS */}
                <Route path='/social' element={<PrivateLayout/>}>
                    <Route index element={<Feed/>}/> 
                    <Route path='feed' element={<Feed/>}/> 
                    <Route path='gente' element={<People/>}/> 
                    <Route path='ajustes' element={<Config/>}/> 
                    <Route path='logout' element={<LogOut/>}/> 
                    <Route path='siguiendo/:userId' element={<Following/>}/> 
                    <Route path='seguidores/:userId' element={<Followers/>}/> 
                    <Route path='perfil/:userId' element={<Profile/>}/> 
                </Route>

                <Route path='*' element={
                    <>  
                        <p>
                            <h1>Error 404</h1>
                            <Link to="/">Volver al inicio</Link>
                        </p>
                        
                    </>
                }/>

            </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}
