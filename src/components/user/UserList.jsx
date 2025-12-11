import React from "react";
import useAuth from "../../hooks/useAuth";
import avatar from "../../assets/img/user.png";
import { Global } from "../../helpers/Global";
import { Link } from "react-router-dom";

// Componente UserList → recibe las props desde el componente padre (People)
export const UserList = ({
    users, setUsers,                // Lista de usuarios y función para actualizarla
    following, setFollowing,        // Lista de IDs que el usuario actual sigue
    loading, setLoading,            // Estado de carga
    page, totalPages,               // Paginación
    getUsers                        // Función para cargar más usuarios
}) => {

    // Extraemos la información del usuario logueado
    const { auth } = useAuth();

    // -------------------------
    //  FUNCIÓN SEGUIR A USUARIO
    // -------------------------
    const follow = async (userId) => {
        try {
            // Petición POST para seguir a un usuario
            const request = await fetch(`${Global.url}follow/savefollow`, {
                method: "POST",
                body: JSON.stringify({ followed: userId }), // Envío del ID a seguir
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token") // Token de autenticación
                }
            });

            const data = await request.json();

            // Si el backend responde success, agregamos el ID al array de following
            if (data.status === "success") {
                setFollowing([...following, userId]);
            }
        } catch (error) {
            console.log("Error siguiendo usuario", error);
        }
    };

    // ------------------------------------
    //  FUNCIÓN DEJAR DE SEGUIR A USUARIO
    // ------------------------------------
    const unfollow = async (userId) => {
        try {
            // Petición DELETE para dejar de seguir
            const request = await fetch(`${Global.url}follow/unfollow/${userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                }
            });

            const data = await request.json();

            // Si tuvo éxito, eliminamos el ID del array following
            if (data.status === "success") {
                let filteredFollowing = following.filter(
                    followingUserId => userId !== followingUserId
                );
                setFollowing(filteredFollowing);
            }

        } catch (error) {
            console.log("Error al dejar de seguir a un usuario", error);
        }
    };

    return (
        <>
            <div className="content__posts">
                
                {/* Mostrar texto de carga */}
                {loading ? "Cargando ..." : ""}

                {/* Recorremos los usuarios y los mostramos uno por uno */}
                {users.map((user) => (
                    <article className="posts__post" key={user._id}>
                        
                        {/* Contenedor del usuario */}
                        <div className="post__container">

                            {/* Imagen del usuario */}
                            <div className="post__image-user">
                                <Link to={"/social/perfil/"+user._id} className="post__image-link">

                                    {/* Si el usuario tiene imagen personalizada */}
                                    {user.image != "default.png" && (
                                        <img
                                            src={Global.url + "user/avatar/" + user.image}
                                            className="post__user-image"
                                            alt="Foto de perfil"
                                        />
                                    )}

                                    {/* Si NO tiene imagen, mostramos avatar por defecto */}
                                    {user.image == "default.png" && (
                                        <img
                                            src={avatar}
                                            className="post__user-image"
                                            alt="Foto de perfil"
                                        />
                                    )}
                                </Link>
                            </div>

                            {/* Información del usuario */}
                            <div className="post__body">
                                <div className="post__user-info">

                                    {/* Nombre y apellidos */}
                                    <Link to={"/social/perfil/"+user._id} className="user-info__name">
                                        {user.name} {user.surname}
                                    </Link>

                                    <span className="user-info__divider"> | </span>

                                    {/* Fecha de creación */}
                                    <Link to={"/social/perfil/"+user._id} className="user-info__create-date">
                                        {user.create_at}
                                    </Link>
                                </div>

                                {/* Texto de ejemplo */}
                                <h4 className="post__content">{user.bio}</h4>
                            </div>
                        </div>

                        {/* Ocultar botones si es el usuario logueado */}
                        {user._id != auth._id && (

                            <div className="post__buttons">

                                {/* Botón SEGUIR (si NO lo sigo) */}
                                {!following.includes(user._id) && (
                                    <button
                                        className="post__button post__button--green"
                                        onClick={() => follow(user._id)}
                                    >
                                        Seguir
                                    </button>
                                )}

                                {/* Botón DEJAR DE SEGUIR (si ya lo sigo) */}
                                {following.includes(user._id) && (
                                    <button
                                        className="post__button post__button--green"
                                        onClick={() => unfollow(user._id)}
                                    >
                                        Dejar de seguir
                                    </button>
                                )}

                            </div>
                        )}
                    </article>
                ))}
            </div>

            {/* Botón para cargar más usuarios */}
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
    );
};