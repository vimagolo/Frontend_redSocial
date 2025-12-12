import React, { useState, useEffect } from "react";
import avatar from "../../assets/img/user.png";
import { Link } from "react-router-dom";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";

export const PublicationList = ({ userId, initialPublications, page: initialPage, totalPages: initialTotalPages, loadMore:loadMore }) => {
    const { auth } = useAuth();

    const [publications, setPublications] = useState([]);
    const [page, setPage] = useState(initialPage || 1);
    const [totalPages, setTotalPages] = useState(initialTotalPages || 1);

    // Actualizar publicaciones cuando cambie initialPublications
    useEffect(() => {
        setPublications(initialPublications || []);
        setPage(initialPage || 1);
        setTotalPages(initialTotalPages || 1);
    }, [initialPublications, initialPage, initialTotalPages]);

    const deletePublication = async (publicationId) => {
        try {
            const res = await fetch(`${Global.url}publication/deletePublication/${publicationId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
            });
            const data = await res.json();
            if (data.status !== "success") return;

            await reloadAllPages();
        } catch (error) {
            console.log("Error al borrar publicación", error);
        }
    };

    const reloadAllPages = async () => {
        try {
            const loadedPages = Math.ceil(publications.length / 5);
            let allPublications = [];

            for (let p = 1; p <= loadedPages; p++) {
                const res = await fetch(`${Global.url}publication/getPublications/${userId}/${p}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("token"),
                    },
                });

                const data = await res.json();
                if (data.status === "success") {
                    allPublications = [...allPublications, ...data.userPublications.docs];
                    setPage(data.userPublications.page);
                    setTotalPages(data.userPublications.totalPages);
                }
            }

            setPublications(allPublications);
        } catch (error) {
            console.log("Error recargando publicaciones", error);
        }
    };

    

    return (
        <>
            {!publications || publications.length === 0 ? (
                <p>Cargando publicaciones...</p> // Mejor mensaje mientras se cargan
            ) : (
                <>
                    <div className="content__posts">
                        {publications.map(pub => (
                            <article className="posts__post" key={pub._id}>
                                <div className="post__container">
                                    <div className="post__image-user">
                                        <Link to={`/social/perfil/${pub.user._id}`}>
                                            {pub.user.image !== "default.png" ? (
                                                <img src={`${Global.url}user/avatar/${pub.user.image}`} className="post__user-image" alt="Foto de perfil" />
                                            ) : (
                                                <img src={avatar} className="post__user-image" alt="Foto de perfil" />
                                            )}
                                        </Link>
                                    </div>

                                    <div className="post__body">
                                        <div className="post__user-info">
                                            <span className="user-info__name">{pub.user.name} {pub.user.surname}</span>
                                            <span className="user-info__divider"> | </span>
                                            <span className="user-info__create-date">{pub.user.create_at}</span>
                                        </div>

                                        <h4 className="post__content">{pub.text}</h4>
                                        {pub.file && <img src={`${Global.url}publication/getImagePublication/${pub.file}`} alt="Archivo de publicación" />}
                                    </div>
                                </div>

                                {auth._id === pub.user._id && (
                                    <button className="post__button" onClick={() => deletePublication(pub._id)}>
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                )}
                            </article>
                        ))}
                    </div>

                    <div className="content__container-btn">
                        {page < totalPages ? (
                            <button className="content__btn-more-post" onClick={loadMore}>
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