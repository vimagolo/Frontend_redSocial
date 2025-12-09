import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global'
import { UserList } from './UserList';

export const People = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [following, setFollowing] = useState([])

  const getUsers = async (pageNumber = 1) => {
    setLoading(true);

    try {
      const request = await fetch(`${Global.url}user/list/${pageNumber}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token")
        }
      });

      const data = await request.json();

      if (data.status === "success") {

        //SI ES PÁGINA 1, REEMPLAZA — SI ES MAYOR, CONCATENA
        if (pageNumber === 1) {
          setUsers(data.users);
        } else {
          setUsers(prev => [...prev, ...data.users]);
        }

        setPage(data.page);
        setFollowing(data.user_following)
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.log("Error obteniendo usuarios", error);
    }

    setLoading(false);
  };

  // Se ejecuta al cargar el componente
  useEffect(() => {
    getUsers(1);
  }, []);



  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Gente</h1>
      </header>

      <UserList
        users={users}
        setUsers={setUsers}
        following={following}
        setFollowing={setFollowing}
        loading={loading}
        setLoading={setLoading}
        page={page}
        totalPages={totalPages}
        getUsers={getUsers}
      />

    </>
  )
}
