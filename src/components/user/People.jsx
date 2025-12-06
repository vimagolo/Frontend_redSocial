import React, { useEffect, useState } from 'react'
import avatar from "../../assets/img/user.png"
import { Global } from '../../helpers/Global'

export const People = () => {
    const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

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

        // ⭐ SI ES PÁGINA 1, REEMPLAZA — SI ES MAYOR, CONCATENA
        if (pageNumber === 1) {
          setUsers(data.users);
        } else {
          setUsers(prev => [...prev, ...data.users]);
        }

        setPage(data.page);
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

      <div className="content__posts">
        {users.map((user) => (
          <article className="posts__post" key={user._id}>

            <div className="post__container">

              <div className="post__image-user">
                <a href="#" className="post__image-link">
                  {user.image != "default.png" && <img src={Global.url+"user/avatar/"+user.image} className="post__user-image" alt="Foto de perfil"/>}
                  {user.image == "default.png" && <img src={avatar} className="post__user-image" alt="Foto de perfil"/>}
                </a>
              </div>

              <div className="post__body">

                <div className="post__user-info">
                  <a href="#" className="user-info__name">{user.name} {user.surname}</a>
                  <span className="user-info__divider"> | </span>
                  <a href="#" className="user-info__create-date">{user.create_at}</a>
                </div>

                <h4 className="post__content">Hola, buenos dias.</h4>

              </div>

            </div>


            <div className="post__buttons">

              <a href="#" className="post__button post__button--green">
                Seguir
              </a>
              {/**
            <a href="#" className="post__button post__button--green">
              Dejar de seguir
            </a>
             */}

            </div>

          </article>
        ))}
      </div>

      {/* Botón ver más */}
      <div className="content__container-btn">
        {page < totalPages ? (
          <button
            className="content__btn-more-post"
            onClick={() => getUsers(page + 1)}
          >
            Ver más personas
          </button>
        ) : (
          <p>No hay más personas</p>
        )}
      </div>

    </>
  )
}
