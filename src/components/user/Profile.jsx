import React, { useEffect, useState } from "react";
import avatar from "../../assets/img/user.png";
import useAuth from "../../hooks/useAuth";
import { Global } from "../../helpers/Global";
import { Link, useParams } from "react-router-dom";
import { GetProfile } from "../../helpers/GetProfile";
import { Capitalize } from "../../helpers/Capitalize";

export const Profile = () => {
    const { auth } = useAuth();
    const [user, setUser] = useState({});
    const [counters, setCounters] = useState({});
    const [iFollow, setIfollow] = useState(false);
    const [publications, setPublicationes] = useState([]);
    const param = useParams();
    // Página actual (para la paginación)
    const [page, setPage] = useState(1);

    // Total de páginas que devuelve el backend
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        getDataUSer();
        getCounters();
        getPublication();
    }, []);

    useEffect(() => {
        setPage(1);
        setPublicationes([]);
        getDataUSer();
        getCounters();
        getPublication(1);
    }, [param]);

    const getDataUSer = async () => {
        let dataUser = await GetProfile(param.userId, setUser);
        if (dataUser.following && dataUser.following._id) setIfollow(true);
    };

    // Función para obtener los contadores del usuario
    const getCounters = async () => {
        try {
            // Realizar la petición al backend
            const response = await fetch(
                `${Global.url}user/counters/${param.userId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );

            // Comprobar si la respuesta es correcta
            if (!response.ok) {
                console.error("Error en la petición:", response.status);
                return;
            }

            // Convertir la respuesta a JSON
            const data = await response.json();

            // Validar que la información necesaria existe antes de actualizar el estado
            if (data && data.following !== undefined) {
                setCounters(data);
            } else {
                console.warn("Los datos recibidos no contienen el campo esperado.");
            }
        } catch (error) {
            // Manejar errores de red u otros
            console.error("Error al obtener los contadores:", error);
        }
    };

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
                    Authorization: localStorage.getItem("token"), // Token de autenticación
                },
            });

            const data = await request.json();

            // Si el backend responde success, agregamos el ID al array de following
            if (data.status === "success") {
                setIfollow(true);
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
                    Authorization: localStorage.getItem("token"),
                },
            });

            const data = await request.json();

            // Si tuvo éxito, eliminamos el ID del array following
            if (data.status === "success") {
                setIfollow(false);
            }
        } catch (error) {
            console.log("Error al dejar de seguir a un usuario", error);
        }
    };

    const getPublication = async (pageToLoad = 1) => {
        try {
            const url =
                pageToLoad === 1
                    ? `${Global.url}publication/getPublications/${param.userId}`
                    : `${Global.url}publication/getPublications/${param.userId}/${pageToLoad}`;

            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
            });

            const data = await res.json();
            console.log(data);

            if (data.status === "success") {
                const newPublications = data.userPublications.docs;

                setPublicationes((prev) =>
                    pageToLoad === 1 ? newPublications : [...prev, ...newPublications]
                );

                // actualizar página desde la respuesta del backend
                setPage(data.userPublications.page);
                setTotalPages(data.userPublications.totalPages);
            }
        } catch (error) {
            console.log("Error obteniendo publicaciones", error);
        }
    };

    return (
        <>
            <header className="aside__profile-info">
                <div className="profile-info__general-info">
                    <div className="general-info__container-avatar">
                        {user.image !== "default.png" && (
                            <img
                                src={Global.url + "user/avatar/" + user.image}
                                className="container-avatar__img"
                                alt="Foto de perfil"
                            />
                        )}
                        {user.image === "default.png" && (
                            <img
                                src={avatar}
                                className="container-avatar__img"
                                alt="Foto de perfil"
                            />
                        )}
                    </div>

                    <div className="general-info__container-names">
                        <div className="container-names__name">
                            <h1>
                                {Capitalize(user.name)} {Capitalize(user.surname)}
                            </h1>
                            {user._id != auth._id &&
                                (iFollow ? (
                                    <button
                                        onClick={() => unfollow(user._id)}
                                        className="content__button content__button--right post__button"
                                    >
                                        Unfollow
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => follow(user._id)}
                                        className="content__button content__button--right"
                                    >
                                        Follow
                                    </button>
                                ))}
                        </div>
                        <h2 className="container-names__nickname">
                            {Capitalize(user.nick)}
                        </h2>
                        <p className="container-names__nickname">{user.bio}</p>
                    </div>
                </div>

                <div className="profile-info__stats">
                    <div className="stats__following">
                        <Link
                            to={"/social/siguiendo/" + user._id}
                            className="following__link"
                        >
                            <span className="following__title">Siguiendo</span>
                            <span className="following__number">
                                {counters.following >= 1 ? counters.following : "0"}
                            </span>
                        </Link>
                    </div>
                    <div className="stats__following">
                        <Link
                            to={"/social/seguidores/" + user._id}
                            className="following__link"
                        >
                            <span className="following__title">Seguidores</span>
                            <span className="following__number">
                                {counters.followed >= 1 ? counters.followed : "0"}
                            </span>
                        </Link>
                    </div>

                    <div className="stats__following">
                        <Link to={"/social/perfil/" + user._id} className="following__link">
                            <span className="following__title">Publicaciones</span>
                            <span className="following__number">
                                {counters.publications >= 1 ? counters.publications : "0"}
                            </span>
                        </Link>
                    </div>
                </div>
            </header>

            {!publications || publications.length === 0 ? (
                <p>Este usuario no tiene publicaciones.</p>
            ) : (
                <>
                    <div className="content__posts">
                        {publications.map((pub) => (
                            <article className="posts__post" key={pub._id}>
                                <div className="post__container">
                                    <div className="post__image-user">
                                        <Link to={"/social/perfil/" + pub.user._id} className="post__image-link">

                                            {/* Si el usuario tiene imagen personalizada */}
                                            {pub.user.image != "default.png" && (
                                                <img
                                                    src={Global.url + "user/avatar/" + pub.user.image}
                                                    className="post__user-image"
                                                    alt="Foto de perfil"
                                                />
                                            )}

                                            {/* Si NO tiene imagen, mostramos avatar por defecto */}
                                            {pub.user.image == "default.png" && (
                                                <img
                                                    src={avatar}
                                                    className="post__user-image"
                                                    alt="Foto de perfil"
                                                />
                                            )}
                                        </Link>
                                    </div>

                                    <div className="post__body">
                                        <div className="post__user-info">
                                            <a href="#" className="user-info__name">{pub.user.name +" "+ pub.user.surname}</a>
                                            <span className="user-info__divider"> | </span>
                                            <a href="#" className="user-info__create-date">
                                                {pub.user.create_at}
                                            </a>
                                        </div>

                                        <h4 className="post__content">{pub.text}</h4>
                                    </div>
                                </div>
                                {auth._id == pub.user._id &&
                                <div className="post__buttons">
                                    <a href="#" className="post__button">
                                        <i className="fa-solid fa-trash-can"></i>
                                    </a>
                                </div>}
                            </article>
                        ))}
                    </div>

                    {/* Botón para cargar más publicaciones */}
                    <div className="content__container-btn">
                        {page < totalPages ? (
                            <button
                                className="content__btn-more-post"
                                onClick={() => getPublication(page + 1)}
                            >
                                Ver más publicaciones
                            </button>
                        ) : (
                            <p>No hay más publicaciones</p>
                        )}
                    </div>
                </>
            )}
        </>
    );
};
