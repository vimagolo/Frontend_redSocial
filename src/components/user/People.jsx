import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import { UserList } from './UserList';

export const People = () => {

  // Lista de usuarios obtenidos desde la API
  const [users, setUsers] = useState([]);

  // Página actual (para la paginación)
  const [page, setPage] = useState(1);

  // Total de páginas que devuelve el backend
  const [totalPages, setTotalPages] = useState(1);

  // Estado de carga para mostrar "Cargando..."
  const [loading, setLoading] = useState(true);

  // Lista de IDs de usuarios a los que el usuario actual sigue
  const [following, setFollowing] = useState([]);

  // -----------------------------------------------------
  //   FUNCIÓN PARA OBTENER USUARIOS CON PAGINACIÓN
  // -----------------------------------------------------
  const getUsers = async (pageNumber = 1) => {
    setLoading(true); // Activamos el estado de carga

    try {
      // Llamada a la API para obtener usuarios
      const request = await fetch(`${Global.url}user/list/${pageNumber}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token") // Se envía el token
        }
      });

      // Parseamos la respuesta
      const data = await request.json();

      if (data.status === "success") {

        // Si es primera página, reemplazamos usuarios
        if (pageNumber === 1) {
          setUsers(data.users);
        } else {
          // Si es página siguiente, concatenamos usuarios
          setUsers(prev => [...prev, ...data.users]);
        }

        // Guardamos la página actual recibida del backend
        setPage(data.page);

        // Guardamos lista de usuarios seguidos por el usuario actual
        setFollowing(data.user_following);

        // Guardamos el total de páginas para el botón "ver más"
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.log("Error obteniendo usuarios", error);
    }

    setLoading(false); // Quitamos el estado de carga
  };

  // -----------------------------------------------------
  //   USEEFFECT → SE EJECUTA UNA VEZ AL CARGAR LA PÁGINA
  // -----------------------------------------------------
  useEffect(() => {
    getUsers(1);  // Cargar la primera página de usuarios
  }, []);

  return (
    <>
      {/* Encabezado de la sección */}
      <header className="content__header">
        <h1 className="content__title">Gente</h1>
      </header>

      {/* Componente hijo que muestra la lista de usuarios */}
      <UserList
        users={users}                   // Lista de usuarios
        setUsers={setUsers}             // Para actualizar usuarios
        following={following}           // Lista de IDs que sigo
        setFollowing={setFollowing}     // Para actualizarla
        loading={loading}               // Mostrar "Cargando..."
        setLoading={setLoading}
        page={page}                     // Página actual
        totalPages={totalPages}         // Total de páginas
        getUsers={getUsers}             // Función para "ver más"
      />
    </>
  );
};
