import React from "react";
import useAuth from "../../hooks/useAuth";
import avatar from "../../assets/img/user.png"
import { Global } from '../../helpers/Global'

export const UserList = ({
    users, setUsers,
    following, setFollowing,
    loading, setLoading,
    page, totalPages,
    getUsers
}) => {
    const { auth } = useAuth();
    const follow = async (userId) => {
        try {
            const request = await fetch(`${Global.url}follow/savefollow`, {
                method: "POST",
                body: JSON.stringify({ followed: userId }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                }
            });

            const data = await request.json();
            if (data.status === "success") {
                setFollowing([...following, userId]);
            }
        } catch (error) {
            console.log("Error siguiendo usuario", error);
        }
    };



    const unfollow = async (userId) => {
        try {
            const request = await fetch(`${Global.url}follow/unfollow/${userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                }
            });

            const data = await request.json();
            if (data.status === "success") {
                let filferFollowing = following.filter(followingUserId => userId !== followingUserId);
                setFollowing(filferFollowing)
            }
        } catch (error) {
            console.log("Error la dejar de siquir a ub usuario", error);
        }
    }
    return (
        <>
            <div className="content__posts">
                {loading ? "Cargando ..." : ""}
                {users.map((user) => (
                    <article className="posts__post" key={user._id}>
                        <div className="post__container">
                            <div className="post__image-user">
                                <a href="#" className="post__image-link">
                                    {user.image != "default.png" && (
                                        <img
                                            src={Global.url + "user/avatar/" + user.image}
                                            className="post__user-image"
                                            alt="Foto de perfil"
                                        />
                                    )}
                                    {user.image == "default.png" && (
                                        <img
                                            src={avatar}
                                            className="post__user-image"
                                            alt="Foto de perfil"
                                        />
                                    )}
                                </a>
                            </div>

                            <div className="post__body">
                                <div className="post__user-info">
                                    <a href="#" className="user-info__name">
                                        {user.name} {user.surname}
                                    </a>
                                    <span className="user-info__divider"> | </span>
                                    <a href="#" className="user-info__create-date">
                                        {user.create_at}
                                    </a>
                                </div>

                                <h4 className="post__content">Hola, buenos dias.</h4>
                            </div>
                        </div>

                        {user._id != auth._id && (
                            <div className="post__buttons">
                                {!following.includes(user._id) && (
                                    <button
                                        className="post__button post__button--green"
                                        onClick={() => follow(user._id)}
                                    >
                                        Seguir
                                    </button>
                                )}
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
    );
};
