import React, { useEffect, useState } from "react";
import avatar from "../../assets/img/user.png";
import useAuth from "../../hooks/useAuth";
import { Global } from "../../helpers/Global";
import { Link, useParams } from "react-router-dom";
import { Capitalize } from "../../helpers/Capitalize";
import { PublicationList } from "../publication/PublicationList";


export const Feed = () => {
    const { auth } = useAuth();
    const [publications, setPublications] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const param = useParams();

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        await getPublications(1);
    };

    const getPublications = async (pageToLoad = 1) => {
        try {
            const url =
                pageToLoad === 1
                    ? `${Global.url}publication/getFollowinPublication`
                    : `${Global.url}publication/getFollowinPublication/${pageToLoad}`;

            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
            });

            const data = await res.json();

            console.log(data)
            if (data.status === "success") {
                const newPublications = data.publications.docs;
                setPublications(prev =>
                    pageToLoad === 1 ? newPublications : [...prev, ...newPublications]
                );
                setPage(data.publications.page);
                setTotalPages(data.publications.totalPages);
            }
        } catch (error) {
            console.log("Error obteniendo publicaciones", error);
        }
    };

    const loadMore = async () => {
        if (page >= totalPages) return;

        try {
            const nextPage = page + 1;
            const res = await fetch(`${Global.url}publication/getFollowinPublication/${nextPage}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
            });

            const data = await res.json();
            if (data.status === "success") {
                setPublications(prev => [...prev, ...data.publications.docs]);
                setPage(data.publications.page);
            }
        } catch (error) {
            console.log("Error cargando más publicaciones", error);
        }
    };

    // ✅ Función para "Mostrar nuevas"
    const showNewPublications = async () => {
        // Resetear página y cargar desde la página 1
        setPage(1);
        setTotalPages(1);
        await getPublications(1); // reemplaza publicaciones actuales
    };


    return (
        <>

            <header className="content__header">
                <h1 className="content__title">Timeline</h1>
                <button className="content__button" onClick={showNewPublications}>
                    Mostrar nuevas
                </button>
            </header>

            <PublicationList
                userId={param.userId}
                initialPublications={publications}
                page={page}
                totalPages={totalPages}
                loadMore={loadMore}
            />



        </>
    )
}
