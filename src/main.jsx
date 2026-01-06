//Importaciones obligatorias de react
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider'
import { SocialProvider } from './context/SocialContext'

//Importar assets(Recursos: hojas de estilo, imganes , fuentes)
import './assets/fonts/fontawesome-free-6.1.2-web/css/all.css'
import './assets/css/normalize.css'
import './assets/css/styles.css'
import './assets/css/responsive.css'

//Cargar configuracion React Time ago
import TimeAgo from "javascript-time-ago";
import es from "javascript-time-ago/locale/es.json";

TimeAgo.addDefaultLocale(es)
TimeAgo.addLocale(es)

//Arrancar app de react
createRoot(document.getElementById('root')).render(

    <StrictMode>
    <SocialProvider>   {/* Primero social */}
      <AuthProvider>   {/* Luego auth */}
        <App />
      </AuthProvider>
    </SocialProvider>
  </StrictMode>
)
