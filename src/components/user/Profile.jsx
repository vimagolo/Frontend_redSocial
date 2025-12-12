import React, { useEffect, useState } from "react";
import avatar from "../../assets/img/user.png";
import useAuth from "../../hooks/useAuth";
import { Global } from "../../helpers/Global";
import { Link, useParams } from "react-router-dom";
import { GetProfile } from "../../helpers/GetProfile";
import { Capitalize } from "../../helpers/Capitalize";
import { PublicationList } from "../publication/PublicationList";

export const Profile = () => {
    const { auth } = useAuth();
    const [user, setUser] = useState({});
    const [counters, setCounters] = useState({});
    const [iFollow, setIfollow] = useState(false);
    const [publications, setPublications] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const param = useParams();

    useEffect(() => {
        loadProfile();
    }, [param]);

    const loadProfile = async () => {
        await getDataUser();
        await getCounters();
        await getPublications(1);
    };

    const getDataUser = async () => {
        let dataUser = await GetProfile(param.userId, setUser);
        if (dataUser.following && dataUser.following._id) setIfollow(true);
    };

    const getCounters = async () => {
        try {
            const response = await fetch(`${Global.url}user/counters/${param.userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
            });

            if (!response.ok) return;

            const data = await response.json();
            if (data && data.following !== undefined) setCounters(data);
        } catch (error) {
            console.error("Error al obtener contadores", error);
        }
    };

    const follow = async (userId) => {
        try {
            const res = await fetch(`${Global.url}follow/savefollow`, {
                method: "POST",
                body: JSON.stringify({ followed: userId }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
            });
            const data = await res.json();
            if (data.status === "success") setIfollow(true);
        } catch (error) {
            console.log("Error siguiendo usuario", error);
        }
    };

    const unfollow = async (userId) => {
        try {
            const res = await fetch(`${Global.url}follow/unfollow/${userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
            });
            const data = await res.json();
            if (data.status === "success") setIfollow(false);
        } catch (error) {
            console.log("Error al dejar de seguir", error);
        }
    };

    const getPublications = async (pageToLoad = 1) => {
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
            if (data.status === "success") {
                const newPublications = data.userPublications.docs;
                setPublications(prev =>
                    pageToLoad === 1 ? newPublications : [...prev, ...newPublications]
                );
                setPage(data.userPublications.page);
                setTotalPages(data.userPublications.totalPages);
            }
        } catch (error) {
            console.log("Error obteniendo publicaciones", error);
        }
    };

    const loadMore = async () => {
        if (page >= totalPages) return;

        try {
            const nextPage = page + 1;
            const res = await fetch(`${Global.url}publication/getPublications/${param.userId}/${nextPage}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
            });

            const data = await res.json();
            if (data.status === "success") {
                setPublications(prev => [...prev, ...data.userPublications.docs]);
                setPage(data.userPublications.page);
            }
        } catch (error) {
            console.log("Error cargando más publicaciones", error);
        }
    };

    return (
        <>
            <header className="aside__profile-info">
                <div className="profile-info__general-info">
                    <div className="general-info__container-avatar">
                        <img
                            src={user.image && user.image !== "default.png" ? `${Global.url}user/avatar/${user.image}` : avatar}
                            className="container-avatar__img"
                            alt="Foto de perfil"
                        />
                    </div>

                    <div className="general-info__container-names">
                        <div className="container-names__name">
                            <h1>{Capitalize(user.name)} {Capitalize(user.surname)}</h1>
                            {user._id !== auth._id && (
                                iFollow ? (
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
                                )
                            )}
                        </div>
                        <h2 className="container-names__nickname">{Capitalize(user.nick)}</h2>
                        <p>{user.bio}</p>
                    </div>
                </div>

                <div className="profile-info__stats">
                    <div className="stats__following">
                        <Link to={`/social/siguiendo/${user._id}`} className="following__link">
                            <span className="following__title">Siguiendo</span>
                            <span className="following__number">{counters.following || 0}</span>
                        </Link>
                    </div>
                    <div className="stats__following">
                        <Link to={`/social/seguidores/${user._id}`} className="following__link">
                            <span className="following__title">Seguidores</span>
                            <span className="following__number">{counters.followed || 0}</span>
                        </Link>
                    </div>
                    <div className="stats__following">
                        <Link to={`/social/perfil/${user._id}`} className="following__link">
                            <span className="following__title">Publicaciones</span>
                            <span className="following__number">{counters.publications || 0}</span>
                        </Link>
                    </div>
                </div>
            </header>

            <PublicationList
                userId={param.userId}
                initialPublications={publications}
                page={page}
                totalPages={totalPages}
                loadMore={loadMore} 
            />
        </>
    );
};